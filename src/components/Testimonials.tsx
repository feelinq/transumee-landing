
import React from 'react';

type TestimonialProps = {
  quote: string;
  name: string;
  title: string;
  country: string;
};

const TestimonialCard = ({ quote, name, title, country }: TestimonialProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-transumee-200 hover:shadow-md transition-all">
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">★</span>
        ))}
      </div>
      <p className="text-transumee-900 mb-6 italic leading-relaxed">{quote}</p>
      <div>
        <p className="font-semibold text-transumee-900">{name}</p>
        <p className="text-sm text-transumee-900/70">{title}, {country}</p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "\"I uploaded my Spanish resume and got back a perfectly formatted English version tailored for the US market. I received 3 interview calls within a week!\"",
      name: "Miguel Rodriguez",
      title: "Software Engineer",
      country: "Spain → USA",
    },
    {
      quote: "\"As a French professional moving to Canada, I needed my CV translated correctly. Transumee did it in minutes with perfect Canadian formatting. Incredible service!\"",
      name: "Céline Dupont",
      title: "Marketing Specialist",
      country: "France → Canada",
    },
    {
      quote: "\"It took me just 60 seconds to get a perfect CV in English. The AI even adapted my experience to match UK terminology. Amazing.\"",
      name: "Hans Weber",
      title: "Project Manager",
      country: "Germany → UK",
    },
    {
      quote: "\"The cover letter generation feature saved me hours of work. I couldn't believe how well it captured my professional story.\"",
      name: "Sofia Rossi",
      title: "Marketing Director",
      country: "Italy → USA",
    },
  ];

  return (
    <section className="py-20 px-4 bg-transumee-100/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-transumee-900">What Our Users Say</h2>
        <p className="text-center text-transumee-900/70 mb-16 max-w-2xl mx-auto">
          Join thousands of professionals who have improved their job prospects with Transumee
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              country={testimonial.country}
            />
          ))}
        </div>
        
        <div className="bg-white p-10 rounded-3xl shadow-md border border-transumee-200">
          <h3 className="text-2xl font-bold text-center mb-8 text-transumee-900">See the Transformation</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-transumee-600 text-white text-sm font-medium py-1 px-3 rounded-full">
                Original Resume
              </div>
              <div className="border border-transumee-200 rounded-xl p-4 h-72 bg-transumee-50">
                <div className="w-full h-full bg-gray-200 rounded-lg blur-sm overflow-hidden flex items-center justify-center">
                  <div className="text-gray-400 font-medium">Foreign language resume</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 bg-purple-500 text-white text-sm font-medium py-1 px-3 rounded-full">
                AI Transformed
              </div>
              <div className="border border-transumee-200 rounded-xl p-4 h-72 bg-white shadow-sm">
                <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-transumee-600 font-medium">Professional English Resume</div>
                  </div>
                  <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-transumee-100"></div>
                  <div className="absolute top-4 right-4 w-32 h-4 rounded-full bg-transumee-100"></div>
                  <div className="absolute top-12 right-4 w-20 h-4 rounded-full bg-transumee-100"></div>
                  <div className="absolute top-36 left-4 right-4 h-3 rounded-full bg-transumee-100"></div>
                  <div className="absolute top-44 left-4 right-4 h-3 rounded-full bg-transumee-100"></div>
                  <div className="absolute top-52 left-4 right-4 h-3 rounded-full bg-transumee-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
