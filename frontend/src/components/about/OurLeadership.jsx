import React from "react";

const leaders = [
  {
    name: "Chef Arjun Mehra",
    title: "Executive Chef",
    experience: "22+ years Experience",
    specialty: "Indian & Global Cuisine",
    image: "/images/executive-chef.jpg",
  },
  {
    name: "Priya Desai",
    title: "General Manager",
    experience: "16+ years Experience",
    specialty: "Hospitality Operations",
    image: "/images/general-manager.jpg",
  },
  {
    name: "Raghav Kapoor",
    title: "Head Sommelier",
    experience: "13+ years Experience",
    specialty: "Wine & Beverage Pairing",
    image: "/images/head-sommelier.jpg",
  },
];

const LeaderCard = ({ name, title, experience, specialty, image }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center">
    <img
      alt={name}
      className="w-full h-64 object-cover object-top"
      src={image}
    />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-orange-600 font-medium mb-2">{title}</p>
      <p className="text-gray-600 mb-2">{experience}</p>
      <p className="text-sm text-gray-500">{specialty}</p>
    </div>
  </div>
);

const OurLeadership = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The experienced professionals who bring{" "}
            <span
              className="text-orange-500"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>
            's vision to life every day
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <LeaderCard key={index} {...leader} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurLeadership;
