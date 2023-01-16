import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ShoppingCart } from "../pages/ShoppingCart";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<ShoppingCart />} />
      </Routes>
    </>
  );
};
