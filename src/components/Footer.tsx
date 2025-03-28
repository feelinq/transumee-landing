
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-transumee-600">Transumee</span>
            <p className="text-sm text-gray-600 mt-1">Your resume, upgraded with AI</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-transumee-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-transumee-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-transumee-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
          © {new Date().getFullYear()} Transumee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
