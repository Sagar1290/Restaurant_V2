import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function EditMenuItemForm({ item, onCancel, onSubmit }) {
  const [formData, setFormData] = useState({ ...item });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(item.id, formData, setSaving);
    }
  };

  return (
    <div>
      <div className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                name="name"
                required
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
              >
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Side">Side</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <input
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="paneer, spices, yogurt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergens
            </label>
            <input
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              placeholder="milk, nuts, gluten or 'none'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vegetarian
              </label>
              <select
                name="is_veg"
                value={formData.is_veg}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
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
                value={formData.available}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm pr-8"
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
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 text-base flex items-center space-x-1"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <ArrowLeft />
            </div>
            <span>Back to View</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={saving}
            onClick={handleSubmit}
            className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-6 py-3 text-base"
          >
            {saving ? "Saving Changes" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
