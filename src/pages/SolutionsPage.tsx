import type React from 'react';
import ServicesSection from '../components/sections/ServicesSection';

const SolutionsPage: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            what we do
          </h1>
          <p className="text-xl text-neutral/80">
            We craft immersive digital products and experiences for forward-thinking companies
          </p>
        </div>
      </div>

      <ServicesSection />
    </div>
  );
};

export default SolutionsPage;
