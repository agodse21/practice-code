import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRouter = ({ children }) => {
  const isAuth = useSelector((state) => state.AuthReducer.isAuth);
  // console.log(isAuth);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ data: location.pathname }} />;
  }

  return children;
};
