import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();
export const MenuContext = createContext();
export const CartContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/login/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
