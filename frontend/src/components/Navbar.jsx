import { useContext, useState } from "react";
import { Menu, Power, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext, CartContext } from "../Contexts.jsx";
import Modal from "./Modal.jsx";
import CartModal from "./cart/CartModal.jsx";

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
            <a
              onClick={() => navigate("/menu")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              Menu
            </a>
            <a
              onClick={() => navigate("/about-us")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              About
            </a>
            <a
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-blue-500 text-md font-medium transition cursor-pointer"
            >
              Contact
            </a>
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
                onClick={logout}
              >
                <Power />
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
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
        <div className="md:hidden bg-white shadow-lg px-4 pb-4 space-y-2">
          <a href="#home" className="block text-gray-700 hover:text-amber-600">
            Home
          </a>
          <a href="#menu" className="block text-gray-700 hover:text-amber-600">
            Menu
          </a>
          <a href="#about" className="block text-gray-700 hover:text-amber-600">
            About
          </a>
          <a
            href="#contact"
            className="block text-gray-700 hover:text-amber-600"
          >
            Contact
          </a>
          <a
            href="/login"
            className="block px-3 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </a>
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
