
import React from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('upload-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="flex items-center justify-between py-6 px-4 md:px-6 lg:px-8">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-transumee-600">Transumee</span>
      </div>
      <div>
        <Button 
          onClick={scrollToForm}
          variant="outline" 
          className="rounded-full hover:bg-transumee-50 hover:text-transumee-600 transition-all"
        >
          Try it now
        </Button>
      </div>
    </header>
  );
};

export default Header;
