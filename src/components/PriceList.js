import React, { useState } from "react";

export const PriceList = () => {
  const [activeSection, setActiveSection] = useState("Development");

  return (
    <div id="webcrumbs">
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="p-8 mx-12">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
            Website Development Pricing
          </h1>

          {/* Section Tabs */}
          <div className="flex justify-center gap-6 mb-6">
            {["Development", "services", "maintenance"].map((section) => (
              <button
                key={section}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeSection === section
                    ? "bg-blue-600 text-white"
                    : "bg-white shadow-md"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {/* Pricing Sections */}
          <div className="grid grid-cols-2 gap-6">
            {/* Website Development */}
            {activeSection === "Development" && (
              <>
                <PriceCard title="Static Website" price="₹5,000 - ₹10,000" features={["Basic Design", "Up to 5 Pages", "Responsive Layout"]} />
                <PriceCard title="Static Website (Premium)" price="₹10,000 - ₹15,000" features={["Advanced Design", "Up to 10 Pages", "Form & Gallery"]} />
                <PriceCard title="Dynamic Website" price="₹15,000 - ₹80,000" features={["CMS Integration", "Dynamic Content", "Database Integration"]} />
              </>
            )}

            {/* Services */}
            {activeSection === "services" && (
              <>
			  <PriceCard title="Web Services" price="₹10,000 - ₹25,000" features={["API Development", "Performance Optimization", "Any Webservice"]} />
			  <PriceCard title="Custom Domain" price="Domain Price + ₹2,000" features={["Custom Domain Selection", "Domain Setup & Transfer", "Domain Maintenance"]} />
                <PriceCard title="Website Redesign" price="50% off on our offerings" features={["Redesigning an existing Website", "Improving User Interface", "UI/UX Design"]} />
                <PriceCard title="SEO Package" price="₹15,000 - ₹25,000" features={["Keyword Research", "On-page SEO", "Monthly Reports"]} />
              </>
            )}

            {/* Maintenance */}
            {activeSection === "maintenance" && (
              <>
                <PriceCard title="Maintenance" price="₹3,000 - ₹10,000" features={["Regular Updates", "Security Patches", "24/7 Support"]} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable PriceCard Component
const PriceCard = ({ title, price, features }) => (
  <div className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {title}
      </h3>
      <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        {price}
      </span>
    </div>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <i className="fa-solid fa-check text-green-500"></i>
          <span className="group-hover:translate-x-2 transition-transform duration-300">{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default PriceList;
