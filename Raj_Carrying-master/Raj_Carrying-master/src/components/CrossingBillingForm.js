import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./CrossingInward.css";
// import {
//   challanBiltyTableItems,
//   challanBiltyTableHeader,
// } from "../config/challanForm.js";
import { crossingBillingApiConfig } from "../config/apiConfig.js";
import {
  groupInfo,
  popupInfo,
  dataObject,
  validate,
  crossingInHeader,
  crossingInTableItems,
  crossingOutHeader,
  crossingOutTableItems,
} from "../config/CrossingBilling.js";
import FormColumn from "./FormColumn.js";
import DatePicker from "react-datepicker";

import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";
import { useEffect } from "react";

const CrossingBillingForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "CROSSINGBILLING",
    validate,
    { ...dataObject, ...variablesFromSession },
    crossingBillingApiConfig
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
      Enter: "consignor_name",
    },
    idClearanceNeeded: "consignee_id",
  };

  const linkBilty = async (e) => {
    if (e.target.value == "" && e.key == "Enter") {
      myForm.makeFocusOnParticularField("add");
      return;
    }
    if (e.key == "Enter") {
      let response = {};
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      // TODO: hit api here, changes for bilty_info
      if (myForm.pageState.type == 1) {
        const url = SERVER_URL + "/crossing_bill_in/filter/";
        response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_to: myForm.pageState.date_to,
            type: myForm.pageState.type,
            branch_id: myForm.pageState.created_from,
            transporter_id: myForm.pageState.transporter_id,
            companyId: myForm.pageState.company_id,
            fyear: fYear_fetch,
          }),
        });
      } else {
        const url = SERVER_URL + "/crossing_bill_out/filter/";

        response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_to: myForm.pageState.date_to,
            type: myForm.pageState.type,
            branch_id: myForm.pageState.created_from,
            transporter_id: myForm.pageState.transporter_id,
            companyId: myForm.pageState.company_id,
            fyear: myForm.pageState.fYear_get,
          }),
        });
      }

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
        crossing_info: temp_response,
      };
      let tran_freight = 0;
      let our_freight = 0;
      let to_pay = 0;
      let paid = 0;
      let pkgs = 0;
      let biltyObj = {};
      for (let i = 0; i < newState.crossing_info.length; i++) {
        biltyObj = newState.crossing_info[i];
        total_amount += parseInt(biltyObj.balance) || 0;
      }
      //   newState.transporter_freight = String(tran_freight);
      newState.total_amount = String(total_amount);
      //   newState.pkgs = String(pkgs);
      //   newState.to_pay = String(to_pay);
      //   newState.paid = String(paid);
      //   newState.balance = String(our_freight - to_pay);

      console.log("New state", newState);
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.makeFocusOnParticularField("add");
    }
  };

  const giveTableHeader = () => {
    if (myForm.pageState.type == "1") {
      return crossingInHeader;
    } else {
      return crossingOutHeader;
    }
  };

  const giveTableItem = () => {
    if (myForm.pageState.type == "1") {
      return crossingInTableItems;
    } else {
      return crossingOutTableItems;
    }
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button" && myForm.pageMode == "edit") {
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
    if (fieldInfo.name == "consignor_gst") {
      return "disabled";
    } else if (fieldInfo.name == "net_amount") {
      return "disabled";
    } else if (fieldInfo.name == "total_amount") {
      return "disabled";
    } else if (myForm.pageMode == "view") {
      return "disabled";
    } else if (
      myForm.pageState.id != "" &&
      myForm.pageState.id != null &&
      fieldInfo.name == "type"
    ) {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "party_name") {
      return "disabled";
      // } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      //   return "disabled";
    } else {
      return "";
    }
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

  const handleDelete = async () => {
    let url = "";
    if (myForm.pageState.type == "1") {
      url =
        SERVER_URL +
        "/crossing_bill_in/?crossing_bill_id=" +
        myForm.pageState.id;
        // "?fyear=" + myForm.pageState.fYear + "&companyId=" + myForm.pageState.company_id;
    } else {
      url =
        SERVER_URL +
        "/crossing_bill_out/?crossing_bill_id=" +
        myForm.pageState.id;
        // "?fyear=" + myForm.pageState.fYear + "&companyId=" + myForm.pageState.company_id;
    }

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

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.crossing_info[infoObject.idx];
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
    newState.crossing_info = infoObject.rows;

    console.log("New state", newState);
    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

  const fetchLastOnChange = async () => {
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    if (myForm.pageState.type == "1") {
      const url =
        SERVER_URL + "/crossing_bill_in/last/" + myForm.pageState.created_from + 
        "?fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
      const response = await fetch(url);
      if (!response.ok) {
        myForm.setPageStateByField("last_consignor_bill_no", "Error");
        return;
      } else {
        let resp = await response.json();
        if (resp != null) {
          myForm.setPageStateByField("last_consignor_bill_no", resp.bill_no);
        }
      }
    } else {
      const url =
        SERVER_URL + "/crossing_bill_out/last/" + myForm.pageState.created_from + 
        "?fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
      const response = await fetch(url);
      if (!response.ok) {
        myForm.setPageStateByField("last_consignor_bill_no", "Error");
        return;
      } else {
        let resp = await response.json();
        if (resp != null) {
          myForm.setPageStateByField("last_consignor_bill_no", resp.bill_no);
        }
      }
    }
  };

  useEffect(() => {
    fetchLastOnChange();
  }, [myForm.pageState.type]);

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
      <div className="form-header">Crossing Billing</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Bill Type</label>
            <select
              className="form-input-wide"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "type");
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "type")}
              disabled={checkDisabledCondition({ name: "type" })}
              value={myForm.pageState["type"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  myForm.makeFocusOnParticularField("bill_no");
                }
              }}
            >
              <option value="1" key="1">
                In
              </option>
              <option value="2" key="2">
                Out
              </option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Crossing Billing No:</label>
            <input
              className="form-input"
              type="text"
              name="bill_no"
              placeholder=""
              value={myForm.pageState.bill_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.bill_no)
              }
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "bill_no")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
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
                {/* <button onClick={handleDelete}>Delete</button> */}
              </>
            )}
          </div>

          <div className="form-row-m">
            <label className="form-label">Date To:</label>
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="date_to"
              placeholder=""
              value={myForm.pageState.date_to}
              onChange={myForm.handleChange}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
              disabled={checkDisabledCondition({ name: "date_to" })}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("transporter_name");
                }
              }}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Transporter Name</label>
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
                onKeyPress: linkBilty,
                disabled: checkDisabledCondition(transporterFieldInfo),
              }}
            />
          </div>
          <div>
            <label className="form-label">Bill Date:</label>
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("transporter_name");
                }
              }}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last Crossing Bill:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_consignor_bill_no}
            </label>
          </div>
        </div>

        <div className="table-container">
          <DynamicViewTable
            tableHeader={giveTableHeader()}
            tableItems={giveTableItem()}
            tableValues={myForm.pageState["crossing_info"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["crossing_info"]}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
            fieldMapping="crossing_info"
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
            onClick={(e) => {
              console.log("Values", myForm.pageState);
              myForm.setServerPrintNeeded(true);
              myForm.handleSubmit(e);
            }}
            type="button"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
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
          <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
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
          {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
        </div>
      </div>
    </div>
  );
};

export default CrossingBillingForm;
