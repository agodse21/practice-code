import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

import { AppContext } from "../Context/AppContext";
import "../styles/ShoppingCart.css";

export const CartProduct = ({ data }) => {
  const { AddTocart, handleTotal, cartData, setCartData } =
    useContext(AppContext);
  console.log(data);
  useEffect(() => {
    handleTotal(data.quantity, data.price);
  }, []);
  const HandleOnechange = (e, id) => {
    let { value } = e.target;
  };
  const HandleDelete = (id) => {
    let x = cartData.filter((ele) => {
      return ele.id == id;
    });
    let temp = cartData.filter((ele) => {
      return ele.id != id;
    });
    x.map((element)=>{
      handleTotal(element.quantity,-element.price)
    })
    setCartData(temp);
  };

  return (
    <>
      <div
        className="main"
        key={data.id}
      >
        <div>
          <img
            width={"150px"}
            height={"150px"}
            src={data.imageURL}
            alt="imageURL"
          />
        </div>
        <div>
          <h2>{data.name}</h2>
          <h2>Rs {data.price}</h2>
        </div>
        <div>
          <label>Quantity: </label>
          <select onChange={(e) => HandleOnechange(e, data.id)}>
            <option value={data.quantity}>{data.quantity}</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => HandleDelete(data.id)}
            className="deleteBtn"
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};
