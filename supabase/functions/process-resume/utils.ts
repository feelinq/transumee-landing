
// Common utilities and constants

// CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function for country-specific guidance
export function getCountrySpecificPrompt(country: string): string {
  const countryPrompts: Record<string, string> = {
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

// Get target language based on the country
export function getTargetLanguage(country: string): string {
  const countryLanguageMap: Record<string, string> = {
    "usa": "English",
    "uk": "English",
    "canada": "English",
    "australia": "English",
    "germany": "German",
    "france": "French",
    "spain": "Spanish",
    "italy": "Italian",
    "portugal": "Portuguese",
    "netherlands": "Dutch",
    "belgium": "Dutch",
    "sweden": "Swedish",
    "norway": "Norwegian",
    "denmark": "Danish",
    "finland": "Finnish",
    "poland": "Polish",
    "russia": "Russian",
    "japan": "Japanese",
    "china": "Chinese",
    "korea": "Korean",
    "other": "English" // Default to English for other countries
  };
  
  return countryLanguageMap[country.toLowerCase()] || "English";
}

// Add country-specific additional information
export function countrySpecificAdditionalInfo(country: string): string {
  const countryMap: Record<string, string> = {
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
