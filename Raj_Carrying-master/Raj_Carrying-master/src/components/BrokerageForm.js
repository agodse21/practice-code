import React, { useState } from "react";
import { SERVER_URL } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";

function Brokerage({ sessionObject }) {

    let variablesFromSession = {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
        // "last_bilty_no": String(sessionObject.sessionVariables.last_bilty_no),
      };

  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "-" +
    String(nowDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    nowDate.getDate();
  const [pageState, setPageState] = useState({
    challan_no: "",
    brokerage: "",
  });
  const handleChange = async (e) => {
    
    const { name, value } = e.target;
    // console.log("sdfasd", name, value)
    setPageState({
      ...pageState,
      [name]: value,
    });
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    // console.log("DSFDSFD", name, value)
    setAmountType(value);
  };

  const handlePrint = async () => {
    let url = SERVER_URL + "/challan/print_with_refund/" ;
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    let apiInputData = {
        "booking_chalan_no": String(pageState.challan_no),
        "brokerage": String(pageState.brokerage),
        "branch_id": String(variablesFromSession.created_from),
        "companyId": variablesFromSession.company_id,
        "fyear": fYear_fetch,
      }

    let response = await fetch(url,{
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiInputData),
    }).then((r) => r.blob());
    print({ printable: URL.createObjectURL(response), type: "pdf", showModal: false });
  }

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
        <div className="form-header">Challan Wise Brokerage</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Challan No </label>
            <input
              className="form-input"
              type="text"
              name="challan_no"
              placeholder=""
              value={pageState.challan_no}
              onChange={handleChange}
              autoFocus={true}
              onKeyPress={(e) => {
                //   console.log(e.key);
                  if(e.key == "Enter") {
                    document.getElementById("brokerage").focus();
                  }
              }}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Brokerage (%) </label>
            <input
              className="form-input"
              type="text"
              name="brokerage"
              id="brokerage"
              placeholder=""
              value={pageState.brokerage}
              onChange={handleChange}
              onKeyPress={(e) => {
                // console.log(e.key);
                if(e.key == "Enter") {
                  document.getElementById("print_button").focus();
                }
            }}
            />
          </div>
          <div className="form-actions">
            <button onClick={handlePrint} id="print_button"> Print</button>
        </div>
        </div>

        
      </div>
    </div>
  );
}

export default Brokerage;
