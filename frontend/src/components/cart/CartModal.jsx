import { useContext } from "react";
import { CartContext } from "../../Contexts";
import EmptyCart from "./EmptyCart";
import FullCart from "./FullCart";

const CartModal = ({ onModalClose }) => {
  const { cart } = useContext(CartContext);
  return cart && cart.size == 0 ? (
    <EmptyCart onModalClose={onModalClose} />
  ) : (
    <FullCart onModalClose={onModalClose} />
  );
};

export default CartModal;
