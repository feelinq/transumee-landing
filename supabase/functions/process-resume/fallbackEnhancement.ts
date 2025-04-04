
import { countrySpecificAdditionalInfo } from "./utils.ts";

// Extract industry from experience section
function extractIndustryFromExperience(experienceText: string): string {
  // Very basic industry detection
  const industries = [
    "technology", "healthcare", "finance", "education", "marketing",
    "retail", "manufacturing", "hospitality", "consulting", "engineering",
    "technologie", "santé", "finance", "éducation", "marketing",
    "commerce de détail", "fabrication", "hôtellerie", "conseil", "ingénierie"
  ];
  
  for (const industry of industries) {
    if (experienceText.toLowerCase().includes(industry)) {
      return industry;
    }
  }
  
  return "relevant industry";
}

// Helper function to extract resume sections
export function extractResumeSections(text: string): Record<string, string> {
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
    
    if (lowerLine.includes("experience") || lowerLine.includes("employment") || 
        lowerLine.includes("work history") || lowerLine.includes("expérience") || 
        lowerLine.includes("travail") || lowerLine.includes("professionnelle")) {
      currentSection = "experience";
      continue;
    } else if (lowerLine.includes("education") || lowerLine.includes("academic") || 
               lowerLine.includes("qualification") || lowerLine.includes("formation") || 
               lowerLine.includes("études") || lowerLine.includes("diplôme")) {
      currentSection = "education";
      continue;
    } else if (lowerLine.includes("skills") || lowerLine.includes("competencies") || 
               lowerLine.includes("abilities") || lowerLine.includes("compétences") || 
               lowerLine.includes("aptitudes") || lowerLine.includes("savoir-faire")) {
      currentSection = "skills";
      continue;
    }
    
    if (currentSection && sections[currentSection] !== undefined) {
      sections[currentSection] += line + "\n";
    }
  }
  
  return sections;
}

// Fallback enhancement function when API is unavailable
export function generateFallbackEnhancement(
  resumeText: string, 
  country: string, 
  countryPrompt: string, 
  name: string, 
  email: string
): string {
  // Extract basic sections we'd expect in a resume
  const sections = extractResumeSections(resumeText);
  
  // Determine if we're creating a French resume
  const isFrench = country.toLowerCase() === "france";
  
  // Apply basic enhancements based on country
  let enhancedResume = `${name || "CANDIDATE NAME"}\n`;
  enhancedResume += `${email || "email@example.com"}\n`;
  enhancedResume += isFrench ? "Téléphone: [Numéro de téléphone]\n" : "Phone: [Contact Number]\n";
  enhancedResume += isFrench ? "LinkedIn: [Profil LinkedIn]\n" : "LinkedIn: [LinkedIn Profile]\n";
  if (isFrench) {
    enhancedResume += "[PHOTO]\n";
  }
  
  enhancedResume += "\n---\n\n";
  
  // Add professional summary
  enhancedResume += isFrench ? "RÉSUMÉ PROFESSIONNEL\n" : "PROFESSIONAL SUMMARY\n";
  if (isFrench) {
    enhancedResume += "Professionnel(le) dévoué(e) et orienté(e) résultats avec une expérience dans " + 
      (sections.experience ? extractIndustryFromExperience(sections.experience) : "le secteur") + 
      ". Je cherche à mettre à profit mes compétences et mon expertise pour contribuer au succès d'une organisation " +
      "dans un poste stimulant et enrichissant.\n\n";
  } else {
    enhancedResume += "Dedicated and results-driven professional with experience in " + 
      (sections.experience ? extractIndustryFromExperience(sections.experience) : "the industry") + 
      ". Seeking to leverage skills and expertise to contribute to organizational success " +
      "in a challenging and rewarding position.\n\n";
  }
  
  enhancedResume += "---\n\n";
  
  // For French resumes, we put education before experience
  if (isFrench) {
    // Add education section if available
    if (sections.education) {
      enhancedResume += "FORMATION\n";
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
      
      enhancedResume += `${degree || "Diplôme"}\n${institution || "Université"}, ${country}\n${period || "Année d'obtention"}\n\n`;
      enhancedResume += "---\n\n";
    }
  }
  
  // Add experience section if available
  if (sections.experience) {
    enhancedResume += isFrench ? "EXPÉRIENCE PROFESSIONNELLE\n" : "WORK EXPERIENCE\n";
    const experienceLines = sections.experience.split('\n').filter(line => line.trim().length > 0);
    
    // Try to format into job entries with bullet points
    let currentCompany = "";
    let currentTitle = "";
    let currentPeriod = "";
    
    for (const line of experienceLines) {
      if (line.includes("20") && (line.includes("-") || line.includes("–"))) {
        // This is likely a date range
        currentPeriod = line.trim();
        enhancedResume += `${currentTitle || (isFrench ? "Poste" : "Position")}\n${currentCompany || (isFrench ? "Entreprise" : "Company")}, ${country}\n${currentPeriod}\n`;
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
  
  // Add education section if available (for non-French resumes, or as a fallback)
  if (!isFrench && sections.education) {
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
    enhancedResume += isFrench ? "COMPÉTENCES\n" : "SKILLS\n";
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
  enhancedResume += isFrench ? "INFORMATIONS COMPLÉMENTAIRES\n" : "ADDITIONAL INFORMATION\n";
  enhancedResume += countrySpecificAdditionalInfo(country);
  
  enhancedResume += "\n---\n\n";
  enhancedResume += isFrench ? "Références disponibles sur demande." : "References available upon request.";
  
  return enhancedResume;
}
