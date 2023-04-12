import React, { useEffect } from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./ChallanForm.css";
import "./Form.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanForm.js";
import { generalRateMasterApiConfig } from "../config/apiConfig.js";
import {
  dataObject,
  validate,
//   groupInfo,
  popupInfo,
  partyRateTableHeader,
  partyRateTableItems,
} from "../config/GeneralRateMaster";

import DatePicker from "react-datepicker";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";

const GeneralRateMasterForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
  };

  const myForm = useForm(
    "GENERALRATEMASTER",
    validate,
    { ...dataObject, ...variablesFromSession },
    generalRateMasterApiConfig
  );

//   useEffect(() => {
//       console.log(myForm.pageState);
//   })

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
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

  const getGeneralRate = async (e) => {
    if (e.key == "Enter") {
      const url = SERVER_URL + "/general_rate/get";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          station_from: myForm.pageState.station_from,
          // station_to: myForm.pageState.station_to,
          consignor_id: myForm.pageState.consignor_id,
        }),
      });
      const resp = await response.json();
      myForm.setPageStateByField("rate_info", resp);
      myForm.makeFocusOnParticularField("station_to_name");
    }
  };

  let stationFromFieldInfo = {
    label: "Station From",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "station_from_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getCitySuggestions",
    url: SERVER_URL + "/branch/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "branch_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      branch_id: "station_from",
      name: "station_from_name",
    },
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "station_to_name",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_from",
  };

  let stationToFieldInfo = {
    label: "Station To",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "station_to_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getCitySuggestions",
    url: SERVER_URL + "/branch/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "branch_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      branch_id: "station_to",
      name: "station_to_name",
    },
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "consignee_name",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_to",
  };

  let consigneeNameFieldInfo = {
    label: "Consignee Name",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "consignee_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getConsigneeSuggestions",
    url: SERVER_URL + "/consignee/",
    suggestionKeyword: "consignee_name",
    suggestionKeywordExtra: "consignee_gst",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "consignee_id",
    suggestionSchema: {
      consignee_name: "consignee_name",
      consignee_id: "consignee",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
        Enter: "item_name",
    },
    idClearanceNeeded: "consignee_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  let itemFieldInfo = {
    type: "text",
    name: "item_name",
    label: "Item Name",
    className: "form-control-large-col",
    apiConfigKey: "getItemSuggestions",
    url: SERVER_URL + "/item/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "item_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      name: "item_name",
      item_id: "item_id",
    },
    newRowFocus: true,
    keyboardNavigationMap: {
      Enter: "unit",
    },
    // isTable: true,
    // parentName: "item_in",
    toValidate: true,
    idClearanceNeeded: "item_id",
    // inputDataNeededInSuggestions: true,
    // inputDataFilter: {
    //   station_from: "same",
    //   station_to: "same",
    //   consignor_id: "same",
    //   consignee_id: "same",
    //   item_id: "same",
    // },
    // apiCallRequiredOnGetValue: true,
  };

  const linkBilty = async (e) => {
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      //   const url =
      //     SERVER_URL +
      //     "/crossing_inward/transporter/" +
      //     String(myForm.pageState.transporter_id);
      //   const response = await fetch(url);

      //   if (!response.ok) {
      //     myForm.setPageState({
      //       ...myForm.pageState,
      //       ["Bilty No"]: "Invalid Bilty",
      //     });
      //     return;
      //   }
      //   const temp_response = await response.json();
      //   console.log("Temp response", temp_response);
      //   if (temp_response.check_fail) {
      //     myForm.setPageState({
      //       ...myForm.pageState,
      //       ["Bilty No"]: "Not possible to add this bilty",
      //     });
      //     return;
      //   }
      if (myForm.pageState.rate != "") {
        // if (
        //   checkIfFieldAlreadyExists(
        //     "item_id",
        //     myForm.pageState.item_id,
        //     myForm.pageState.rate_info
        //   )
        // ) {
          
        //   myForm.setPageState({
        //     ...myForm.pageState,
        //     ["item_name"]: "Already Present",
        //   });
        //   myForm.makeFocusOnParticularField("item_name");
        //   return;
        // }
        let dummyObject = {
          consignor_id: myForm.pageState.consignor_id,
          station_from: myForm.pageState.station_from,
          station_from_name: myForm.pageState.station_from_name,
          station_to: myForm.pageState.station_to,
          station_to_name: myForm.pageState.station_to_name,
          item_id: myForm.pageState.item_id,
          item_name: myForm.pageState.item_name,
          rate: myForm.pageState.rate,
          unit: myForm.pageState.unit,
          consignee: myForm.pageState.consignee,
          consignee_name: myForm.pageState.consignee_name,
        };
        if(dummyObject.item_id == ""){
          dummyObject.item_id = null
        }
        let objectToSave = {
          rate_info: [...myForm.pageState.rate_info, dummyObject],
          item_name: "",
          item_id: "",
          rate: "",
          station_to_name: "",
          consignee: "",
          consignee_name: "",
        //   unit: "",
        };
        console.log(objectToSave);
        myForm.setPageState({
          ...myForm.pageState,
          ...objectToSave,
        });
        myForm.makeFocusOnParticularField("station_to_name");
        return;
      }
      myForm.makeFocusOnParticularField("save_button");
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

  const handleEditSpecificRow = (idx,fieldMapping) => () => {
    const rows = [...myForm.pageState[fieldMapping]];
    let dct = rows[idx];
    if (fieldMapping == "rate_info") {
      dct.rate_info = rows;
      if (
        myForm.pageState.station_to != "" &&
        myForm.pageState.rate != ""
      ) {
        myForm.setPageMode("error");
        myForm.setPopupError("Clear Or Update existing Entry");
        return;
      }
      // rows.splice(idx, 1);
    } else {
      dct.charge_info = rows;
      if (
        myForm.pageState.other_station_to != "" &&
        myForm.pageState.amount != ""
      ) {
        myForm.setPageMode("error");
        myForm.setPopupError("Clear Or Update existing Entry");
        return;
      }
      // rows.splice(idx, 1);
    }
    rows.splice(idx,1);


    if (fieldMapping == "rate_info"){
      console.log("DCT:- ",dct)
      dct.unit = dct.unit.toLowerCase()
      myForm.setPageState({ ...myForm.pageState, ...dct });
    }
    else{
      let newState = {}
      console.log("DCT:- new state ",dct)
      newState.other_station_to = dct.station_to
      newState.other_station_to_name = dct.station_to_name
      newState.other_station_from = dct.station_from
      newState.other_station_from_name = dct.station_from_name
      newState.other_item_name = dct.item_name
      newState.other_item_id = dct.item_id
      newState.consignee_name = dct.consignee_name
      newState.consignee_id = dct.consignee_id
      newState.charge = dct.charge
      newState.charge_type = dct.charge_type
      newState.from_c = String(parseInt(dct.qty_from_case) || 0)
      newState.to_c = String(parseInt(dct.qty_to_case) || 0)
      newState.from_w = String(parseInt(dct.qty_from_kg) || 0)
      newState.to_w = String(parseInt(dct.qty_to_kg) || 0)
      newState.amount = dct.amount
      newState.charge_info = dct.charge_info

      if (newState.consignee_id == null){
        newState.consignee_id = ""
      }
      if (newState.consignee_name == null){
        newState.consignee_name = ""
      }
      if (newState.from_c == "0"){
        newState.from_c = ""
      }
      if (newState.from_w == "0"){
        newState.from_w = ""
      }
      if (newState.to_c == "0"){
        newState.to_c = ""
      }
      if (newState.to_w == "0"){
        newState.to_w = ""
      }
      console.log("Only new state ",newState)
      myForm.setPageState({ ...myForm.pageState, ...newState });
    }

    if (myForm.deleteEntryFromTableCallback != null) {
      console.log("In delete entry");
      myForm.deleteEntryFromTableCallback({ idx: idx, rows: rows });
      return;
    }
    // this.props.setPageState({ ...this.props.pageState, ...dct });
    // this.props.setPageStateByField(this.props.fieldMapping, rows);
  };

  const handleDelete = async () => {
    const url =
      SERVER_URL + "/general_rate/"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rate_info: [],
          station_from: myForm.pageState.station_from,
          station_to: myForm.pageState.station_to
        }),
      });
    let objtosave = {
      rate_info : []
    }
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    myForm.setPageState({ ...myForm.pageState, ...objtosave });
    // const temp_response = await response.json();
    // if (temp_response.is_deleted) {
    //   myForm.setPageMode("write");
      // window.location.reload();
      return;
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
      </div>

      <div className="form-header">General Rate Master</div>
      <div onSubmit={myForm.handleSubmit} className="form" noValidate>
        <div className="form-title">
          <div>
            General Rate Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                console.log("Here");
                // if (a.key == "Enter"){
                //   myForm.makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                // }
              }}
            />
          </div>
        </div>
        <div className="form-input-content-block-0">
        </div>
        <div className="chform-row">
          <label className="chform-label">Station From</label>
          <div className="chform-input">
            <Autosuggest
              id={stationFromFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(stationFromFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(stationFromFieldInfo)
              }
              getSuggestionValue={suggestion => suggestion[stationFromFieldInfo.suggestionKeyword]}
              onSuggestionSelected={(a,b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  stationFromFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, stationFromFieldInfo)
              }
              highlightFirstSuggestion ={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: info["name"],
                value: String(myForm.pageState[stationFromFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, stationFromFieldInfo);
                },
                onBlur: () => {
                  stationFromFieldInfo["toValidate"]
                    ? myForm.onblurValidator(stationFromFieldInfo)
                    : {};
                },
                onKeyPress: getGeneralRate,
                disabled: checkDisabledCondition(stationToFieldInfo),
                // onKeyPress: (a) =>
                //   myForm.onKeyPressForKeyNav(a, stationFromFieldInfo),
                // disabled: checkDisabledCondition(stationFromFieldInfo),
              }}
            />
          </div>
          <label className="chform-label">Station To</label>
          <div className="chform-input">
            <Autosuggest
              id={stationToFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(stationToFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(stationToFieldInfo)
              }
              getSuggestionValue={suggestion => suggestion[stationToFieldInfo.suggestionKeyword]}
              onSuggestionSelected={(a,b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  stationToFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, stationToFieldInfo)
              }
              highlightFirstSuggestion ={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: info["name"],
                value: String(myForm.pageState[stationToFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, stationToFieldInfo);
                },
                onBlur: () => {
                  stationToFieldInfo["toValidate"]
                    ? myForm.onblurValidator(stationToFieldInfo)
                    : {};
                },
                onKeyPress: (a) =>
                  myForm.onKeyPressForKeyNav(a, stationToFieldInfo),
                disabled: checkDisabledCondition(stationToFieldInfo),
              }}
            />
          </div>
          <label className="chform-label">Consignee Name</label>
          <div className="chform-input">
            <Autosuggest
              id={consigneeNameFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(consigneeNameFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(consigneeNameFieldInfo)
              }
              getSuggestionValue={suggestion => suggestion[consigneeNameFieldInfo.suggestionKeyword]}
              onSuggestionSelected={(a,b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  consigneeNameFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, consigneeNameFieldInfo)
              }
              highlightFirstSuggestion ={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: info["name"],
                value: String(myForm.pageState[consigneeNameFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, consigneeNameFieldInfo);
                },
                onBlur: () => {
                    consigneeNameFieldInfo["toValidate"]
                    ? myForm.onblurValidator(consigneeNameFieldInfo)
                    : {};
                },
                onKeyPress: (a) =>
                  myForm.onKeyPressForKeyNav(a, consigneeNameFieldInfo),
                disabled: checkDisabledCondition(consigneeNameFieldInfo),
              }}
            />
          </div>
        </div>
        <div className="chform-row">
          <label className="chform-label">Item Name</label>
          <div className="chform-input">
            <Autosuggest
              id={itemFieldInfo["name"]}
              suggestions={myForm.suggestions}
              onSuggestionsFetchRequested={(a) =>
                myForm.onSuggestionsFetchRequested(a, (b) =>
                  myForm.suggestionFetchApi(itemFieldInfo, b)
                )
              }
              onSuggestionsClearRequested={() =>
                myForm.onSuggestionsClearRequested(itemFieldInfo)
              }
              getSuggestionValue={suggestion => suggestion[itemFieldInfo.suggestionKeyword]}
              onSuggestionSelected={(a,b) =>
                myForm.getSuggestionValue(
                  b.suggestion,
                  itemFieldInfo,
                  myForm.performSuggestions,
                  myForm.updatePageStateForGetSuggestion
                )
              }
              renderSuggestion={(a) =>
                myForm.renderSuggestion(a, itemFieldInfo)
              }
              highlightFirstSuggestion ={true}
              ref={(a) => myForm.storeInputReference(a, false)}
              inputProps={{
                //placeholder: info["name"],
                value: String(myForm.pageState[itemFieldInfo["name"]]),
                onChange: (a, b) => {
                  myForm.onChangeAutoSuggest(a, b, itemFieldInfo);
                },
                onBlur: () => {
                  itemFieldInfo["toValidate"]
                    ? myForm.onblurValidator(itemFieldInfo)
                    : {};
                },
                onKeyPress: (a) => myForm.onKeyPressForKeyNav(a, itemFieldInfo),
                disabled: checkDisabledCondition(itemFieldInfo),
              }}
            />
          </div>
          <label className="chform-label">Unit (W/C)</label>
          <select
            className="form-input-wc-dd"
            onChange={(newValue) => {
              myForm.handleChangeForSelect(newValue, "unit");
            }}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "unit")}
            // disabled={checkDisabledCondition({ name: "is_crossing" })}
            value={myForm.pageState["unit"]}
            onKeyPress={(a) => {
              if (a.key == "Enter") {
                a.preventDefault();
                myForm.makeFocusOnParticularField("rate");
              }
            }}
          >
            <option value="w" key="w">
              Weight
            </option>
            <option value="c" key="c">
              Carton
            </option>
          </select>
          <label className="chform-label">Rate</label>
          <input
            className="chform-input"
            type="text"
            name="rate"
            placeholder=""
            value={myForm.pageState["rate"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "rate")}
          />
        </div>
        <div className="table-container">
          <DynamicViewTable
            edit={1}
            delete={1}
            editRowFunction={handleEditSpecificRow}
            tableHeader={partyRateTableHeader}
            tableItems={partyRateTableItems}
            tableValues={myForm.pageState["rate_info"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["rate_info"]}
            fieldMapping="rate_info"
          />
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
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          <button
            onClick={handleDelete}
          >
            Delete All
          </button>
          {myForm.pageState.status == "1" && (
            <button
              onClick={() => {
                let data = {
                  apiUrlTail: myForm.pageState.challan_no,
                  apiType: "generateCwb",
                  apiConfig: challanApiConfig["generateCwb"],
                };
                myForm.performSuggestions(data);
              }}
            >
              Genrate CWB
            </button>
          )}
          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default GeneralRateMasterForm;
