import React, { useState } from "react";
export const AppContext = React.createContext();

function AppContextProvider({ children }) {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [total, setTotal] = useState(0);
  const [indx, setIndex] = useState(0);
  const getData = async () => {
    let res = await fetch(
      "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json"
    );
    let resp = await res.json();
    setData(resp);
  };
  const handleTotal = (q, p) => {
    console.log(q, p);
    let t = q * p;
    setTotal(total + t);
  };
  const FilterProduct = () => {
    console.log(filtered);
    filtered.map((ele) => {
      if (data.includes(ele)) {
        let temp = data.filter((elem) => {
          return ele == elem.color;
        });
        setFilterData([...temp]);
      }
    });
  };
  console.log(filterData);
  const searchproducts = (item) => {
    let temp = data.filter((ele) => {
      return ele.name == item || ele.color == item || ele.type == item;
    });
    if (temp.length == 0) {
      alert("result not found!");
    } else {
      setData(temp);
    }
  };
  const AddTocart = (id) => {
    let temp = data.filter((ele) => {
      return ele.id == id;
    });
    temp.map((item) => {
      setCartData([...cartData, item]);
    });
    alert("Product added in cart!");
  };

  return (
    <AppContext.Provider
      value={{
        getData,
        filtered,
        AddTocart,
        setFiltered,
        data,
        searchproducts,
        cartData,
        setCartData,
        handleTotal,
        total,
        FilterProduct,
        filterData,
        setIndex,
        indx,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
