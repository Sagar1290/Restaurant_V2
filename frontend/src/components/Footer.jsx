import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div
              className="flex-shrink-0 cursor-pointer mb-4"
              onClick={() => navigate("/")}
            >
              <div
                className="flex flex-col items-center -ml-16"
                style={{ fontFamily: "Cinzel,serif" }}
              >
                <span className="text-yellow-700 tracking-wider font-semibold text-4xl">
                  TABLE &
                </span>
                <span className="text-yellow-700 tracking-wider font-semibold text-4xl">
                  TASTE
                </span>
              </div>
            </div>

            <p className="text-gray-400 mb-4">
              Experience the finest dining with our carefully crafted dishes and
              exceptional service.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:text-orange-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:text-orange-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 flex items-center justify-center cursor-pointer hover:text-orange-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                {
                  name: "Home",
                  href: "/",
                },
                {
                  name: "Menu",
                  href: "/",
                },
                {
                  name: "Reservations",
                  href: "/",
                },
                {
                  name: "About",
                  href: "/",
                },
                {
                  name: "Contact",
                  href: "/",
                },
              ].map(({ name, href, external }) => (
                <li key={name}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    data-discover={!external ? "true" : undefined}
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-orange-400">
                  <MapPin size={20} />
                </div>
                <span>123 Restaurant Street, Dehradun, Pin: 000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-orange-400">
                  <Phone size={20} />
                </div>
                <span>+91 xxxx123456</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center text-orange-400">
                  <Mail size={20} />
                </div>
                <span>table.and.taste@xyz.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Opening Hours
            </h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex justify-between items-center">
                <span className="text-md">Mon - Fri</span>
                <span className="text-white text-lg font-medium">
                  11:00 AM - 10:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md">Saturday</span>
                <span className="text-white text-lg font-medium">
                  10:00 AM - 11:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md">Sunday</span>
                <span className="text-white text-lg font-medium">
                  10:00 AM - 09:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="text-center text-gray-400">
          <p>
            © 2025{" "}
            <span
              style={{ fontFamily: "Cinzel,serif" }}
              className="text-orange-500"
            >
              {" "}
              Table & Taste{" "}
            </span>{" "}
            Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
