
import React from 'react';

interface ResumePDFProps {
  content: string;
}

const ResumePDF = ({ content }: ResumePDFProps) => {
  // Function to process resume content and format it properly
  const formatResumeContent = () => {
    if (!content) return [];
    
    const sections = content.split('---').filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      
      // Check if this is likely a header section (name, contact info)
      if (index === 0) {
        return (
          <div key={`section-${index}`} className="header-section mb-6">
            {lines.map((line, lineIdx) => (
              <div 
                key={`header-${lineIdx}`} 
                className={lineIdx === 0 ? "text-2xl font-bold mb-1" : "text-sm"}
              >
                {line}
              </div>
            ))}
          </div>
        );
      }
      
      // Process other sections (experience, education, etc.)
      const sectionTitle = lines[0]?.trim();
      const sectionContent = lines.slice(1);
      
      return (
        <div key={`section-${index}`} className="mb-5">
          {sectionTitle && (
            <div className="text-lg font-bold uppercase mb-2 border-b border-gray-300 pb-1">
              {sectionTitle}
            </div>
          )}
          <div className="pl-1">
            {sectionContent.map((line, lineIdx) => {
              // Check if it's a bullet point
              if (line.trim().startsWith('-')) {
                return (
                  <div key={`line-${lineIdx}`} className="ml-4 mb-1 flex">
                    <span className="mr-2">•</span>
                    <span>{line.trim().substring(1).trim()}</span>
                  </div>
                );
              }
              
              // Check if it's a job title or company (typically has no indentation)
              if (line.trim() && !line.startsWith(' ') && lineIdx > 0) {
                return (
                  <div key={`line-${lineIdx}`} className={lineIdx > 0 && lineIdx % 3 === 0 ? "mt-3 font-semibold" : "font-semibold"}>
                    {line}
                  </div>
                );
              }
              
              // Regular line
              return line.trim() ? (
                <div key={`line-${lineIdx}`} className="mb-1">
                  {line}
                </div>
              ) : <div key={`line-${lineIdx}`} className="h-2"></div>;
            })}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div 
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#333',
        maxWidth: '210mm', // A4 width
        margin: '0 auto',
        padding: '10mm',
        backgroundColor: 'white',
      }}
    >
      {formatResumeContent()}
    </div>
  );
};

export default ResumePDF;
