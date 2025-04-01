
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, fileContent, country, fileType } = await req.json();
    
    // Validate inputs
    if (!name || !email || !fileContent || !country) {
      throw new Error("Missing required fields");
    }

    console.log(`Processing resume for ${name} targeting ${country}`);
    
    // Get target country specific instructions
    const countrySpecificPrompt = getCountrySpecificPrompt(country);
    
    // Extract text from file if it's not already text
    // For now we assume the content is already text, in a real implementation
    // you would use a PDF parser or other document parser based on fileType
    const resumeText = fileContent;
    
    // Process with OpenAI
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
            content: `You are an expert resume translator and enhancer. 
            Your task is to translate resumes into professional English, 
            adapt them to the target country's hiring standards, and enhance them 
            to highlight the candidate's strengths. Keep the same information 
            but make it more appealing to employers.`
          },
          {
            role: "user",
            content: `Please translate and enhance this resume for a job application in ${country}. 
            ${countrySpecificPrompt}
            
            Here's the resume content:
            ${resumeText}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const openaiData = await openaiResponse.json();
    const enhancedResume = openaiData.choices[0].message.content;
    
    // Save to Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
    );

    const { data, error } = await supabase.from("ClientData").insert([
      {
        user_id: null, // Anonymous user for now
        source_text: resumeText,
        translated_text: enhancedResume,
        target_lang: "english",
        source_lang: "detected", // In a real app, you'd detect the language
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
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
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Helper function for country-specific guidance
function getCountrySpecificPrompt(country: string): string {
  const countryPrompts: Record<string, string> = {
    "usa": "Focus on achievements and quantifiable results. Use active language and industry-specific keywords. Keep it under 1-2 pages.",
    "uk": "Emphasize skills and achievements. Use British English spelling. Include a personal statement at the beginning.",
    "canada": "Highlight both hard and soft skills. Use a hybrid of US/UK format with a focus on chronological work history.",
    "germany": "Be detailed and precise. Include personal information at the top. Formal tone is expected.",
    "france": "Include a professional photo. Focus on education and certifications. Maintain a formal tone.",
    "australia": "Casual but professional tone. Focus on achievements and cultural fit. Include hobbies/interests.",
    "other": "Focus on transferable skills and achievements. Highlight international experience. Use clear, straightforward English.",
  };
  
  return countryPrompts[country] || countryPrompts["other"];
}
