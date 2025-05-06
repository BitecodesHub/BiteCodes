import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Digital Innovation
            <br />
            Through Code
          </h1>
          <p className="text-xl md:text-2xl text-neutral/80 mb-10 max-w-2xl mx-auto">
            We craft powerful digital products and solutions for forward-thinking companies
          </p>
          <Link to="/solutions" className="btn btn-primary">
            Discover what we do
          </Link>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl animate-pulse-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl animate-pulse-float-delayed" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral/60"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;