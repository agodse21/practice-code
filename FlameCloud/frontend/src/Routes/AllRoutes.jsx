import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { Login } from "../pages/Login";
import { WelComePage } from "../pages/WelComePage";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelComePage />} />
        <Route path="/home/:id" element={<HomePage />} />
      </Routes>
    </>
  );
};
