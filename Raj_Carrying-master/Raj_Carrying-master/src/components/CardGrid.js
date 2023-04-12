import React from "react"
import './CardGrid.scss';
import { checkAccess } from "../utils/apiUtils";
// import gridItems from '../config/gridItems.js'
import Card from './Card.js'


function CardGrid() {
  var inc = 0
  const roleId = JSON.parse(window.sessionStorage.getItem("role_id")).role_id;
  const dashboardInfo = JSON.parse(sessionStorage.getItem("dashboard_info"))?.dashboard_info ?? [];
    let gridItems = [];

    dashboardInfo.forEach((item) => {
        gridItems.push({
            label: item.menu_name,
            url: "/" + item.menu_accessor,
        })
    })
  return (
    <div className="grid-container">
      {/* <ul className="navbar-nav">{props.children}</ul> */}
      {gridItems.map((gridItem, index) => {
        module = gridItem.url.replace('/','')
        let acc = checkAccess(module)
        if(!acc){
          return;
        }
        // console.log(roleId, module, typeof roleId);
        if(roleId != 1 && module == "report-bilty") {
            return;
        }
        inc = inc + 1
        return (
        <Card index={inc} item={gridItem}  />
      )})}
    </div>
  );
}


export default CardGrid