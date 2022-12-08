import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <nav
        className="nav"
        style={{
          border: "1px solid red",
          width: "100%",
          height: "50px",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Link to="/login">Login Page</Link>
        <Link to="/list">List Page</Link>
        <Link to="/report">Reports Page</Link>
      </nav>
    </div>
  );
};
