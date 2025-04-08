
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import FormView from './FormView';
import ResultView from './ResultView';

const UploadForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [translatedResume, setTranslatedResume] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !name || !email || !country) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and upload a resume.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Read the file
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const fileContent = event.target?.result as string;
        
        // Store original content for debugging purposes
        setOriginalContent(fileContent);
        
        try {
          console.log(`Processing resume for ${name} (${email}) targeting ${country}`);
          console.log(`File type: ${file.type}, size: ${fileContent.length} characters`);
          console.log(`First 100 chars of content: ${fileContent.substring(0, 100)}...`);
          
          // Call our edge function
          const response = await supabase.functions.invoke("process-resume", {
            body: {
              name,
              email,
              fileContent,
              country,
              fileType: file.type
            }
          });
          
          if (response.error) {
            console.error("Supabase function error:", response.error);
            throw new Error(response.error.message || "Error processing resume");
          }

          console.log("Response from edge function:", response.data);

          // Check if we're in fallback mode
          setIsFallbackMode(!!response.data?.fallbackMode);
          
          if (response.data?.enhancedResume) {
            console.log("Resume enhancement successful. Length:", response.data.enhancedResume.length);
            setTranslatedResume(response.data.enhancedResume);
            
            // Dispatch event with resume content for ChatBot
            const event = new CustomEvent('resumeProcessed', {
              detail: { 
                resumeContent: response.data.enhancedResume,
                name,
                email,
                country
              }
            });
            window.dispatchEvent(event);
            
            toast({
              title: "Success!",
              description: response.data?.fallbackMode 
                ? "Your resume has been enhanced using our simplified system."
                : "Your resume has been translated and upgraded successfully.",
            });
          } else {
            console.error("No resume data received in the response");
            setTranslatedResume("Error: No resume data received from our processing service. Please try again.");
            
            toast({
              title: "Processing Error",
              description: "No resume data was returned. Please try again with a different file.",
              variant: "destructive",
            });
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          
          // Handle API errors by showing the error and still attempting to process
          toast({
            title: "Warning",
            description: "Using simplified enhancement due to service limitations.",
            variant: "destructive",
          });
          
          setIsFallbackMode(true);
          // If the API entirely fails, we'll still show something to the user
          const fallbackResume = `ENHANCED RESUME FOR ${name}\n\nEmail: ${email}\n\nWe encountered an issue processing your resume with our AI system. Here's a simplified enhancement:\n\nProfessional Summary: Detail-oriented professional seeking opportunities in the ${country} job market.\n\n[Your original resume content would appear here, professionally formatted.]`;
          
          setTranslatedResume(fallbackResume);
          
          // Also dispatch event with resume content for ChatBot
          const event = new CustomEvent('resumeProcessed', {
            detail: { 
              resumeContent: fallbackResume,
              name,
              email,
              country
            }
          });
          window.dispatchEvent(event);
        } finally {
          setIsSubmitting(false);
        }
      };
      
      fileReader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "File Error",
          description: "Error reading your file. Please try another file.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      };
      
      fileReader.readAsText(file);
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error",
        description: "There was a problem processing your resume. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleNewUpload = () => {
    setTranslatedResume(null);
    setOriginalContent(null);
    setName('');
    setEmail('');
    setFile(null);
    setCountry('');
    setIsFallbackMode(false);
    // Reset the file input
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Render the appropriate view based on state
  return (
    <div id="upload-form" className="flex-1">
      {translatedResume ? (
        <ResultView 
          translatedResume={translatedResume} 
          isFallbackMode={isFallbackMode} 
          handleNewUpload={handleNewUpload} 
        />
      ) : (
        <FormView 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          country={country}
          setCountry={setCountry}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          file={file}
        />
      )}
    </div>
  );
};

export default UploadForm;
