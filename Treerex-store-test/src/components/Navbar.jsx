import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import Cart from "../assets/cart.png";

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav">
        <div>
          <Link to={"/"}>
            <h1 className="h1">TeeRex Store</h1>
          </Link>
        </div>

        <div>
          <div className="cart">
            {" "}
            <div className="products">
              <Link to={"/"}>
                <h2 className="h1">Products</h2>
              </Link>
            </div>
            <Link to="/cart">
              <div
                style={{
                  padding: "7px 15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: "10px",
                }}
              >
                <img width="30px" src={Cart} alt={Cart} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
