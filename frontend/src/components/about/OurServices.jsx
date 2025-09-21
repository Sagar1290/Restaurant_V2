import React from "react";
import {
  Utensils,
  Wine,
  Music2,
  Dice5,
  CalendarCheck,
  Car,
  Truck,
} from "lucide-react";

const services = [
  {
    title: "Authentic Indian Dining",
    description:
      "Relish seasonal and regional delicacies made with traditional recipes and a homely touch.",
    imageUrl: "/images/fine-dining-restaurant.jpg",
    icon: Utensils,
  },
  {
    title: "Premium Bar & Lounge",
    description:
      "Unwind at our sophisticated bar featuring craft cocktails, premium spirits, and an extensive wine collection.",
    imageUrl: "/images/premium-bar-lounge.jpg",
    icon: Wine,
  },
  // {
  //   title: "Exclusive Nightclub",
  //   description:
  //     "Dance the night away in our vibrant nightclub with live DJs, premium sound system, and VIP sections.",
  //   imageUrl:
  //     "/images/exclusige-night-club.jpg",
  //   icon: Music2,
  // },
  // {
  //   title: "Private Gaming Lounge",
  //   description:
  //     "Enjoy premium gaming experiences in our exclusive private gaming lounge with professional dealers.",
  //   imageUrl:
  //     "/images/private-gaming-lounge.jpg",
  //   icon: Dice5,
  // },
  // {
  //   title: "Event & Banquet Hall",
  //   description:
  //     "Host memorable events in our versatile banquet halls perfect for weddings, corporate events, and celebrations.",
  //   imageUrl:
  //     "/images/event-banquet-hall.jpg",
  //   icon: CalendarCheck,
  // },
  // {
  //   title: "Valet & Concierge",
  //   description:
  //     "Enjoy premium valet parking and personalized concierge services for a seamless luxury experience.",
  //   imageUrl:
  //     "/valet-concierge.jpg",
  //   icon: Car,
  // },
  // {
  //   title: "Catering & Events",
  //   description:
  //     "From weddings to corporate functions, our catering brings authentic flavors to every celebration.",
  //   imageUrl:
  //     "/images/catering-events.jpg",
  //   icon: CalendarCheck,
  // },
  {
    title: "Home Delivery",
    description:
      "Enjoy your favorite dishes at home with our quick and hygienic delivery service.",
    imageUrl: "/images/home-delivery.jpg",
    icon: Truck,
  },
];

const ServiceCard = ({ title, description, imageUrl, Icon }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img
      alt={title}
      className="w-full h-48 object-cover object-top"
      src={imageUrl}
    />
    <div className="p-6">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const OurServices = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A complete entertainment and dining complex offering world-class
            experiences under one roof
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              Icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
