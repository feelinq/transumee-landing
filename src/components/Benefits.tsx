
import React from 'react';
import { Check, Globe, Clock, FileText } from 'lucide-react';

const BenefitCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-transumee-50 rounded-full flex items-center justify-center text-transumee-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "Instant AI Translation & Formatting",
      description: "Our AI transforms your resume in seconds, with perfect formatting and professional language."
    },
    {
      icon: <Globe size={24} />,
      title: "Localized for USA, Canada, UK, EU",
      description: "Tailored to meet specific regional job market standards and expectations."
    },
    {
      icon: <FileText size={24} />,
      title: "Cover Letter included",
      description: "Receive a matching professional cover letter customized for your experience."
    },
    {
      icon: <Check size={24} />,
      title: "Works with 50+ languages",
      description: "Upload your CV in any language - we handle the translation and cultural adaptation."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">
          Transform Your Career Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
