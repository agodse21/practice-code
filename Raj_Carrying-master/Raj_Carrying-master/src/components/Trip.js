import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { tripApiConfig } from "../config/apiConfig.js";
import {
  groupInfo,
  dataObject,
  tripChallanTableItems,
  tripChallanTableHeader,
  popupInfo,
} from "../config/tripConfig.js";
import { SERVER_URL } from "../config/config";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./TripForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import { validate } from "../config/tripConfig";
import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";
import print from "print-js";
import { useLocation } from "react-router-dom";


const Trip = ({ sessionObject }) => {
    const location = useLocation();
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    login_user_id: String(sessionObject.sessionVariables.user_id),
    role_id: String(sessionObject.sessionVariables.role_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "Trip",
    validate,
    { ...dataObject, ...variablesFromSession },
    tripApiConfig
  );

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };



  React.useEffect(() => {
      console.log(myForm.pageState);
  })

  React.useEffect(() => {
    // console.log(myForm.pageState);
    const defaultTripNo = location.state ?? "";
    console.log(defaultTripNo);
    if(defaultTripNo != "") {
        myForm.setPageState((oldPageState) =>({
            ...oldPageState,
            "trip_no": defaultTripNo,
        }))

        const fakeKey = { key: "Enter" }
        myForm.getPageOnKeyEnter(fakeKey, defaultTripNo);
    }
}, []);

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
    // console.log("field info", fieldInfo, myForm.pageState.role_id)
    if (fieldInfo.name == "edit_button" && myForm.pageState.role_id != "1") {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (myForm.pageMode == "view") {
      return "disabled";
    } else if (fieldInfo.name == "balance_bhada" || fieldInfo.name == "tds_amount" || fieldInfo.name == "net_balance") {
      return "disabled";
    } else if (fieldInfo.name == "bhada_paid_branch_name") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date" && myForm.pageState.role_id != 1) {
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
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      // TODO: hit api here, changes for bilty_info
      const url = SERVER_URL + "/challan/trip_in/" + e.target.value
                    + "?fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
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
    const url = SERVER_URL + "/trip/?trip_no=" + myForm.pageState.trip_no
                + "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;
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

      <div className="form-header">Bhada Chitthi</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Trip No:</label>
            <input
              className="form-input"
              type="text"
              name="trip_no"
              placeholder=""
              value={myForm.pageState.trip_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.trip_no)
              }
              disabled={checkDisabledCondition({ name: "trip_no" })}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "trip_no")}
            />
            {myForm.internalValidationErrors["trip_no"] && (
              <p>{myForm.internalValidationErrors["trip_no"]}</p>
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
          </div>
          <div>
            <label className="form-label">Trip Date:</label>
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              // onKeyPress={(a) => {
              //   console.log("Here");
              //   if (a.key == "Enter") {
              //     myForm.makeFocusOnParticularField("consignor_name");
              //   }
              // }}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last Trip No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_trip_no}
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
        <div className="chform-row">
          <label className="chform-label">Challan No:</label>
          <input
            className="chform-input"
            type="text"
            name="No"
            placeholder=""
            value={myForm.pageState["No"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "challan_no")}
          />
        </div>
        <div className="table-container">
          <DynamicViewTable
            tableHeader={tripChallanTableHeader}
            tableItems={tripChallanTableItems}
            tableValues={myForm.pageState["challan_ids"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["challan_ids"]}
            fieldMapping="challan_ids"
          />
        </div>
        <div className="form-footer">
          <button
            onClick={(e) => {
              console.log("Values", myForm.pageState);
              console.log("Values", myForm.pageState);
              myForm.setServerPrintNeeded(true);
              myForm.handleSubmit(e);
            }}
            type="button"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "print_button")}
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
          <button
            onClick={async () => {
              let url =
                SERVER_URL +
                "/trip/multiple_print/" +
                String(myForm.pageState.trip_no) +
                "?branch_id=" +
                String(myForm.pageState.created_from) + 
                "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;

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
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trip;
