import React from "react";
import "./Navbar.css";
import { useRef, useState, useEffect } from "react";

function Navbar(props) {
    const [currentYear, setCurrentYear] = useState("");
    const [yearIndex, setYearIndex] = useState(props.sessionObject.sessionVariables.financial_year_for_fetch);
    const [dateSelectorObj, setDateSelectorObj] = useState([]);

    // console.log({ currentYear, yearIndex});
    // console.log(props.sessionObject.sessionVariables);
    // console.log(props.sessionObject.sessionVariables.financial_year_for_fetch);

  const getLocalFlag = () => {
    try{
      return localStorage.getItem("local_flag") === 'true';
    } catch(e){
      return false
    }
  }
  const setLocalFlag = () => {
    try{
      localStorage.setItem("local_flag", JSON.stringify(!isLocal));
    }
    catch (e){
      console.log("Errorr asdf", e.message);
    }   
    
    setIsLocal(!isLocal)
  }

  useEffect(() => {

    console.log("reload");
        
    let selectorObj = [];

    const currDate = new Date();
    let currMonth = currDate.getMonth() + 1;
    let currYear = currDate.getFullYear().toString().substring(2) - (currMonth < 4);

    let yearRange = 2;
    let isCurrentYearSet = false;
    
    if(currYear == "21") {
        selectorObj.push({
            value: "22-23",
            label: "01/04/2022 - 31/03/2023", 
        });
    }

    for(let i = 0; i < yearRange; i++) {
        let temp1 = currYear - i;
        let temp2 = temp1 + 1;
        let tempObj = {
            value: temp1 + "-" + temp2,
            label: "01/04/20" + temp1 + " - " + "31/03/20" + temp2,
        };

        if(!isCurrentYearSet) {
            isCurrentYearSet = true;
            setCurrentYear(temp1 + "-" + temp2);
            // setYearIndex(temp1 + "-" + temp2);
        }

        selectorObj.push(tempObj);
    }
    setDateSelectorObj(selectorObj);
    // console.log(branchInfo, yearIndex);
    }, [])

    useEffect(() => {
        // console.log("++++++++++++++", yearIndex);
        // const newYearToSet = {
        //     financial_year_for_fetch: yearIndex,
        // }
        props.sessionObject.saveSessionVariableByObject({"financial_year_for_fetch": yearIndex});
        window.dispatchEvent(new Event("Fyear-Changed"));
    }, yearIndex);

    const financialYearChanged = (e) => {
        const newYear = e.target.value;
        // console.log(e.target);
        setYearIndex(newYear);
    }

  const [isLocal, setIsLocal] = useState(getLocalFlag());
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
      <div className="navbar-branch" style={{whiteSpace: "nowrap"}}>
        F. Year: 
        <select
                className="navbar-branch"
                style={{
                    backgroundColor: "#23293e", 
                    color: yearIndex == currentYear ?  "lemonchiffon" : "red",
                    fontFamily: "roboto",
                }}
                value={yearIndex}
                onChange={financialYearChanged}
            >
                {dateSelectorObj.map((date) => (
                <option 
                    value={date["value"]} 
                    key={date["value"]}
                    style={{
                        color: date.value == currentYear ? "lemonchiffon": "red",
                    }}
                >
                    {date.label}
                </option>
            ))}
            </select>
      </div>
      <div className="navbar-branch">
      Branch: {JSON.parse(sessionStorage.getItem("branch_name"))["branch_name"].toUpperCase()}
      </div>
      <div className="navbar-branch">
      User: {JSON.parse(sessionStorage.getItem("user_name"))["user_name"].toUpperCase()}
      </div>
      {/* <button className="log-out-container" onClick={setLocalFlag}>
        {isLocal ? "Local" : "Global"}
      </button> */}
      <button className="log-out-container" onClick={props.handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
