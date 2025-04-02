
import { countrySpecificAdditionalInfo } from "./utils.ts";

// Extract industry from experience section
function extractIndustryFromExperience(experienceText: string): string {
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
  
  // Apply basic enhancements based on country
  let enhancedResume = `${name || "CANDIDATE NAME"}\n`;
  enhancedResume += `${email || "email@example.com"}\n`;
  enhancedResume += "Phone: [Contact Number]\n";
  enhancedResume += "LinkedIn: [LinkedIn Profile]\n\n";
  
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
