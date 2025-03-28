
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-white border-t border-transumee-200">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold text-transumee-600">Transumee</span>
            <p className="text-sm text-transumee-900/70 mt-2">Your resume, upgraded with AI</p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-transumee-900/70 hover:text-transumee-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-transumee-900/70 hover:text-transumee-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-transumee-900/70 hover:text-transumee-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-transumee-900/50 pt-8 border-t border-transumee-100">
          © {new Date().getFullYear()} Transumee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
