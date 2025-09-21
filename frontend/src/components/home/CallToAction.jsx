import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Ready to Experience the Best Dining in Town?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Book your table now or order online for fast, delicious delivery.
        </p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/")}
            className="bg-white text-red-700 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-100 transition whitespace-nowrap cursor-pointer"
          >
            Reserve a Table
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-red-700 transition whitespace-nowrap cursor-pointer"
          >
            Order Online
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
