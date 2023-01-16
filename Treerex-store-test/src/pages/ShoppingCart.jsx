import React, { useContext } from "react";
import { useState } from "react";
import { CartProduct } from "../components/CartProduct";
import { AppContext } from "../Context/AppContext";

export const ShoppingCart = () => {
  const { cartData, total, handleTotal, setCartData } = useContext(AppContext);

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h1>Shopping Cart</h1>
      {cartData.length == 0 ? (
        <>
          <h2 style={{ textAlign: "center" }}>Cart is Empty!</h2>
        </>
      ) : (
        cartData?.map((item) => (
          <>
            <CartProduct key={item.id} data={item} />
          </>
        ))
      )}
      <hr />
      {cartData.length == 0 ? (
        <></>
      ) : (
        <h2 style={{ textAlign: "center" }}>Total amount: Rs {total}</h2>
      )}
    </div>
  );
};
