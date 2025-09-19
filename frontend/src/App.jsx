import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import { useState } from "react";
import { AuthContext } from "./Contexts";
import ProtectedRoute from "./ProtectedRoute";
import Menu from "./pages/Menu";

function App() {
  const initialProfile = {
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    profile_photo: "",
    user_role: "customer",
    birthdate: "",
    preferences: "{}",
  };
  const [user, setUser] = useState(initialProfile);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Navbar />
        <Toaster position="bottom-right" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
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
          </Routes>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
