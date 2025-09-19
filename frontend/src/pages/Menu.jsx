import React, { useEffect, useState } from "react";
import MenuList from "../components/MenuList";

const API_BASE = "http://localhost:3000";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/menu/get-menu`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setMenuItems(data.menuItems);
        setLoading(false);
      });
  }, []);

  return (
    <main className="px-2 md:px-10 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Menu</h1>
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-lg text-gray-600">Loading menu...</span>
        </div>
      ) : (
        <MenuList items={menuItems} />
      )}
    </main>
  );
}
