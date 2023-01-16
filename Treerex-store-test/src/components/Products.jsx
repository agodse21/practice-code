import React, { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export const Products = ({ data }) => {
  const { AddTocart, setIndex } = useContext(AppContext);

  return (
    <div key={data.id}>
      <div style={{ backgroundColor: "white", padding: "10px" }}>
        <h2 style={{ textAlign: "left" }}>{data.name}</h2>
        <img
          width={"200px"}
          height={"200px"}
          src={data.imageURL}
          alt="imageURL"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Rs {data.price}</h2>
        <button
          onClick={() => {
            AddTocart(data.id);
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};
