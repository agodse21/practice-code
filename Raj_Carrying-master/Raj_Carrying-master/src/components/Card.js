import React from "react";
import "./CardGrid.scss";
import { checkAccess } from "../utils/apiUtils";
import { useHistory } from "react-router-dom";

function Card(props) {
  const history = useHistory();
  const handleClick = () => history.push(props.item.url);
  // module = props.item.url.replace('/','')
  // let acc = checkAccess(module)
  // if(!acc){
  //   return <p/>
  // }
  return (
    <div
      className={`card-${props.index} btnfos-5`}
      tabindex="0"
      onKeyPress={(a) => {
        if (a.key == "Enter") {
          handleClick();
        }
      }}
      onClick={handleClick}
    >
      <span className="card-icon">{props.item.icon}</span>
      <div className="card-text">{props.item.label}</div>
    </div>
  );
}

export default Card;
