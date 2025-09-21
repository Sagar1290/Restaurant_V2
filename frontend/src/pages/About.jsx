import OurJourney from "../components/about/OurJourney";
import OurValues from "../components/about/OurValues";
import OurServices from "../components/about/OurServices";
import OurLeadership from "../components/about/OurLeadership";
import OurAwards from "../components/about/OurAwards";
import OurStory from "../components/about/OurStory";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section
        className="relative h-96 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(
              to right,
              rgba(0, 0, 0, 0.4),
              rgba(0, 0, 0, 0.8)
            ), url("/images/restaurant-entrance.jpg")`,
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About{" "}
            <span
              className="text-orange-500"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Four decades of culinary excellence and hospitality innovation
          </p>
        </div>
      </section>
      <OurStory />
      <OurJourney />
      <OurServices />
      <OurLeadership />
      <OurValues />
      <OurAwards />
      <section className="py-20 bg-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience{" "}
            <span
              className="text-orange-400"
              style={{ fontFamily: "Cinzel,serif" }}
            >
              {" "}
              Table & Taste{" "}
            </span>{" "}
            Today
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join us for an unforgettable culinary journey and discover why we've
            been the city's premier destination for nearly four decades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 text-lg"
              onClick={() => navigate("/")}
            >
              Reserve a Table
            </button>
            <button
              className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap border-2 px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-orange-600"
              onClick={() => navigate("/")}
            >
              Order Online
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
