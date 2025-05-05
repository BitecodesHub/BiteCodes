import type React from 'react';
import ProductsSection from '../components/sections/ProductsSection';

const ProductsPage: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            our products
          </h1>
          <p className="text-xl text-neutral/80">
            Explore our suite of innovative digital products designed to transform businesses
          </p>
        </div>
      </div>

      <ProductsSection />
    </div>
  );
};

export default ProductsPage;
