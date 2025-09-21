import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4)), 
           url("/restaurant-bg.jpg")`,
      }}
    >
      <div className="text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-[#F3F4F6]">
          Experience Fine Dining
          <br />
          <span className="text-[#FE7A1A]">at Its Best</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-[#E3E3E3] max-w-2xl mx-auto">
          Indulge in culinary excellence with our carefully crafted dishes,
          exceptional service, and unforgettable dining atmosphere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-8 py-4 text-lg"
            onClick={() => navigate("/")}
          >
            Book a Table
          </button>
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
            onClick={() => navigate("/menu")}
          >
            View Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
