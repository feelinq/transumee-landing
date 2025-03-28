
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
  ];

  return (
    <section className="py-20 px-4 bg-transumee-100/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-transumee-900">What Our Users Say</h2>
        <p className="text-center text-transumee-900/70 mb-16 max-w-2xl mx-auto">
          Join thousands of professionals who have improved their job prospects with Transumee
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
      </div>
    </section>
  );
};

export default Testimonials;
