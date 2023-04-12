import React, { useEffect } from "react";
import DynamicTable from "./DynamicTable";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./Form.css";
import { biltyInquiryApiConfig } from "../config/apiConfig.js";
import { SERVER_URL } from "../config/config";
import FormColumn from "./FormColumn.js";
import "./FieldView.css";
import {
  groupInfo,
  validate,
  dataObject,
  popupInfo,tripChallanTableHeader,tripChallanTableItems
} from "../config/BiltyInquiry";
import {
  itemTableHeader,
  itemTableItems,
  ewbTableItems,
  ewbTableHeader,
} from "../config/tableItems";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./popup.css";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "../components/ComponentToPrint";

const BiltyInquiryForm = ({ sessionObject }) => {
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
    // "last_bilty_no": String(sessionObject.sessionVariables.last_bilty_no),
  };
  const myForm = useForm(
    "Bilty Inquiry",
    validate,
    { ...dataObject, ...variablesFromSession },
    biltyInquiryApiConfig
  );

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    let additionalInfoObject = {};
    if (fieldInfoObject.name == "consignor_name"){
      additionalInfoObject.branch_id = myForm.pageState.created_from;
      // additionalInfoObject.pay_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    return null;
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (
      myForm.pageState.pay_type == "4" &&
      (fieldInfo.name == "freight" || fieldInfo.name == "total_amount")
    ) {
      return false;
    } else if (
      myForm.pageState.pay_type == "2" &&
      fieldInfo.name == "delete_button"
    ) {
      return false;
    } else if (
      myForm.pageState.mr_no != "" &&
      fieldInfo.name == "delete_button"
    ) {
      return false;
    } else if (
      myForm.pageState.pay_type == "2" &&
      fieldInfo.name == "edit_button"
    ) {
      return false;
    } else if (
      myForm.pageState.mr_no != "" &&
      fieldInfo.name == "edit_button"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "N" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "n" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "N" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "n" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (myForm.pageMode == "view" && fieldInfo.name != "bilty_no") {
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "disabled";
    }else if (fieldInfo.name != "bilty_no" && fieldInfo.name != "is_crossing" && fieldInfo.name != "transporter_name") {
      return "disabled";}
    else {
      return "";
    }
  };

  const handleDelete = async () => {
    const url = SERVER_URL + "/bilty/?bilty_id=" + myForm.pageState.bilty_id;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete bilty");
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
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "bilty_no",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "transporter_id",
  };

//   useEffect(() => {
//       console.log(myForm.pageState);
//   })

  return (
    <div className="form-container">
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

      <div className="form-header">Bilty Inquiry</div>
      <div className="form">
        <div className="form-title">
          {/* <div className="form-row">
            <label className="form-label">Crossing?</label>
            <select
              className="form-input"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "is_crossing");
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "is_crossing")}
              disabled={checkDisabledCondition({ name: "is_crossing" })}
              value={myForm.pageState["is_crossing"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  if (
                    myForm.pageState.is_crossing == "N" ||
                    myForm.pageState.is_crossing == "n"
                  ) {
                    myForm.makeFocusOnParticularField("bilty_no");
                    return;
                  } else {
                    myForm.makeFocusOnParticularField("transporter_name");
                    return;
                  }
                }
              }}
            >
              <option value="N" key="N">
                N
              </option>
              <option value="Y" key="Y">
                Y
              </option>
            </select>
          </div> */}
          {/* <div className="form-row">
            {checkVisibilityCondition(transporterFieldInfo) && (
              <label className="form-label">Transprter Name</label>
            )}
            {checkVisibilityCondition(transporterFieldInfo) && (
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
                  onBlur: () => myForm.onblurValidator(transporterFieldInfo),
                  onKeyPress: (a) => {
                    if (a.key == "Enter") {
                      myForm.makeFocusOnParticularField("bilty_no");
                    }
                  },
                  disabled: checkDisabledCondition(transporterFieldInfo),
                }}
              />
            )}
          </div> */}
          <div className="form-row">
            <label className="form-label">Bilty No:</label>
            <input
              className="form-input"
              type="text"
              name="bilty_no"
              placeholder=""
              value={myForm.pageState.bilty_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) => {
                if(a.key == "Enter") {
                    myForm.getFyearsOnKeyEnter(a, "Bilty Inquiry", myForm.pageState.bilty_no)
                }
              }}
              autoFocus={true}
            // onKeyPress={(e) => {
            //     if(e.key == "Enter") {
            //         getSuffixesOfBilty();
            //     }
            // }} 
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
              disabled={checkDisabledCondition({ name: "bilty_no" })}
            />
            <select
                className="form-input "
                name="suffix"
                value={myForm.pageState.suffix}
                onChange={(e) => myForm.handleChangeForSelect(e, "suffix")}
                onKeyPress={(e) => {
                    if(e.key == "Enter") {
                        e.preventDefault();
                        myForm.getPageOnKeyEnter(e, myForm.pageState.bilty_no, myForm.pageState.fyear_get_bilty)
                    }
                }}
                ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            > 
                {myForm.pageState.suffix_options.map((suff) => {
                    return <option value={suff}> {suff} </option>
                })}
            </select>

            {/* <input
              className="form-input-suffix"
              type="text"
              name="suffix"
              placeholder=""
              value={myForm.pageState.suffix}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.bilty_no)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            //   disabled={true}
            /> */}
            {myForm.pageMode == "view" && (
              <>
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
              </>
            )}
          </div>

          <div className="bilty-inquiry-date">
            Bilty Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
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
            <label style={{fontWeight:"bolder"}}>
              {"Currently In: "+myForm.pageState.owned_by_name}
            </label>
          </div>
          {/* <div>
            Bilty Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularFieldForItem(
                    "eway_bill_no",
                    0,
                    "eway_bill_no"
                  );
                }
              }}
            />
          </div> */}
          {/* <div className="form-row">
            <label className="form-last_bilty">Last Bilty No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_bilty_no + myForm.pageState.last_suffix}
            </label>
          </div> */}
        </div>
        <div className="form-input-content-block-0">
          <div className="form-field-left-most">
            <DynamicTable
              disabledFlag="true"
              pageStateArray={myForm.pageState["eway_bill_no"]}
              pageMode={myForm.pageMode}
              fieldMapping="eway_bill_no"
              tableHeader={ewbTableHeader}
              tableItems={ewbTableItems}
              setPageStateByField={myForm.setPageStateByField}
              onSuggestionsFetchRequested={myForm.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={myForm.onSuggestionsClearRequested}
              onChangeAutoSuggest={myForm.onChangeAutoSuggest}
              getSuggestionValue={myForm.getSuggestionValue}
              renderSuggestion={myForm.renderSuggestion}
              performSuggestions={myForm.performSuggestions}
              suggestions={myForm.suggestions}
              suggestionFetchApi={myForm.suggestionFetchApi}
              storeInputReference={myForm.storeInputReference}
              refStoreObject={myForm.refStoreObject}
              makeFocusOnParticularField={myForm.makeFocusOnParticularField}
              makeFocusOnParticularFieldForItem={
                myForm.makeFocusOnParticularFieldForItem
              }
              apiConfig={biltyInquiryApiConfig["getEwbInfo"]}
              pageState={myForm.pageState}
              onblurValidatorForTable={myForm.onblurValidatorForTable}
              storeInputReferenceForSelectForDynamicTable={
                myForm.storeInputReferenceForSelectForDynamicTable
              }
            />
            <div className="border"></div>
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-5"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            />
          </div>
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
        <div className="table-container_scroll">
          <DynamicViewTable
            tableHeader={tripChallanTableHeader}
            tableItems={tripChallanTableItems}
            tableValues={myForm.pageState["chalan_info"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["chalan_info"]}
            fieldMapping="chalan_info"
          />
        </div>
        <div className="table-container">
          <DynamicTable
            disabledFlag="true"
            pageStateArray={myForm.pageState["item_in"]}
            pageMode={myForm.pageMode}
            fieldMapping="item_in"
            tableHeader={itemTableHeader}
            tableItems={itemTableItems}
            setPageStateByField={myForm.setPageStateByField}
            onSuggestionsFetchRequested={myForm.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={myForm.onSuggestionsClearRequested}
            onChangeAutoSuggest={myForm.onChangeAutoSuggest}
            getSuggestionValue={myForm.getSuggestionValue}
            renderSuggestion={myForm.renderSuggestion}
            performSuggestions={myForm.performSuggestions}
            suggestions={myForm.suggestions}
            suggestionFetchApi={myForm.suggestionFetchApi}
            storeInputReference={myForm.storeInputReference}
            refStoreObject={myForm.refStoreObject}
            makeFocusOnParticularField={myForm.makeFocusOnParticularField}
            makeFocusOnParticularFieldForItem={
              myForm.makeFocusOnParticularFieldForItem
            }
            apiConfig={biltyInquiryApiConfig["getEwbInfo"]}
            pageState={myForm.pageState}
            onblurValidatorForTable={myForm.onblurValidatorForTable}
            storeInputReferenceForSelectForDynamicTable={
              myForm.storeInputReferenceForSelectForDynamicTable
            }
          />
          {/* <div className="table-container">
          <DynamicViewTable
            tableHeader={tripChallanTableHeader}
            tableItems={tripChallanTableItems}
            tableValues={myForm.pageState["temp"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["temp"]}
            fieldMapping="temp"
          />
        </div> */}
          {/* <StaticTable/> */}
          <div className="form-field-vertical_wide">
            {groupInfo["group-3"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["label"]}>
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
                  <div className={info["className"]} key={info["label"]}>
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
                        getSuggestionValue={(a) =>
                          myForm.getSuggestionValue(
                            a,
                            info,
                            myForm.performSuggestions,
                            myForm.updatePageStateForGetSuggestion
                          )
                        }
                        renderSuggestion={(a) =>
                          myForm.renderSuggestion(a, info)
                        }
                        ref={(a) => myForm.storeInputReference(a, false)}
                        inputProps={{
                          placeholder: info["placeholder"],
                          value: String(myForm.pageState[info["name"]]),
                          onChange: (a, b) => {
                            myForm.onChangeAutoSuggest(a, b, info);
                          },
                          onBlur: () => myForm.onblurValidator(info),
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
          <div className="form-field-vertical_no_b">
            {groupInfo["group-6"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["label"]}>
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
                  <div className={info["className"]} key={info["label"]}>
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
                        getSuggestionValue={(a) =>
                          myForm.getSuggestionValue(
                            a,
                            info,
                            myForm.performSuggestions,
                            myForm.updatePageStateForGetSuggestion
                          )
                        }
                        renderSuggestion={(a) =>
                          myForm.renderSuggestion(a, info)
                        }
                        ref={(a) => myForm.storeInputReference(a, false)}
                        inputProps={{
                          placeholder: info["placeholder"],
                          value: String(myForm.pageState[info["name"]]),
                          onChange: (a, b) => {
                            myForm.onChangeAutoSuggest(a, b, info);
                          },
                          onBlur: () => myForm.onblurValidator(info),
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
          
          {/* <div className="field-container">
            {groupInfo["group-4"].map(function (info) {
              return (
                <div className={info["className"]} key={info["label"]}>
                  {checkVisibilityCondition(info) && (
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>
                  )}
                  {checkVisibilityCondition(info) && (
                    <input
                      className={info["className"]}
                      type={info["type"]}
                      name={info["name"]}
                      placeholder={info["placeholder"]}
                      value={myForm.pageState[info["name"]]}
                      onChange={myForm.handleChange}
                      onBlur={() => {}}
                      disabled={true}
                    />
                  )}
                  {myForm.internalValidationErrors[info["name"]] && (
                    <p>{myForm.internalValidationErrors[info["name"]]}</p>
                  )}
                </div>
              );
            })}
          </div> */}
        </div>
        {/* <div className="table-container">
          <DynamicViewTable
            tableHeader={tripChallanTableHeader}
            tableItems={tripChallanTableItems}
            tableValues={myForm.pageState["temp"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["temp"]}
            fieldMapping="temp"
          /> */}
        {/* </div> */}
        <div className="form-footer">
          <button
            onClick={() => {
              console.log("Values", myForm.pageState);
              console.log("Value verification", myForm.valueVerificationState);
              console.log("Id clearance", myForm.idClearancState);
              console.log("Reference store", myForm.refStoreObject.current);
              console.log("Session", sessionObject.sessionVariables);
              console.log("Page mode", myForm.pageMode);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button>
          <ReactToPrint
            trigger={() => <button>Print this out!</button>}
            content={(myForm) => ComponentToPrint.componentRef}
          />
          <div style={{ display: "none" }}>
            <ComponentToPrint
              fields={myForm.pageState}
              ref={(el) => (ComponentToPrint.componentRef = el)}
            />
          </div>

          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default BiltyInquiryForm;
