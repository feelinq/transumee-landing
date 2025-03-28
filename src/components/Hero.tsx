
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
    <section className="py-16 md:py-24 lg:py-32 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 bg-gradient-to-r from-transumee-600 to-purple-500 bg-clip-text text-transparent">
          Your Resume. Translated. Upgraded.
        </h1>
        <p className="text-xl md:text-2xl text-transumee-900 mb-12 max-w-2xl mx-auto font-light">
          Upload your CV in any language. Get a perfect English version in 1 minute.
        </p>
        <Button 
          onClick={scrollToForm}
          size="lg" 
          className="bg-transumee-600 hover:bg-transumee-700 text-white text-lg font-medium rounded-xl px-8 py-6 shadow-md hover:shadow-lg transition-all"
        >
          Try it now
        </Button>
        <div className="mt-6 text-sm text-transumee-900/70">
          Powered by GPT-4 technology
        </div>
      </div>
    </section>
  );
};

export default Hero;
