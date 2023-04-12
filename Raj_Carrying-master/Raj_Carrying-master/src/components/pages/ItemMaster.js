import React from "react";
import "../../App.css";
import ItemMasterForm from "../ItemMasterForm";

function ItemMasterPage({ sessionObject }) {
  if(!sessionObject.sessionVariables["modules"].includes("item_master")){
    return;}
  return (
    <div className="page-vehicle">
      <ItemMasterForm sessionObject={sessionObject} />
    </div>
  );
}

export default ItemMasterPage;
