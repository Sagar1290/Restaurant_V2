import React from "react";

export default function MenuItemCard({ item }) {
  const {
    name,
    category,
    description,
    price,
    discount,
    image_url,
    is_veg,
    allergens,
    available,
    ingredients
  } = item;

  return (
    <div className={`w-full sm:w-72 bg-white shadow-md rounded-lg overflow-hidden border ${available ? 'border-gray-200' : 'border-red-200 opacity-60'} transition-all`}>
      <img
        src={image_url}
        alt={name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold truncate">{name}</h2>
          <span className={`px-2 py-1 text-xs rounded ${is_veg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {is_veg ? "Veg" : "Non-Veg"}
          </span>
        </div>
        <span className="text-xs inline-block bg-gray-100 rounded px-2 py-0.5 mb-1">{category}</span>
        <p className="text-gray-600 text-sm mt-1 mb-2 line-clamp-2">{description}</p>

        <div className="flex items-center space-x-2 text-base mb-2">
          <span className="font-bold text-blue-700">₹{price}</span>
          {discount > 0 && (
            <span className="text-xs text-orange-600 font-semibold">-{discount}%</span>
          )}
        </div>

        <div className="mb-1">
          <span className="text-xs text-gray-800">
            <strong>Ingredients:</strong> {ingredients}
          </span>
        </div>

        {allergens && (
          <div className="mb-2 text-xs text-red-600">
            <strong>Allergens:</strong> {allergens}
          </div>
        )}

        {!available && (
          <div className="text-xs text-red-600 mt-2">Currently Unavailable</div>
        )}
      </div>
    </div>
  );
}
