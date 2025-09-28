import { useContext, useState } from "react";
import { Menu, Power, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext, CartContext } from "../Contexts.jsx";
import Modal from "./Modal.jsx";
import CartModal from "./cart/CartModal.jsx";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              className="h-16 w-auto"
              src="/brand-logo-cropped.png"
              alt="Table & Taste Logo"
            />
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <div
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              Home
            </div>
            <div
              onClick={() => navigate("/menu")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              Menu
            </div>
            <div
              onClick={() => navigate("/about-us")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              About
            </div>
            <div
              onClick={() => navigate("/order")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              Orders
            </div>
            {user && (
              <button
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200 cursor-pointer"
                onClick={() => setIsCartModalOpen(true)}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ShoppingCart />
                </div>
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cart?.size}
                </span>
              </button>
            )}
            {user?.email ? (
              <a
                onClick={() => navigate("/userProfile")}
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                {user.fullname || user.email.split("@")[0]}
              </a>
            ) : (
              <a
                onClick={() => navigate("/login")}
                className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                Login
              </a>
            )}
            {user && (
              <button
                className="text-gray-700 hover:text-red-500 text-md font-medium transition cursor-pointer"
                onClick={() => {
                  toast.success("Cart cleared!");
                  setCart(new Map());
                  toast.success("Logout successful!");
                  logout();
                }}
              >
                <Power />
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <button
                className="relative p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors duration-200 cursor-pointer"
                onClick={() => setIsCartModalOpen(true)}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <ShoppingCart />
                </div>
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cart?.size}
                </span>
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-amber-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-12 pb-4 space-y-2">
          <div
            onClick={() => navigate("/")}
            className="block text-gray-700 hover:text-amber-600 px-2"
          >
            Home
          </div>
          <div
            onClick={() => navigate("/menu")}
            className="block text-gray-700 hover:text-amber-600 px-2"
          >
            Menu
          </div>
          <div
            onClick={() => navigate("/about-us")}
            className="block text-gray-700 hover:text-amber-600 px-2"
          >
            About
          </div>
          <div
            onClick={() => navigate("/order")}
            className="block text-gray-700 hover:text-amber-600 px-2"
          >
            Orders
          </div>

          {user?.email ? (
            <div
              onClick={() => navigate("/userProfile")}
              className="block px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
            >
              {user.fullname || user.email.split("@")[0]}
            </div>
          ) : (
            <div
              onClick={() => navigate("/login")}
              className="block px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
            >
              Login
            </div>
          )}
          {user && (
            <button
              className="flex px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition justify-center items-center gap-4 w-full"
              onClick={() => {
                toast.success("Cart cleared!");
                setCart(new Map());
                toast.success("Logout successful!");
                logout();
              }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Power />
              </div>
              Log Out
            </button>
          )}
        </div>
      )}
      {isCartModalOpen && (
        <Modal
          title={"Cart Modal"}
          isModalOpen={isCartModalOpen}
          onModalClose={() => setIsCartModalOpen(false)}
        >
          <CartModal onModalClose={() => setIsCartModalOpen(false)} />
        </Modal>
      )}
    </nav>
  );
}
