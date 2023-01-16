import React, { forwardRef, useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";

export const Input = ({ value, name }) => {
  const { filtered, data, FilterProduct, indx, setFiltered } =
    useContext(AppContext);

  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = (e) => {
    let { value } = e.target;
    setIsChecked(!isChecked);
    if (filtered.includes(value)) {
      let temp = filtered.filter((ele) => {
        return ele != value;
      });
      setFiltered([...filtered, ...temp]);
    } else {
      if (!isChecked) {
        setFiltered([...filtered, value]);
      }
    }
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleOnChange}
        name={name}
        value={value}
      />
    </>
  );
};
