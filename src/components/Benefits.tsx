
import React from 'react';
import { Globe, Clock, FileText, Check } from 'lucide-react';

const BenefitCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-transumee-200 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-transumee-100 rounded-full flex items-center justify-center text-purple-500 mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3 text-transumee-900">{title}</h3>
      <p className="text-transumee-900/70">{description}</p>
    </div>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "Instant AI Translation",
      description: "Our AI transforms your resume in seconds, with perfect formatting and professional language."
    },
    {
      icon: <Globe size={24} />,
      title: "Localized Formatting",
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
    <section className="py-20 px-4 bg-transumee-100/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-16 text-transumee-900">
          Transform Your Career Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
