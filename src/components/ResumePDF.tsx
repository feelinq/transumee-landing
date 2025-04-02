
import React from 'react';

interface ResumePDFProps {
  content: string;
}

const ResumePDF = ({ content }: ResumePDFProps) => {
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
      }}
    >
      {content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResumePDF;
