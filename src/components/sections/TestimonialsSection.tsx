import { useState } from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
}

const Testimonial = ({ quote, author, position, company }: TestimonialProps) => {
  return (
    <div className="bg-black/20 p-8 rounded-xl flex flex-col h-full">
      <div className="text-primary mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
        >
          <path d="M11.94 3a8.94 8.94 0 0 0-8.93 8.94c0 4.91 3.49 8.89 8.88 9A2.75 2.75 0 0 1 14.62 24H21a1 1 0 0 0 1-1v-2.94A8.94 8.94 0 0 0 20 3Z" />
          <path d="M11.94 3a8.94 8.94 0 0 0-8.93 8.94c0 4.91 3.49 8.89 8.88 9A2.75 2.75 0 0 1 14.62 24H21a1 1 0 0 0 1-1v-2.94A8.94 8.94 0 0 0 20 3Z" opacity=".2" />
        </svg>
      </div>
      <p className="text-lg mb-6 flex-grow">
        "{quote}"
      </p>
      <div>
        <p className="font-semibold text-primary">{author}</p>
        <p className="text-neutral/70 text-sm">{position}, {company}</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 'testimonial-1',
      quote: "BiteCodes transformed our business with their innovative digital commerce platform. Sales increased by 40% within the first quarter of implementation.",
      author: "Sarah Johnson",
      position: "Chief Digital Officer",
      company: "Retail Innovations Inc."
    },
    {
      id: 'testimonial-2',
      quote: "The analytics solution provided by BiteCodes gave us unprecedented insights into our customer behavior, allowing us to make data-driven decisions that positively impacted our bottom line.",
      author: "Michael Chen",
      position: "VP of Marketing",
      company: "Global Enterprises Ltd."
    },
    {
      id: 'testimonial-3',
      quote: "Working with BiteCodes was a game-changer for our startup. Their cloud integration middleware connected all our systems seamlessly, reducing operational costs by 30%.",
      author: "David Rodriguez",
      position: "CTO",
      company: "TechStart Solutions"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            client testimonials
          </h2>
          <p className="text-lg md:text-xl text-neutral/80">
            Hear what our clients have to say about working with BiteCodes
          </p>
        </div>

        {/* For larger screens - show all testimonials */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Testimonial
              key={testimonial.id}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              company={testimonial.company}
            />
          ))}
        </div>

        {/* For mobile - show a carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <Testimonial
                    quote={testimonial.quote}
                    author={testimonial.author}
                    position={testimonial.position}
                    company={testimonial.company}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-neutral hover:bg-black/50 transition-colors"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-neutral hover:bg-black/50 transition-colors"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeIndex ? 'bg-primary' : 'bg-neutral/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
