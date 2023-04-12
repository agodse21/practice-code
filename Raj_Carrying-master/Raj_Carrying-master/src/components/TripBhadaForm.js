import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { tripApiConfig } from "../config/apiConfig.js";
import Autosuggest from "react-autosuggest";
import {
  groupInfo,
  dataObject,
  tripBhadaTableHeader,
  tripBhadaTableItems,
  popupInfo,
} from "../config/TripBhada.js";
import { SERVER_URL } from "../config/config";
import { Prompt } from "react-router-dom";
import FormColumn from "./FormColumn.js";
import "./Form.css";
import "./TripForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import { validate } from "../config/TripBhada";
import DatePicker from "react-datepicker";

const TripBhada = ({ sessionObject }) => {
  let variablesFromSession = {
    // station_from: String(sessionObject.sessionVariables.branch_id),
    // station_from_name: sessionObject.sessionVariables.branch_name,
    bhada_paid_branch: String(sessionObject.sessionVariables.branch_id),
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    login_user_id: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
  };

  const myForm = useForm(
    "TripBhada",
    validate,
    { ...dataObject, ...variablesFromSession },
    tripApiConfig
  );

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  const checkIfFieldAlreadyExists = (fieldKey, fieldValue, arrayToCheck) => {
    let dummyObject = {};
    for (let i = 0; i < arrayToCheck.length; i++) {
      dummyObject = arrayToCheck[i];
      if (fieldKey in dummyObject && dummyObject[fieldKey] == fieldValue) {
        return true;
      }
    }
    return false;
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (myForm.pageMode == "view") {
      return "disabled";
    } else if (fieldInfo.name == "balance_bhada") {
      return "disabled";
    } else if (fieldInfo.name == "owner_name") {
      return "disabled";
    } else if (fieldInfo.name == "driver_name") {
      return "disabled";
    } else if (fieldInfo.name == "bhada_paid_branch_name") {
      return "disabled";
    } else if (fieldInfo.name == "amount") {
      return "disabled";
    } 
    else if(fieldInfo.name == "payable_declaration") {
        if(sessionObject.sessionVariables.user_id != "1" && sessionObject.sessionVariables.user_id != "220") {
            return "disabled";
        }
    }
    // else if (
    //   myForm.pageMode == "edit" &&
    //   fieldInfo.name == "bhada_paid_date"
    // ) {
    //   return "disabled";
    // } 
    else {
      return "";
    }
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "save_button" && myForm.pageMode != 'edit'){
      return false;
    }
    return true;
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let tripObj = myForm.pageState.trip_info[infoObject.idx];
    let newState = {};

    newState.trip_info = infoObject.rows;

    let oldAmount = parseInt(myForm.pageState.amount) || 0;
    let newAmount = parseInt(tripObj.balance_bhada) || 0;
    newState.amount = String(oldAmount - newAmount);

    console.log("New state", newState);
    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

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
      Enter: "trip_no",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_from",
  };

  const linkBilty = async (e) => {
    if (e.target.value == "" && e.key == "Enter") {
      myForm.makeFocusOnParticularField("save_button");
      return;
    }
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      const url = SERVER_URL + "/trip/bhada/" + e.target.value;
      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["trip_no"]: "Invalid Trip",
        });
        return;
      }
      const temp_response = await response.json();
      console.log("Hoo", temp_response);
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["trip_no"]: "Not possible to add this trip",
        });
        return;
      }
      // if (
      //   checkIfFieldAlreadyExists(
      //     "trip_no",
      //     temp_response.trip_no,
      //     myForm.pageState.trip_info
      //   )
      // ) {
      //   myForm.setPageState({
      //     ...myForm.pageState,
      //     ["trip_no"]: "Already Present",
      //   });
      //   return;
      // }
      let oldAmount = parseInt(myForm.pageState.amount) || 0;
      let newAmount = parseInt(temp_response.balance_bhada) || 0;
      const newState = {
        trip_info: [...myForm.pageState["trip_info"], temp_response],
        ["trip_no"]: "",
        amount: String(oldAmount + newAmount),
      };
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
    }
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

  const handleDelete = async () => {
    const url = SERVER_URL + "/trip/?trip_no=" + myForm.pageState.trip_no
                + "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      myForm.setPageState({ ...dataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  // let isBlocking = (myForm.pageState!=dataObject);
  return (
    <div className="challan-form-container">
      {/* <Prompt
        when={
          JSON.stringify(myForm.pageState) !=
          JSON.stringify({ ...dataObject, ...variablesFromSession })
        }
        message={
          (location) =>
            `There is some unsaved data are you sure you want to leave it? ${myForm.pageState["Vehicle No."]}, 2132, ${dataObject["Vehicle No."]}`
          // `Are you sure you want to go to ${location.pathname}`
        }
      /> */}
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
                  {popupInfo.success_title}
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">
                        {popupInfo.field_label_success}
                      </div>
                      <div className="pop-up-field-value">
                        {myForm.pageState[popupInfo.field_name_success]}
                      </div>
                    </div>
                  </div>
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
                      // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":myForm.pageState.bilty_no})
                      myForm.setPageState({
                        ...dataObject,
                        ...variablesFromSession,
                      });
                      myForm.setPageMode("write");
                      window.location.reload();
                      close();
                    } else {
                      myForm.setPageMode("write");
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

      <div className="form-header">Trip Bhada Payable</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
          <div className="form-row">
            <label className="chform-label">Station From</label>
            <Autosuggest
                id={stationFromFieldInfo["name"]}
                suggestions={myForm.suggestions}
                // onSuggestionsFetchRequested={(a) =>
                //   myForm.onSuggestionsFetchRequested(a, (b) =>
                //     myForm.suggestionFetchApi(stationFromFieldInfo, b)
                //   )
                // }
                onSuggestionsFetchRequested={(a) =>
                  myForm.onSuggestionsFetchRequestedDebounced(
                    a,
                    (b) =>
                      myForm.suggestionFetchApi(
                        stationFromFieldInfo,
                        b,
                        getAdditionalInfoForSuggestionFetch(stationFromFieldInfo)
                      )
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
                  disabled: checkDisabledCondition(stationFromFieldInfo),
                }}
              />
          </div>
          <div className="form-row">
            <label className="form-label">Trip No:</label>
            <input
              className="chform-input"
              type="text"
              name="trip_no"
              placeholder=""
              value={myForm.pageState["trip_no"]}
              onChange={myForm.handleChange}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.trip_no)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "trip_no")}
            />
            {myForm.pageMode == "view" && (
              <>
                <button
                  onClick={() => {
                    myForm.setPageMode("edit");
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    myForm.setPageState({
                      ...dataObject,
                      ...variablesFromSession,
                    });
                    window.location.reload();
                    myForm.setPageMode("write");
                  }}
                >
                  Clear
                </button>
                <button onClick={handleDelete}>Delete</button>
              </>
            )}
          </div>
          <div>
            Trip Date:{" "}
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="bhada_paid_date"
              placeholder=""
              value={myForm.pageState.bhada_paid_date}
              onChange={myForm.handleChange}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bhada_paid_date")}
              disabled={checkDisabledCondition({ name: "bhada_paid_date" })}
            />
            {/* <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.bhada_paid_date}
              onChange={(date) =>
                myForm.setPageStateByField("bhada_paid_date", date)
              }
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "bhada_paid_date")
              }
              disabled={checkDisabledCondition({ name: "bhada_paid_date" })}
            /> */}
          </div>
          {/* <div className="form-row">
            <label className="form-last_bilty">Last Trip Bhada No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_trip_bhada_no}
            </label>
          </div> */}
        </div>
        <div className="form-input-content-block-0">
          <div className="form-field-left">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-1"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={
                getAdditionalInfoForSuggestionFetch
              }
            />
          </div>
          <div className="form-field-right">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-2"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={
                getAdditionalInfoForSuggestionFetch
              }
            />
          </div>
        </div>
        {/* <div className="chform-row">
          <label className="chform-label">Trip No:</label>
          <input
            className="chform-input"
            type="text"
            name="trip_no"
            placeholder=""
            value={myForm.pageState["trip_no"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "trip_no")}
          />
        </div> */}
        <div className="table-container">
          <DynamicViewTable
            tableHeader={tripBhadaTableHeader}
            tableItems={tripBhadaTableItems}
            tableValues={myForm.pageState["trip_info"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["trip_info"]}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
            fieldMapping="trip_info"
          />
        </div>
        <div className="form-footer">
          <button
            onClick={() => {
              console.log("Values", myForm.pageState);
              console.log("Values", myForm.pageState);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button>
          {checkVisibilityCondition({"name": "save_button"}) && (
            <button
              onClick={myForm.handleSubmit}
              type="button"
              className="btn btn-primary"
              ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
            >
              Save
            </button>
          )}

          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default TripBhada;
