
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => {
  const [resumeContent, setResumeContent] = useState<string | null>(null);

  // Listen for resume content - this would be enhanced in a real app
  // to store and retrieve resume content from local storage or state management
  useEffect(() => {
    const handleResumeProcessed = (event: CustomEvent) => {
      if (event.detail?.resumeContent) {
        setResumeContent(event.detail.resumeContent);
        console.log("Resume content received for ChatGPT:", event.detail.resumeContent.substring(0, 50) + "...");
      }
    };
    
    // Create a custom event type
    window.addEventListener('resumeProcessed' as any, handleResumeProcessed as EventListener);
    
    return () => {
      window.removeEventListener('resumeProcessed' as any, handleResumeProcessed as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Floating chat will show only if we have resume content */}
        {resumeContent && <ChatBot resumeContent={resumeContent} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
