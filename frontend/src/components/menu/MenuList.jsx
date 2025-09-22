import { useState } from "react";
import MenuItemCard from "./MenuItemCard";
import MenuItemModal from "./MenuItemModal";
import Modal from "../Modal";

export default function MenuList({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  if (!items.length) return <p className="text-center">No menu items found.</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onSelect={setSelectedItem} />
        ))}
      </div>

      {selectedItem && (
        <Modal
          isModalOpen={!!selectedItem}
          onModalClose={() => setSelectedItem(null)}
          title={selectedItem.name || "Menu Item"}
        >
          <MenuItemModal item={selectedItem} onModalClose={() => setSelectedItem(null)}/>
        </Modal>
      )}
    </>
  );
}
