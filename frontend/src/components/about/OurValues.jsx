import React from "react";
import { Heart, Award, Leaf, Users } from "lucide-react";

const values = [
  {
    title: "Passion",
    description:
      "We pour our heart into every dish, drink, and experience we create.",
    icon: Heart,
  },
  {
    title: "Excellence",
    description:
      "We maintain the highest standards in cuisine, service, and hospitality.",
    icon: Award,
  },
  {
    title: "Sustainability",
    description:
      "We're committed to responsible sourcing and environmental stewardship.",
    icon: Leaf,
  },
  {
    title: "Community",
    description:
      "We believe in building lasting relationships with our guests and community.",
    icon: Users,
  },
];

const OurValues = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at{" "}
            <span
              className="text-orange-500"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map(({ title, description, icon: Icon }, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Icon className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
