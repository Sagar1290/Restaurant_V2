import { useContext, useState } from "react";
import { MenuContext } from "../../Contexts";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:3000";

const AddNewItemModal = ({ onModalClose }) => {
  const { items, setItems } = useContext(MenuContext);
  const [formData, setFormData] = useState({
    name: "",
    category: "Starter",
    description: "",
    price: 0,
    discount: 0,
    image_url: "",
    is_veg: 1,
    allergens: "",
    available: 1,
    ingredients: "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddNewMenuItem = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Please provide name and price!");
      return;
    }
    try {
      setLoading(true);
      const image_url = `https://placehold.co/400/png?text=${formData.name
        .split(" ")
        .join("")}`;
      formData["image_url"] = image_url;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${API_BASE}/menu/create-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemDetail: formData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create item");
      }

      const data = await res.json();
      toast.success("Item Added successfully.");
      setItems([...items, formData]);
      onModalClose();
      return { success: true, data };
    } catch (error) {
      toast.error(error["message"]);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "discount" ||
        name === "is_veg" ||
        name === "available"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div>
      <div className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              required
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <input
              placeholder="paneer, spices, yogurt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergens
            </label>
            <input
              placeholder="milk, nuts, gluten or 'none'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              type="text"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vegetarian
              </label>
              <select
                name="is_veg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
                value={formData.is_veg}
                onChange={handleChange}
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available
              </label>
              <select
                name="available"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
                value={formData.available}
                onChange={handleChange}
              >
                <option value={1}>Available</option>
                <option value={0}>Out of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Upload (Coming Soon)
            </label>
            <input
              type="file"
              disabled
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed rounded-md text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Feature disabled — currently using this URL: {/* <br /> */}
              <span className="text-gray-700 break-all">
                {formData.image_url}
              </span>
            </p>
          </div>
        </form>
      </div>

      <div className="sticky -bottom-6 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-3">
          <button className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base">
            Cancel
          </button>
          <button
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base"
            onClick={handleAddNewMenuItem}
            disabled={loading}
          >
            {loading ? "Adding" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewItemModal;
