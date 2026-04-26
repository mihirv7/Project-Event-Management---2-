import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) return <Navigate to="/login" />;

  // ✅ Allow all logged-in users
  return children;
}