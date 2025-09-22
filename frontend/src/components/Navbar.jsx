import { useContext, useState } from "react";
import { LogOut, LucideLogOut, Menu, Power, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts.jsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
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
    </nav>
  );
}
