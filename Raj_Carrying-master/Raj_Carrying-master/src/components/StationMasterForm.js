import React from "react";
import Popup from "reactjs-popup";
import { stationMasterApiConfig } from "../config/apiConfig.js";
import {
  groupInfo,
  dataObject,
  validate,
} from "../config/stationMasterForm.js";
import FormColumn from "./FormColumn.js";
import { Prompt } from "react-router-dom";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import Autosuggest from "react-autosuggest";
import { SERVER_URL } from "../config/config.js";

const StationMasterForm = ({ sessionObject }) => {
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
  };

  const myForm = useForm(
    "StationMaster",
    validate,
    { ...dataObject, ...variablesFromSession },
    stationMasterApiConfig
  );

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    // console.log(fieldInfoObject.name);
    if(fieldInfoObject.name == "to_pay_account_name") {
        let additionalInfoObject = {};
        additionalInfoObject.is_account_related = "1";
        return additionalInfoObject;
    }
    return null;
  };

  const checkDisabledCondition = (fieldInfo) => {
    return ""
  };

  const checkVisibilityCondition = (fieldInfo) => {
    return true
  };

  React.useEffect(() => {
      console.log(myForm.pageState);
  })

  let partyNameFieldInfo = {
    label: "Party Name",
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
        Enter: "save_button",
      },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };
  let toPayAccountFieldInfo = {
    label: "",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "to_pay_account_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getConsignorSuggestions",
    url: SERVER_URL + "/consignor/",
    suggestionKeyword: "consignor_name",
    suggestionKeywordExtra: "consignor_gst",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "consignor_id",
    suggestionSchema: {
      consignor_name: "to_pay_account_name",
    //   consignor_gst: "consignor_gst",
      consignor_id: "to_pay_account_id",
        // to_pay_account_name: "consignor_name",
        // to_pay_account_id: "consignor_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
        Enter: "pincode",
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  return (
    <div className="challan-form-container">
      {/* <Prompt
        when={
          JSON.stringify(myForm.pageState) !=
          JSON.stringify({
            ...dataObject,
            ...variablesFromSession,
          })
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
                  <div>Station Saving Successful </div>
                ) : (
                  <div>Error In Station Module </div>
                )}
                <div>
                  <a className="pop-up-close btn" onClick={close}>
                    &times;
                  </a>
                </div>
              </div>
              {myForm.pageMode == "submitted" ? (
                <div className="pop-up-content">
                  {" "}
                  Station Master Saved Successfully:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Station Name</div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.name}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in Station Master with the following info:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Error:</div>
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

      <div className="form-header">Station Master</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">
              Id: {myForm.pageState.branch_id}
            </label>
            <label className="form-label">Is Branch?:</label>
            <select
              className="chform-input-suffix"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "is_branch");
              }}
              name="is_branch"
              ref={(a) => myForm.storeInputReferenceForSelect(a, "is_branch")}
              // disabled={checkDisabledCondition({ name: "bilty_type" })}
              value={myForm.pageState["is_branch"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("name");
                }
              }}
            >
              <option value="1" key="Y">
                Y
              </option>
              <option value="0" key="N">
                N
              </option>
            </select>
          </div>
        </div>
        <div className="form-input-content-block-0">
          <div className="form-field-left">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-1"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            />
          </div>
          <div className="form-field-right">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-2"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            />
            <>
            <div className="form-row">
            <label className="form-label">Freight Bill Account</label>
            <Autosuggest
                id={partyNameFieldInfo["name"]}
                suggestions={myForm.suggestions}
                onSuggestionsFetchRequested={(a) =>
                    myForm.onSuggestionsFetchRequestedDebounced(
                    a,
                    (b) =>
                        myForm.suggestionFetchApi(
                        partyNameFieldInfo,
                        b,
                        getAdditionalInfoForSuggestionFetch(partyNameFieldInfo)
                        )
                    )
                }
                onSuggestionsClearRequested={() =>
                    myForm.onSuggestionsClearRequested(partyNameFieldInfo)
                }
                getSuggestionValue={(suggestion) =>
                    suggestion[partyNameFieldInfo.suggestionKeyword]
                }
                onSuggestionSelected={(a, b) =>
                    myForm.getSuggestionValue(
                    b.suggestion,
                    partyNameFieldInfo,
                    myForm.performSuggestions,
                    myForm.updatePageStateForGetSuggestion
                    )
                }
                renderSuggestion={(a) =>
                    myForm.renderSuggestion(a, partyNameFieldInfo)
                }
                highlightFirstSuggestion={true}
                ref={(a) => myForm.storeInputReference(a, false)}
                inputProps={{
                    placeholder: partyNameFieldInfo["placeholder"],
                    value: String(myForm.pageState[partyNameFieldInfo["name"]]),
                    onChange: (a, b) => {
                    myForm.onChangeAutoSuggest(a, b, partyNameFieldInfo);
                    },
                    onBlur: () => {
                    partyNameFieldInfo["toValidate"]
                        ? myForm.onblurValidator(partyNameFieldInfo)
                        : {};
                    },
                    onKeyPress: (a) =>
                    myForm.onKeyPressForKeyNav(a, partyNameFieldInfo),
                    // disabled: checkDisabledCondition(partyNameFieldInfo),
                }}
            />
            </div>
    {/* {myForm.internalValidationErrors[partyNameFieldInfo["name"]] && (
      <p>
        {myForm.internalValidationErrors[partyNameFieldInfo["name"]]}
      </p>
    )} */}
      </>
          </div>
        </div>
        <div className="form-footer">
          <button
            onClick={() => {
              console.log("Values", myForm.pageState);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button>
          <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default StationMasterForm;
