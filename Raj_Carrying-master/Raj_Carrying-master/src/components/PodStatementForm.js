import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./CrossingInward.css";
import {
  podStatementTableHeader,
  podStatementTableItems,
} from "../config/PodStatement.js";
import { podStatementApiConfig } from "../config/apiConfig.js";
import { dataObject, validate } from "../config/PodStatement.js";

import { groupInfo, popupInfo } from "../config/PodStatement.js";
import DatePicker from "react-datepicker";

import { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";
import ReportExcel from "./ReportExcel.js";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useLocation } from "react-router-dom";

const PodStatementForm = ({ sessionObject }) => {
    const location = useLocation();

  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};
  
  const download_ref = React.useRef(null);

    // useEffect(() => {
    //     console.log(myForm.pageState);
    // })

  const myForm = useForm(
    "PODSTATEMENT",
    validate,
    { ...dataObject, ...variablesFromSession },
    podStatementApiConfig
  );

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  useEffect(() => {
    // console.log(myForm.pageState);
    const defaultPodNo = location.state ?? "";
    if(defaultPodNo != "") {
        myForm.setPageStateByField("pod_statement_no", defaultPodNo);

        const fakeKey = { key: "Enter" }
        myForm.getPageOnKeyEnter(fakeKey, defaultPodNo);
    }
}, []);

  const transporterFieldInfo = {
    label: "Consignor Name",
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
      Enter: "add",
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  const linkBilty = async (e) => {
    if (e.target.value == "" && e.key == "Enter") {
      // myForm.makeFocusOnParticularField("save_button");
      return;
    }
    if (e.key == "Enter") {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      // TODO: hit api here, changes for bilty_info
      const url = SERVER_URL +"/pod/pod_statement"
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_to: myForm.pageState.input_date,
          branch_id: myForm.pageState.created_from,
          consignor_id: myForm.pageState.consignor_id,
          fyear: fYear_fetch,
          companyId: myForm.pageState.company_id,
        }),
      });

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

      let newState = {
        pod_info_list: temp_response.pod_info,
      };

      if(myForm.pageMode == "edit") {
          newState = {
              pod_info_list: [
                  ...myForm.pageState.pod_info_list,
                  ...temp_response.pod_info,
              ]
          }
      }

      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      // myForm.makeFocusOnParticularField("save_button");
    }
  };

//   useEffect(() => {
//       console.log(myForm.pageState);
//   })

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return (myForm.pageState.id != "");
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

  const handleDelete = async () => {
    const url =
      SERVER_URL + "/pod_statement/?pod_statement_id=" + myForm.pageState.id
        + "&companyId=" + myForm.pageState.company_id 
        + "&fyear=" + myForm.pageState.fYear_get;
    
        const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete Bill");
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

  const checkDisabledCondition = (fieldInfo) => {
    if (fieldInfo.name == "consignor_gst") {
      return "disabled";
    } else if (fieldInfo.name == "net_amount") {
      return "disabled";
    } else if (fieldInfo.name == "total_amount") {
      return "disabled";
    } else if (myForm.pageMode == "view") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "party_name") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "disabled";
    } else {
      return "";
    }
  };

  // const handleDelete = async () => {
  //   const url =
  //     SERVER_URL + "/challan/?booking_chalan_no=" + myForm.pageState.challan_no;
  //   const response = await fetch(url, { method: "DELETE" });
  //   if (!response.ok) {
  //     console.log("Not able to delete challan");
  //     return;
  //   }
  //   const temp_response = await response.json();
  //   if (temp_response.is_deleted) {
  //     myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
  //     myForm.setPageMode("write");
  //     window.location.reload();
  //     return;
  //   }
  // };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.pod_info_list[infoObject.idx];
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
    newState.pod_info_list = infoObject.rows;

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
      <div className="form-header">POD Statement</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">POD Statement No:</label>
            <input
              className="form-input"
              type="text"
              name="pod_statement_no"
              placeholder=""
              value={myForm.pageState.pod_statement_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              autoFocus={true}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.pod_statement_no)
              }
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "pod_statement_no")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
            {myForm.internalValidationErrors["challan_no"] && (
              <p>{myForm.internalValidationErrors["challan_no"]}</p>
            )}
          </div>

          <div className="form-row">
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

          {/* <div className="form-row">
            <label className="form-label">{"Amount >="}</label>
            <input
              className="form-input"
              type="text"
              name="amount"
              placeholder=""
              value={myForm.pageState.amoun}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) => {
                console.log("Here");
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularField("consignor_name");
                }
              }}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "amount")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div> */}

          <div className="form-row">
            <label className="form-label">Consignor Name</label>
            { 
            myForm.pageMode == "edit" ? 
            <input
                type="text"
                name="consignor_name"
                value={myForm.pageState.consignor_name}
                onChange={myForm.handleChange}
                className="form-input"
                onKeyPress={linkBilty}
            />
            : <Autosuggest
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
              getSuggestionValue={suggestion => suggestion[transporterFieldInfo.suggestionKeyword]}
              onSuggestionSelected={(a,b) =>
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
              highlightFirstSuggestion ={true}
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
            />}
          </div>
          <div className="form-row">
            <label className="form-label">POD statement Date:{" "}</label>
            <DatePicker
            className="form-input"
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                {console.log({date});
                return myForm.setPageStateByField("input_date", date)}
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                console.log("Here");
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularFieldForItem("pod_receive_date");
                }
              }}
            />
          </div>
          <div className="form-row">
          <label className="form-label">POD Received Date:{" "}</label>
            <DatePicker
            className="form-input"
              dateFormat="dd-MM-yyy"
              selected={
                  (
                    myForm.pageState.pod_receive_date_selected == "true"
                  ) 
                  ? myForm.pageState.pod_receive_date : ""}
              onChange={(date) => {
                    myForm.setPageStateByField("pod_receive_date_selected", "true");
                    myForm.setPageStateByField("pod_receive_date", date)
                }
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "pod_receive_date")}
            //   disabled={checkDisabledCondition({ name: "pod_receive_date" })}
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
          <div className="form-row">
            <label className="form-last_bilty">Last Statement No:</label>
            <label className="form-pod_statement">
              {myForm.pageState.last_consignor_bill_no}
            </label>
          </div>
        </div>

        <div className="table-container">
          <DynamicViewTable
            tableHeader={podStatementTableHeader}
            tableItems={podStatementTableItems}
            tableValues={myForm.pageState["pod_info_list"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["pod_info_list"]}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
            fieldMapping="pod_info_list"
          />
        </div>

        <div className="form-input-content-block-0">
          <div className="form-field-left">
            {groupInfo["group-1"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["name"]}>
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>

                    <select
                      className={info["inputClassName"]}
                      onChange={(newValue) => {
                        myForm.handleChangeForSelect(newValue, info["name"]);
                      }}
                      disabled={checkDisabledCondition(info)}
                      value={myForm.pageState[info["name"]]}
                      ref={(a) =>
                        myForm.storeInputReferenceForSelect(a, info["name"])
                      }
                      onKeyPress={(a) => myForm.onKeyPressForKeyNav(a, info)}
                    >
                      {info["dropdown_items"].map((dropdown_item) => (
                        <option
                          value={dropdown_item.value}
                          key={dropdown_item.label}
                        >
                          {dropdown_item.label}
                        </option>
                      ))}
                    </select>
                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
              else
                return (
                  <div className={info["className"]} key={info["name"]}>
                    {checkVisibilityCondition(info) && (
                      <label className={info["labelClassName"]}>
                        {info["label"]}
                      </label>
                    )}
                    {checkVisibilityCondition(info) && (
                      <Autosuggest
                        id={info["name"]}
                        suggestions={myForm.suggestions}
                        onSuggestionsFetchRequested={(a) =>
                          myForm.onSuggestionsFetchRequested(a, (b) =>
                            myForm.suggestionFetchApi(info, b)
                          )
                        }
                        onSuggestionsClearRequested={() =>
                          myForm.onSuggestionsClearRequested(info)
                        }
                        getSuggestionValue={suggestion => suggestion[info.suggestionKeyword]}
                        onSuggestionSelected={(a,b) =>
                          myForm.getSuggestionValue(
                            b.suggestion,
                            info,
                            myForm.performSuggestions,
                            myForm.updatePageStateForGetSuggestion
                          )
                        }
                        renderSuggestion={(a) =>
                          myForm.renderSuggestion(a, info)
                        }
                        highlightFirstSuggestion ={true}
                        ref={(a) => myForm.storeInputReference(a, false)}
                        inputProps={{
                          //placeholder: info["name"],
                          value: String(myForm.pageState[info["name"]]),
                          onChange: (a, b) => {
                            myForm.onChangeAutoSuggest(a, b, info);
                          },
                          onBlur: () => {
                            info["toValidate"]
                              ? myForm.onblurValidator(info)
                              : {};
                          },
                          onKeyPress: (a) =>
                            myForm.onKeyPressForKeyNav(a, info),
                          disabled: checkDisabledCondition(info),
                        }}
                      />
                    )}
                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
            })}
          </div>
        </div>

        <div className="form-footer">
          <button style={{ display: "none" }}>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="bilty_report_excel"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
              ref={(a) => (download_ref.current = a)}
            />
          </button>
          <button
            className="download-table-xls-button"
            onClick={async () => {
              download_ref.current.handleDownload();
            }}
          >
            Download as XLS
          </button>
          {ReportExcel.excel_pod_data(
            myForm.pageState
          )}
          <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          <button onClick={()=>myForm.setDeletePopup(true)}>Delete</button>
          {/* {myForm.pageMode == "view" && (
              <> */}
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
                {/* <button onClick={handleDelete}>Delete</button> */}
              {/* </> */}
            {/* // )} */}
          {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
        </div>
      </div>
    </div>
  );
};

export default PodStatementForm;
