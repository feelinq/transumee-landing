
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ResumePDF from '@/components/ResumePDF';

interface ResultViewProps {
  translatedResume: string | null;
  isFallbackMode: boolean;
  handleNewUpload: () => void;
}

const ResultView = ({ translatedResume, isFallbackMode, handleNewUpload }: ResultViewProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Dispatch custom event with resume content when the component mounts
    if (translatedResume) {
      const event = new CustomEvent('resumeProcessed', {
        detail: { resumeContent: translatedResume }
      });
      window.dispatchEvent(event);
      console.log("Dispatched resumeProcessed event with content");
    }
  }, [translatedResume]);

  const handleCopyToClipboard = () => {
    if (translatedResume) {
      navigator.clipboard.writeText(translatedResume);
      toast({
        title: "Copied!",
        description: "Resume content copied to clipboard",
      });
    }
  };
  
  const handleDownloadPDF = () => {
    if (!translatedResume) return;
    
    const resumeElement = document.getElementById('resume-output');
    if (!resumeElement) return;
    
    toast({
      title: "Generating PDF...",
      description: "Please wait while we prepare your resume",
    });
    
    const options = {
      margin: [15, 15],
      filename: 'enhanced-resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(options).from(resumeElement).save().then(() => {
      toast({
        title: "Success!",
        description: "Your resume PDF has been downloaded",
      });
    }).catch(error => {
      console.error('PDF generation failed:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-transumee-200">
      <h2 className="text-xl font-bold mb-6 text-center text-transumee-900">Your {isFallbackMode ? 'Enhanced' : 'Translated & Upgraded'} Resume</h2>
      
      {isFallbackMode && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription className="text-sm text-amber-800">
            We're using our simplified enhancement system due to high demand. Your resume has been enhanced with basic improvements.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="mb-6 p-4 bg-transumee-50 rounded-xl border border-transumee-200 max-h-[500px] overflow-y-auto">
        <div id="resume-output" className="overflow-hidden">
          <ResumePDF content={translatedResume || ''} />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Button 
          onClick={handleCopyToClipboard}
          className="flex-1 bg-transumee-600 hover:bg-transumee-700 text-white rounded-xl"
        >
          Copy to Clipboard
        </Button>
        
        <Button
          onClick={handleDownloadPDF}
          className="flex-1 bg-transumee-500 hover:bg-transumee-600 text-white rounded-xl"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
        
        <Button 
          onClick={handleNewUpload}
          className="flex-1 bg-gradient-to-r from-transumee-600 to-purple-500 hover:from-transumee-700 hover:to-purple-600 text-white rounded-xl"
        >
          Upload Another Resume
        </Button>
      </div>
    </div>
  );
};

export default ResultView;
