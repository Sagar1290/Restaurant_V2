import { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import MenuItemModal from "./MenuItemModal";

export default function MenuList({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!items.length) return <p className="text-center">No menu items found.</p>;

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {items.map((item) => (
        <div key={item.id || item.name} onClick={() => setSelectedItem(item)}>
          <MenuItemCard key={item.id} item={item} />
        </div>
      ))}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
