import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import { dataObject, validate } from "../config/BrokerageSummaryConfig.js";
import useForm from "./useForm";
import { BrokerageSummaryApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation } from "react-router-dom";
let ex_data = [];

function BrokerageSummary({ sessionObject }) {
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
    BrokerageSummaryApiConfig
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

  const handlePrint = async () => {
    myForm.setOverlay(true);
    let url = SERVER_URL + "/challan/print_tripwise_challan/";

    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    let apiInputData = {
      branch_dict: {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_to: String(myForm.pageState.station_to),
      },
      date_dict: {
        date_from: myForm.pageState.date_from,
        date_to: myForm.pageState.date_to,
      },
      brokerage: String(myForm.pageState.brokerage),
      "companyId": myForm.pageState.company_id,
      "fyear": fYear_fetch,
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiInputData),
    }).then((r) => r.blob());
    myForm.setOverlay(false);
    print({
      printable: URL.createObjectURL(response),
      type: "pdf",
      showModal: false,
    });
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
      Enter: "print_button",
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
        <div className="form-header">Brokerage Summary</div>
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
              autoFocus={true}
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
                  myForm.makeFocusOnParticularField("brokerage");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
            />
          </div>
          <div className="form-row">
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
          </div>
          <div className="form-row">
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
          </div>
          <div className="form-actions">
            <button
              onClick={handlePrint}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "print_button")
              }
            >
              {" "}
              Print
            </button>
          </div>
          <div className="form-footer">
            <button style={{ display: "none" }}>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="bilty_report_excel"
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
                // let dataToSend = {
                //   date_dict: finalInput.date_dict,
                //   filter_fields: finalInput.filter_fields,
                // };
                const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
                let dataToSend = {
                  branch_dict: {
                    station_from: String(
                      sessionObject.sessionVariables.branch_id
                    ),
                    station_to: String(myForm.pageState.station_to),
                  },
                  date_dict: {
                    date_from: myForm.pageState.date_from,
                    date_to: myForm.pageState.date_to,
                  },
                  brokerage: String(myForm.pageState.brokerage),
                    "companyId": myForm.pageState.company_id,
                    "fyear": fYear_fetch,
                };
                let resp = await fetch(
                  SERVER_URL + "/challan/print_tripwise_challan/excel",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                  }
                );
                let response = await resp.json();
                myForm.setOverlay(false);
                if (response) {
                  console.log(response, "fsdfafsfds");
                  // setData(response["data"]);
                  ex_data = response;
                  // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                }
                setLoading(false);
                download_ref.current.handleDownload();
              }}
            >
              Download as XLS
            </button>
            {ReportExcel.brokerage_summary_excel({ ex_data })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrokerageSummary;
