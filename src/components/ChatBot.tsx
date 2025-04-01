
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatBotProps {
  resumeContent: string;
}

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
};

const ChatBot = ({ resumeContent }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your resume assistant. Ask me questions about improving your resume or for advice on job applications.",
      role: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user' as const
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log("Sending request to resume-chat function");
      const response = await supabase.functions.invoke("resume-chat", {
        body: {
          message: input,
          resumeContent,
          conversation: messages.map(({ content, role }) => ({ content, role }))
        }
      });

      if (response.error) {
        console.error("Supabase function error:", response.error);
        throw new Error(response.error.message || "Error processing your question");
      }

      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: response.data?.response || "I'm sorry, I couldn't process your request.",
        role: 'assistant' as const
      };

      setMessages(prev => [...prev, botResponse]);
      console.log("Got response successfully");
    } catch (error) {
      console.error("Chat Error:", error);
      toast({
        title: "Chat Error",
        description: "There was a problem connecting to the AI assistant.",
        variant: "destructive",
      });

      // Add fallback response
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant' as const
      };

      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 md:p-6 border border-transumee-200">
      <h3 className="text-lg font-bold mb-4 text-center text-transumee-900">Resume Assistant</h3>
      
      <div className="mb-4 p-4 bg-transumee-50 rounded-xl border border-transumee-200 h-[300px] overflow-y-auto flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-transumee-600 text-white self-end'
                : 'bg-gray-200 text-transumee-900 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="bg-gray-200 text-transumee-900 p-3 rounded-xl max-w-[80%] self-start">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your resume..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-transumee-600 hover:bg-transumee-700 rounded-xl"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
