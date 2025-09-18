import { useContext } from "react";
import { AuthContext } from "../Contexts";

export default function Home() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-amber-600">
        Welcome to MyRestaurant 🍽️
      </h1>
      <p className="mt-4 text-gray-600">
        Enjoy delicious meals crafted with love and care.
      </p>
    </div>
  );
}
