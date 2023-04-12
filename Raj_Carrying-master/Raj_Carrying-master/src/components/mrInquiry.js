import React from "react";
import validate from "./validateInfo";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./MRForm.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanForm.js";
import { mrInquiryApiConfig } from "../config/apiConfig.js";
import { dataObject, popupInfo, groupInfo } from "../config/mrInquiry.js";

import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";

const MrInquiryForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
  };

  const myForm = useForm(
    "MR Inquiry",
    validate,
    { ...dataObject, ...variablesFromSession },
    mrInquiryApiConfig
  );

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

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

  const linkBilty = async (e) => {
    if (myForm.pageState["Bilty No"] == "" && e.key == "Enter") {
      myForm.makeFocusOnParticularField("delivery_on");
      return;
    }
    if (e.key == "Enter") {
      let flag = 0;
      if (
        myForm.pageState.bilty_type == "c" ||
        myForm.pageState.bilty_type == "C"
      ) {
        flag = 1;
      }
      let suffix = myForm.pageState.suffix;
      if (suffix == "") {
        suffix = "null";
      }
      const url =
        SERVER_URL +
        "/bilty/mr_in/" +
        myForm.pageState["Bilty No"] +
        "?branch_id=" +
        myForm.pageState.created_from +
        "&suffix=" +
        suffix +
        "&flag=" +
        flag;
      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "",
        });
        const temp_error = await response.json();
        if ("detail" in temp_error){
          myForm.setPageMode("error");
          myForm.setPopupError(temp_error.detail);
        }
        else{
          myForm.setPageMode("error");
          myForm.setPopupError("Invalid Bilty");
        }
        return;
      }
      const temp_response = await response.json();
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "",
        });
        myForm.setPageMode("error");
        myForm.setPopupError("Not possible to add this bilty");
        return;
      }
      if (
        checkIfFieldAlreadyExists(
          "bilty_id",
          temp_response.bilty_id,
          myForm.pageState.bilty_ids
        )
      ) {
        myForm.setPageState({
          ...myForm.pageState,
          ["No"]: "",
        });
        myForm.setPageMode("error");
        myForm.setPopupError("Already present");
        return;
      }

      let partyName = "";
      let total_amount = 0;
      let newState = {
        bilty_ids: [...myForm.pageState["bilty_ids"], temp_response],
        ["Bilty No"]: "",
      };
      if (myForm.pageState.bilty_ids.length == 0) {
        partyName = temp_response.consignee_name;
      }
      if (partyName != "") {
        newState.party_name = partyName;
      }
      if (temp_response.pay_type_name == "To Pay") {
        if (temp_response.freight != "" && temp_response.freight != null) {
          total_amount += parseInt(temp_response.freight);
        }
        if (temp_response.hamali != "" && temp_response.hamali != null) {
          total_amount += parseInt(temp_response.hamali);
        }
        if (
          temp_response.door_del_charge != "" &&
          temp_response.door_del_charge != null
        ) {
          total_amount += parseInt(temp_response.door_del_charge);
        }
        if (
          temp_response.bilty_charge != "" &&
          temp_response.bilty_charge != null
        ) {
          total_amount += parseInt(temp_response.bilty_charge);
        }
        if (
          temp_response.other_amount != "" &&
          temp_response.other_amount != null
        ) {
          total_amount += parseInt(temp_response.other_amount);
        }

        if (
          myForm.pageState.to_pay_amount != "" &&
          myForm.pageState.to_pay_amount != null
        ) {
          newState.to_pay_amount = String(
            total_amount + parseInt(myForm.pageState.to_pay_amount)
          );
        } else {
          newState.to_pay_amount = String(total_amount);
        }
      }
      console.log("New state", newState);
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.makeFocusOnParticularField("bilty_type");
    }
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
    if (fieldInfo.name != "mr_no") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "disabled";
    } else if (myForm.pageMode == "view") {
      return "disabled";
    } else {
      return "";
    }
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
                      <div className="pop-up-field-label">{popupInfo.field_label_success}</div>
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
                      <div className="pop-up-field-label">{popupInfo.field_label_error}</div>
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
      <div className="form-header">MR Inquiry</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">MR No:</label>
            <input
              className="form-input"
              type="text"
              name="mr_no"
              placeholder=""
              value={myForm.pageState.mr_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.mr_no)
              }
              disabled={checkDisabledCondition({ name: "mr_no" })}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "mr_no")}
            />
            {myForm.internalValidationErrors["mr_no"] && (
              <p>{myForm.internalValidationErrors["mr_no"]}</p>
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
                {checkVisibilityCondition({ name: "delete_button" }) && (
                  <button
                  // onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
          {/* <div className="chform-row">
            <label className="chform-label">Type</label>
            <select
              className="chform-input-suffix"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "bilty_type");
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_type")}
              disabled={checkDisabledCondition({ name: "bilty_type" })}
              value={myForm.pageState["bilty_type"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("bilty_no");
                }
              }}
            >
              <option value="D" key="D">
                D
              </option>
              <option value="C" key="C">
                C
              </option>
            </select>
            <label className="chform-label">Bilty No:</label>
            <input
              className="chform-input"
              type="text"
              name="Bilty No"
              placeholder=""
              value={myForm.pageState["Bilty No"]}
              onChange={myForm.handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("suffix");
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
            />
            <input
              className="chform-input-suffix "
              type="text"
              name="suffix"
              placeholder=""
              value={myForm.pageState["suffix"]}
              onChange={myForm.handleChange}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            />
          </div> */}

          <div>
            MR Date:{" "}
            <DatePicker
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
            />
          </div>
          {/* <div className="form-row">
            <label className="form-last_bilty">Last MR No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_mr_no}
            </label>
          </div> */}
        </div>

        <div className="table-container">
          <DynamicViewTable
            tableHeader={challanBiltyTableHeader}
            tableItems={challanBiltyTableItems}
            tableValues={myForm.pageState["bilty_ids"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["bilty_ids"]}
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
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            />
          </div>
          <div className="form-field-left">
          <FormColumn
              groupInfo={groupInfo}
              groupName="group-2"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            />
          </div>
          <div className="form-field-right">
          <FormColumn
              groupInfo={groupInfo}
              groupName="group-3"
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
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button>
          {/* <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button> */}
          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default MrInquiryForm;
