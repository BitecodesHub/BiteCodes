import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => {
  return (
    <div className="bg-black/20 p-8 rounded-xl hover:bg-black/30 transition-colors group">
      <div className="w-16 h-16 flex items-center justify-center text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-neutral/80 mb-4">
        {description}
      </p>
      <Link
        to={link}
        className="text-primary inline-flex items-center group-hover:underline"
      >
        Get In Touch
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      id: 'web-development',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      ),
      title: 'Web Development',
      description: 'Custom web applications built with modern frameworks and technologies for optimal performance and user experience.',
      link: '/contact'
    },
    {
      id: 'mobile-applications',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <path d="M12 18h.01" />
        </svg>
      ),
      title: 'Mobile Applications',
      description: 'Native and cross-platform mobile apps that deliver exceptional user experiences on iOS and Android devices.',
      link: '/contact'
    },
    {
      id: 'api-development',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 12v5h16a2 2 0 0 1 0 4H3v-4" />
        </svg>
      ),
      title: 'API Development',
      description: 'Robust and scalable APIs that connect systems, services, and applications for seamless data exchange.',
      link: '/contact'
    },
    {
      id: 'cloud-solutions',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="m9 15 3 3 3-3" />
        </svg>
      ),
      title: 'Cloud Solutions',
      description: 'Scalable and secure cloud-based architectures and migrations for businesses of all sizes.',
      link: '/contact'
    },
    {
      id: 'ai-integration',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M8 12l4-4 4 4" />
        </svg>
      ),
      title: 'AI Integration',
      description: 'Advanced artificial intelligence and machine learning solutions to transform your business processes and insights.',
      link: '/contact'
    },
    {
      id: 'data-analytics',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      title: 'Data Analytics',
      description: 'Powerful data analysis tools and visualizations to help you extract meaningful insights from your business data.',
      link: '/contact'
    }
  ];

  return (
    <section className="py-20 bg-background/60">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Technology Solutions
          </h2>
          <p className="text-lg md:text-xl text-neutral/80">
            We leverage cutting-edge technologies to build innovative solutions for forward-thinking businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/contact" className="btn btn-primary">
            Explore all solutions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
