
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
    "france": "Format this as a French 'CV': Include a professional photo at the top (placeholder: [PHOTO]). Be concise and formal. Education section should come BEFORE work experience. All languages must be listed with proficiency level. Use formal French language. Include age and place of birth if available.",
    "germany": "Be detailed and precise. Include personal information at the top. Formal tone is expected.",
    "australia": "Casual but professional tone. Focus on achievements and cultural fit. Include hobbies/interests.",
    "japan": "Be concise and modest. Include a photo, age, and personal details. Emphasis on education and company loyalty.",
    "china": "Include personal information and a photo. Focus on educational background and achievements. Be factual and detailed.",
    "korea": "Include photo, age, and personal information. Show respect for hierarchy and emphasize educational background.",
    "india": "Focus on technical skills and educational qualifications. Highlight teamwork capabilities and adaptability.",
    "singapore": "Focus on bilingual abilities and cross-cultural skills. Emphasize educational qualifications and technical skills.",
    "malaysia": "Highlight language proficiency and multicultural experience. Balance between Western and local resume styles.",
    "thailand": "Include personal details and photo. Focus on educational background and teamwork skills.",
    "vietnam": "Include personal details. Focus on foreign language skills and adaptability. Highlight formal education.",
    "philippines": "Emphasize communication skills, especially English proficiency. Focus on adaptability and formal education.",
    "indonesia": "Include personal details and photo. Highlight educational credentials and teamwork abilities.",
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
    "india": "English",
    "singapore": "English",
    "malaysia": "English",
    "thailand": "Thai",
    "vietnam": "Vietnamese",
    "philippines": "English",
    "indonesia": "Indonesian",
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
    "france": "Disponible pour un entretien à votre convenance. " +
             "Permis de conduire B. Mobilité nationale et internationale. " +
             "Excellentes compétences en communication et capacité d'adaptation à de nouveaux environnements.",
    "germany": "Detail-oriented with appreciation for precision and quality. " +
               "Understanding of German business culture and structured work environments.",
    "australia": "Adaptable team player with excellent communication skills. " +
                "Enthusiastic about contributing to a positive workplace culture.",
    "japan": "Respectful of Japanese business culture and hierarchy. " +
             "Understanding of group harmony and consensus-building approaches.",
    "china": "Familiarity with Chinese business practices. " +
             "Ability to build and maintain professional relationships (guanxi).",
    "korea": "Appreciation for Korean business hierarchy and etiquette. " +
             "Understanding of team dynamics and group decision-making.",
    "india": "Strong technical skills and problem-solving abilities. " +
             "Adaptable to diverse work environments and collaborative team settings.",
    "singapore": "Multicultural awareness and strong communication skills. " +
                 "Ability to work in fast-paced, diverse environments.",
    "malaysia": "Appreciation for multicultural work environments. " +
                "Strong interpersonal skills and adaptability.",
    "thailand": "Respectful of Thai business culture and hierarchies. " +
                "Positive attitude and strong interpersonal skills.",
    "vietnam": "Adaptable to changing environments. " +
               "Strong work ethic and commitment to professional development.",
    "philippines": "Excellent communication skills and customer service orientation. " +
                   "Adaptable and resilient with strong teamwork capabilities.",
    "indonesia": "Respectful of Indonesian business customs. " +
                 "Patient and detail-oriented with strong interpersonal skills.",
    "other": "Globally-minded professional with cross-cultural communication skills. " +
             "Adaptable to diverse work environments and business practices."
  };
  
  return countryMap[country.toLowerCase()] || countryMap["other"];
}
