import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { accountTransactionApiConfig } from "../config/apiConfig.js";
import {
  groupInfo,
  dataObject,
  jvItems,
  jvItemsForCrCp,
  jvHeaders,
  jvHeadersForCrCp,
  validate,
  popupInfo,
} from "../config/AccountTransaction.js";
import DatePicker from "react-datepicker";
import { SERVER_URL } from "../config/config";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import ReactToPrint from "react-to-print";
import TableToPrint from "./ChallanPrint";
import FormColumn from "./FormColumn.js";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const AccountTransaction = ({ sessionObject }) => {
    const location = useLocation();
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  useEffect(() => {
      console.log(myForm.pageState);
  })

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

//   useEffect(() => {
    // const voucher = query.get("voucher_type");
    // // myForm.setPageStateByField("voucher_type", voucher);
    // last_no(voucher);
//   }, []);

  useEffect(() => {
      const voucher = query.get("voucher_type");
      // myForm.setPageStateByField("voucher_type", voucher);
      
      const dataCame = location.state ?? {};

    // console.log(voucherId, myForm.pageState);
      last_no(voucher, dataCame);

  }, []);

  useEffect(() => {
      console.log(myForm.pageState);
  })



  const handleEditSpecificRow = (idx, fieldMapping) => () => {

    localStorage.setItem("idx", idx);

    console.log("handle edit---------------------- for ", fieldMapping);
    console.log("!!! inside edit row: ", idx, " -- ", fieldMapping);
    console.log(myForm.pageState);

    const rows = [...myForm.pageState[fieldMapping]];
    // console.log("!!! all rows: ", rows);

    if (fieldMapping == "account_transaction_info") {
        const type = myForm.pageState.voucher_type;
        let mainField = "";

        if (type == "cr" || type == "br") {
            mainField = "consignee_name";
        }
        else if (type == "cp" || type == "bp" || type == "jv") {
            mainField = "consignor_name";
        }
        
        if (myForm.pageState[mainField] != "") {
            myForm.setPageMode("error");
            myForm.setPopupError("Clear Or Update existing Entry");
            return;
        }

        let dct = rows[idx];
        let totalAmount = myForm.pageState.total_amount;
        // console.log(totalAmount, dct.amount);
        totalAmount -= Number(dct.amount);
        totalAmount = totalAmount.toFixed(2);
        // console.log("my row: ", dct);

        rows.splice(idx, 1);
        // console.log("edited rows:", rows);
        // console.log("DCT:- ", dct)
        // console.log([fieldMapping]);

        myForm.setPageState({ 
            ...myForm.pageState, 
            "total_amount": totalAmount, 
            [fieldMapping]: rows, 
            ...dct 
        });
    }
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.account_transaction_info[infoObject.idx];
    console.log("Bilty objecy", biltyObj);
    let newState = {};
    let total_amount = parseFloat(myForm.pageState.total_amount) || 0;
    console.log(total_amount, parseFloat(biltyObj.amount));

    total_amount -= parseFloat(biltyObj.amount) || 0;

    newState.account_transaction_info = infoObject.rows;
    newState.total_amount = parseFloat(total_amount).toFixed(2);

    console.log("New state", newState);
    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    branch_account_name: String(
      sessionObject.sessionVariables.branch_account_name
    ),
    branch_account_id: String(sessionObject.sessionVariables.branch_account_id),
    // company_id: sessionObject.sessionVariables.company_id,
    // company_id: "1",
    // fYear: "22-23",
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "AccountTransaction",
    validate,
    { ...dataObject, ...variablesFromSession },
    accountTransactionApiConfig
  );

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
      console.log({fieldInfoObject});
    let additionalInfoObject = {};
    if (fieldInfoObject.name == "station_from_name") {
      additionalInfoObject.is_branch = true;
      // additionalInfoObject.pay_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    if((myForm.pageState.voucher_type == "cr" || myForm.pageState.voucher_type == "br") && fieldInfoObject.name == "consignee_name"){
        additionalInfoObject.is_account_related = "1";
        return additionalInfoObject;
    }
    if((myForm.pageState.voucher_type == "cp" || myForm.pageState.voucher_type == "bp") && fieldInfoObject.name == "consignor_name"){
        additionalInfoObject.is_account_related = "1";
        return additionalInfoObject;
    }
    if(myForm.pageState.voucher_type == "jv" && (fieldInfoObject.name == "consignor_name" || fieldInfoObject.name == "consignee_name")){
        additionalInfoObject.is_account_related = "1";
        return additionalInfoObject;
    }
    
    
    if(myForm.pageState.voucher_type == "bp" && fieldInfoObject.name == "consignee_name"){
      additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.subgroup_id = "8";
      return additionalInfoObject;
    }
    if(myForm.pageState.voucher_type == "br" && fieldInfoObject.name == "consignor_name"){
      additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.subgroup_id = "8";
      return additionalInfoObject;
    }
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

  const linkBilty = async (e) => {
    console.log("link");
    if (myForm.pageState.No == "" && e.key == "Enter") {
      console.log("Enter");
      myForm.makeFocusOnParticularField("save_button");
      return;
    }
    if (e.key == "Enter") {
      if (
        myForm.pageState.amount == "" ||
        myForm.pageState.consignor_id == "" ||
        myForm.pageState.consignee_id == "" ||
        myForm.pageState.remarks == ""
      ) {   
        //   myForm.setPopupError("All entries must be filled");
        myForm.makeFocusOnParticularField("save_button");
        //   myForm.setPageMode("error");
        return;
      }
      let amount = parseFloat(myForm.pageState.amount).toFixed(2) || 0;
      let total_amount = parseFloat(myForm.pageState.total_amount) || 0;
      const temp_response = {
        consignor_id: myForm.pageState.consignor_id,
        consignee_id: myForm.pageState.consignee_id,
        consignor_name: myForm.pageState.consignor_name,
        consignee_name: myForm.pageState.consignee_name,
        amount: amount,
        remarks: myForm.pageState.remarks,
        created_from: myForm.pageState.created_from,
        created_by: myForm.pageState.created_by,
        voucher_type: myForm.pageState.voucher_type,
        unique_id: myForm.pageState.unique_id,
        date: new Date(myForm.pageState.input_date),
        clearance_status: myForm.pageState.clearance_status,
      };
      if (myForm.pageState.bank_name != ""){
        temp_response.bank_name = myForm.pageState.bank_name
      }
      if (myForm.pageState.cheque_no != ""){
        temp_response.cheque_no = myForm.pageState.cheque_no
      }
      if (myForm.pageState.id != ""){
        temp_response.voucher_id = myForm.pageState.id
      }
      console.log("Temp response:- ", temp_response);
      let newState = {};
      let newTotalAmount = (parseFloat(amount) + parseFloat(total_amount)).toFixed(2);
    //   console.log(amount, total_amount, newTotalAmount, typeof amount);
      if (myForm.pageState.voucher_type == "jv") {
        temp_response.account_id = 1154;
        newState = {
          account_transaction_info: [
            ...myForm.pageState["account_transaction_info"],
            temp_response
          ],
          consignor_id: "",
          consignee_id: "",
          consignor_name: "",
          consignee_name: "",
          amount: "",
          remarks: "",
          total_amount: newTotalAmount,
        };
      } else if (myForm.pageState.voucher_type == "cr") {
        temp_response.account_id = myForm.pageState.consignor_id;
        newState = {
          account_transaction_info: [
            ...myForm.pageState["account_transaction_info"],
            temp_response
          ],
          consignee_id: "",
          consignee_name: "",
          amount: "",
          remarks: "",
          total_amount: newTotalAmount,
        };
      } else if (myForm.pageState.voucher_type == "br") {
        temp_response.account_id = myForm.pageState.consignor_id;

// NEW CODE FOR SENDING CLERANCE STATUS

        let oldState = myForm.initialpageState["account_transaction_info"];
        console.log("oldState",oldState);
        if(oldState.length > 0){
          let edit_obj = oldState.filter((obj=>obj.consignee_id==temp_response.consignee_id))
          console.log({edit_obj,temp_response});
          if(edit_obj.length > 0){
            console.log({edit_obj,temp_response});
            console.log("THIS IS EDIT OBJ",edit_obj);

            //  COMMENTED FOR SENDING THE CLEARANCE STATUS SAME AS BACKEND 
            
            // let edit_obj_float = parseFloat(edit_obj[0].amount)
    
            // let temp_amt_float = parseFloat(temp_response.amount);
            // if(temp_amt_float != edit_obj_float ){
            //   temp_response.clearance_status = null
  
            // }
            // else{
            //   temp_response.clearance_status = edit_obj[0].clearance_status
            // }
          }
        }
       
        

// END CODE


        newState = {
          account_transaction_info: [
            ...myForm.pageState["account_transaction_info"],
            temp_response
          ],
          consignee_id: "",
          consignee_name: "",
          amount: "",
          remarks: "",
          cheque_no: "",
          bank_name: "",
          total_amount: newTotalAmount,
        };
      } else if (myForm.pageState.voucher_type == "bp") {
        temp_response.account_id = myForm.pageState.consignee_id;
        newState = {
          account_transaction_info: [
            ...myForm.pageState["account_transaction_info"],
            temp_response
          ],
          consignor_id: "",
          consignor_name: "",
          amount: "",
          remarks: "",
          cheque_no: "",
          total_amount: newTotalAmount,
        };
      } else if (myForm.pageState.voucher_type == "cp") {
        temp_response.account_id = myForm.pageState.consignee_id;
        newState = {
          account_transaction_info: [
            ...myForm.pageState["account_transaction_info"],
            temp_response
          ],
          consignor_id: "",
          consignor_name: "",
          amount: "",
          remarks: "",
          total_amount: newTotalAmount,
        };
      }

      const index = localStorage.getItem("idx");

      for(let i = newState.account_transaction_info.length-1; i > index ; i--) {
        let temp = newState.account_transaction_info[i];
        newState.account_transaction_info[i] = newState.account_transaction_info[i-1];
        newState.account_transaction_info[i-1] = temp;
        console.log("NEWSTATE IN LOOP:", newState);
      }

      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.makeFocusOnParticularField("consignor_name");
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
  //     myForm.setPageState({ ...dataObject, ...variablesFromSession });
  //     myForm.setPageMode("write");
  //     window.location.reload();
  //     return;
  //   }
  // };

  const handleDelete = async () => {

    let url = SERVER_URL + "/account_trans/delete_trans?"
        + `voucher_id=${myForm.pageState.id}&`
        + `voucher_type=${myForm.pageState.voucher_type}&`
        + `branch_id=${myForm.pageState.created_from}`
        ;
    
    if (myForm.pageState.voucher_type == "cr" || myForm.pageState.voucher_type == "br"){
      url += "&account_id=" + String(myForm.pageState.consignor_id);
    } else if (myForm.pageState.voucher_type == "cp" || myForm.pageState.voucher_type == "bp"){
      url += "&account_id=" + String(myForm.pageState.consignee_id);
    } else {
      url += "&account_id=1154";
    }

    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    url += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
        .then(response => response.json())
        .then((data) => {
            console.log("data from backend: ", data);
            if (data.Message == "Entry Deleted") {
                myForm.setPageState({ ...dataObject, ...variablesFromSession });
                myForm.setPageMode("write");
                window.location.reload();
                return;
            }
        })

    // const response = await fetch(url, { method: "DELETE" });
    // if (!response.ok) {
    //     console.log("Not able to delete challan");
    //     return;
    // }
    // const temp_response = await response.json();
    // if (temp_response.is_deleted) {
    //     myForm.setPageState({ ...dataObject, ...variablesFromSession });
    //     myForm.setPageMode("write");
    //     window.location.reload();
    //     return;
    // }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (myForm.pageMode == "view") {
      return "disabled";
    } else if (fieldInfo.name == "cewb_no") {
      return "disabled";
    // } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
    //   return "disabled";
    } else if (
      myForm.pageState.voucher_type == "cr" &&
      fieldInfo.name == "consignor_name"
    ) {
      return "disabled";
    } else if (
      myForm.pageState.voucher_type == "cp" &&
      fieldInfo.name == "consignee_name"
    ) {
      return "disabled";
    } else {
      return "";
    }
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (
      myForm.pageState.voucher_type == "cr" &&
      fieldInfo.name == "cheque_no"
    ) {
      return false;
    } else if (
        myForm.pageState.voucher_type == "jv" &&
        fieldInfo.name == "cheque_no"
      ) {
        return false;
    } else if (
      myForm.pageState.voucher_type == "cp" &&
      fieldInfo.name == "cheque_no"
    ) {
      return false;
    } else if (
      myForm.pageState.voucher_type == "cp" &&
      fieldInfo.name == "bank_name"
    ) {
      return false;
    } else if (
      myForm.pageState.voucher_type == "cr" &&
      fieldInfo.name == "bank_name"
    ) {
      return false;
    } else if (
      myForm.pageState.voucher_type == "bp" &&
      fieldInfo.name == "bank_name"
    ) {
      return false;
    } else if (
      myForm.pageState.voucher_type == "jv" &&
      fieldInfo.name == "bank_name"
    ) {
      return false;
    } else {
      return true;
    }
  };

//   useEffect(() => {
//     if(myForm.pageState.voucher_type == "br" || myForm.pageState.voucher_type == "bp") {
//         last_no(myForm.pageState.voucher_type);
//     }
//   }, [myForm.pageState.consignee_id]);

  const last_no = async (e, dataCame) => {

    const voucherId = dataCame?.voucherId ?? "";
    const partyName = dataCame?.partyName ?? "";
    const partyId = dataCame?.partyId ?? "";
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

    let url =
      SERVER_URL +
      "/account_trans/last/" +
      myForm.pageState.created_from +
      "/" +
      e + 
      "?companyId=" + myForm.pageState.company_id + 
      "&fyear=" + fYear_fetch;
      
    if(myForm.pageState.consignee_id != "") {
        url += "&account_id=" + myForm.pageState.consignee_id;
    }

    console.log("Type :- ", myForm.pageState.voucher_type);
    const response = await fetch(url);
    let update = {};
    if (response.ok) {
      let resp = await response.json();
      update = { last_challan_no: resp.id };
      if(e == "br" || e == "bp") {
          if("banks" in resp) {
              update.br_bp_list = resp.banks;
              if(e == "br") {
                  update.consignor_name = resp.banks[0]?.account_name;
                  update.consignor_id = resp.banks[0]?.account_id;
                  update.last_no = resp.banks[0]?.last_no;
            }
              else {
                update.consignee_name = resp.banks[0]?.account_name;
                update.consignee_id = resp.banks[0]?.account_id;
                update.last_no = resp.banks[0]?.last_no;
              }
          }
      }
    }
    update.voucher_type = e;


    if (e == "cr") {
      update.consignor_id = myForm.pageState.branch_account_id;
      update.consignor_name = myForm.pageState.branch_account_name;
    } else if (e == "cp") {
      update.consignee_id = myForm.pageState.branch_account_id;
      update.consignee_name = myForm.pageState.branch_account_name;
    }
    else if(partyName != "") {
        if (e == "br") {
            update.consignor_id = partyId;
            update.consignor_name = partyName;
          } else if (e == "bp") {
            update.consignee_id = partyId;
            update.consignee_name = partyName;
          }
    }
    /**
     * First focus part is moved to here for this page only as 
     * we need to set focus after we have decided what voucer type is this.
     */
    if (update.voucher_type == "cp"){
      myForm.makeFocusOnParticularField("id");
    } else if (update.voucher_type == "cr"){
      myForm.makeFocusOnParticularField("id");
    } else if (update.voucher_type == "bp"){
      console.log("jhrerejrej");
      myForm.makeFocusOnParticularField("consignee_name");
    } else if (update.voucher_type == "br"){
      myForm.refStoreObject.current["consignor_name"].focus();
    } else {
      myForm.refStoreObject.current["id"].focus();
    }

    if(voucherId != "") {
        update.id = voucherId;
    }

    console.log("Update obj", update);
    myForm.setPageState((oldpageState) => ({ ...oldpageState, ...update }))

    if(voucherId != "") {
        const fakeKey = { key: "Enter"}
        myForm.getPageOnKeyEnter(fakeKey, voucherId, myForm.pageState);
        myForm.makeFocusOnParticularField("id");
    }

    // setTimeout(() => {
    //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //     if(voucherId != "") {
    //         const fakeKey = { key: "Enter"}
    //         myForm.getPageOnKeyEnter(fakeKey, voucherId, myForm.pageState);
    //     }
    // }, 5000);
  };

  

  const getTitleName = () => {
    if (myForm.pageState.voucher_type == "cr") {
      return "Cash Receipt";
    }
    if (myForm.pageState.voucher_type == "cp") {
      return "Cash Payment";
    }
    if (myForm.pageState.voucher_type == "br") {
      return "Bank Receipt";
    }
    if (myForm.pageState.voucher_type == "bp") {
      return "Bank Payment";
    }
    if (myForm.pageState.voucher_type == "jv") {
      return "Journal Voucher";
    }
  };

  const getTransporterName = () => {
    if (myForm.pageState.voucher_type == "cr") {
      return "Cash Type";
    }
    if (myForm.pageState.voucher_type == "cp") {
      return "Cash Type";
    }
    if (myForm.pageState.voucher_type == "br") {
      return "Bank Name";
    }
    if (myForm.pageState.voucher_type == "bp") {
      return "Bank Name";
    }
    if (myForm.pageState.voucher_type == "jv") {
      return "";
    }
  };

  let partyNameFieldInfo = {
    label: "Party Name",
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
      conditionalNav: true,
      conditionalNavFunct: (pageState) => {
        if (pageState.voucher_type == "cp") {
          return "amount";
        }
        else if (pageState.voucher_type == "bp") {
          return "amount";
        }
        else if (pageState.voucher_type == "br") {
          return "id";
        }
        else if (pageState.voucher_type == "jv") {
          return "consignee_name";
        }
        else {
          return "amount";
        }
      },
    },
    idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  let RemarksFieldInfo = {
    label: "Remarks",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "remarks",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getNarrationSuggestions",
    url: SERVER_URL + "/narration/filter/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionSchema: {
      remarks: "name",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      conditionalNav: true,
      conditionalNavFunct: (pageState) => {
        if(pageState.voucher_type != "cr" && pageState.voucher_type != "br"){
          return partyNameFieldInfo['name'];
        }
        else if(pageState.voucher_type != "cp" && pageState.voucher_type != "bp"){
          return consigneeNameFieldInfo['name'];
        }
      },
    },
    // idClearanceNeeded: "consignor_id",
    inputDataNeededInSuggestions: false,
    // inputDataFilter: {
    //   pay_type: "same",
    // },
  };

  let consigneeNameFieldInfo = {
    label: "Party Name",
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
      consignee_gst: "consignee_gst",
      consignee_id: "consignee_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      conditionalNav: true,
      conditionalNavFunct: (pageState) => {
        if (pageState.voucher_type == "cp") {
          return "amount";
        }
        else if (pageState.voucher_type == "bp") {
          return "id";
        }
        else if (pageState.voucher_type == "cr") {
          return "amount";
        }
        else if (pageState.voucher_type == "jv") {
          return "amount";
        }
        else if (pageState.voucher_type == "br") {
          return "amount";
        }
        else {
          return "consignee_name";
        }
      },
    },
    idClearanceNeeded: "consignee_id",
    inputDataNeededInSuggestions: false,
    inputDataFilter: {
      pay_type: "same",
    },
  };

  const getDebitParty = () => {
    return (
      <>
              <Autosuggest
      id={partyNameFieldInfo["name"]}
      suggestions={myForm.suggestions}
      onSuggestionsFetchRequested={(a) =>
        myForm.onSuggestionsFetchRequestedDebounced(
          a,
          (b) =>
            myForm.suggestionFetchApi(
              partyNameFieldInfo,
              b,
              getAdditionalInfoForSuggestionFetch(partyNameFieldInfo)
            )
        )
      }
      onSuggestionsClearRequested={() =>
        myForm.onSuggestionsClearRequested(partyNameFieldInfo)
      }
      getSuggestionValue={(suggestion) =>
        suggestion[partyNameFieldInfo.suggestionKeyword]
      }
      onSuggestionSelected={(a, b) =>
        myForm.getSuggestionValue(
          b.suggestion,
          partyNameFieldInfo,
          myForm.performSuggestions,
          myForm.updatePageStateForGetSuggestion
        )
      }
      renderSuggestion={(a) =>
        myForm.renderSuggestion(a, partyNameFieldInfo)
      }
      highlightFirstSuggestion={true}
      ref={(a) => myForm.storeInputReference(a, false)}
      inputProps={{
        placeholder: partyNameFieldInfo["placeholder"],
        value: String(myForm.pageState[partyNameFieldInfo["name"]]),
        onChange: (a, b) => {
          myForm.onChangeAutoSuggest(a, b, partyNameFieldInfo);
        },
        onBlur: () => {
          partyNameFieldInfo["toValidate"]
            ? myForm.onblurValidator(partyNameFieldInfo)
            : {};
        },
        onKeyPress: (a) =>
          myForm.onKeyPressForKeyNav(a, partyNameFieldInfo),
        disabled: checkDisabledCondition(partyNameFieldInfo),
      }}
    />
    {myForm.internalValidationErrors[partyNameFieldInfo["name"]] && (
      <p>
        {myForm.internalValidationErrors[partyNameFieldInfo["name"]]}
      </p>
    )}
      </>
    );
  }

  const getCreditParty = () => {
    return (
      <>
                      <Autosuggest
                id={consigneeNameFieldInfo["name"]}
                suggestions={myForm.suggestions}
                onSuggestionsFetchRequested={(a) =>
                  myForm.onSuggestionsFetchRequestedDebounced(
                    a,
                    (b) =>
                      myForm.suggestionFetchApi(
                        consigneeNameFieldInfo,
                        b,
                        getAdditionalInfoForSuggestionFetch(consigneeNameFieldInfo)
                      )
                  )
                }
                onSuggestionsClearRequested={() =>
                  myForm.onSuggestionsClearRequested(consigneeNameFieldInfo)
                }
                getSuggestionValue={(suggestion) =>
                  suggestion[consigneeNameFieldInfo.suggestionKeyword]
                }
                onSuggestionSelected={(a, b) =>
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
                highlightFirstSuggestion={true}
                ref={(a) => myForm.storeInputReference(a, false)}
                inputProps={{
                  placeholder: consigneeNameFieldInfo["placeholder"],
                  value: String(
                    myForm.pageState[consigneeNameFieldInfo["name"]]
                  ),
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
              {myForm.internalValidationErrors[
                consigneeNameFieldInfo["name"]
              ] && (
                <p>
                  {
                    myForm.internalValidationErrors[
                      consigneeNameFieldInfo["name"]
                    ]
                  }
                </p>
              )}
      </>
    )
  }

  const getNarration = () => {
    return (
      <>
              <Autosuggest
      id={RemarksFieldInfo["name"]}
      suggestions={myForm.suggestions}
      onSuggestionsFetchRequested={(a) =>
        myForm.onSuggestionsFetchRequestedDebounced(
          a,
          (b) =>
            myForm.suggestionFetchApi(
              RemarksFieldInfo,
              b,
              getAdditionalInfoForSuggestionFetch(RemarksFieldInfo)
            )
        )
      }
      onSuggestionsClearRequested={() =>
        myForm.onSuggestionsClearRequested(RemarksFieldInfo)
      }
      getSuggestionValue={(suggestion) =>
        suggestion[RemarksFieldInfo.suggestionKeyword]
      }
      onSuggestionSelected={(a, b) =>
        myForm.getSuggestionValue(
          b.suggestion,
          RemarksFieldInfo,
          myForm.performSuggestions,
          myForm.updatePageStateForGetSuggestion
        )
      }
      renderSuggestion={(a) =>
        myForm.renderSuggestion(a, RemarksFieldInfo)
      }
      highlightFirstSuggestion={true}
      ref={(a) => myForm.storeInputReference(a, false)}
      inputProps={{
        placeholder: RemarksFieldInfo["placeholder"],
        value: String(myForm.pageState[RemarksFieldInfo["name"]]),
        onChange: (a, b) => {
          myForm.onChangeAutoSuggest(a, b, RemarksFieldInfo);
        },
        onBlur: () => {
          RemarksFieldInfo["toValidate"]
            ? myForm.onblurValidator(RemarksFieldInfo)
            : {};
        },
        onKeyPress: (a) =>
        {linkBilty(a);
          myForm.onKeyPressForKeyNav(a, RemarksFieldInfo);}
        // disabled: checkDisabledCondition(RemarksFieldInfo),
      }}
    />
    {myForm.internalValidationErrors[RemarksFieldInfo["name"]] && (
      <p>
        {myForm.internalValidationErrors[RemarksFieldInfo["name"]]}
      </p>
    )}
      </>
    );
  }

  const getBpDropdown = () => {
      return <select
            name="consignee_name"
            // value={myForm.pageState.consignee_name}
            onChange={(e) => {
                // console.log(e);
                const tmp = e.target.value.split("$");
                myForm.setPageState((oldState) => ({
                    ...oldState,
                    consignee_id: tmp[0],
                    consignee_name: tmp[1],
                    last_challan_no: tmp[2],
                }))
            }}
            autoFocus={true}
            onKeyPress={(e) => {
                if(e.key == "Enter") {
                    e.preventDefault();
                    myForm.makeFocusOnParticularField("id");
                }
            }}
        >
          {myForm.pageState.br_bp_list.map(obj => <option value={obj.account_id + "$" + obj.account_name + "$" + obj.last_no}> {obj.account_name}  </option>)}
      </select>
  }
  const getBrDropdown = () => {
      return <select
            name="consignor_name"
            // value={myForm.pageState.consignor_name}
            onChange={(e) => {
                const tmp = e.target.value.split("$");
                // console.log(tmp);
                myForm.setPageState((oldState) => ({
                    ...oldState,
                    consignor_id: tmp[0],
                    consignor_name: tmp[1],
                    last_challan_no: tmp[2],
                }))
            }}
            autoFocus={true}
            onKeyPress={(e) => {
                if(e.key == "Enter") {
                    e.preventDefault();
                    myForm.makeFocusOnParticularField("id");
                }
            }}
        >
          {myForm.pageState.br_bp_list.map(
              obj => <option 
                value={obj.account_id + "$" + obj.account_name + "$" + obj.last_no}> 
                {obj.account_name} 
              </option>)
            }
      </select>
  }
console.log(myForm.initialpageState,"myForm");
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
      </div>

      <div className="form-header">{getTitleName()}</div>
      <div
        onSubmit={myForm.handleSubmit}
        className="form"
        noValidate
        style={{ overflow: "auto" }}
      >
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">{getTransporterName()}</label>
            {
              (myForm.pageState.voucher_type == "cr") && 
              getDebitParty()
            }
            {
              (myForm.pageState.voucher_type == "cp") && 
              getCreditParty()
            }
            {
              (myForm.pageState.voucher_type == "br") && 
              getBrDropdown()
            }
            {
              (myForm.pageState.voucher_type == "bp") && 
              getBpDropdown()
            }
          </div>
          <div className="form-row">
            <label className="form-label">{"Voucher No."}</label>
            <input
              className="form-input"
              type="text"
              name="id"
              placeholder=""
              value={myForm.pageState.id}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.id)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "id")}
              disabled={checkDisabledCondition({ name: "id" })}
            />
            {myForm.internalValidationErrors["id"] && (
              <p>{myForm.internalValidationErrors["id"]}</p>
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
                <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
              </>
            )}
          </div>
          <div>
            Date:{" "}
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  if (myForm.pageState.voucher_type == "cr") {
                    myForm.makeFocusOnParticularField("consignee_name");
                  } 
                  else if (myForm.pageState.voucher_type == "br") {
                    myForm.makeFocusOnParticularField("consignee_name");
                  } 
                  else if (myForm.pageState.voucher_type == "bp") {
                    myForm.makeFocusOnParticularField("consignor_name");
                  } 
                  else {
                    myForm.makeFocusOnParticularField("consignor_name");
                  }
                }
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">
              {"Last " + getTitleName() + " No:"}
            </label>
            <label className="form-last_bilty">
              {console.log("this is pagestate",myForm.pageState.last_challan_no)}
              {myForm.pageState.last_challan_no}
            </label>
          </div>
        </div>
        <div className="form-input-content-block-0">
          <div className="form-field-left">
            <div
              className={partyNameFieldInfo["className"]}
              key={partyNameFieldInfo["name"]}
            >
              {
                myForm.pageState.voucher_type != "cr" && 
                myForm.pageState.voucher_type != "br" &&
                (<label className={partyNameFieldInfo["labelClassName"]}>
                {myForm.pageState.consignor_label}
                </label>)
              }
              {myForm.pageState.voucher_type != "cr" && 
               myForm.pageState.voucher_type != "br" && 
              getDebitParty()}
            </div>
            <div
              className={consigneeNameFieldInfo["className"]}
              key={consigneeNameFieldInfo["name"]}
            >
              {
                myForm.pageState.voucher_type != "cp" && 
                myForm.pageState.voucher_type != "bp" &&
                (<label className={partyNameFieldInfo["labelClassName"]}>
                {myForm.pageState.consignee_label}
                </label>)
              }
              {myForm.pageState.voucher_type != "cp" && 
               myForm.pageState.voucher_type != "bp" && 
              getCreditParty()}
            </div>
            <div className="form-row">
              <label className="form-label">Amount</label>
              <input
                className="form-input"
                type="number"
                name="amount"
                placeholder=""
                value={myForm.pageState["amount"]}
                onChange={myForm.handleChange}
                onKeyPress={(a) => {
                  if (a.key == "Enter") {
                    if (myForm.pageState.voucher_type == "cr" || myForm.pageState.voucher_type == "cp" || myForm.pageState.voucher_type == "jv"){
                      myForm.makeFocusOnParticularField("remarks");
                    }
                    else {
                      myForm.makeFocusOnParticularField("cheque_no");
                    }
                    
                  }
                }}
                ref={(a) => myForm.storeInputReferenceForSelect(a, "amount")}
              />
            </div>
          </div>
          <div className="form-field-right">
            <div className="form-row">
              {checkVisibilityCondition({ name: "cheque_no" }) && (
                <label className="form-label">Cheque No</label>
              )}
              {checkVisibilityCondition({ name: "cheque_no" }) && (
                <input
                  className="form-input"
                  type="text"
                  name="cheque_no"
                  placeholder=""
                  value={myForm.pageState["cheque_no"]}
                  onChange={myForm.handleChange}
                  onKeyPress={(a) => {
                    if (a.key == "Enter") {
                      if (myForm.pageState.voucher_type == "br"){
                        myForm.makeFocusOnParticularField("bank_name");
                      }
                      else {
                        myForm.makeFocusOnParticularField("remarks");
                      }
                    }
                  }}
                  ref={(a) =>
                    myForm.storeInputReferenceForSelect(a, "cheque_no")
                  }
                />
              )}
            </div>
            <div className="form-row">
              {checkVisibilityCondition({ name: "bank_name" }) && (
                <label className="form-label">Bank name</label>
              )}
              {checkVisibilityCondition({ name: "bank_name" }) && (
                <input
                  className="form-input"
                  type="text"
                  name="bank_name"
                  placeholder=""
                  value={myForm.pageState["bank_name"]}
                  onChange={myForm.handleChange}
                  onKeyPress={(a) => {
                    if (a.key == "Enter") {
                      myForm.makeFocusOnParticularField("remarks");
                    }
                  }}
                  ref={(a) =>
                    myForm.storeInputReferenceForSelect(a, "bank_name")
                  }
                />
              )}
            </div>
            <div className="form-row">
              <label className="form-label">Remarks</label>
              {getNarration()}
            </div>
            {/* <div className="form-row">
              <label className="form-label">Cheque No</label>
              <input
                className="form-input"
                type="text"
                name="cheque_no"
                placeholder=""
                value={myForm.pageState["cheque_no"]}
                onChange={myForm.handleChange}
                onKeyPress={(a) => {
                  if (a.key == "Enter") {
                    myForm.makeFocusOnParticularField("amount");
                  }
                }}
                ref={(a) => myForm.storeInputReferenceForSelect(a, "cheque_no")}
              />
            </div> */}
            <div className="form-row">
              <label className="form-label">Total Amount</label>
              <input
                className="form-input"
                type="text"
                name="remarks"
                placeholder=""
                value={myForm.pageState["total_amount"]}
                onChange={myForm.handleChange}
                // ref={(a) => myForm.storeInputReferenceForSelect(a, "remarks")}
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <DynamicViewTable
            // checkBox={1}
            edit={1}
            delete={1}
            editRowFunction={handleEditSpecificRow}
            tableHeader={
                (myForm.pageState.voucher_type == "cp" || myForm.pageState.voucher_type == "cr") 
                ? jvHeadersForCrCp
                : jvHeaders
            }
            tableItems={
                (myForm.pageState.voucher_type == "cp" || myForm.pageState.voucher_type == "cr") 
                ? jvItemsForCrCp
                : jvItems
            }
            tableValues={myForm.pageState["account_transaction_info"]}
            setPageStateByField={myForm.setPageStateByField}
            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
            pageStateArray={myForm.pageState["account_transaction_info"]}
            fieldMapping="account_transaction_info"
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

          {/* <ReactToPrint
            trigger={() => <button>Print this out!</button>}
            content={(myForm) => TableToPrint.componentRef}
          />
          <div style={{ display: "none" }}>
            <TableToPrint
              fields={myForm}
              ref={(el) => (TableToPrint.componentRef = el)}
            />
          </div> */}
          {myForm.pageState.status == "1" && (
            <button
              onClick={() => {
                let data = {
                  apiUrlTail: myForm.pageState.challan_no,
                  apiType: "generateCwb",
                  apiConfig: accountTransactionApiConfig["generateCwb"],
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

export default AccountTransaction;
