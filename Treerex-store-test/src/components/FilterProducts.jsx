import React, { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

import { Input } from "../custom-component/Input";

export const FilterProducts = () => {
  const { FilterProduct } = useContext(AppContext);
  useEffect(() => {
    FilterProduct();
  }, []);
  return (
    <div style={{ padding: "10px" }}>
      <div>
        <h2>Colour</h2>
        <Input value={"Red"} name="Red" />
        <label for="Red"> Red</label>
        <br />
        <Input value={"Blue"} name="Blue" />
        <label for="Blue">Blue</label>
        <br />

        <Input name="Green" value="Green" />
        <label for="Green"> Green</label>
      </div>
      <div>
        <h2>Gender</h2>
        <Input name="Men" value="Men" />
        <label for="Men"> Men</label>
        <br />
        <Input name="Women" value="Women" />
        <label for="Women"> Women</label>
        <br />
      </div>
      <div>
        <h2>Price</h2>
        <Input name="0-Rs250" value="250" />
        <label for="0-Rs250"> 0-Rs250</label>
        <br />
        <Input name="Rs251-450" value="l450" />
        <label for="Rs251-450"> Rs251-450</label>
        <br />
        <Input name="Rs450" value="g450" />
        <label for="Rs450"> Rs450</label>
      </div>
      <div>
        <h2>Type</h2>
        <Input name="Polo" value="Polo" />
        <label for="Polo"> Polo</label>
        <br />
        <Input name="Hodies" value="Hodies" />
        <label for="Hodies"> Hodies</label>
        <br />
        <Input name="Basic" value="Basic" />
        <label for="Basic">Basic</label>
      </div>
    </div>
  );
};
