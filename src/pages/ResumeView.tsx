
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FileDown, ArrowLeft } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResumePDF from '@/components/ResumePDF';

const ResumeView = () => {
  const [searchParams] = useSearchParams();
  const resumeContent = searchParams.get('content');
  const { toast } = useToast();
  
  const handleDownloadPDF = () => {
    if (!resumeContent) return;
    
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
    <div className="min-h-screen bg-transumee-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button 
          onClick={() => window.history.back()}
          variant="outline" 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-transumee-200 mb-6">
          <h2 className="text-xl font-bold mb-6 text-center text-transumee-900">Your Enhanced Resume</h2>
          
          {resumeContent ? (
            <>
              <div className="mb-6 p-6 bg-white rounded-xl border border-transumee-200 shadow-sm">
                <div id="resume-output" className="overflow-hidden">
                  <ResumePDF content={resumeContent} />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-transumee-600 hover:bg-transumee-700 text-white rounded-xl px-6"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-transumee-900">
              No resume content found. Please go back and try again.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResumeView;
