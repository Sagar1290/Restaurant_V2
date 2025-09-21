import React from "react";
import { Utensils, CalendarCheck, Truck, Headset } from "lucide-react";

const features = [
  {
    icon: <Utensils className="text-orange-600 w-6 h-6" />,
    title: "Fine Dining Experience",
    description:
      "Enjoy exquisite cuisine prepared by our world-class chefs using the finest ingredients.",
  },
  {
    icon: <CalendarCheck className="text-orange-600 w-6 h-6" />,
    title: "Easy Reservations",
    description:
      "Book your table instantly with our seamless online reservation system.",
  },
  {
    icon: <Truck className="text-orange-600 w-6 h-6" />,
    title: "Food Delivery",
    description:
      "Get your favorite dishes delivered fresh to your doorstep within 30 minutes.",
  },
  {
    icon: <Headset className="text-orange-600 w-6 h-6" />,
    title: "24/7 Support",
    description:
      "Our friendly staff is always ready to assist you with any questions or special requests.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span
              className="text-orange-500"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with an exceptional dining
            experience that goes beyond just great food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
