import React from "react";

const CartModal = () => {
  return (
    <div class="flex-1 overflow-y-auto">
      <div class="p-8 text-center">
        <div class="w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <i class="ri-shopping-cart-line text-6xl text-gray-300"></i>
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h3>
        <p class="text-gray-500 mb-6">
          Add some delicious items to get started
        </p>
        <div class="mb-6">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Popular Items</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <img
                alt="Paneer Tikka"
                class="w-full h-24 object-cover object-top rounded-md mb-2"
                src="https://readdy.ai/api/search-image?query=Grilled%20paneer%20tikka%20cubes%20with%20bell%20peppers%20and%20onions%2C%20marinated%20in%20yogurt%20and%20spices%2C%20served%20on%20skewer%20with%20mint%20chutney%2C%20Indian%20appetizer%20food%20photography&amp;width=300&amp;height=200&amp;seq=paneer-tikka-cart&amp;orientation=landscape"
              />
              <h5 class="font-medium text-gray-900 text-sm mb-1">
                Paneer Tikka
              </h5>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                  <span class="text-sm font-semibold text-orange-600">
                    ₹179.1
                  </span>
                  <span class="text-xs text-gray-400 line-through">₹199</span>
                </div>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Starter
                </span>
              </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <img
                alt="Chicken Biryani"
                class="w-full h-24 object-cover object-top rounded-md mb-2"
                src="https://readdy.ai/api/search-image?query=Authentic%20chicken%20biryani%20with%20fragrant%20basmati%20rice%2C%20tender%20chicken%20pieces%2C%20garnished%20with%20fried%20onions%2C%20fresh%20herbs%2C%20served%20with%20raita%2C%20Indian%20main%20course%20photography&amp;width=300&amp;height=200&amp;seq=chicken-biryani-cart&amp;orientation=landscape"
              />
              <h5 class="font-medium text-gray-900 text-sm mb-1">
                Chicken Biryani
              </h5>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1">
                  <span class="text-sm font-semibold text-orange-600">
                    ₹254.15
                  </span>
                  <span class="text-xs text-gray-400 line-through">₹299</span>
                </div>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Main Course
                </span>
              </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <img
                alt="Masala Chai"
                class="w-full h-24 object-cover object-top rounded-md mb-2"
                src="https://readdy.ai/api/search-image?query=Traditional%20masala%20chai%20in%20glass%20cup%20with%20saucer%2C%20steam%20rising%2C%20garnished%20with%20cardamom%20pods%2C%20cinnamon%20stick%2C%20served%20with%20biscuits%2C%20Indian%20beverage%20photography&amp;width=300&amp;height=200&amp;seq=masala-chai-cart&amp;orientation=landscape"
              />
              <h5 class="font-medium text-gray-900 text-sm mb-1">
                Masala Chai
              </h5>
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-orange-600">₹49</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Beverage
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-center">
          <a
            href="/preview/d17e8249-69be-48a7-95ac-5e3fe5e9d2c3/2656823/menu"
            data-discover="true"
          >
            <button class="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base flex items-center space-x-2">
              <div class="w-4 h-4 flex items-center justify-center">
                <i class="ri-restaurant-line"></i>
              </div>
              <span>Browse Menu</span>
            </button>
          </a>
          <button class="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
