import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import { useEffect, useState } from "react";
import { AuthProvider, CartContext, MenuContext } from "./Contexts.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Menu from "./pages/Menu";
import Footer from "./components/Footer";
import About from "./pages/About";
import ScrollToTop from "./ScrollToTop";

const API_BASE = "http://localhost:3000";

function App() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(new Map());

  useEffect(() => {
    fetch(`${API_BASE}/menu/get-menu`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.menuItems);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-lg text-gray-600">Loading ...</span>
      </div>
    );
  }

  return (
    <AuthProvider>
      <MenuContext.Provider value={{ items, setItems }}>
        <CartContext.Provider value={{ cart, setCart }}>
          <BrowserRouter>
            <Navbar />
            <Toaster position="bottom-right" />
            <main className="w-full mt-16">
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/userProfile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about-us" element={<About />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </CartContext.Provider>
      </MenuContext.Provider>
    </AuthProvider>
  );
}

export default App;
