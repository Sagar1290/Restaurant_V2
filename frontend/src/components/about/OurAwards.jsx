import React from "react";
import { Star, Trophy, Headphones, Wine } from "lucide-react";

const awards = [
  {
    title: "Michelin Star",
    description: "2001, 2015, 2020",
    icon: Star,
  },
  {
    title: "Best Restaurant",
    description: "City Food Awards 2023",
    icon: Trophy,
  },
  {
    title: "Wine Spectator",
    description: "Award of Excellence",
    icon: Wine,
  },
  {
    title: "Service Excellence",
    description: "Hospitality Industry 2022",
    icon: Headphones,
  },
];

const OurAwards = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Awards & Recognition</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders
            and critics worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map(({ title, description, icon: Icon }, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurAwards;
