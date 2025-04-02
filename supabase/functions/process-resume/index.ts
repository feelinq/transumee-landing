
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
  let enhancedResume = `${name || "CANDIDATE NAME"}\n`;
  enhancedResume += `${email || "email@example.com"}\n`;
  enhancedResume += "Phone: [Contact Number]\n";
  enhancedResume += "LinkedIn: [LinkedIn Profile]\n\n";  // Fixed: Changed backtick to double quote
  
  enhancedResume += "---\n\n";
  
  // Add professional summary
  enhancedResume += "PROFESSIONAL SUMMARY\n";
  enhancedResume += "Dedicated and results-driven professional with experience in " + 
    (sections.experience ? extractIndustryFromExperience(sections.experience) : "the industry") + 
    ". Seeking to leverage skills and expertise to contribute to organizational success " +
    "in a challenging and rewarding position.\n\n";
  
  enhancedResume += "---\n\n";
  
  // Add experience section if available
  if (sections.experience) {
    enhancedResume += "WORK EXPERIENCE\n";
    const experienceLines = sections.experience.split('\n').filter(line => line.trim().length > 0);
    
    // Try to format into job entries with bullet points
    let currentCompany = "";
    let currentTitle = "";
    let currentPeriod = "";
    
    for (const line of experienceLines) {
      if (line.includes("20") && (line.includes("-") || line.includes("–"))) {
        // This is likely a date range
        currentPeriod = line.trim();
        enhancedResume += `${currentTitle || "Position"}\n${currentCompany || "Company"}, ${country}\n${currentPeriod}\n`;
      } else if (line.length < 50 && !line.startsWith("-") && !line.startsWith("•")) {
        // This is likely a job title or company
        if (!currentCompany) {
          currentCompany = line.trim();
        } else {
          currentTitle = line.trim();
        }
      } else {
        // This is likely a job description bullet point
        enhancedResume += `- ${line.trim().replace(/^[-•]\s*/, "")}\n`;
      }
    }
    enhancedResume += "\n---\n\n";
  }
  
  // Add education section if available
  if (sections.education) {
    enhancedResume += "EDUCATION\n";
    const educationLines = sections.education.split('\n').filter(line => line.trim().length > 0);
    
    let degree = "";
    let institution = "";
    let period = "";
    
    for (const line of educationLines) {
      if (line.includes("20") && (line.includes("-") || line.includes("–"))) {
        period = line.trim();
      } else if (line.length < 100) {
        if (!degree) {
          degree = line.trim();
        } else if (!institution) {
          institution = line.trim();
        }
      }
    }
    
    enhancedResume += `${degree || "Degree"}\n${institution || "University"}, ${country}\n${period || "Graduation Year"}\n\n`;
    enhancedResume += "---\n\n";
  }
  
  // Add skills section if available
  if (sections.skills) {
    enhancedResume += "SKILLS\n";
    const skillsArray = sections.skills
      .split(/[,;\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 50);
    
    for (const skill of skillsArray) {
      enhancedResume += `- ${skill}\n`;
    }
    enhancedResume += "\n---\n\n";
  }
  
  // Add country-specific section
  enhancedResume += "ADDITIONAL INFORMATION\n";
  enhancedResume += countrySpecificAdditionalInfo(country);
  
  enhancedResume += "\n---\n\n";
  enhancedResume += "References available upon request.";
  
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

// Add country-specific additional information
function countrySpecificAdditionalInfo(country) {
  const countryMap = {
    "usa": "Authorized to work in the United States. Available for immediate start. " +
           "Willing to relocate as necessary for the right opportunity.",
    "uk": "Excellent communication skills with proficiency in British English. " +
          "Possesses strong teamwork abilities and adaptability to new environments.",
    "canada": "Adept at working in multicultural environments. " +
              "Knowledge of both Canadian business practices and bilingual capabilities where applicable.",
    "germany": "Detail-oriented with appreciation for precision and quality. " +
               "Understanding of German business culture and structured work environments.",
    "france": "Strong interpersonal skills and cultural awareness. " +
              "Appreciation for work-life balance and French business etiquette.",
    "australia": "Adaptable team player with excellent communication skills. " +
                "Enthusiastic about contributing to a positive workplace culture.",
    "other": "Globally-minded professional with cross-cultural communication skills. " +
             "Adaptable to diverse work environments and business practices."
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
