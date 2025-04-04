
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders, getCountrySpecificPrompt, getTargetLanguage } from "./utils.ts";
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
  
  // Get target language for the country
  const targetLanguage = getTargetLanguage(country);
  
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

Your job is to take a plain text resume (possibly translated from another language) and return a fully enhanced, professionally formatted version in ${targetLanguage}.

Your output should follow a clean layout with clear section headers in ALL CAPS, line breaks between sections, and no markdown or HTML. This format is meant to be directly used in a PDF file.

Structure your output like this:

[Full Name]  
[Email]  
[Phone Number]  
[LinkedIn or Website]  

---

${targetLanguage === "English" ? "PROFESSIONAL SUMMARY" : translateSectionTitle("PROFESSIONAL SUMMARY", targetLanguage)}  
[A 2-3 sentence summary]

---

${targetLanguage === "English" ? "WORK EXPERIENCE" : translateSectionTitle("WORK EXPERIENCE", targetLanguage)}  
[Job Title]  
[Company], [City]  
[Date Range]  
- Bullet point 1  
- Bullet point 2  

(repeat as needed)

---

${targetLanguage === "English" ? "EDUCATION" : translateSectionTitle("EDUCATION", targetLanguage)}  
[Degree]  
[University], [City]  
[Date Range]

---

${targetLanguage === "English" ? "SKILLS" : translateSectionTitle("SKILLS", targetLanguage)}  
- Skill 1  
- Skill 2  
- Skill 3  

---

${targetLanguage === "English" ? "ADDITIONAL INFORMATION" : translateSectionTitle("ADDITIONAL INFORMATION", targetLanguage)}  
[Languages, certifications, awards, or relevant notes]

---

${targetLanguage === "English" ? "References available upon request." : translateSectionTitle("References available upon request.", targetLanguage)}

Return only the resume text, clean and formatted, ready to be saved as a PDF. Target the resume for the job market in: ${country} using ${targetLanguage} language.`
          },
          {
            role: "user",
            content: `Here is a resume to enhance for ${country} in ${targetLanguage}. 
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
          target_lang: targetLanguage,
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
        message: `Your resume has been successfully translated and enhanced in ${targetLanguage}!`
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

// Helper function to translate section titles
function translateSectionTitle(title: string, language: string): string {
  const translations: Record<string, Record<string, string>> = {
    "PROFESSIONAL SUMMARY": {
      "German": "BERUFLICHES PROFIL",
      "French": "RÉSUMÉ PROFESSIONNEL",
      "Spanish": "RESUMEN PROFESIONAL",
      "Italian": "PROFILO PROFESSIONALE",
      "Portuguese": "RESUMO PROFISSIONAL",
      "Dutch": "PROFESSIONELE SAMENVATTING",
      "Swedish": "PROFESSIONELL SAMMANFATTNING",
      "Norwegian": "PROFESJONELL SAMMENDRAG",
      "Danish": "PROFESSIONEL SAMMENFATNING",
      "Finnish": "AMMATILLINEN YHTEENVETO",
      "Polish": "PODSUMOWANIE ZAWODOWE",
      "Russian": "ПРОФЕССИОНАЛЬНОЕ РЕЗЮМЕ",
      "Japanese": "職務要約",
      "Chinese": "专业摘要",
      "Korean": "전문 요약",
    },
    "WORK EXPERIENCE": {
      "German": "BERUFSERFAHRUNG",
      "French": "EXPÉRIENCE PROFESSIONNELLE",
      "Spanish": "EXPERIENCIA LABORAL",
      "Italian": "ESPERIENZA LAVORATIVA",
      "Portuguese": "EXPERIÊNCIA PROFISSIONAL",
      "Dutch": "WERKERVARING",
      "Swedish": "ARBETSLIVSERFARENHET",
      "Norwegian": "ARBEIDSERFARING",
      "Danish": "ERHVERVSERFARING",
      "Finnish": "TYÖKOKEMUS",
      "Polish": "DOŚWIADCZENIE ZAWODOWE",
      "Russian": "ОПЫТ РАБОТЫ",
      "Japanese": "職務経歴",
      "Chinese": "工作经验",
      "Korean": "직장 경력",
    },
    "EDUCATION": {
      "German": "AUSBILDUNG",
      "French": "FORMATION",
      "Spanish": "EDUCACIÓN",
      "Italian": "ISTRUZIONE",
      "Portuguese": "EDUCAÇÃO",
      "Dutch": "OPLEIDING",
      "Swedish": "UTBILDNING",
      "Norwegian": "UTDANNING",
      "Danish": "UDDANNELSE",
      "Finnish": "KOULUTUS",
      "Polish": "EDUKACJA",
      "Russian": "ОБРАЗОВАНИЕ",
      "Japanese": "学歴",
      "Chinese": "教育背景",
      "Korean": "교육",
    },
    "SKILLS": {
      "German": "FÄHIGKEITEN",
      "French": "COMPÉTENCES",
      "Spanish": "HABILIDADES",
      "Italian": "COMPETENZE",
      "Portuguese": "HABILIDADES",
      "Dutch": "VAARDIGHEDEN",
      "Swedish": "FÄRDIGHETER",
      "Norwegian": "FERDIGHETER",
      "Danish": "FÆRDIGHEDER",
      "Finnish": "TAIDOT",
      "Polish": "UMIEJĘTNOŚCI",
      "Russian": "НАВЫКИ",
      "Japanese": "スキル",
      "Chinese": "技能",
      "Korean": "기술",
    },
    "ADDITIONAL INFORMATION": {
      "German": "ZUSÄTZLICHE INFORMATIONEN",
      "French": "INFORMATIONS COMPLÉMENTAIRES",
      "Spanish": "INFORMACIÓN ADICIONAL",
      "Italian": "INFORMAZIONI AGGIUNTIVE",
      "Portuguese": "INFORMAÇÕES ADICIONAIS",
      "Dutch": "AANVULLENDE INFORMATIE",
      "Swedish": "YTTERLIGARE INFORMATION",
      "Norwegian": "YTTERLIGERE INFORMASJON",
      "Danish": "YDERLIGERE OPLYSNINGER",
      "Finnish": "LISÄTIEDOT",
      "Polish": "DODATKOWE INFORMACJE",
      "Russian": "ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ",
      "Japanese": "追加情報",
      "Chinese": "附加信息",
      "Korean": "추가 정보",
    },
    "References available upon request.": {
      "German": "Referenzen auf Anfrage verfügbar.",
      "French": "Références disponibles sur demande.",
      "Spanish": "Referencias disponibles a petición.",
      "Italian": "Referenze disponibili su richiesta.",
      "Portuguese": "Referências disponíveis mediante solicitação.",
      "Dutch": "Referenties beschikbaar op aanvraag.",
      "Swedish": "Referenser tillgängliga på begäran.",
      "Norwegian": "Referanser tilgjengelig på forespørsel.",
      "Danish": "Referencer tilgængelige på anmodning.",
      "Finnish": "Suositukset saatavilla pyynnöstä.",
      "Polish": "Referencje dostępne na żądanie.",
      "Russian": "Рекомендации предоставляются по запросу.",
      "Japanese": "照会先は要望に応じて提供可能です。",
      "Chinese": "可根据要求提供推荐信。",
      "Korean": "요청 시 참고인 정보 제공 가능.",
    }
  };
  
  return translations[title]?.[language] || title;
}
