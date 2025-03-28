
import React from 'react';
import { Upload, FileText, Download } from 'lucide-react';

type StepProps = {
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
};

const Step = ({ icon, number, title, description }: StepProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-transumee-100 rounded-full flex items-center justify-center text-transumee-600 mb-4">
        {icon}
      </div>
      <div className="bg-transumee-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold -mt-12 ml-10 mb-5">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-transumee-900">{title}</h3>
      <p className="text-transumee-900/70 max-w-xs">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload size={28} />,
      number: 1,
      title: "Upload Your CV",
      description: "Upload your resume in any language, format and style. PDF, Word, or other formats accepted."
    },
    {
      icon: <FileText size={28} />,
      number: 2, 
      title: "AI Translates & Formats",
      description: "Our AI instantly translates, reformats, and optimizes your resume for your target country."
    },
    {
      icon: <Download size={28} />,
      number: 3,
      title: "Download Your Resume",
      description: "Get your professionally translated resume and matching cover letter in perfect English."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-16 text-transumee-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <Step 
              key={index}
              icon={step.icon}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
