import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import { SERVER_URL } from "../config/config";
import { useHistory } from "react-router-dom";

async function loginUser(credentials) {
    // https://run.mocky.io/v3/702e0d64-e1eb-4c63-b071-e4ad3e15acfc
    return fetch(SERVER_URL + "/login/access-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(credentials),
    }).then((data) => data.json());
}

export default function BranchSelector({ sessionObject, mainBranchSelector }) {
    // console.log(mainBranchSelector);
    const [currentYear, setCurrentYear] = useState("");
    const [yearIndex, setYearIndex] = useState("");
    const [dateSelectorObj, setDateSelectorObj] = useState([]);
    const history = useHistory();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    let refStoreObject = useRef({});
    var branch_info = sessionStorage.getItem("branch_info");
    var branch_info_1 = JSON.parse(branch_info)["branch_info"];
    // var branch_id = branch_info_1[0].branch_id;
    // var branch_name = branch_info_1[0].branch_name;
    // var branch_account_name = branch_info_1[0].account_name;
    // var branch_account_id = branch_info_1[0].account_id;
    const [branchInfo, setBranchInfo] = useState({
        branch_id: branch_info_1[0].branch_id,
        branch_name: branch_info_1[0].branch_name,
        branch_account_name: branch_info_1[0].account_name,
        branch_account_id: branch_info_1[0].account_id,
        branch_suffix: branch_info_1[0].suffix,
    });

    // const dateValueMapping = {
    //     1: "26-27",
    //     2: "25-26",
    //     3: "24-25",
    //     4: "23-24",
    //     5: "22-23",
    //     6: "21-22",
    //     7: "20-21",
    //     8: "19-20",
    //     9: "18-19",
    //     10: "17-18",
    //     11: "16-17",
    // }

    // const dateSelectorObj = [
    //     // {
    //     //     value: "26-27",
    //     //     label: "01/04/2026 - 31-03-2027"
    //     // },
    //     // {
    //     //     value: "25-26",
    //     //     label: "01/04/2025 - 31-03-2026"
    //     // },
    //     // {
    //     //     value: "24-25",
    //     //     label: "01/04/2024 - 31-03-2025"
    //     // },
    //     // {
    //     //     value: "23-24",
    //     //     label: "01/04/2023 - 31-03-2024"
    //     // },
    //     {
    //         value: "21-22",
    //         label: "01/04/2021 - 31/03/2022",
    //     },
    //     {
    //         value: "22-23",
    //         label: "01/04/2022 - 31/03/2023",
    //     },
    //     // {
    //     //     value: "20-21",
    //     //     label: "01/04/2020 - 31/03/2021",
    //     // },
    //     // {
    //     //     value: "26-27",
    //     //     label: "01/04/2018 - 31-03-2019"
    //     // },
    //     // {
    //     //     value: "26-27",
    //     //     label: "01/04/2017 - 31-03-2018"
    //     // },
    //     // {
    //     //     value: "26-27",
    //     //     label: "01/04/2016 - 31-03-2017"
    //     // },
    // ]

    const handleSubmit = async (e) => {
        e.preventDefault();

        let financialYearObj = {
            financial_year: yearIndex,
        }

        if (mainBranchSelector) {
            financialYearObj.financial_year_for_fetch = yearIndex;
        }

        sessionObject.saveSessionVariableByObject({
            // branch_id: branch_id,
            // branch_name: branch_name,
            // branch_account_id: branch_account_id,
            // branch_account_name: branch_account_name,
            ...branchInfo,
            ...financialYearObj,
        });

        history.push("/");
    };

    const handleChange = function (e, selectName) {
        const { name, value } = e.target;
        let curr_branch_id = value;
        for (let i = 0; i < branch_info_1.length; i++) {
            if (branch_info_1[i].branch_id == curr_branch_id) {
                setBranchInfo({
                    branch_id: value,
                    branch_name: branch_info_1[i].branch_name,
                    branch_account_name: branch_info_1[i].account_name,
                    branch_account_id: branch_info_1[i].account_id,
                    branch_suffix: branch_info_1[i].suffix,
                });
            }
        }
    };

    useEffect(
        // Effect for clearing out client side validation
        () => {
            refStoreObject.current["branch_select"].focus();
        },
        []
    );

    useEffect(() => {

        let selectorObj = [];

        const currDate = new Date();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear().toString().substring(2) - (currMonth < 4);

        console.log(sessionObject.sessionVariables);
        let yearRange = 2;
        let isCurrentYearSet = false;

        if (currYear == "21") {
            selectorObj.push({
                value: "22-23",
                label: "01/04/2022 - 31/03/2023",
            });
        }

        for (let i = 0; i < yearRange; i++) {
            let temp1 = currYear - i;
            let temp2 = temp1 + 1;
            let tempObj = {
                value: temp1 + "-" + temp2,
                label: "01/04/20" + temp1 + " - " + "31/03/20" + temp2,
            };

            if (!isCurrentYearSet) {
                isCurrentYearSet = true;
                setCurrentYear(temp1 + "-" + temp2);
                setYearIndex(temp1 + "-" + temp2);
            }

            selectorObj.push(tempObj);
        }
        setDateSelectorObj(selectorObj);
        // console.log(branchInfo, yearIndex);
    }, [])

    // React.useEffect(() => {
    //     console.log({ currentYear});
    // })

    return (
        <div className="branch-selector-wrapper">
            <form onSubmit={handleSubmit} className="branch-selector-form">
                <div className="branch-selector-header">Select Branch</div>
                {/* <label>
                    <p>Branch</p>
                    <input type="text" onChange={(e) => setUserName(e.target.value)} />
                </label> */}

                <select
                    style={{ fontSize: "20px"}}
                    onChange={(newValue) => {
                        handleChange(newValue);
                    }}
                    ref={(a) => (refStoreObject.current.branch_select = a)}
                    onKeyPress={(a) => {
                        if (a.key == "Enter") {
                            a.preventDefault();
                            refStoreObject.current.year_select.focus();
                        }
                    }}
                >
                    {branch_info_1.map((branch) => (
                        <option value={branch["branch_id"]} key={branch["branch_name"]}>
                            {branch.branch_name}
                        </option>
                    ))}
                    {/* {info["dropdown_items"].map((dropdown_item) => (
            <option value={dropdown_item.value} key={dropdown_item.label}>
              {dropdown_item.label}
            </option>
          ))} */}
                </select>
                
                {/* <hr height="5px" style={{ backgroundColor: "black"}} /> */}

                <div 
                    style={{height: "2px", backgroundColor: "grey"}} 
                />

                {/* <h1>
                    Select Year
                </h1> */}
                <div className="branch-selector-header">
                    Select Year
                </div>
                <select
                    style={{ fontSize: "20px", color: yearIndex == currentYear ? "black" : "red" }}
                    value={yearIndex}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setYearIndex(e.target.value)
                    }}
                    ref={(a) => (refStoreObject.current.year_select = a)}
                    onKeyPress={(a) => {
                        if (a.key == "Enter") {
                            a.preventDefault();
                            refStoreObject.current.save_button.focus();
                        }
                    }}
                >
                    {dateSelectorObj.map((date) => (
                        <option
                            value={date["value"]}
                            key={date["value"]}
                            style={{
                                color: date.value == currentYear ? "black" : "red",
                            }}
                        >
                            {date.label}
                        </option>
                    ))}
                </select>
                {/* <hr/> */}

                <div 
                    style={{height: "2px", backgroundColor: "grey"}} 
                />
                
                <button
                    style={{ alignSelf: "center", fontSize: "20px", }}
                    type="submit"
                    ref={(a) => (refStoreObject.current.save_button = a)}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
