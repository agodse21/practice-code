import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { vehicleRegisterApiConfig } from "../config/apiConfig.js";
import {
  groupInfo,
  dataObject,
  popupInfo,
} from "../config/vehicleRegisterConfig.js";
import { SERVER_URL } from "../config/config";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./TripForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import { validate } from "../config/vehicleRegisterConfig";
import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";
import print from "print-js";

const VehicleRegister = ({ sessionObject }) => {
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    role_id: String(sessionObject.sessionVariables.role_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "VehicleRegister",
    validate,
    { ...dataObject, ...variablesFromSession },
    vehicleRegisterApiConfig
  );

    // React.useEffect(() => {
    //     myForm.makeFocusOnParticularField("vr_no")
    // }, [])

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

  const checkVisibilityCondition = (fieldInfo) => {
    //   console.log(myForm.pageState.role_id);
    if (fieldInfo.name == "edit_button" && (myForm.pageState.role_id != "1" && myForm.pageState.role_id != "2")) {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (myForm.pageMode == "view") {
      return "disabled";
    } else if (fieldInfo.name == "balance_bhada") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "disabled";
    } else {
      return "";
    }
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    let additionalInfoObject = {};
    if (fieldInfoObject.name == "station_from_name") {
      additionalInfoObject.is_branch = true;
      // additionalInfoObject.pay_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    return null;
  };

  const linkBilty = async (e) => {
    if (e.target.value == "" && e.key == "Enter") {
      myForm.makeFocusOnParticularField("save_button");
      return;
    }
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      const url = SERVER_URL + "/challan/trip_in/" + e.target.value;
      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["No"]: "Invalid Challan",
        });
        return;
      }
      const temp_response = await response.json();
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["No"]: "Not possible to add this challan",
        });
        return;
      }
      if (
        checkIfFieldAlreadyExists(
          "booking_chalan_no",
          temp_response.booking_chalan_no,
          myForm.pageState.challan_ids
        )
      ) {
        myForm.setPageState({
          ...myForm.pageState,
          ["No"]: "Already Present",
        });
        return;
      }
      const newState = {
        challan_ids: [...myForm.pageState["challan_ids"], temp_response],
        ["No"]: "",
      };
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
    }
  };

  const handleDelete = async () => {
    const url = SERVER_URL + "/vehicleregister/?vehicle_register_id=" + myForm.pageState.vehicle_register_id
                + "&companyId=" + myForm.pageState.company_id + "&fyear=" + myForm.pageState.fYear_get;
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
      </div>f
      <div className="form-header">Vehicle Register</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Register Entry No:</label>
            <input
              className="form-input"
              type="text"
              name="vr_no"
              placeholder=""
              value={myForm.pageState.vr_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              autoFocus={true}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.vr_no)
              }
              disabled={checkDisabledCondition({ name: "vr_no" })}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "vr_no")}
            />
            {myForm.internalValidationErrors["vr_no"] && (
              <p>{myForm.internalValidationErrors["vr_no"]}</p>
            )}
            {myForm.pageMode == "view" && (
              <>
                {checkVisibilityCondition({ name: "edit_button" }) && (
                  <button
                    onClick={() => {
                      myForm.setPageMode("edit");
                    }}
                  >
                    Edit
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
                  Clear
                </button>
                {/* <button onClick={handleDelete}>Delete</button> */}
              </>
            )}
            <label className="form-label">Letter No:</label>
            <input
              className="form-input"
              type="text"
              name="letter_no"
              placeholder=""
              value={myForm.pageState.letter_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("vehicle_no");
                }
              }}
              disabled={checkDisabledCondition({ name: "letter_no" })}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "letter_no")}
            />
          </div>
          <div>
            Entry Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last Entry No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_entry_no}
            </label>
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
        {/* <div className="table-container">
          <DynamicViewTable
            tableHeader={tripChallanTableHeader}
            tableItems={tripChallanTableItems}
            tableValues={myForm.pageState["challan_ids"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["challan_ids"]}
            fieldMapping="challan_ids"
          />
        </div> */}
        <div className="form-footer">
          <button
            onClick={(e) => {
              console.log("Values", myForm.pageState);
              console.log("Values", myForm.pageState);
              // myForm.setServerPrintNeeded(true);
              // myForm.handleSubmit(e);
            }}
            type="button"
            // ref={(a) => myForm.storeInputReferenceForSelect(a, "print_button")}
            className="btn btn-primary"
          >
            Print
          </button>
          <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
          )}
          {/* <button
            onClick={async () => {
              let url =
                SERVER_URL +
                "/trip/multiple_print/" +
                String(myForm.pageState.trip_no) +
                "?branch_id=" +
                String(myForm.pageState.created_from);
              let response = await fetch(url, {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }).then((r) => r.blob());
              console.log("response", response);
              print({
                printable: URL.createObjectURL(response),
                type: "pdf",
                showModal: false,
              });
            }}
            type="button"
            className="btn btn-primary"
            // ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Print All Memo
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default VehicleRegister;
