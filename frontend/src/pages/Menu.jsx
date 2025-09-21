import React, { useContext, useState } from "react";
import MenuList from "../components/menu/MenuList";
import { MenuContext } from "../Contexts";
import { ChefHat, CookingPot, IceCreamBowl, Martini, Soup } from "lucide-react";

const categories = [
  { name: "All", icon: <ChefHat /> },
  { name: "Starter", icon: <Soup /> },
  { name: "Main Course", icon: <CookingPot /> },
  { name: "Dessert", icon: <IceCreamBowl /> },
  { name: "Beverage", icon: <Martini /> },
];

export default function Menu() {
  const { items } = useContext(MenuContext);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = items.filter((item) => {
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="bg-gray-50 min-h-screen mb-8">
      <div className="bg-gray-900 text-white text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
        <p className="max-w-2xl mx-auto text-gray-300">
          Discover our carefully crafted dishes made with the finest ingredients
          and culinary expertise.
        </p>
        <div className="mt-6 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search by name, ingredients, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white w-full px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center mb-8 bg-gray-100 rounded-full p-2 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`flex items-center space-x-2 px-6 py-3  font-medium transition-all duration-200 cursor-pointer whitespace-nowrap rounded-full gap-1.5
            ${
              activeCategory === cat.name
                ? "bg-orange-600 text-white shadow-lg"
                : "text-gray-600 hover:text-orange-600"
            }`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {cat.icon}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        <MenuList items={filteredItems} />
      </div>
    </main>
  );
}
