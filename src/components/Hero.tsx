
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('upload-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 bg-gradient-to-r from-transumee-600 to-purple-500 bg-clip-text text-transparent">
        Your Resume. Translated. Upgraded.
      </h1>
      <p className="text-lg md:text-xl text-transumee-900 mb-6 font-light">
        Upload your CV in any language. Get a perfect English version in 1 minute.
      </p>
      <Button 
        onClick={scrollToForm}
        size="lg" 
        className="bg-transumee-600 hover:bg-transumee-700 text-white text-lg font-medium rounded-xl px-8 py-6 shadow-md hover:shadow-lg transition-all lg:hidden"
      >
        Try it now
      </Button>
      <div className="mt-4 text-sm text-transumee-900/70">
        Powered by GPT-4 technology
      </div>
    </div>
  );
};

export default Hero;
