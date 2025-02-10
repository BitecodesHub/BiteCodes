import React, { useState } from "react";

export const PriceList = () => {
  const [activeSection, setActiveSection] = useState("Development");

  return (
    <div id="webcrumbs">
      <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Website Development Pricing
        </h1>

        {/* Section Tabs - Always in One Line */}
        <div className="flex justify-center space-x-6 mb-6">
          {["Development", "Services", "Maintenance"].map((section) => (
            <button
              key={section}
              className={`w-[150px] md:w-auto px-6 py-2 text-center rounded-lg font-semibold transition-all duration-300 ${
                activeSection === section
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white shadow-md"
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Pricing Sections - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Website Development */}
          {activeSection === "Development" && (
            <>
              <PriceCard
                title="Static Website"
                price="₹5,000 - ₹10,000"
                features={["Basic Design", "Up to 5 Pages", "Responsive Layout"]}
              />
              <PriceCard
                title="Static Website (Premium)"
                price="₹10,000 - ₹15,000"
                features={["Advanced Design", "Up to 10 Pages", "Form & Gallery"]}
              />
              <PriceCard
                title="Dynamic Website"
                price="₹15,000 - ₹80,000"
                features={["CMS Integration", "Dynamic Content", "Database Integration"]}
              />
            </>
          )}

          {/* Services */}
          {activeSection === "Services" && (
            <>
              <PriceCard
                title="Web Services"
                price="₹10,000 - ₹25,000"
                features={["API Development", "Performance Optimization", "Any Webservice"]}
              />
              <PriceCard
                title="Custom Domain"
                price="Domain Price + ₹2,000"
                features={["Custom Domain Selection", "Domain Setup & Transfer", "Domain Maintenance"]}
              />
              <PriceCard
                title="Website Redesign"
                price="50% off on our offerings"
                features={["Redesigning an existing Website", "Improving User Interface", "UI/UX Design"]}
              />
              <PriceCard
                title="SEO Package"
                price="₹15,000 - ₹25,000"
                features={["Keyword Research", "On-page SEO", "Monthly Reports"]}
              />
            </>
          )}

          {/* Maintenance */}
          {activeSection === "Maintenance" && (
            <>
              <PriceCard
                title="Maintenance"
                price="₹3,000 - ₹10,000"
                features={["Regular Updates", "Security Patches", "24/7 Support"]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable PriceCard Component (Mobile-Friendly)
const PriceCard = ({ title, price, features }) => (
  <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 w-full mx-auto">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        {title}
      </h3>
      <span className="text-sm md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
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
