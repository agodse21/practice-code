import React, { useState } from "react";
import { SERVER_URL } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";

function MarfatiyaWise({ sessionObject }) {
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "-" +
    String(nowDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    nowDate.getDate();
//   console.log(date, "dsfsfadfsdfa")
  const [pageState, setPageState] = useState({
    date_from: date,
    date_to: date,
    marfatiya_name: "",
    companyId: sessionObject.sessionVariables.company_id ?? "1",
    // fYear: sessionObject.sessionVariables.financial_year,
  });
  const [amountType, setAmountType] = useState("payable")
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
    let url = SERVER_URL + "/money_receipt/marfatiya_"+amountType +"/"+ String(sessionObject.sessionVariables.branch_id)+"?" ;
    
    for (let param in pageState) {
    url+=  param+"=" + pageState[param]+"&"
    }
    url += "&fyear=" + JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

    // url = url.slice(0, url.length - 1)

    let response = await fetch(url,{
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((r) => r.blob());
    console.log("response", response);
    print({ printable: URL.createObjectURL(response), type: "pdf", showModal: false });
  }

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
        <div className="form-header">Marfatiya Wise Statement</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Date From: </label>
            <input
              className="form-input"
              type="date"
              name="date_from"
              placeholder=""
              value={pageState.date_from}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Date To: </label>
            <input
              className="form-input"
              type="date"
              name="date_to"
              placeholder=""
              value={pageState.date_to}
            onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Lorry No. / Marfatiya: </label>
            <input
              className="form-input"
              //   type="date"
              name="marfatiya_name"
              placeholder=""
              value={pageState.marfatiya_name}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Amount Type: </label>
            <select
              className="form-input"
              type="radio"
              name="amount_type"
              placeholder=""
                value={amountType}
                onChange={handleChangeForSelect}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            >
              <option value="payable" key="payable"> Payable Amount</option>
              <option value="receivable" key="receivable">Receivable Amount</option>
            </select>
          </div>
          <div className="form-actions">
            <button onClick={handlePrint}> Print</button>
        </div>
        </div>

        
      </div>
    </div>
  );
}

export default MarfatiyaWise;
