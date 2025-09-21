import { useNavigate } from "react-router-dom";

const dishes = [
  {
    title: "Grilled Atlantic Salmon",
    description:
      "Fresh salmon with herb crust, seasonal vegetables, and lemon butter sauce.",
    price: "₹ 250",
    image:
      "https://readdy.ai/api/search-image?query=Gourmet%20grilled%20salmon%20fillet%20with%20herb%20crust%2C%20roasted%20vegetables%2C%20and%20lemon%20butter%20sauce%2C%20elegantly%20plated%20on%20white%20ceramic%20dish%2C%20restaurant%20quality%20food%20photography%2C%20professional%20lighting%2C%20fine%20dining%20presentation&width=400&height=300&seq=salmon-dish&orientation=landscape",
  },
  {
    title: "Wagyu Beef Steak",
    description:
      "Premium wagyu beef with truffle mashed potatoes and red wine reduction.",
    price: "₹ 350",
    image:
      "https://readdy.ai/api/search-image?query=Premium%20wagyu%20beef%20steak%20perfectly%20grilled%20with%20rosemary%20and%20garlic%2C%20served%20with%20truffle%20mashed%20potatoes%2C%20elegant%20restaurant%20plating%2C%20professional%20food%20photography%2C%20fine%20dining%20presentation&width=400&height=300&seq=steak-dish&orientation=landscape",
  },
  {
    title: "Lobster Ravioli",
    description:
      "Handmade ravioli filled with fresh lobster in creamy tomato basil sauce.",
    price: "₹ 300",
    image:
      "https://readdy.ai/api/search-image?query=Homemade%20lobster%20ravioli%20with%20creamy%20tomato%20sauce%2C%20fresh%20basil%2C%20and%20parmesan%20cheese%2C%20beautifully%20plated%20in%20elegant%20white%20bowl%2C%20fine%20dining%20pasta%20dish%2C%20professional%20food%20photography&width=400&height=300&seq=ravioli-dish&orientation=landscape",
  },
];

const SignatureDishes = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Signature Dishes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular dishes crafted with passion and served
            with pride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={dish.image}
                alt={dish.title}
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {dish.title}
                </h3>
                <p className="text-gray-600 mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">
                    {dish.price}
                  </span>
                  <button className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-4 py-2 text-sm">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 text-lg"
            onClick={() => navigate("/menu")}
          >
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignatureDishes;
