import { useContext } from "react";
import { CartContext } from "../../Contexts";
import { Leaf, Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import toast from "react-hot-toast";

const CartItemList = () => {
  const { cart, setCart } = useContext(CartContext);

  const handleRemoveItem = (itemID) => {
    const updatedCart = new Map(cart);
    const existingItem = updatedCart.get(itemID);

    if (!existingItem) return;

    const { price, discount = 0 } = existingItem.item;
    const discountedPrice = price - (price * discount) / 100;

    existingItem.quantity -= 1;
    existingItem.subTotal -= discountedPrice;

    if (existingItem.quantity <= 0) {
      updatedCart.delete(itemID);
    } else {
      updatedCart.set(itemID, existingItem);
    }
    toast("Item reduced from cart", {
      icon: <ShoppingCart />,
    });
    setCart(updatedCart);
  };

  const handleAddItem = (itemID) => {
    const updatedCart = new Map(cart);
    const existingItem = updatedCart.get(itemID);

    if (!existingItem) return;

    const { price, discount = 0 } = existingItem.item;
    const discountedPrice = price - (price * discount) / 100;

    existingItem.quantity += 1;
    existingItem.subTotal += discountedPrice;

    updatedCart.set(itemID, existingItem);
    toast("Item increased in cart", {
      icon: <ShoppingCart />,
    });
    setCart(updatedCart);
  };

  const handleDeleteItem = (itemID) => {
    const updatedCart = new Map(cart);
    const existingItem = updatedCart.get(itemID);

    if (!existingItem) return;

    updatedCart.delete(itemID);
    toast("Item deleted from cart", {
      icon: <ShoppingCart />,
    });
    setCart(updatedCart);
  };

  if (!cart || cart.size === 0) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <>
      {Array.from(cart).map(([itemID, cartItem]) => {
        const {
          item: { name, category, price, discount = 0, image_url, is_veg },
          quantity,
          subTotal,
        } = cartItem;

        const discountedPrice = price - (price * discount) / 100;

        return (
          <div
            key={itemID}
            className="flex flex-col md:flex-row items-center space-y-4 md:space-x-4 bg-gray-50 rounded-lg p-4 mb-2"
          >
            <img
              alt={name}
              className="w-full md:w-16 h-32 md:h-16 rounded-lg object-cover object-top flex-shrink-0"
              src={image_url}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-900">{name}</h3>
                {is_veg && (
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 flex items-center justify-center">
                      <Leaf className="text-white text-xs" />
                    </div>
                  </div>
                )}
              </div>

              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {category || "Item"}
              </span>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-orange-600">
                    ₹{discountedPrice.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRemoveItem(itemID)}
                  >
                    <Minus className="text-gray-600 text-xs" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddItem(itemID)}
                  >
                    <Plus className="text-xs text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-900">
                  Subtotal: ₹{subTotal.toFixed(2)}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDeleteItem(itemID)}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Trash />
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CartItemList;
