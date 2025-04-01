
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import ChatBot from './ChatBot';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultViewProps {
  translatedResume: string | null;
  isFallbackMode: boolean;
  handleNewUpload: () => void;
}

const ResultView = ({ translatedResume, isFallbackMode, handleNewUpload }: ResultViewProps) => {
  const { toast } = useToast();
  const [showChat, setShowChat] = useState(true); // Set to true by default to show chat

  const handleCopyToClipboard = () => {
    if (translatedResume) {
      navigator.clipboard.writeText(translatedResume);
      toast({
        title: "Copied!",
        description: "Resume content copied to clipboard",
      });
    }
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
        <pre className="whitespace-pre-wrap text-sm text-transumee-900">{translatedResume}</pre>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Button 
          onClick={handleCopyToClipboard}
          className="flex-1 bg-transumee-600 hover:bg-transumee-700 text-white rounded-xl"
        >
          Copy to Clipboard
        </Button>
        
        <Button 
          onClick={handleNewUpload}
          className="flex-1 bg-gradient-to-r from-transumee-600 to-purple-500 hover:from-transumee-700 hover:to-purple-600 text-white rounded-xl"
        >
          Upload Another Resume
        </Button>
      </div>
      
      <Button
        onClick={() => setShowChat(!showChat)}
        className="w-full bg-transumee-100 hover:bg-transumee-200 text-transumee-800 rounded-xl flex items-center justify-center mb-4"
      >
        {showChat ? "Hide Resume Assistant" : "Show Resume Assistant"}
        {showChat ? <ChevronUp className="ml-2" size={16} /> : <ChevronDown className="ml-2" size={16} />}
      </Button>
      
      {showChat && translatedResume && (
        <ChatBot resumeContent={translatedResume} />
      )}
    </div>
  );
};

export default ResultView;
