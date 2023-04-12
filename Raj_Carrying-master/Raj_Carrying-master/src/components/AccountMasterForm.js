import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { accountMasterApiConfig } from "../config/apiConfig.js";
import Autosuggest from "react-autosuggest";
import {
  groupInfo,
  dataObject,
  validate,
  accountGroupTableHeader,
  accountGroupTableItems,
} from "../config/accountMasterForm.js";
import { Prompt } from "react-router-dom";
import FormColumn from "./FormColumn.js";
import "./Form.css";
// import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import "../components/AccountMasterForm.css";
import { SERVER_URL } from "../config/config";

const AccountMasterForm = ({ sessionObject }) => {

    React.useEffect(() => {
        console.log(myForm.pageState);
    })

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  const checkDisabledCondition = (fieldInfo) => {
    return "";
  };

  const checkVisibilityCondition = (fieldInfo) => {
    return true;
  };

  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "AccountMaster",
    validate,
    { ...dataObject, ...variablesFromSession },
    accountMasterApiConfig
  );

  const consignorFieldInfo = {
    label: "Consignor Name",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "consignor_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getTransporterSuggestions",
    url: SERVER_URL + "/consignor/",
    suggestionKeyword: "consignor_name",
    suggestionKeywordExtra: "consignor_gst",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "consignor_id",
    suggestionChooseQueryKeywordCustom: (suggestion, pageState) => {
      return (
        String(suggestion.consignor_id) +
        "?bilty_type=" +
        String(pageState.pay_type)
      );
    },
    suggestionSchema: {
      transporter_name: "consignor_name",
      transporter_gst: "consignor_gst",
      transporter_id: "consignor_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "consignor_gst",
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  const consigorGstInfo = {
    label: "Consignor GST",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "consignor_gst",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getTransporterSuggestions",
    url: SERVER_URL + "/consignor/",
    suggestionKeyword: "consignor_gst",
    suggestionKeywordForFetchApiArgs: "gst",
    suggestionChooseQueryKeyword: "consignor_id",
    suggestionSchema: {
      transporter_name: "consignor_name",
      transporter_gst: "consignor_gst",
      transporter_id: "consignor_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: false,
    regExpValidation:
      "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
    keyboardNavigationMap: {
      Enter: "consignee_name",
    },
    conditionalTurnOffSuggestions: (value) => {
      if (value.indexOf(".") != -1) {
        return true;
      } else {
        return false;
      }
    },
    idClearanceNeeded: "consignor_id",
  };

  const selectAll = () => {
    let arrayForBranch = [];
    for (let i=0; i< groupInfo["group-3"].length; i++){
      arrayForBranch.push(String(groupInfo["group-3"][i].key));
    }
    console.log("Array for branch", arrayForBranch);
    myForm.setPageStateByField("branch_info",arrayForBranch);
  };

  const linkBilty = async (e) => {
    if (e.key == "Enter") {
      if (myForm.pageState.consignor_id != "") {
        // if (
        //   checkIfFieldAlreadyExists(
        //     "item_id",
        //     myForm.pageState.item_id,
        //     myForm.pageState.rate_info
        //   )
        // ) {

        //   myForm.setPageState({
        //     ...myForm.pageState,
        //     ["item_name"]: "Already Present",
        //   });
        //   myForm.makeFocusOnParticularField("item_name");
        //   return;
        // }
        const url =
          SERVER_URL + "/transporter/group/" + myForm.pageState.consignor_id;
        //   + "&companyId=" + myForm.pageState.company_id;
        const response = await fetch(url);
        if (!response.ok) {
          let objectToSave = {
            consignor_gst: "",
            consignor_id: "",
            consignor_name: "",
          };
          myForm.setPageState({
            ...myForm.pageState,
            ...objectToSave,
          });
          const temp_error = await response.json();
          if ("detail" in temp_error) {
            myForm.setPageMode("error");
            myForm.setPopupError(temp_error.detail);
          } else {
            myForm.setPageMode("error");
            myForm.setPopupError("Invalid Party");
          }
          return;
        }
        let dummyObject = {
          id: myForm.pageState.consignor_id,
          name: myForm.pageState.consignor_name,
          gst: myForm.pageState.consignor_gst,
        };
        let objectToSave = {
          company_info: [...myForm.pageState.company_info, dummyObject],
          consignor_gst: "",
          consignor_id: "",
          consignor_name: "",
        };
        myForm.setPageState({
          ...myForm.pageState,
          ...objectToSave,
        });
        myForm.makeFocusOnParticularField("consignor_name");
        return;
      }
      myForm.makeFocusOnParticularField("save_button");
    }
  };

  const handleCheckBoxChange = (arr) => {
    const { name, value } = arr.target;
    if (arr.target.checked) {
      myForm.setPageStateByField(name, [...myForm.pageState[name], value]);
    } else {
      const rows = [...myForm.pageState[name]];
      const index = myForm.pageState[name].indexOf(value);
      rows.splice(index, 1);
      myForm.setPageStateByField(name, rows);
    }
  };
  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
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
                  <div>Account Master Saving Successful </div>
                ) : (
                  <div>Error In Account Master Module </div>
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
                  Account Master Saved Successfully:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Account Name</div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.name}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in Account Master with the following info:-
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

      <div className="form-header">Account Master</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-input-content-block-0">
          <div className="form-field-left-1">
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
            <div className="table-container-2">
              <div className={consignorFieldInfo["className"]}>
                <label className={consignorFieldInfo["labelClassName"]}>
                  {consignorFieldInfo["label"]} 
                </label>
                <Autosuggest
                  id={consignorFieldInfo["name"]}
                  suggestions={myForm.suggestions}
                  onSuggestionsFetchRequested={(a) =>
                    myForm.onSuggestionsFetchRequested(a, (b) =>
                      myForm.suggestionFetchApi(
                        consignorFieldInfo,
                        b,
                        getAdditionalInfoForSuggestionFetch(consignorFieldInfo)
                      )
                    )
                  }
                  onSuggestionsClearRequested={() =>
                    myForm.onSuggestionsClearRequested(consignorFieldInfo)
                  }
                  getSuggestionValue={(suggestion) =>
                    suggestion[consignorFieldInfo.suggestionKeyword]
                  }
                  onSuggestionSelected={(a, b) =>
                    myForm.getSuggestionValue(
                      b.suggestion,
                      consignorFieldInfo,
                      myForm.performSuggestions,
                      myForm.updatePageStateForGetSuggestion
                    )
                  }
                  renderSuggestion={(a) =>
                    myForm.renderSuggestion(a, consignorFieldInfo)
                  }
                  highlightFirstSuggestion={true}
                  ref={(a) => myForm.storeInputReference(a, false)}
                  inputProps={{
                    placeholder: consignorFieldInfo["placeholder"],
                    value: String(myForm.pageState[consignorFieldInfo["name"]]),
                    onChange: (a, b) => {
                      myForm.onChangeAutoSuggest(a, b, consignorFieldInfo);
                    },
                    onBlur: () => myForm.onblurValidator(consignorFieldInfo),
                    onKeyPress: linkBilty,
                    disabled: checkDisabledCondition(consignorFieldInfo),
                  }}
                />
              </div>
              <div className={consigorGstInfo["className"]}>
                <label className={consigorGstInfo["labelClassName"]}>
                  {consigorGstInfo["label"]}
                </label>
                <Autosuggest
                  id={consigorGstInfo["name"]}
                  suggestions={myForm.suggestions}
                  onSuggestionsFetchRequested={(a) =>
                    myForm.onSuggestionsFetchRequested(a, (b) =>
                      myForm.suggestionFetchApi(
                        consigorGstInfo,
                        b,
                        getAdditionalInfoForSuggestionFetch(consigorGstInfo)
                      )
                    )
                  }
                  onSuggestionsClearRequested={() =>
                    myForm.onSuggestionsClearRequested(consigorGstInfo)
                  }
                  getSuggestionValue={(suggestion) =>
                    suggestion[consigorGstInfo.suggestionKeyword]
                  }
                  onSuggestionSelected={(a, b) =>
                    myForm.getSuggestionValue(
                      b.suggestion,
                      consigorGstInfo,
                      myForm.performSuggestions,
                      myForm.updatePageStateForGetSuggestion
                    )
                  }
                  renderSuggestion={(a) =>
                    myForm.renderSuggestion(a, consigorGstInfo)
                  }
                  highlightFirstSuggestion={true}
                  ref={(a) => myForm.storeInputReference(a, false)}
                  inputProps={{
                    placeholder: consigorGstInfo["placeholder"],
                    value: String(myForm.pageState[consigorGstInfo["name"]]),
                    onChange: (a, b) => {
                      myForm.onChangeAutoSuggest(a, b, consigorGstInfo);
                    },
                    onBlur: () => myForm.onblurValidator(consigorGstInfo),
                    onKeyPress: (a) =>
                      myForm.onKeyPressForKeyNav(a, consigorGstInfo),
                    disabled: checkDisabledCondition(consigorGstInfo),
                  }}
                />
              </div>

              <DynamicViewTable
                tableHeader={accountGroupTableHeader}
                tableItems={accountGroupTableItems}
                tableValues={myForm.pageState["company_info"]}
                setPageStateByField={myForm.setPageStateByField}
                pageStateArray={myForm.pageState["company_info"]}
                fieldMapping="company_info"
              />
            </div>
          </div>
          <div className="form-field-right">
            <div id="party-belongs-to-branch-div">
              <label id="party-belongs-to-branch-label">
                Party Belongs To Branch
              </label>
              <div id="break"></div>
              <div id="party-belongs-to-branch-check">
                <button onClick={selectAll}>Select all</button>
                <div id="branch-name-div">
                  {groupInfo["group-3"].map(function (info) {
                    return (
                      <React.Fragment>
                        <label>
                          <input
                            id="party-belongs-checkbox"
                            name="branch_info"
                            type="checkbox"
                            checked={myForm.pageState.branch_info.includes(
                              String(info["key"])
                            )}
                            value={info["key"]}
                            onChange={handleCheckBoxChange}
                          />
                          {info["branch_name"]}
                        </label>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
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

export default AccountMasterForm;
