
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import UploadForm from '@/components/UploadForm';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-transumee-50">
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <UploadForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
