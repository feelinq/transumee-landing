
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import UploadForm from '@/components/UploadForm';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-transumee-50">
      <Header />
      <div className="container mx-auto px-4 flex flex-col lg:flex-row lg:items-center py-12 gap-8">
        <Hero />
        <UploadForm />
      </div>
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
