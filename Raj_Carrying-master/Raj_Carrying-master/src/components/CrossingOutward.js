import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./CrossingOutward.css";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/crossingOutward.js";
import { crossingOutApiConfig } from "../config/apiConfig.js";
import { groupInfo, dataObject, validate } from "../config/crossingOutward.js";
import FormColumn from "./FormColumn.js";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";
// import "./CrossingOutward.css";

const CrossingOutwardForm = ({ sessionObject }) => {
  let variablesFromSession = {
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,    
};

//   useEffect(() => {
//       console.log(myForm.pageState, myForm.pageMode);
//   })

  const [ewaySubmitted, setEwaySubmitted] = useState(false);

  const myForm = useForm(
    "CROSSINGOUT",
    validate,
    { ...dataObject, ...variablesFromSession },
    crossingOutApiConfig
  );

  const [biltyObj, setBiltyObj] = useState({});

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
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "transporter_name ",
    suggestionSchema: {
      transporter_name: "transporter_name",
      transporter_id: "transporter_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "^(?:[0-9]+d*|d)$",
    keyboardNavigationMap: {
      Enter: "bilty_type",
    },
    idClearanceNeeded: "consignee_id",
  };

  const transporterFieldValidator = async (e) => {
    if (e.key == "Enter") {
      if (myForm.pageState["transporter_name"] == "") {
      } else {
        myForm.makeFocusOnParticularField("bilty_type");
      }
    }
  };

  const linkBilty = async (e) => {
    if (myForm.pageState["bilty_no"] == "" && e.key == "Enter") {
      myForm.makeFocusOnParticularField("station_to_name");
      return;
    }
    if (e.key == "Enter") {
      let flag = 0;
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
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
        "/bilty/crossing_outward_in/" +
        myForm.pageState["bilty_no"] +
        "?branch_id=" +
        myForm.pageState.created_from +
        "&suffix=" +
        suffix +
        "&flag=" +
        flag +
        "&transporter_id=" +
        myForm.pageState.transporter_id + 
        "&fyear=" + myForm.pageState.fyear_get_bilty + "&companyId=" + myForm.pageState.company_id;

      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["bilty_no"]: "",
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
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["bilty_no"]: "",
        });
        myForm.setPreviousPageMode(myForm.pageMode);
        myForm.setPageMode("error");
        myForm.setPopupError("Not possible to add this bilty");
        return;
      }
      if (
        checkIfFieldAlreadyExists(
          "bilty_no",
          temp_response.bilty_no,
          myForm.pageState.bilty_ids
        )
      ) {
        myForm.setPageState({
          ...myForm.pageState,
          ["bilty_no"]: "",
        });
        myForm.setPreviousPageMode(myForm.pageMode);
        myForm.setPageMode("error");
        myForm.setPopupError("Already present");
        return;
      }
      setBiltyObj(temp_response);
      let dummyObj = {}
      if("crossing_hire" in temp_response){
        dummyObj.crossing_hire = parseFloat(temp_response.crossing_hire) || 0;
      }
      if("crossing_dd" in temp_response){
        dummyObj.crossing_dd = parseFloat(temp_response.crossing_dd) || 0;
      }
      console.log("Dummy object", dummyObj);
      myForm.setPageState({
        ...myForm.pageState,
        ...dummyObj,
      });
      myForm.makeFocusOnParticularField("crossing_hire")
    }
  };

  const otherLinkBilty = async (e) => {
    if (e.key == "Enter") {

      let temp_response = biltyObj

      let partyName = "";
      let total_amount = 0;
      let our_freight = parseFloat(myForm.pageState.our_freight) || 0;
      let to_pay = parseFloat(myForm.pageState.to_pay) || 0;
      let paid = parseFloat(myForm.pageState.paid) || 0;
      let pkgs = parseFloat(myForm.pageState.pkgs) || 0;
      let transporter_freight =
        parseFloat(myForm.pageState.transporter_freight) || 0;
      temp_response.crossing_hire = (parseFloat(myForm.pageState.crossing_hire) || 0) + (parseFloat(myForm.pageState.crossing_dd) || 0);
      let newState = {
        bilty_ids: [...myForm.pageState["bilty_ids"], temp_response],
        ["bilty_no"]: "",
      };
      console.log("Temp response", temp_response);
      if (temp_response.pay_type != "4") {
        our_freight += parseInt(temp_response.total_amount) || 0;
      }
      if (temp_response.pay_type == "1") {
        to_pay += parseInt(temp_response.total_amount) || 0;
      } else if (temp_response.pay_type == "2") {
        paid += parseInt(temp_response.total_amount) || 0;
      }
      pkgs += parseInt(temp_response.no_of_package) || 0;
      transporter_freight += (parseFloat(myForm.pageState.crossing_hire) || 0) + (parseFloat(myForm.pageState.crossing_dd) || 0);
      newState.our_freight = String(our_freight);
      newState.pkgs = String(pkgs);
      newState.to_pay = String(to_pay);
      newState.transporter_freight = String(transporter_freight);
      newState.paid = String(paid);
      console.log("New state", newState);
      console.log("Transporter freight 2:- ", transporter_freight);
      newState.crossing_hire = ""
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.makeFocusOnParticularField("bilty_type");
    }
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

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return false;
    } 
    // else if (fieldInfo.name == "delete_button") {
    //   return false;
    // } 
    else if (
      fieldInfo.name == "cheque_no" &&
      myForm.pageState.payment_type == "1"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if(fieldInfo.name == "cewb_no") {
        return "disabled"
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
    // } else if (
    //   myForm.pageMode == "edit" &&
    //   fieldInfo.name == "transporter_name"
    // ) {
    //   return "disabled";
    // } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
    //   return "disabled";
    } else {
      return "";
    }
  };

  const handleDelete = async () => {
    const url =
      SERVER_URL + "/crossing_outward/?crossing_outward_id=" + myForm.pageState.id + 
            "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;

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

  const handleEditSpecificRow = (idx,fieldMapping) => () => {
    const rows = [...myForm.pageState[fieldMapping]];
    let dct = rows[idx];
    if (myForm.pageState.bilty_no != "") {
      myForm.setPageMode("error");
      myForm.setPopupError("Clear Or Update existing Entry");
      return;
    }
    rows.splice(idx,1);
    console.log("dct", dct);

    /**
     * Getting total sum variables
     */
    let our_freight = parseFloat(myForm.pageState.our_freight) || 0;
    let to_pay = parseFloat(myForm.pageState.to_pay) || 0;
    let paid = parseFloat(myForm.pageState.paid) || 0;
    let pkgs = parseFloat(myForm.pageState.pkgs) || 0;
    let transporter_freight =
      parseFloat(myForm.pageState.transporter_freight) || 0;

    /**
     * Removing sum of the bilty we are editing.
     */
     if (dct.pay_type != "4") {
      our_freight -= parseInt(dct.total_amount) || 0;
    }
    if (dct.pay_type == "1") {
      to_pay -= parseInt(dct.total_amount) || 0;
    } else if (dct.pay_type == "2") {
      paid -= parseInt(dct.total_amount) || 0;
    }
    pkgs -= parseInt(dct.no_of_package) || 0;
    transporter_freight -= parseInt(dct.crossing_hire) || 0;

    let newState = {
      bilty_ids: rows,
      
    }

    newState.our_freight = String(our_freight);
    newState.pkgs = String(pkgs);
    newState.to_pay = String(to_pay);
    newState.transporter_freight = String(transporter_freight);
    newState.paid = String(paid);
    newState.crossing_hire = parseInt(dct.crossing_hire) || 0;
    newState.bilty_no = parseInt(dct.bilty_no) || 0;
    newState.suffix = dct.suffix
    newState.dummy_pkgs = String(dct.no_of_package);
    newState.dummy_weight = String(dct.charge_weight);



    myForm.setPageState({ ...myForm.pageState, ...newState });
    //Yet to set biltyobj
    setBiltyObj(dct);
    myForm.makeFocusOnParticularField("crossing_hire");
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

    tran_freight -= parseInt(biltyObj.crossing_hire) || 0;
    if (biltyObj.pay_type != "4") {
      our_freight -= parseInt(biltyObj.total_amount) || 0;
    }
    if (biltyObj.pay_type == "1") {
      to_pay -= parseInt(biltyObj.total_amount) || 0;
    } else if (biltyObj.pay_type == "2") {
      paid -= parseInt(biltyObj.total_amount) || 0;
    }
    pkgs -= parseInt(biltyObj.no_of_package) || 0;

    newState.transporter_freight = String(tran_freight);
    newState.our_freight = String(our_freight);
    newState.pkgs = String(pkgs);
    newState.to_pay = String(to_pay);
    newState.paid = String(paid);
    newState.balance = String(our_freight - to_pay);
    newState.bilty_ids = infoObject.rows;

    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

  useEffect(() => {
    let transporter_freight =
      parseInt(myForm.pageState.transporter_freight) || 0;
    let to_pay = parseInt(myForm.pageState.to_pay) || 0;
    let balance = parseInt(myForm.pageState.balance) || 0;
    let objectToUpdate = {
      balance: String(to_pay - transporter_freight),
    };
    if (balance != to_pay - transporter_freight) {
      myForm.setPageState({ ...myForm.pageState, ...objectToUpdate });
    }
  }, [myForm.pageState]);

  const handleTransferEway = async () => {
      const crossingOutNo = myForm.pageState.crossing_out_no;
      const transporterId = myForm.pageState.transporter_id;
      const branchId = myForm.pageState.created_from;
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

      const url = SERVER_URL + '/ewb/ewb/transfer/'
                    + `?crossing_outward_no=${crossingOutNo}`
                    + `&branch_id=${branchId}`
                    + `&transporter_id=${transporterId}`
                    + "&companyId=" + myForm.pageState.company_id 
                    + "&fyear=" + fYear_fetch;
      const resp = await fetch(url, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }
      })

      console.log(resp.ok);
      if(!resp.ok) {
        myForm.setPageMode("error");
        myForm.setPopupError("Operation Transfer Eway failed");
      }
      else {
          const data = await resp.json();
          console.log({data});
          if(data.flag == true) {
            myForm.setPageMode("submitted");   
            setEwaySubmitted(true);
          }
          else {
            myForm.setPageMode("error");
            myForm.setPopupError(data.message);
          }
      }
  }

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
                  <div> {ewaySubmitted ? "Eway Transfer" : "Crossing Out Saving"} Successful </div>
                ) : (
                  <div>Error In Crossiong Outward Module </div>
                )}
                <div>
                  <a className="pop-up-close btn" onClick={close}>
                    &times;
                  </a>
                </div>
              </div>
              {myForm.pageMode == "submitted" ? (
                !ewaySubmitted && <div className="pop-up-content">
                  {" "}
                  Crossing Outward is successfully created with the following
                  info:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">
                        Crossing Outward No.
                      </div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.crossing_out_no}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in crossing Outward module with the following info:-
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
                      setEwaySubmitted(false);
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
      <div className="form-header">Crossing Outward</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Crossing Outward No:</label>
            <input
              className="form-input"
              type="text"
              name="crossing_out_no"
              placeholder=""
              value={myForm.pageState.crossing_out_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.crossing_out_no)
              }
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "crossing_out_no")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
            {myForm.internalValidationErrors["challan_no"] && (
              <p>{myForm.internalValidationErrors["challan_no"]}</p>
            )}
            {myForm.pageMode == "view" && (
              <>
                <button
                  onClick={() => {
                    myForm.setPageMode("edit");
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <div className="form-row">
            <label className="form-label">Transporter Name</label>
            <Autosuggest
              id={transporterFieldInfo["name"]}
              name={transporterFieldInfo["name"]}
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
                onKeyPress: transporterFieldValidator,
                disabled: checkDisabledCondition(transporterFieldInfo),
              }}
            />
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
            Crossing Outward Challan Date:{" "}
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
            <label className="form-last_bilty">Last Crossing Outward No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_crossing_no}
            </label>
          </div>
        </div>
        <div className="chform-row">
          <label className="chform-label">Type</label>
          <select
            className="chform-input-suffix"
            name="bilty_type"
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
            name="bilty_no"
            placeholder=""
            value={myForm.pageState["bilty_no"]}
            onChange={myForm.handleChange}
            // onKeyPress={(a) => {
            //   if (a.key == "Enter") {
            //     myForm.makeFocusOnParticularField("suffix");
            //   }
            // }}
            onKeyPress={(e) => {
                if(e.key == "Enter") {
                    if(myForm.pageState["bilty_no"]) {
                        myForm.getFyearsOnKeyEnter(e, "Bilty Inquiry", myForm.pageState["bilty_no"])
                    }
                    else {
                        myForm.makeFocusOnParticularField("station_to_name");
                    }
                }
            }} 
            ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
          />
           <select
                className="chform-input"
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
          <label className="chform-label">Crossing Hire:</label>
          <input
            className="chform-input"
            type="text"
            name="crossing_hire"
            placeholder=""
            value={myForm.pageState["crossing_hire"]}
            onChange={myForm.handleChange}
            onKeyPress={(a) => {
              if (a.key == "Enter") {
                myForm.makeFocusOnParticularField("crossing_dd");
              }
            }}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "crossing_hire")}
          />
          <label className="chform-label">Crossing DD:</label>
          <input
            className="chform-input"
            type="text"
            name="crossing_dd"
            placeholder=""
            value={myForm.pageState["crossing_dd"]}
            onChange={myForm.handleChange}
            onKeyPress={otherLinkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "crossing_dd")}
          />
          <label className="chform-label">Pkgs:</label>
          <input
            className="chform-input-suffix"
            type="text"
            name="dummy_pkgs"
            placeholder=""
            value={myForm.pageState["dummy_pkgs"]}
            onChange={myForm.handleChange}
            onKeyPress={otherLinkBilty}
            disabled={true}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "dummy_pkgs")}
          />
          <label className="chform-label">Weight:</label>
          <input
            className="chform-input-suffix"
            type="text"
            name="dummy_weight"
            placeholder=""
            value={myForm.pageState["dummy_weight"]}
            onChange={myForm.handleChange}
            onKeyPress={otherLinkBilty}
            disabled={true}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "dummy_weight")}
          />
        </div>

        <div className="table-container">
          <DynamicViewTable
            edit={1}
            editRowFunction={handleEditSpecificRow}
            tableHeader={challanBiltyTableHeader}
            tableItems={challanBiltyTableItems}
            tableValues={myForm.pageState["bilty_ids"]}
            setPageStateByField={myForm.setPageStateByField}
            pageStateArray={myForm.pageState["bilty_ids"]}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
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
            {(myForm.pageMode == "edit") && 
                <button
                onClick={async () => {
                    // myForm.setOverlay(true);
                    const branchId = parseInt(sessionObject.sessionVariables.branch_id);
                    const con = parseInt(myForm.pageState.crossing_out_no);
                    const vehicleNo = myForm.pageState.vehicle_no;
                    let data = {
                        apiInputData: {
                            branch_id: branchId,
                            crossing_outward_no: con,
                            vehicle_no: vehicleNo,
                            companyId: myForm.pageState.company_id,
                            fyear: JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch,
                        },
                        apiType: "generateCwb",
                        apiConfig: crossingOutApiConfig.generateCewb,
                    };
                    await myForm.performSuggestions(data);
                    // console.log("!!!", myForm.suggestionApiState);
                    const cewbNo = myForm.suggestionApiState.data.response.cewb_no ?? "";
                    myForm.setPageStateByField("cewb_no", cewbNo);
                }}
            >
                Generate CEWB
            </button>
            }
            {(myForm.pageMode != "write") && 
                <button onClick={handleTransferEway}>
                    Transfer Eway 
                </button>
            }
          {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
        </div>
      </div>
    </div>
  );
};

export default CrossingOutwardForm;
