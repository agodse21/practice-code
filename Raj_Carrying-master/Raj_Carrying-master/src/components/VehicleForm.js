import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { vehicleApiConfig } from "../config/apiConfig.js";
import { groupInfo, dataObject, validate } from "../config/vehicleForm.js";
import FormColumn from "./FormColumn.js";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import LoadingOverlay from "react-loading-overlay";

const VehicleForm = ({ sessionObject }) => {
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
  };

  const myForm = useForm(
    "Vehicle",
    validate,
    { ...dataObject, ...variablesFromSession },
    vehicleApiConfig
  );

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

  const checkDisabledCondition = (fieldInfo) => {
    return ""
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (
      fieldInfo.name == "entry_date"
    ) {
      return false;
    }
    return true
  };

  React.useEffect(() => {
    console.log(myForm.pageState);
  })
  
  const handleInvalidOtpCall = async () => {
    const url = SERVER_URL + "/token_verification/expire?"
                + `token=${myForm.pageState.vehicle_no}`;

    await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
  }

  const handleSendOTP = async () => {
    const currOtp = parseInt(myForm.pageState.otp);

    const url = SERVER_URL + "/token_verification/verify?"
                + `token=${myForm.pageState.vehicle_no}`
                + `&otp=${currOtp}`;
    let resp = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    if(resp.ok) {
        const respData = await resp.json();

        if(respData.flag == 1) {
            // save
            myForm.setPageState((oldState) => ({
                ...oldState,
                "otp_success": true,
            }))

            document.getElementById("send_button").click();
        }
        else {
            // if attempts Remaining == -1 and this resp was also negative
            if(myForm.pageState.otp_attempts == 1) {
                await handleInvalidOtpCall();
                window.location.reload();
            }
            else {
                myForm.setPageState((oldState) => ({
                    ...oldState,
                    "otp": "",
                    "otp_attempts": parseInt(myForm.pageState.otp_attempts) - 1,
                }))
                document.getElementById("otp").focus();
            }
        }
    }
  }

  return (
    <div className="challan-form-container">
      {
        USE_OVERLAY && (
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
        )
      }
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
                  <div>Vehicle Saving Successful </div>
                ) : (
                  <div>Error In Vehicle Module </div>
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
                  Vehicle Master Saved Successfully:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Vehicle No</div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.vehicle_no}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in Vehicle Master with the following info:-
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
          open={myForm.pageState.pan_popup == "1"}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">Given Pan number exists 10 times, Are you sure want to proceed?</div>
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    let newState = {
                      pan_popup: "0",
                      // pan_no: "",
                      ingore_pan_limit: "1",
                    }
                    myForm.setPageState({
                        ...myForm.pageState,
                        ...newState,
                      });
                    close();
                  }}
                >
                  Yes
                </button>
                <button
                  className="pop-up-button"
                  onClick={() => {
                    let newState = {
                      pan_popup: "0",
                      pan_no: "",
                    }
                    myForm.setPageState({
                        ...myForm.pageState,
                        ...newState,
                      });
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
      <div>
                <Popup
                    open={myForm.pageState.save_clicked == true}
                    modal
                    contentStyle={contentStyle}
                    closeOnDocumentClick={false}
                >
                    {(close) => {
                        return (
                            <div className="pop-up-container">
                                <div className="pop-up-header">
                                    Enter OTP (Remaining attempts : {myForm.pageState.otp_attempts})
                                    <div>
                                        <a className="pop-up-close btn" onClick={() => {
                                            myForm.setPageState((pageState) => ({
                                                ...pageState,
                                                "save_clicked": false,
                                                "otp": "",
                                                "otp_attempts": "3",
                                            }))
                                            close();
                                        }}>
                                            &times;
                                        </a>
                                    </div>
                                </div>
                                <div className="popup-content">
                                    <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <label className="form-label">OTP </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="otp"
                                                id="otp"
                                                value={myForm.pageState.otp}
                                                onChange={myForm.handleChange}
                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        document.getElementById("verified_by").focus();
                                                    }
                                                }}
                                                autoFocus={true}
                                            />
                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">Verified By </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="verified_by"
                                                id="verified_by"
                                                value={myForm.pageState.verified_by}
                                                onChange={myForm.handleChange}
                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        document.getElementById("send_otp").focus();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        id="send_otp"
                                        // type="submit"
                                        onClick={() => {
                                            handleSendOTP();
                                            if(myForm.pageState.otp_success == true) {
                                                myForm.setPageState((pageState) => ({
                                                    ...pageState,
                                                    "save_clicked": false,
                                                    "otp": "",
                                                    "otp_attempts": "3",
                                                    "otp_success": false,
                                                }))
                                                close();
                                            }
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                </Popup>
            </div>

      <div className="form-header"> Vehicle </div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
        <div className="form-row">
            <label className="form-label">Created Date</label>
            <input
              className="form-input-vehicle-date"
              type="date"
              name="entry_date"
              placeholder=""
              disabled="disabled"
              value={myForm.pageState.entry_date}
              onChange={myForm.handleChange}
              // onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "entry_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
        </div>
        <div className="form-row">
            <label className="form-last_bilty">Verified By: </label>
            <label className="form-last_bilty">
            {myForm.pageState.verified_by}
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
            id="send_button"
            onClick={(e) => {
                if(sessionObject.sessionVariables.role_id == "1" || myForm.pageState.otp_success) {
                    myForm.handleSubmit(e);
                }
                else {
                    const url = SERVER_URL + "/token_verification/generate?"
                    + `vehicle_no=${myForm.pageState.vehicle_no}`
                    + `&name=${myForm.pageState.owner_name}`
                    + `&pan_no=${myForm.pageState.pan_no}`
                    + `&tds_rate=${myForm.pageState.tds_rate}`
                    + `&declaration=${myForm.pageState.policy_no}`;
                    fetch(url, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    });

                    myForm.setPageStateByField("save_clicked", true)
                }
            }}
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

export default VehicleForm;
