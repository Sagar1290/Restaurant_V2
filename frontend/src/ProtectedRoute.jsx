import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Contexts";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
