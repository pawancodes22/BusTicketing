import { Navigate } from "react-router-dom";
import { getJwtToken } from "../utils/jwtToken";

const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = getJwtToken();
  if (!isUserLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
