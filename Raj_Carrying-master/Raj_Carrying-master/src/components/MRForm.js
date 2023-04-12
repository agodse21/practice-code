import React, { useEffect } from "react";
import validate from "./validateInfo";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./MRForm.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanForm.js";
import { mrApiConfig } from "../config/apiConfig.js";
import { dataObject, popupInfo, groupInfo } from "../config/mrForm.js";

import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";
import MrPrint from "../components/MrPrint";
import ReactToPrint from "react-to-print";
import { useLocation } from "react-router-dom";

const MRForm = ({ sessionObject }) => {
    const location = useLocation();
    let variablesFromSession = {
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    // useEffect(() => {
    //     console.log(myForm.pageState);
    // })

  const myForm = useForm(
    "MR",
    validate,
    { ...dataObject, ...variablesFromSession },
    mrApiConfig
  );

    useEffect(() => {
        // console.log(myForm.pageState);
        const defaultMrNo = location.state ?? "";
        console.log(defaultMrNo);
        if(defaultMrNo != "") {
            myForm.setPageStateByField("mr_no", defaultMrNo);

            const fakeKey = { key: "Enter" }
            myForm.getPageOnKeyEnter(fakeKey, defaultMrNo);
        }
    }, []);

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

  const handleDelete = async () => {
    let url =
      SERVER_URL + "/money_receipt/?mr_no=" + myForm.pageState.mr_no;
    url += "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;

    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete MR");
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

  const checkPrint = async () => {
    console.log("Ho");
    // throw new Error("Check");
    let response = null;
    try {
      response = await myForm.synchronousSave();
      myForm.setPageState({
        ...myForm.pageState,
        ...response.response,
      });
      myForm.setPageMode("submitted");
    } catch (e) {
      myForm.setPreviousPageMode(myForm.pageMode);
      myForm.setPageMode("error");
      myForm.setPopupError(e.message);
      // console.log("error caught", e.message);
      throw new Error("Hiiii");
    }

    console.log("response sync", response);
    return;
  };
  const linkBilty = async (e) => {
    const fYear_fetch = myForm.pageState.fyear_get_bilty;
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
        flag + 
        "&fyear=" + myForm.pageState.fyear_get_bilty + "&companyId=" + myForm.pageState.company_id;
      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "",
        });
        const temp_error = await response.json();
        if ("detail" in temp_error) {
          myForm.setPreviousPageMode(myForm.pageMode);
          myForm.setPageMode("error");
          myForm.setPopupError(String(temp_error.detail));
        } else {
          myForm.setPreviousPageMode(myForm.pageMode);
          myForm.setPageMode("error");
          myForm.setPopupError("Invalid Bilty");
        }
        return;
      }
      const temp_response = await response.json();
      
    //   if("flag" in temp_response) {
    //     myForm.makeFocusOnParticularField("suffix");
    //     return;
    //   }
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["Bilty No"]: "",
        });
        myForm.setPreviousPageMode(myForm.pageMode);
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
        myForm.setPreviousPageMode(myForm.pageMode);
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
        if("lorry_rate" in temp_response && temp_response.lorry_rate != null) {
            newState.lorry_rate = parseInt(myForm.pageState.lorry_rate) + parseInt(temp_response.lorry_rate);
        }
      if (myForm.pageState.bilty_ids.length == 0) {
        partyName = temp_response.consignee_name;
      }
      if (partyName != "") {
        newState.party_name = partyName;
      }
      if (temp_response.pay_type_name == "To Pay") {
        if (temp_response.transporter_id != "" && temp_response.transporter_id != null){
          total_amount += parseInt(temp_response.transporter_freight) || 0;
        }
        else{
          total_amount += parseInt(temp_response.freight) || 0;
          total_amount += parseInt(temp_response.hamali) || 0;
          total_amount += parseInt(temp_response.door_del_charge) || 0;
          total_amount += parseInt(temp_response.bilty_charge) || 0;
          total_amount += parseInt(temp_response.other_amount) || 0;
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
    if (fieldInfo.name == "edit_button" && myForm.pageState.role_id != "1") {
      return false;
  } else if (fieldInfo.name == "delete_button" && myForm.pageState.role_id != "1") {
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
    if (fieldInfo.name == "to_pay_amount") {
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
            open={myForm.pageState.fyearList.length > 0}
            modal
            closeOnDocumentClick={false}
        >            
            {(close) => myForm.displayFyearPopup(close)}  
        </Popup>
    </div>
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          // open={myForm.pageMode == "submitted" || myForm.pageMode == "error"}
          open={myForm.pageMode == "error"}
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
      </div>
      <div className="form-header">Money Receipt</div>
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
              // onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getFyearsOnKeyEnter(a, "MR", myForm.pageState.mr_no)
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
                </button> */}
                {/* {checkVisibilityCondition({ name: "delete_button" }) && (
                  <button
                  onClick={handleDelete}
                  >
                    Delete
                  </button>
                )} */}
              </>
            )}
          </div>
          <div className="chform-row">
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
            //   onKeyPress={(a) => {
            //     if (a.key == "Enter") {
            //       myForm.makeFocusOnParticularField("suffix");
            //     }
            //   }}
            onKeyPress={(e) => {
                if(e.key == "Enter") {
                    // console.log("press", myForm.pageState["Bilty No"]);
                    if(myForm.pageState["Bilty No"]) {
                        myForm.getFyearsOnKeyEnter(e, "Bilty Inquiry", myForm.pageState["Bilty No"])
                    }
                    else {
                        myForm.makeFocusOnParticularField("delivery_on");
                    }
                }
            }} 
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
            />
            <select
                className="chform-input "
                name="suffix"
                value={myForm.pageState.suffix}
                onChange={(e) => myForm.handleChangeForSelect(e, "suffix")}
                onKeyPress={(e) => {
                    if(e.key == "Enter") {
                        e.preventDefault();
                        linkBilty(e);
                    }
                }}
                ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            > 
                {myForm.pageState.suffix_options.map((suff) => {
                    return <option value={suff}> {suff} </option>
                })}
            </select>
            {/* <input
              className="chform-input-suffix "
              type="text"
              name="suffix"
              placeholder=""
              value={myForm.pageState["suffix"]}
              onChange={myForm.handleChange}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            /> */}
          </div>

          <div>
            MR Date:{" "}
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
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last MR No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_mr_no}
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
          <div className="form-field-right">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-3"
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
          <ReactToPrint
            trigger={() => (
              <button
                onClick={() => {
                  console.log("Values", myForm.pageState);
                  console.log(
                    "Value verification",
                    myForm.valueVerificationState
                  );
                  console.log("Id clearance", myForm.idClearancState);
                  console.log("Reference store", myForm.refStoreObject.current);
                  console.log("Session", sessionObject.sessionVariables);
                  console.log("Page mode", myForm.pageMode);
                }}
                ref={(a) =>
                  myForm.storeInputReferenceForSelect(a, "print_button")
                }
                type="button"
                className="btn btn-primary"
              >
                Print
              </button>
            )}
            content={(myForm) => MrPrint.componentRef}
            onBeforeGetContent={checkPrint}
            onAfterPrint={() => {
              myForm.setPageState({
                ...dataObject,
                ...variablesFromSession,
              });
              myForm.setPageMode("write");
              window.location.reload();
              // close();
            }}
          />
          <button
            onClick={(e) => {
              myForm.setClearDataOnSave(true);
              myForm.handleSubmit(e);
            }}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
          )}
          <button
            onClick={() => {
              history.push("/");
              console.log(myForm.pageState)
            }}
          >
            Exit
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
            New
          </button>
          {/* <ReactToPrint
            trigger={() => <button>Print this out!</button>}
            content={(myForm) => MrPrint.componentRef}
          /> */}

          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
        <div style={{ display: "none" }}>
          <MrPrint
            fields={myForm.pageState}
            ref={(el) => (MrPrint.componentRef = el)}
          />
        </div>
      </div>
    </div>
  );
};

export default MRForm;
