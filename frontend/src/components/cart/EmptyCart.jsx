import { ChefHat, Menu, ShoppingCart } from "lucide-react";
import { useContext } from "react";
import { MenuContext } from "../../Contexts";
import { useNavigate } from "react-router-dom";

const EmptyCart = ({ onModalClose }) => {
  const { items } = useContext(MenuContext);
  const navigate = useNavigate();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 text-center">
        <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-24 h-24 text-6xl text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-6">
          Add some delicious items to get started
        </p>
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.slice(0, 3).map((item, index) => {
              const discountedPrice =
                item.price - (item.price * item.discount) / 100;

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <img
                    alt={item.name}
                    className="w-full h-24 object-cover object-top rounded-md mb-2"
                    src={item.image_url}
                  />
                  <h5 className="font-medium text-gray-900 text-sm mb-1">
                    {item.name}
                  </h5>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-semibold text-orange-600">
                        ₹{discountedPrice.toFixed(2)}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3 justify-center items-center">
          <a
            data-discover="true"
            onClick={() => {
              onModalClose();
              navigate("/menu");
            }}
          >
            <button className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base flex items-center space-x-2 w-full md:max-w-[300px]">
              <div className="w-4 h-4 flex items-center justify-center">
                <Menu />
              </div>
              <span>Browse Menu</span>
            </button>
          </a>
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base w-full md:max-w-[300px]"
            onClick={onModalClose}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
