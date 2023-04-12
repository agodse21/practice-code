import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import { dataObject, validate } from "../config/OpeningBalance";
import useForm from "./useForm";
import { crossingOutApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation } from "react-router-dom";
let ex_data = [];
import Popup from "reactjs-popup";

function OpeningBalance({ sessionObject }) {
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    branch_account_name: String(
      sessionObject.sessionVariables.branch_account_name
    ),
    branch_account_id: String(sessionObject.sessionVariables.branch_account_id),
    // company_id: "1",
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

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };
  const popupInfo = {
    error_header: "Error In Challan Module ",
    success_header: "Opening Balance Successfullty ",
    success_title: "",
    field_label_success: "",
    field_name_success: "challan_no",
    error_title: "Error in Challan module with the following info:-",
    field_label_error: "Error:",
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    // console.log("DSFDSFD", name, value)
    setAmountType(value);
  };

  useEffect(() => {

  }, [])

  const handlePrint = async () => {
    myForm.setOverlay(true);
    let url = SERVER_URL + "/account_trans/opening_balance/";
    let apiInputData = {
      branch_id: String(sessionObject.sessionVariables.branch_id),
      opening_balance: String(myForm.pageState.balance),
      type: String(myForm.pageState.balance_type),
      companyId: (myForm.pageState.company_id),
      fyear: myForm.pageState.fYear,
    };

    if (myForm.pageState.consignor_id != "") {
      apiInputData.party_id = myForm.pageState.consignor_id;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiInputData),
    });
    if (!response.ok) {
      myForm.setOverlay(false);
      myForm.setPreviousPageMode(myForm.pageMode);
      myForm.setPageMode("error");
      myForm.setPopupError("Opening balance already exist.");
      return;
    }
    myForm.setPageMode("submitted");
    window.location.reload();
    const resp = await response.json();
  };

  let stationToFieldInfo = {
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
      Enter: "balance_type",
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
    onKeyPressEvent: async (inputObject)=>{
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      inputObject.setOverlay(true);
      console.log("input object",inputObject);
      const url =
      SERVER_URL +
      "/account_trans/opening_balance/" + inputObject.pageState.station_from +'/'+ inputObject.pageState.consignor_id
        + "?companyId=" + inputObject.pageState.company_id
        + "&fyear=" + fYear_fetch;

      console.log('url of opening balance',url);
      const response = await fetch(url);
      console.log("okkkkkkkkkkkk",response);
      if (!response.ok) {
        inputObject.setOverlay(false);
        return;
      }
      const temp_response = await response.json();
      console.log('temp resp',temp_response);
      if (Object.keys(temp_response).length >0){
      inputObject.setPageState(
        {
            ...inputObject.pageState,
            "balance": temp_response.balance,
            "balance_type": temp_response.balance_type,
        }
    )
      }
      else{
        inputObject.setPageState(
          {
              ...inputObject.pageState,
              "balance": 0,
              "balance_type": 'dr',
          }
      ) 
      }
      inputObject.setOverlay(false);
      return;

    }
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    let additionalInfoObject = {};
    if(fieldInfoObject.name == "consignor_name") {
        additionalInfoObject.is_account_related = "1";
        return additionalInfoObject;
    }
    return null;
  }

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
        <div>
          <Popup
            // trigger={<button className="button"> Open Modal </button>}
            open={myForm.pageMode == "submitted" || myForm.pageMode == "error"}
            modal
            contentStyle={contentStyle}
            closeOnDocumentClick={false}
          >
            {(close) => (
              <div className="pop-up-container">
                <div className="pop-up-header">
                  {" "}
                  {myForm.pageMode == "submitted" ? (
                    <div>{popupInfo.success_header}</div>
                  ) : (
                    <div>{popupInfo.error_header}</div>
                  )}
                  <div>
                    <a className="pop-up-close btn" onClick={close}>
                      &times;
                    </a>
                  </div>
                </div>
                {myForm.pageMode == "submitted" ? (
                  <div className="pop-up-content">
                  </div>
                ) : (
                  <div className="pop-up-content">
                    {popupInfo.error_title}
                    <br />
                    <div className="pop-up-fields">
                      <div className="pop-up-field">
                        <div className="pop-up-field-label">
                          {popupInfo.field_label_error}
                        </div>
                        <div className="pop-up-field-value">
                          {myForm.popupError}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="pop-up-actions">
                  <button
                    className="pop-up-button"
                    onClick={() => {
                      if (myForm.pageMode == "submitted") {
                        // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":pageState.bilty_no})
                        // setPageState({
                        //   ...dataObject,
                        //   ...variablesFromSession,
                        // });
                        setPageMode("write");
                        window.location.reload();
                        close();
                      } else {
                        if (myForm.previousPageMode != "") {
                          myForm.setPageMode(myForm.previousPageMode);
                          myForm.setPreviousPageMode("");
                        } else {
                          myForm.setPageMode("write");
                        }
                        close();
                      }
                    }}
                  >
                    Okay
                  </button>
                </div>
              </div>
            )}
          </Popup>
        </div>
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
        <div className="form-header">Opening Balance</div>
        <div className="form-marfatiya-wise">
        <div className="form-row">
            <label className="form-label">Party Name </label>
            <Autosuggest
              id={stationToFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(
                      stationToFieldInfo, 
                      b,
                      getAdditionalInfoForSuggestionFetch(stationToFieldInfo),
                    )
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
                autoFocus: true,
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
            <label className="form-label">Balance Type</label>
            <select
              className="form-input"
              type="text"
              name="balance_type"
              placeholder=""
              value={myForm.pageState.balance_type}
              onChange={myForm.handleChange}
              // disabled="disabled"
              onKeyPress={(a) => {
                
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("balance");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "balance_type")}
            >
              <option value="dr" key="dr">
                {" "}
                DR
              </option>
              <option value="cr" key="cr">
                CR
              </option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Balance </label>
            <input
              className="form-input"
              type="text"
              name="balance"
              placeholder=""
              value={myForm.pageState.balance}
              onChange={handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("save_button");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "balance")}
            />
          </div>
          <div className="form-actions">
            <button
              onClick={handlePrint}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "save_button")
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

export default OpeningBalance;
