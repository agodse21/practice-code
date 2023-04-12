import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./TripInward.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanForm.js";
import { crossingInApiConfig } from "../config/apiConfig.js";
import {
  dataObject,
  tripTableHeader,
  tripTableItems,
  validate
} from "../config/TripInward.js";

import DatePicker from "react-datepicker";

import { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";

const TripInwardForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
  };

  const myForm = useForm(
    "TRIPIN",
    validate,
    { ...dataObject, ...variablesFromSession },
    crossingInApiConfig
  );

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  const linkBilty = async (e) => {
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      const url =
        SERVER_URL +
        "/trip/all_info/" +
        String(myForm.pageState.trip_no) +
        "?branch_id=" +
        myForm.pageState.created_from;
      const response = await fetch(url);

      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["trip_no"]: "Invalid Trip",
        });
        return;
      }
      const temp_response = await response.json();
      console.log("Temp response", temp_response);
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["trip_no"]: "Not possible to add this bilty",
        });
        return;
      }

      myForm.setPageState({
        ...myForm.pageState,
        ...temp_response,
      });
    }
  };

  const inwardTrip = async (e) => {
    const url = SERVER_URL + "/challan/inward/";
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking_challan_nos: myForm.pageState.booking_chalan_list,
        removed_bilty_ids: myForm.pageState.removed_bilty_ids,
      }),
    });

    if (!response.ok) {
      myForm.setPageMode("error");
      myForm.setPopupError("Issue in trip inward");
      return;
    }
    myForm.setPageMode("submitted");
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return false;
    } else if (fieldInfo.name == "delete_button") {
      return false;
    } else if (
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
    } else {
      return "";
    }
  };

  const handleDelete = async () => {
    const url =
      SERVER_URL + "/challan/?booking_chalan_no=" + myForm.pageState.challan_no;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.trip_info[infoObject.idx];
    let biltyId = biltyObj.bilty_id;
    console.log("Bilty objecy", biltyObj);
    let newState = {};

    newState.trip_info = infoObject.rows;
    newState.removed_bilty_ids = [
      ...myForm.pageState.removed_bilty_ids,
      biltyId,
    ];

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
                  <div>Trip Saving Successful </div>
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
                  Trip Inward is successfully created
                  <br />
                  {/* <div className="pop-up-fields">
                      <div className="pop-up-field">
                      <div className="pop-up-field-label">Crossing Inward No.</div>
                      <div className="pop-up-field-value">{myForm.pageState.crossing_in_no}</div>
                      </div>
                    </div> */}
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
      <div className="form-header">Trip Inward</div>
      <div className="form">
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
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "trip_no")}
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
            {checkVisibilityCondition({ name: "inward_button" }) ? (
              <button onClick={inwardTrip}>Inward</button>
            ) : (
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
            )}
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

          <div>
            Trip Inward Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_date")}
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
            />
          </div>
        </div>

        <div className="multi-table-container">
          <div className="small-table-container">
            <DynamicViewTable
              tableHeader={tripTableHeader}
              tableItems={tripTableItems}
              tableValues={myForm.pageState["trip_ids"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["trip_ids"]}
              // deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="trip_ids"
            />
          </div>
          <div className="table-container">
            <DynamicViewTable
              tableHeader={challanBiltyTableHeader}
              tableItems={challanBiltyTableItems}
              tableValues={myForm.pageState["trip_info"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["trip_info"]}
              deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="trip_info"
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
        </div>
      </div>
    </div>
  );
};

export default TripInwardForm;
