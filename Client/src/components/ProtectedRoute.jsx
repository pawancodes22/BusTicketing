import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isUserLoggedIn = sessionStorage.getItem("jwtToken");
  if (!isUserLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
