import React, { useContext, useEffect } from "react";
import "../styles/HomePage.css";
import SearchIcon from "../assets/search-icon.png";
import { AppContext } from "../Context/AppContext";
import { Products } from "../components/Products";
import { FilterProducts } from "../components/FilterProducts";
import { useState } from "react";

import filterIcon from "../assets/filterIcon.png";
export const HomePage = () => {
  const { getData, data, filterData, filtered, FilterProduct, searchproducts } =
    useContext(AppContext);
  const [search, setSearch] = useState("");
  useEffect(() => {
    getData();
    FilterProduct();
  }, [filtered]);

  return (
    <div className="Main">
      <div className="filter">
        <FilterProducts />
      </div>
      <div>
        <div className="search">
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search for products..."
          />

          <button
            onClick={() => {
              searchproducts(search);
            }}
            style={{
              width: "60px",
              height: "40px",
              backgroundColor: "blue",
              cursor: " pointer",
              border: "none",
              display: "flex",
              borderRadius: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              width="20px"
              className="searchIcon"
              src={SearchIcon}
              alt="SearchIcon"
            />
          </button>
          <button className="filterIcon">
            <img
              width="20px"
              className="searchIcon"
              src={filterIcon}
              alt="SearchIcon"
            />
          </button>
        </div>
        <div className="data">
          {
            // filterData.length != 0
            //   ? filterData.map((item) => (
            //       <>
            //         <Products key={item.id} data={item} />
            //       </>
            //     ))
            //   :
            data?.map((item, index) => (
              <>
                <Products key={item.id} index={index} data={item} />
              </>
            ))
          }
        </div>
      </div>
    </div>
  );
};
