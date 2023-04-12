import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import { dataObject, validate } from "../config/OutstandingPartywiseConfig";
import useForm from "./useForm";
import { BrokerageSummaryApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation } from "react-router-dom";
import getLoggedinFyear from "../utils/getLoggedinFyear";
let ex_data = [];

function OutstandingPartywise({ sessionObject }) {
    const fyearObj = getLoggedinFyear(sessionObject);
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
    myForm.refStoreObject.current.print_button.blur();

    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    let url = SERVER_URL + "/tbb_billing_statement/get_party_wise_print/?from_date="
    +String(myForm.pageState.date_from)
    +"&to_date="+String(myForm.pageState.date_to)
    + "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

    
    console.log("checkpage",myForm.pageState)
    if (myForm.pageState.station_to != null && myForm.pageState.station_to != ""){
      url += "&branch="+String(myForm.pageState.station_to)
    }
    if (myForm.pageState.consignor_id != null && myForm.pageState.consignor_id != ""){
      url += "&party_id="+String(myForm.pageState.consignor_id)
    }
    if (myForm.pageState.report_type == "1" || myForm.pageState.report_type == "0"){
      url += "&is_paid="+String(myForm.pageState.report_type)
    }

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(apiInputData),
    }).then((r) => r.blob());
    myForm.setOverlay(false);
    print({
      printable: URL.createObjectURL(response),
      type: "pdf",
      showModal: false,
    });
  };

  let transporterFieldInfo = {
    label: "Consignor Name",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "consignor_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getConsignorSuggestions",
    url: SERVER_URL + "/consignor/",
    suggestionKeyword: "consignor_name",
    suggestionKeywordExtra: "consignor_gst",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "consignor_id",
    suggestionSchema: {
      consignor_name: "consignor_name",
      consignor_gst: "consignor_gst",
      consignor_id: "consignor_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "print_button",
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
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
      Enter: "consignor_name",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_to",
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
      let additionalInfoObject = {};
      if(fieldInfoObject.name == "consignor_name") {
          additionalInfoObject.is_active = "1";
          return additionalInfoObject;
      }
      return null;
  }

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
        <div className="form-header">Outstanding Partywise</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Date From: </label>
            <input
              autoFocus={true}
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
                  myForm.makeFocusOnParticularField("report_type");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Report Type </label>
            <select
              className="form-input"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "report_type");
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "report_type")}
              // disabled={checkDisabledCondition({ name: "report_type" })}
              value={myForm.pageState["report_type"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("station_to_name");
                }
              }}
            >
              <option value="1" key="1">
                PAID
              </option>
              <option value="0" key="0">
                UNPAID
              </option>
              <option value="2" key="2">
                ALL
              </option>
            </select>
          </div>
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
            <label className="form-label">Party Name</label>
            <Autosuggest
              id={transporterFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(
                      transporterFieldInfo, 
                      b,
                      getAdditionalInfoForSuggestionFetch(transporterFieldInfo)
                    )
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(transporterFieldInfo)
              }
              getSuggestionValue={(suggestion) =>
                suggestion[transporterFieldInfo.suggestionKeyword]
              }
              onSuggestionSelected={(a, b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  transporterFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, transporterFieldInfo)
              }
              highlightFirstSuggestion={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: partyGstFieldInfo["name"],
                value: String(myForm.pageState[transporterFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, transporterFieldInfo);
                },
                onBlur: () => {
                  transporterFieldInfo["toValidate"]
                    ? myForm.onblurValidator(transporterFieldInfo)
                    : {};
                },
                onKeyPress: (a) =>
                  myForm.onKeyPressForKeyNav(a, transporterFieldInfo),
                // disabled: checkDisabledCondition(transporterFieldInfo),
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
          {/* <div className="form-footer">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default OutstandingPartywise;
