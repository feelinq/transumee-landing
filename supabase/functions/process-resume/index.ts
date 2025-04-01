
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
    
    // Check if the content length is too long
    if (fileContent.length > 100000) {
      console.log("File content too large, using fallback mode");
      const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt);
      
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
        const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt);
        
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
      const fallbackResume = generateFallbackEnhancement(fileContent, country, countrySpecificPrompt);
      
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
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        fallbackMode: true, 
        enhancedResume: "We couldn't process your resume. Please try again with a different file or format."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Changed to 200 to ensure client always gets a response
      }
    );
  }
});

// Fallback enhancement function when API is unavailable
function generateFallbackEnhancement(resumeText, country, countryPrompt) {
  // Extract basic sections we'd expect in a resume
  const sections = extractResumeSections(resumeText);
  
  // Apply basic enhancements based on country
  let enhancedResume = `ENHANCED RESUME FOR ${country.toUpperCase()} MARKET\n\n`;
  
  // Add professional summary
  enhancedResume += "PROFESSIONAL SUMMARY\n";
  enhancedResume += "Dedicated and results-driven professional with experience in " + 
    (sections.experience ? extractIndustryFromExperience(sections.experience) : "the industry") + 
    ". Seeking to leverage skills and expertise to contribute to organizational success " +
    "in a challenging and rewarding position.\n\n";
  
  // Add experience section if available
  if (sections.experience) {
    enhancedResume += "PROFESSIONAL EXPERIENCE\n";
    enhancedResume += sections.experience + "\n\n";
  }
  
  // Add education section if available
  if (sections.education) {
    enhancedResume += "EDUCATION\n";
    enhancedResume += sections.education + "\n\n";
  }
  
  // Add skills section if available
  if (sections.skills) {
    enhancedResume += "SKILLS & COMPETENCIES\n";
    enhancedResume += sections.skills + "\n\n";
  }
  
  // Add country-specific section
  enhancedResume += countrySpecificSection(country);
  
  return enhancedResume;
}

// Helper function to extract resume sections
function extractResumeSections(text) {
  const sections = {
    experience: "",
    education: "",
    skills: ""
  };
  
  // Simple extraction logic
  const lines = text.split('\n');
  let currentSection = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes("experience") || lowerLine.includes("employment") || lowerLine.includes("work history")) {
      currentSection = "experience";
      continue;
    } else if (lowerLine.includes("education") || lowerLine.includes("academic") || lowerLine.includes("qualification")) {
      currentSection = "education";
      continue;
    } else if (lowerLine.includes("skills") || lowerLine.includes("competencies") || lowerLine.includes("abilities")) {
      currentSection = "skills";
      continue;
    }
    
    if (currentSection && sections[currentSection] !== undefined) {
      sections[currentSection] += line + "\n";
    }
  }
  
  return sections;
}

// Extract industry from experience section
function extractIndustryFromExperience(experienceText) {
  // Very basic industry detection
  const industries = [
    "technology", "healthcare", "finance", "education", "marketing",
    "retail", "manufacturing", "hospitality", "consulting", "engineering"
  ];
  
  for (const industry of industries) {
    if (experienceText.toLowerCase().includes(industry)) {
      return industry;
    }
  }
  
  return "relevant industry";
}

// Add country-specific section based on target country
function countrySpecificSection(country) {
  const countryMap = {
    "usa": "ADDITIONAL INFORMATION\n" +
           "Authorized to work in the United States. Available for immediate start. " +
           "Willing to relocate as necessary for the right opportunity.\n\n",
    "uk": "ADDITIONAL INFORMATION\n" +
          "Excellent communication skills with proficiency in British English. " +
          "Possesses strong teamwork abilities and adaptability to new environments.\n\n",
    "canada": "ADDITIONAL INFORMATION\n" +
              "Adept at working in multicultural environments. " +
              "Knowledge of both Canadian business practices and bilingual capabilities where applicable.\n\n",
    "germany": "ADDITIONAL INFORMATION\n" +
               "Detail-oriented with appreciation for precision and quality. " +
               "Understanding of German business culture and structured work environments.\n\n",
    "france": "ADDITIONAL INFORMATION\n" +
              "Strong interpersonal skills and cultural awareness. " +
              "Appreciation for work-life balance and French business etiquette.\n\n",
    "australia": "ADDITIONAL INFORMATION\n" +
                "Adaptable team player with excellent communication skills. " +
                "Enthusiastic about contributing to a positive workplace culture.\n\n",
    "other": "ADDITIONAL INFORMATION\n" +
             "Globally-minded professional with cross-cultural communication skills. " +
             "Adaptable to diverse work environments and business practices.\n\n"
  };
  
  return countryMap[country.toLowerCase()] || countryMap["other"];
}

// Helper function for country-specific guidance
function getCountrySpecificPrompt(country) {
  const countryPrompts = {
    "usa": "Focus on achievements and quantifiable results. Use active language and industry-specific keywords. Keep it under 1-2 pages.",
    "uk": "Emphasize skills and achievements. Use British English spelling. Include a personal statement at the beginning.",
    "canada": "Highlight both hard and soft skills. Use a hybrid of US/UK format with a focus on chronological work history.",
    "germany": "Be detailed and precise. Include personal information at the top. Formal tone is expected.",
    "france": "Include a professional photo. Focus on education and certifications. Maintain a formal tone.",
    "australia": "Casual but professional tone. Focus on achievements and cultural fit. Include hobbies/interests.",
    "other": "Focus on transferable skills and achievements. Highlight international experience. Use clear, straightforward English.",
  };
  
  return countryPrompts[country.toLowerCase()] || countryPrompts["other"];
}
