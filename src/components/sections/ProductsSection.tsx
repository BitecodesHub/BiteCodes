import { Link } from 'react-router-dom';

interface ProductCardProps {
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
  link: string;
}

const ProductCard = ({ title, subtitle, image, tags, link }: ProductCardProps) => {
  return (
    <Link
      to={link}
      className="bg-black/20 rounded-lg overflow-hidden group transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <h4 className="text-lg text-neutral/60 mb-4">
          {subtitle}
        </h4>
        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={`${title}-${tag}`}
              className="px-3 py-1 bg-background/80 rounded-full text-xs text-neutral/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const ProductsSection = () => {
  const products = [
    {
      id: 'E-Learning-Platform',
      title: 'E-Learning Platform',
      subtitle: 'Learn Without Limits',
      image: 'https://sourcebae.com/blog/wp-content/uploads/2023/09/e-learning-session-de-formation-en-ligne.jpg',
      tags: ['Web', 'E-commerce', 'API'],
      link: 'https://www.elearning.bitecodes.com'
    },
    {
      id: 'Billing-Software',
      title: 'Billing & Invoice Application',
      subtitle: 'VoiStock',
      image: 'https://thumbs.dreamstime.com/b/invoice-line-icon-linear-style-sign-mobile-concept-web-design-document-dollar-outline-vector-billing-payments-375332462.jpg',
      tags: ['Cloud', 'API', 'Integration'],
      link: 'https://voistock.bitecodes.com'
    },
    {
      id: 'pet-socialmedia',
      title: 'Linked Paws',
      subtitle: 'Pet Social Media',
      image: 'https://images-platform.99static.com//gl_nLKPznFPvQWEPzIs4t7eq6WA=/1032x1025:1950x1943/fit-in/500x500/99designs-contests-attachments/144/144772/attachment_144772736',
      tags: ['Cloud', 'API', 'Integration'],
      link: 'https://www.pet.bitecodes.com'
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            our innovative products
          </h2>
          <p className="text-lg md:text-xl text-neutral/80">
            Explore our suite of digital products designed to transform your business and drive results
          </p>
        </div>

        {/* Filter tabs - can be made functional in future */}
        <div className="flex justify-center gap-6 mb-12">
          <button className="px-4 py-2 text-primary border-b-2 border-primary">
            All
          </button>
          <button className="px-4 py-2 text-neutral/60 hover:text-neutral transition-colors">
            Web
          </button>
          <button className="px-4 py-2 text-neutral/60 hover:text-neutral transition-colors">
            Mobile
          </button>
          <button className="px-4 py-2 text-neutral/60 hover:text-neutral transition-colors">
            Cloud
          </button>
          <button className="px-4 py-2 text-neutral/60 hover:text-neutral transition-colors">
            AI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              subtitle={product.subtitle}
              image={product.image}
              tags={product.tags}
              link={product.link}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products" className="btn btn-outline">
            Discover more products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
