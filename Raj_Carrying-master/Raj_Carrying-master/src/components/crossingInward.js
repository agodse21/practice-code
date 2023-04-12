import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./CrossingInward.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/crossingInward";
import { crossingInApiConfig } from "../config/apiConfig.js";
import FormColumn from "./FormColumn.js";
import { dataObject, validate } from "../config/crossingInward.js";

import { groupInfo } from "../config/crossingInward.js";
import DatePicker from "react-datepicker";

import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";

const CrossingInwardForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "CROSSINGIN",
    validate,
    { ...dataObject, ...variablesFromSession },
    crossingInApiConfig
  );

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  const transporterFieldInfo = {
    label: "Transporter",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "transporter_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getTransporterSuggestions",
    url: SERVER_URL + "/transporter/",
    suggestionKeyword: "transporter_name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "transporter_id",
    suggestionSchema: {
      transporter_name: "transporter_name",
      suffix: "suffix",
      transporter_id: "transporter_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: false,
    regExpValidation: "^(?:[0-9]+d*|d)$",
    keyboardNavigationMap: {
      Enter: "memo_no",
    },
    idClearanceNeeded: "consignee_id",
  };

  const linkBilty = async (e) => {
    // if (myForm.pageState["Bilty No"] == "" && e.key == "Enter") {
    //   myForm.makeFocusOnParticularField("transporter_freight");
    //   return;
    // }
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      const url =
        SERVER_URL +
        "/crossing_inward/transporter/" +
        String(myForm.pageState.transporter_id) +
        "?date=" +
        myForm.pageState.input_date +
        "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
    
      const response = await fetch(url);

      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "Invalid Bilty",
        });
        return;
      }
      const temp_response = await response.json();
      console.log("Temp response", temp_response);
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "Not possible to add this bilty",
        });
        return;
      }

      let partyName = "";
      let total_amount = 0;
      let newState = {
        bilty_ids: temp_response.bilty_info,
      };
      let tran_freight = 0;
      let our_freight = 0;
      let to_pay = 0;
      let paid = 0;
      let pkgs = 0;
      let biltyObj = {};
      for (let i = 0; i < newState.bilty_ids.length; i++) {
        biltyObj = newState.bilty_ids[i];
        tran_freight += parseInt(biltyObj.transporter_freight) || 0;
        our_freight += parseInt(biltyObj.total_amount) || 0;
        if (biltyObj.pay_type == "1") {
          to_pay += parseInt(biltyObj.transporter_freight) || 0;
        } else {
          paid += parseInt(biltyObj.transporter_freight) || 0;
        }
        pkgs += parseInt(biltyObj.no_of_package) || 0;
      }
      newState.transporter_freight = String(tran_freight);
      newState.our_freight = String(our_freight);
      newState.pkgs = String(pkgs);
      newState.to_pay = String(to_pay);
      newState.paid = String(paid);
      newState.balance = String(our_freight - to_pay);

      console.log("New state", newState);
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.makeFocusOnParticularField("save_button");
    }
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return false;
      } 
      else if (myForm.pageMode == "view" && fieldInfo.name == "save_button" && (myForm.pageMode=="view" || myForm.pageMode=="edit")) {
        return false;
    } 
    else if (
      fieldInfo.name == "cheque_no" &&
      myForm.pageState.payment_type == "1"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (fieldInfo.name == "transporter_freight") {
      return "disabled";
    }
    if (fieldInfo.name == "to_pay") {
      return "disabled";
    }
    if (fieldInfo.name == "paid") {
      return "disabled";
    }
    if (fieldInfo.name == "our_freight") {
      return "disabled";
    }
    if (fieldInfo.name == "balance") {
      return "disabled";
    }
    if (fieldInfo.name == "pkgs") {
      return "disabled";
    }
    if (fieldInfo.name == "crossing_bill_no") {
      return "disabled";
    } else if (myForm.pageMode == "view") {
      return "disabled";
    } else if (
      myForm.pageMode == "edit" &&
      fieldInfo.name == "transporter_name"
    ) {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "disabled";
    } else {
      return "";
    }
  };

  const handleDelete = async () => {
    const url =
      SERVER_URL +
      "/crossing_inward/?crossing_inward_id=" +
      myForm.pageState.id + 
      "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;
      
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      // myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.bilty_ids[infoObject.idx];
    console.log("Bilty objecy", biltyObj);
    let newState = {};
    let tran_freight = parseInt(myForm.pageState.transporter_freight) || 0;
    let our_freight = parseInt(myForm.pageState.our_freight) || 0;
    let to_pay = parseInt(myForm.pageState.to_pay) || 0;
    let paid = parseInt(myForm.pageState.paid) || 0;
    let pkgs = parseInt(myForm.pageState.pkgs) || 0;

    tran_freight -= parseInt(biltyObj.transporter_freight) || 0;
    our_freight -= parseInt(biltyObj.total_amount) || 0;
    if (biltyObj.pay_type == "1") {
      to_pay -= parseInt(biltyObj.transporter_freight) || 0;
    } else {
      paid -= parseInt(biltyObj.transporter_freight) || 0;
    }
    pkgs -= parseInt(biltyObj.no_of_package) || 0;

    newState.transporter_freight = String(tran_freight);
    newState.our_freight = String(our_freight);
    newState.pkgs = String(pkgs);
    newState.to_pay = String(to_pay);
    newState.paid = String(paid);
    newState.balance = String(our_freight - to_pay);
    newState.bilty_ids = infoObject.rows;

    console.log("New state", newState);
    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

  return (
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
                  <div>Crossing Challan Saving Successful </div>
                ) : (
                  <div>Error In Crossiong Challan Inward Module </div>
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
                  Crossing challan Inward is successfully created with the
                  following info:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">
                        Crossing Inward No.
                      </div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.crossing_in_no}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in crossing Inward module with the following info:-
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
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          open={myForm.deletePopup}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">Are you sure want to delete?</div>
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    handleDelete();
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  Yes
                </button>
                <button
                  className="pop-up-button"
                  onClick={() => {
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div className="form-header">Crossing Challan Inward</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Crossing Challan No:</label>
            <input
              className="form-input"
              type="text"
              name="crossing_in_no"
              placeholder=""
              value={myForm.pageState.crossing_in_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.crossing_in_no)
              }
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "crossing_in_no")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
            {myForm.internalValidationErrors["challan_no"] && (
              <p>{myForm.internalValidationErrors["challan_no"]}</p>
            )}
            {myForm.pageMode == "view" && (
              <>
                <button
                  onClick={() => {
                    myForm.setPageMode("edit");
                  }}
                >
                  Edit
                </button>
                {/* <button
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
                <button onClick={handleDelete}>Delete</button> */}
              </>
            )}
          </div>
          <div className="form-row">
            <label className="form-label">Transprter Name</label>
            <Autosuggest
              id={transporterFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(transporterFieldInfo, b)
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
                //placeholder: info["name"],
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
                disabled: checkDisabledCondition(transporterFieldInfo),
              }}
            />
          </div>
          <div className="chform-row">
            {/* <label className="chform-label">Station To</label>
          <input
            className="chform-input"
            type="text"
            name="Bilty No"
            placeholder=""
            value={myForm.pageState["Bilty No"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
          /> */}
          </div>
          <div className="form-row">
            <label className="form-label">Memo No </label>
            <input
              className="form-input"
              type="text"
              name="memo_no"
              placeholder=""
              value={myForm.pageState.memo_no}
              onChange={myForm.handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("input_date");
                }
              }}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "memo_no")
              }
            />
          </div>
          <div>
            Crossing Inward Challan Date:{" "}
            {/* <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                console.log("Here");
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularFieldForItem(
                    "eway_bill_no",
                    0,
                    "eway_bill_no"
                  );
                }
              }}
            /> */}
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last Crossing Inward No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_crossing_no}
            </label>
          </div>
        </div>

        <div className="table-container">
          <DynamicViewTable
            tableHeader={challanBiltyTableHeader}
            tableItems={challanBiltyTableItems}
            tableValues={myForm.pageState["bilty_ids"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["bilty_ids"]}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
            fieldMapping="bilty_ids"
          />
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
          <div className="form-field-left">
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
          {checkVisibilityCondition({ name: "save_button" }) && (
            <button
              onClick={myForm.handleSubmit}
              type="button"
              className="btn btn-primary"
              ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
            >
              Save
            </button>
          )}

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
            New
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
          )}
          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default CrossingInwardForm;
