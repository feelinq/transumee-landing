
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, resumeContent, conversation } = await req.json();
    
    // Create system message with instructions for the AI
    const systemMessage = {
      role: 'system', 
      content: `You are an intelligent resume assistant for the Transumee application.
      Your job is to help users improve their resumes and give advice on job applications.
      
      The user has already submitted their resume, which has been translated and enhanced.
      Resume content: ${resumeContent || "No resume content provided"}
      
      Provide helpful, specific advice about their resume and career questions.
      Be professional, positive, and concise. Focus on actionable improvements.
      Don't make up information about their resume that wasn't included.
      If their question isn't about resumes or careers, politely redirect them.`
    };
    
    // Prepare conversation history by mapping to OpenAI format
    const messages = [
      systemMessage,
      ...conversation.map((msg: { role: string, content: string }) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log("Sending message to OpenAI:", message);
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message || "Error from OpenAI API");
    }

    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble processing your request.";
    console.log("Received response from OpenAI");

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in resume-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
