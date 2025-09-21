import React from "react";

export default function MenuItemModal({ item, onClose }) {
  if (!item) return null;

  const finalPrice = (item.price - (item.price * item.discount) / 100).toFixed(
    2
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-64 object-cover rounded-t-2xl"
        />

        <div className="p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {item.name}
            {item.is_veg ? (
              <span
                className="w-3 h-3 bg-green-600 rounded-full"
                title="Vegetarian"
              ></span>
            ) : (
              <span
                className="w-3 h-3 bg-red-600 rounded-full"
                title="Non-Vegetarian"
              ></span>
            )}
          </h2>
          <p className="text-gray-500">{item.category}</p>
          <p className="mt-3 text-gray-700">{item.description}</p>

          <div className="mt-4 space-y-1">
            <p className="text-sm text-gray-600">
              <strong>Ingredients:</strong> {item.ingredients}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Allergens:</strong> {item.allergens}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-xl font-bold text-teal-600">
              ₹{finalPrice}
            </span>
            {item.discount > 0 && (
              <span className="text-sm text-red-500">
                <del>₹{item.price}</del> ({item.discount}% OFF)
              </span>
            )}
            <span
              className={`ml-auto text-sm font-semibold ${
                item.available ? "text-green-600" : "text-gray-400"
              }`}
            >
              {item.available ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
