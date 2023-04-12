import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import { dataObject, validate } from "../config/TDSReport";
import useForm from "./useForm";
import { crossingOutApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation } from "react-router-dom";
import getLoggedinFyear from "../utils/getLoggedinFyear";
let ex_data = [];

function TDSReport({ sessionObject }) {

    const fyearObj = getLoggedinFyear(sessionObject);
  let variablesFromSession = {
    // station_from: String(sessionObject.sessionVariables.branch_id),
    // station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    branch_account_name: String(
      sessionObject.sessionVariables.branch_account_name
    ),
    branch_account_id: String(sessionObject.sessionVariables.branch_account_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
    date_from: fyearObj.start_fyear,
    date_to: fyearObj.end_fyear,
  };

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const download_ref = React.useRef(null);
  const sortIdRef = React.useRef(0);
  const [dateState, setDateState] = React.useState({
    date_from: new Date(),
    date_to: new Date(),
    all_branch: "2",
  });
  const [finalInput, setFinalInput] = React.useState({});
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

  const myForm = useForm(
    "BrokerageSummary",
    validate,
    { ...dataObject, ...variablesFromSession },
    crossingOutApiConfig
  );

  const handleChange = async (e) => {
    const { name, value } = e.target;
    // console.log("sdfasd", name, value)
    myForm.setPageState({
      ...myForm.pageState,
      [name]: value,
    });
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    // console.log("DSFDSFD", name, value)
    setAmountType(value);
  };

  // const handlePrint = async () => {
  //   myForm.setOverlay(true);
  //   let url = SERVER_URL + "/crossing_outward/report_print/";
  //   let apiInputData = {
  //     created_from: String(sessionObject.sessionVariables.branch_id),
  //     date_from: myForm.pageState.date_from,
  //     date_to: myForm.pageState.date_to,
  //   };

  //   if (myForm.pageState.consignor_id != "") {
  //     apiInputData.transporter_id = myForm.pageState.consignor_id;
  //   }

  //   let response = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(apiInputData),
  //   }).then((r) => r.blob());
  //   myForm.setOverlay(false);
  //   print({
  //     printable: URL.createObjectURL(response),
  //     type: "pdf",
  //     showModal: false,
  //   });
  // };

  let stationFromFieldInfo = {
    label: "Station From",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "station_from_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getCitySuggestions",
    url: SERVER_URL + "/branch/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "branch_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      branch_id: "station_from",
      name: "station_from_name",
    },
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "station_to_name",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_from",
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
      Enter: "excel",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_to",
  };

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
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
        <div className="form-header">TDS Report</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Date From: </label>
            <input
              className="form-input"
              type="date"
              name="date_from"
              placeholder=""
              value={myForm.pageState.date_from}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("date_to");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "date_from")}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Date To: </label>
            <input
              className="form-input"
              type="date"
              name="date_to"
              placeholder=""
              value={myForm.pageState.date_to}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("all_data");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Old Data?</label>
            <select
              className="form-input"
              type="text"
              name="all_data"
              placeholder=""
              value={myForm.pageState.all_data}
              onChange={myForm.handleChange}
              // disabled="disabled"
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("amount");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "all_data")}
            >
              <option value="1" key="1">
                {" "}
                Yes
              </option>
              <option value="0" key="0">
                No
              </option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label"> Amount >=: </label>
            <input
              className="form-input"
              type="text"
              name="amount"
              placeholder=""
              value={myForm.pageState.amount}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("excel");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "amount")}
            />
          </div>
          {/* <div className="form-row">
            <label className="form-label">Brokerage (%) </label>
            <input
              className="form-input"
              type="text"
              name="brokerage"
              placeholder=""
              value={myForm.pageState.brokerage}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("station_to_name");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "brokerage")}
            />
          </div> */}
          {/* <div className="form-row">
            <label className="form-label">Station From </label>
            <Autosuggest
              id={stationFromFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(stationFromFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(stationFromFieldInfo)
              }
              getSuggestionValue={(suggestion) =>
                suggestion[stationFromFieldInfo.suggestionKeyword]
              }
              onSuggestionSelected={(a, b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  stationFromFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, stationFromFieldInfo)
              }
              highlightFirstSuggestion={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: partyGstFieldInfo["name"],
                value: String(myForm.pageState[stationFromFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, stationFromFieldInfo);
                },
                onBlur: () => {
                  stationFromFieldInfo["toValidate"]
                    ? myForm.onblurValidator(stationFromFieldInfo)
                    : {};
                },
                onKeyPress: (a) =>
                  myForm.onKeyPressForKeyNav(a, stationFromFieldInfo),
                // disabled: checkDisabledCondition(stationFromFieldInfo),
              }}
            />
          </div> */}
          {/* <div className="form-row">
            <label className="form-label">Station To </label>
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
          </div> */}
          {/* <div className="form-actions">
            <button
              onClick={handlePrint}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "print_button")
              }
            >
              {" "}
              Print
            </button>
          </div> */}
          <div className="form-footer">
            <button style={{ display: "none" }}>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="tds_excel"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Download as XLS"
                ref={(a) => (download_ref.current = a)}
              />
            </button>
            <button
              className="download-table-xls-button"
              onClick={async () => {
                setLoading(true);
                myForm.setOverlay(true);
                console.log("fubakl inout ", finalInput);

                const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
                let dataToSend = {
                  from_date: myForm.pageState.date_from,
                  to_date: myForm.pageState.date_to,
                  all_data: myForm.pageState.all_data,
                  amount: myForm.pageState.amount,
                  companyId: myForm.pageState.company_id,
                  fyear: fYear_fetch,
                };
                if (myForm.pageState.station_from != ""){
                  dataToSend.station_from = myForm.pageState.station_from
                }
                if (myForm.pageState.station_to != ""){
                  dataToSend.station_to = myForm.pageState.station_to
                }
                let resp = await fetch(SERVER_URL + "/trip/tds/", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(dataToSend),
                });
                let response = await resp.json();

                ex_data = response;

                // if (response["data"] && "total_rows" in response) {
                //   console.log(response["data"], "fsdfafsfds");
                //   // setData(response["data"]);
                  
                //   // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                // }
                setLoading(false);
                myForm.setOverlay(false);
                download_ref.current.handleDownload();
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "excel")}
            >
              TDS Data
            </button>
            {ReportExcel.excel_tds_data(
              { ex_data },
              { dateState }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TDSReport;
