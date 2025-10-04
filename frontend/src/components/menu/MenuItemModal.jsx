import { Edit, Leaf, Trash } from "lucide-react";
import { useContext, useState } from "react";
import EditMenuItemForm from "./EditMenuItemForm";
import { AuthContext, MenuContext } from "../../Contexts";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function MenuItemModal({ item, onModalClose }) {
  const { user } = useContext(AuthContext);
  const { items, setItems } = useContext(MenuContext);
  if (!item) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const finalPrice = (item.price - (item.price * item.discount) / 100).toFixed(
    2
  );

  const handleMenuItemEdit = async (itemId, itemDetail, setLoading) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${API_BASE}/menu/update-item/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemDetail }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      const data = await res.json();
      toast.success("Item Updated Successfully");
      setItems(data["menuItems"]);
      onModalClose();
      return { success: true, data };
    } catch (error) {
      toast.error(error["message"]);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemDelete = async (itemId, setLoading) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${API_BASE}/menu/delete-item/${itemId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      const data = await res.json();
      toast.success("Item deleted successfully!");
      setItems(items.filter((item) => item.id !== itemId));
      onModalClose();
      return { success: true, data };
    } catch (error) {
      toast.error(error["message"]);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isEditing ? (
        <div className="md:p-6 flex justify-center items-center">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-x-6">
              <img
                alt={item.name}
                className="w-52 h-40 object-cover object-top rounded-lg flex-shrink-0"
                src={item.image_url}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {item.name}
                  </h3>

                  {item.is_veg === 1 && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Leaf className="text-white text-sm" />
                      </div>
                    </div>
                  )}
                </div>

                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {item.category}
                </span>

                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{finalPrice}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.price}
                    </span>
                  )}
                </div>
              </div>
              {user?.user_role == "manager" && (
                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                  <button
                    className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-sm flex items-center space-x-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Edit />
                    </div>
                    <span>Edit</span>
                  </button>

                  <button
                    className="font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 text-sm flex items-center space-x-1"
                    disabled={deleting}
                    onClick={() => handleMenuItemDelete(item.id, setDeleting)}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Trash />
                    </div>
                    <span>{deleting ? "Deleting" : "Delete"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Ingredients
                </h4>
                <p className="text-gray-600">{item.ingredients}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Allergens</h4>
                <p className="text-gray-600">{item.allergens || "None"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Availability
                </h4>
                <p
                  className={`font-medium ${
                    item.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.available ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditMenuItemForm
          item={item}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleMenuItemEdit}
        />
      )}
    </>
  );
}
