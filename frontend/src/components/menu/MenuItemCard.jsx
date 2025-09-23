import { Leaf, AlertTriangle, Plus, Edit } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../../Contexts";
import _ from "lodash";

export default function MenuItemCard({ item, onSelect }) {
  const { cart, setCart } = useContext(CartContext);
  const {
    name,
    category,
    description,
    price,
    discount = 0,
    image_url,
    is_veg,
    allergens,
    available = true,
    ingredients,
  } = item;

  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount
    ? (price * (1 - discount / 100)).toFixed(2)
    : price;

  const onAddToCart = (item) => {
    const cartItem = {
      itemID: item.id,
      item: item,
      quantity: 1,
      subTotal: discountedPrice,
    };
    console.log(cartItem);
    if (!cart || cart.length == 0) {
      setCart([cartItem]);
    } else {
      const cartPresent = cart.map((ele) => ele.itemid == item.id);
      console.log(cartPresent[0]);
      if (cartPresent[0]) {
        const groupedCart = _.keyBy(cart, "itemID");
        console.log(groupedCart);
        groupedCart[item.id]["qunatity"] = groupedCart[item.id]["quantity"] + 1;
        groupedCart[item.id]["subTotal"] =
          groupedCart[item.id]["subTotal"] + discountedPrice;
        console.log(groupedCart);
      } else {
        setCart([...cart, cartItem]);
      }
    }

    // console.log(itemPresent);
    console.log("Added to cart! will be implemented later.");
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
        !available ? "opacity-60" : ""
      }`}
      onClick={() => onSelect(item)}
    >
      <div className="relative">
        <img
          src={image_url}
          alt={name}
          className="w-full h-48 object-cover object-top"
        />

        {is_veg ? (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        ) : (
          <></>
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-orange-600">
              ₹{discountedPrice}
            </span>
            {hasDiscount && (
              <div className="text-sm line-through text-gray-400">₹{price}</div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-3 text-sm leading-relaxed">
          {description}
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
          <p className="text-xs text-gray-600">{ingredients}</p>
        </div>

        {allergens && (
          <div className="mb-4 text-xs text-red-600 flex items-center">
            <AlertTriangle className="mr-1 w-4 h-4" />
            <span>Contains: {allergens}</span>
          </div>
        )}
      </div>

      <div className="absolute right-3 bottom-3">
        <button
          disabled={!available}
          className={`font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl px-4 py-2 text-sm flex items-center space-x-2 ${
            !available ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
