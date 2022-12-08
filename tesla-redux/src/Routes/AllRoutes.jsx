import { List } from "../Pages/List";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../Components/Home";
import { Tesla } from "../Components/Tesla";
import { User } from "../Components/User";
import { Login } from "../Pages/Login";
import { Reports } from "../Pages/Reports";
import { PrivateRouter } from "../PrivateRoute/PrivateRouter";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tesla" element={<Tesla />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<List />} />
        <Route path="/report" element={<Reports />} />
        <Route path="*" element={<h1>Wrong Routes</h1>} />
      </Routes>
    </div>
  );
};
