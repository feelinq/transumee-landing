
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { handleResumeProcessing } from "./resumeProcessor.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, fileContent, country, fileType } = await req.json();
    
    // Validate inputs
    if (!name || !email || !fileContent || !country) {
      throw new Error("Missing required fields");
    }

    console.log(`Processing resume for ${name} targeting ${country}`);
    
    return await handleResumeProcessing(name, email, fileContent, country, fileType);
  } catch (error) {
    console.error("Error processing resume:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        fallbackMode: true, 
        enhancedResume: "We couldn't process your resume. Please try again with a different file or format."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Changed to 200 to ensure client always gets a response
      }
    );
  }
});
