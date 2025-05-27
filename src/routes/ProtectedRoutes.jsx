import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  console.log("Protected Route - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    window.location.href = "/signin";
    return null;
  }

  return children;
};

export default ProtectedRoute;
