import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import { dataObject, validate } from "../config/BillPaidConfig.js";
import useForm from "./useForm";
import { BrokerageSummaryApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation } from "react-router-dom";
let ex_data = [];

function formatDate(date) {
  if (date == null) {
    return null;
  }
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function BillPaid({ sessionObject }) {
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    branch_account_name: String(
      sessionObject.sessionVariables.branch_account_name
    ),
    branch_account_id: String(sessionObject.sessionVariables.branch_account_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
  };

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const download_ref = React.useRef(null);
  const sortIdRef = React.useRef(0);
  const [dateState, setDateState] = React.useState({
    bill_date: new Date(),
    paid_date: new Date(),
    all_branch: "2",
  });
  const [finalInput, setFinalInput] = React.useState({});
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

  const myForm = useForm(
    "BillPaid",
    validate,
    { ...dataObject, ...variablesFromSession },
    BrokerageSummaryApiConfig
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;
    myForm.setPageState({
      ...myForm.pageState,
      [name]: value,
    });
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    setAmountType(value);
  };

  useEffect(() => {
    let dummyObject = {};
    let tds = parseInt(myForm.pageState.tds) || 0;
    // let tds_per = parseInt(myForm.pageState.tds_per) || 0
    let paid_amount = parseInt(myForm.pageState.paid_amount) || 0;
    let paid_adjust = parseInt(myForm.pageState.paid_adjust) || 0;
    let net_amount = parseInt(myForm.pageState.net_amount) || 0;
    dummyObject.balance = String(
      net_amount - (paid_adjust + paid_amount + tds)
    );
    if (dummyObject.balance != myForm.pageState.balance) {
      myForm.setPageState({ ...myForm.pageState, ...dummyObject });
    }
  }, [myForm.pageState]);


  const linkBilty = async (e) => {
    // if (myForm.pageState.bill_no == "" && e.key == "Enter") {
    //   makeFocusOnParticularField("save_button");
    //   return;
    // }
    if (e.key == "Enter") {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      console.log("hi");
      let url =
        SERVER_URL +
        "/tbb_billing_statement/get_by_bill_no/" +
        String(myForm.pageState.station_to) +
        "?bill_no=" +
        String(myForm.pageState.bill_no);
    
      url += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

      const response = await fetch(url);


      if (!response.ok) {
        const temp_error = await response.json();
        setPreviousPageMode(pageMode);
        setPageMode("error");
        setPopupError("Invalid Bill");
        return;
      }
      const temp_response = await response.json();
      if ("bill_date" in temp_response) {
        temp_response.bill_date = formatDate(temp_response.bill_date);
      }
      if ("paid_date" in temp_response) {
        temp_response.paid_date = formatDate(temp_response.paid_date);
      }
      myForm.setPageState({
        ...myForm.pageState,
        ...temp_response,
      });
      myForm.makeFocusOnParticularField("paid_date");
    }
  };

  const handlePrint = async () => {
    let url = SERVER_URL + "/tbb_billing_statement/paid_bill/"

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paid_date: myForm.pageState.paid_date,
        cheque_no: myForm.pageState.cheque_no,
        mr_no: myForm.pageState.mr_no,
        paid_amount: myForm.pageState.paid_amount,
        tds: myForm.pageState.tds,
        adj_remarks: myForm.pageState.adj_remarks,
        paid_adjust: myForm.pageState.paid_adjust,
        id: myForm.pageState.id,
        bank_name:myForm.pageState.bank_name,
        tds_per: myForm.pageState.tds_per,
        balance: myForm.pageState.balance,
        edit_bill: myForm.pageState.edit_bill,
        companyId: myForm.pageState.company_id,
        fyear: myForm.pageState.fyear,
      }),
    });
    if (!response.ok) {
      return;
    }
    myForm.setPageMode("submitted");
    window.location.reload();
    const resp = await response.json();
  };

  let stationToFieldInfo = {
    label: "Station To",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "station_to_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getCitySuggestions",
    url: SERVER_URL + "/branch/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "branch_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      branch_id: "station_to",
      name: "station_to_name",
    },
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "bill_no",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_to",
  };

  return (
    <div className="page-marfatiya-wise">
      <div className="form-container">
        {USE_OVERLAY && (
          <LoadingOverlay
            active={myForm.overlay}
            spinner
            text="Loading your content..."
            styles={{
              wrapper: {
                // width: '400px',
                // height: '400px',
                overflow: true ? "hidden" : "scroll",
              },
            }}
          ></LoadingOverlay>
        )}
        <div className="form-header">Bill Paid</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Branch</label>
            <Autosuggest
              id={stationToFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(stationToFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(stationToFieldInfo)
              }
              getSuggestionValue={(suggestion) =>
                suggestion[stationToFieldInfo.suggestionKeyword]
              }
              onSuggestionSelected={(a, b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  stationToFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, stationToFieldInfo)
              }
              highlightFirstSuggestion={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: partyGstFieldInfo["name"],
                value: String(myForm.pageState[stationToFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, stationToFieldInfo);
                },
                onBlur: () => {
                  stationToFieldInfo["toValidate"]
                    ? myForm.onblurValidator(stationToFieldInfo)
                    : {};
                },
                onKeyPress: (a) =>
                  myForm.onKeyPressForKeyNav(a, stationToFieldInfo),
                // disabled: checkDisabledCondition(stationToFieldInfo),
              }}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Bill No: </label>
            <input
              className="form-input"
              type="text"
              name="bill_no"
              placeholder=""
              value={myForm.pageState.bill_no}
              onChange={handleChange}
              // onKeyPress={(a) => {
              //   if (a.key == "Enter") {
              //     myForm.makeFocusOnParticularField("paid_date");
              //   }
              // }}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bill_no")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Bill Date </label>
            <input
              className="form-input"
              type="date"
              name="bill_date"
              placeholder=""
              disabled="disabled"
              value={myForm.pageState.bill_date}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("consignor_name");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bill_date")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Party Name </label>
            <input
              className="form-input"
              type="text"
              name="consignor_name"
              placeholder=""
              disabled="disabled"
              value={myForm.pageState.consignor_name}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("net_amount");
                }
              }}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "consignor_name")
              }
            />
          </div>
          <div className="form-row">
            <label className="form-label">Bill Amount </label>
            <input
              className="form-input"
              type="text"
              name="net_amount"
              placeholder=""
              disabled="disabled"
              value={myForm.pageState.net_amount}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("paid_date");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "net_amount")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Paid Date </label>
            <input
              className="form-input"
              type="date"
              name="paid_date"
              placeholder=""
              value={myForm.pageState.paid_date}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("cheque_no");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "paid_date")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Cheque No</label>
            <input
              className="form-input"
              type="text"
              name="cheque_no"
              placeholder=""
              value={myForm.pageState.cheque_no}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("bank_name");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "cheque_no")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Bank Name</label>
            <input
              className="form-input"
              type="text"
              name="bank_name"
              placeholder=""
              value={myForm.pageState.bank_name}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("mr_no");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bank_name")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">MR No</label>
            <input
              className="form-input"
              type="text"
              name="mr_no"
              placeholder=""
              value={myForm.pageState.mr_no}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("paid_amount");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "mr_no")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Paid Amount</label>
            <input
              className="form-input"
              type="text"
              name="paid_amount"
              placeholder=""
              value={myForm.pageState.paid_amount}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("tds_per");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "paid_amount")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">TDS(%) </label>
            <input
              className="form-input-suffix"
              type="input"
              name="tds_per"
              placeholder=""
              value={myForm.pageState.tds_per}
              onChange={handleChange}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "tds_per")}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("paid_adjust");
                }
              }}
            />
            <input
              className="form-input"
              type="input"
              name="tds"
              placeholder=""
              disabled="disabled"
              value={myForm.pageState.tds}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("paid_adjust");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "tds")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Adjust/less</label>
            <input
              className="form-input"
              type="text"
              name="paid_adjust"
              placeholder=""
              value={myForm.pageState.paid_adjust}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("adj_remarks");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "paid_adjust")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Adjust Remarks</label>
            <input
              className="form-input"
              type="text"
              name="adj_remarks"
              placeholder=""
              value={myForm.pageState.adj_remarks}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.setPageStateByField("edit_bill","0");
                  myForm.makeFocusOnParticularField("edit_bill");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "adj_remarks")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Balance</label>
            <input
              className="form-input"
              type="text"
              name="balance"
              placeholder=""
              value={myForm.pageState.balance}
              onChange={handleChange}
              disabled="disabled"
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("edit_bill");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "balance")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Edit Bill?</label>
            <select
              className="form-input"
              type="text"
              name="edit_bill"
              placeholder=""
              value={myForm.pageState.edit_bill}
              onChange={handleChange}
              // disabled="disabled"
              onKeyPress={(a) => {
                
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("print_button");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "edit_bill")}
            >
              <option value="1" key="1">
                {" "}
                Yes
              </option>
              <option value="0" key="0">
                No
              </option>
              <option value="-1" key="-1">
                ---
              </option>
            </select>
          </div>
          <div className="form-actions">
            <button
              onClick={handlePrint}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "print_button")
              }
            >
              {" "}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPaid;
