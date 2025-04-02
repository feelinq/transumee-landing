
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders, getCountrySpecificPrompt } from "./utils.ts";
import { generateFallbackEnhancement } from "./fallbackEnhancement.ts";

export async function handleResumeProcessing(
  name: string,
  email: string,
  fileContent: string,
  country: string,
  fileType?: string
) {
  // Get target country specific instructions
  const countrySpecificPrompt = getCountrySpecificPrompt(country);
  
  // Check if the content length is too long
  if (fileContent.length > 100000) {
    console.log("File content too large, using fallback mode");
    const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt, name, email);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        enhancedResume: fallbackResume,
        fallbackMode: true,
        message: "Using fallback enhancement mode due to content length."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
  
  try {
    // Process with OpenAI - using the structured resume format instructions
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a resume enhancement engine.

Your job is to take a plain text resume (possibly translated from another language) and return a fully enhanced, professionally formatted version in English.

Your output should follow a clean layout with clear section headers in ALL CAPS, line breaks between sections, and no markdown or HTML. This format is meant to be directly used in a PDF file.

Structure your output like this:

[Full Name]  
[Email]  
[Phone Number]  
[LinkedIn or Website]  

---

PROFESSIONAL SUMMARY  
[A 2-3 sentence summary]

---

WORK EXPERIENCE  
[Job Title]  
[Company], [City]  
[Date Range]  
- Bullet point 1  
- Bullet point 2  

(repeat as needed)

---

EDUCATION  
[Degree]  
[University], [City]  
[Date Range]

---

SKILLS  
- Skill 1  
- Skill 2  
- Skill 3  

---

ADDITIONAL INFORMATION  
[Languages, certifications, awards, or relevant notes]

---

References available upon request.

Return only the resume text, clean and formatted, ready to be saved as a PDF. Target the resume for the job market in: ${country}.`
          },
          {
            role: "user",
            content: `Here is a resume to enhance for ${country}. 
            ${countrySpecificPrompt}
            
            Resume content:
            ${fileContent.substring(0, 8000)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      
      // Handle quota exceeded error and other errors with fallback mode
      console.log("API error detected, using fallback mode");
      const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt, name, email);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          enhancedResume: fallbackResume,
          fallbackMode: true,
          message: "Using fallback enhancement mode due to API limitations."
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const enhancedResume = openaiData.choices[0].message.content;
    
    // Save to Supabase
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      );

      await supabase.from("ClientData").insert([
        {
          user_id: null, // Anonymous user for now
          source_text: fileContent.substring(0, 1000), // Store only a preview to save space
          translated_text: enhancedResume,
          target_lang: "english",
          source_lang: "detected", // In a real app, you'd detect the language
        },
      ]);
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue even if DB save fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        enhancedResume,
        message: "Your resume has been successfully translated and enhanced!"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (apiError) {
    console.error("API processing error:", apiError);
    
    // Generate a fallback enhancement without API
    const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt, name, email);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        enhancedResume: fallbackResume,
        fallbackMode: true,
        message: "Using fallback enhancement mode due to API limitations."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
}
