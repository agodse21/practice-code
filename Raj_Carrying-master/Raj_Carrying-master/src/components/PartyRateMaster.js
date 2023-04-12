import React, { useRef } from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./ChallanForm.css";
import "./Form.css";
import { partyRateMasterApiConfig } from "../config/apiConfig.js";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReportExcel from './ReportExcel';
import {
    dataObject,
    validate,
    groupInfo,
    popupInfo,
    partyRateTableHeader,
    partyRateTableItems,
    otherRateTableHeader,
    otherRateTableItems,
} from "../config/PartyRateMaster";

import DatePicker from "react-datepicker";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";

const PartyRateMasterForm = ({ sessionObject }) => {
    let variablesFromSession = {
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
    };

    const download_ref = useRef(null);

    const myForm = useForm(
        "PARTYRATEMASTER",
        validate,
        { ...dataObject, ...variablesFromSession },
        partyRateMasterApiConfig
    );

    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };

    // React.useEffect(() => {
    //     console.log(myForm.pageState);   
    // })

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
    const checkIfFieldAlreadyExistsObject = (objectToCompare, arrayToCheck) => {
        let dummyObject = {};
        let output = {};
        let allMatched = true;
        for (let i = 0; i < arrayToCheck.length; i++) {
            dummyObject = arrayToCheck[i];
            allMatched = true;
            objectToCompare.unit = objectToCompare.unit.toUpperCase()
            for (let key in objectToCompare) {
                if (key in dummyObject && dummyObject[key] == objectToCompare[key]) {
                    continue
                }
                else {
                    allMatched = false;
                }
            }
            if (allMatched) {
                output = { status: true, id: i }
                return true
            }
        }
        output = { status: false, id: 0 }
        return false
    };

    const getPartyRate = async (e) => {
        if (e.key == "Enter") {
            const url = SERVER_URL + "/party_rate/get";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    // station_from: myForm.pageState.station_from,
                    // station_to: myForm.pageState.station_to,
                    consignor_id: myForm.pageState.consignor_id,
                }),
            });
            const resp = await response.json();
            let chargeMap = {
                1: "Bilty Charge",
                2: "DD Charge",
                3: "Collection Charge",
                4: "Hamali",
                5: "Marfatiya Charge"
            };

            let chargeTypeMap = {
                1: "Bilty Wise",
                2: "Day Wise",
                3: "Package Wise",
                4: "Weight Wise",
                5: "Vehicle Wise",
            };

            for (let i = 0; i < resp.charge_info.length; i++) {
                if ("charge" in resp.charge_info[i]) {
                    resp.charge_info[i].charge_name =
                        chargeMap[resp.charge_info[i].charge];
                }
                if ("charge_type" in resp.charge_info[i]) {
                    resp.charge_info[i].charge_type_name =
                        chargeTypeMap[resp.charge_info[i].charge_type];
                }
            }

            myForm.setPageState({ ...myForm.pageState, ...resp });
            myForm.makeFocusOnParticularField("station_from_name");
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
            Enter: "item_name",
        },
        valueVerificationFromSuggestionNeeded: true,
        valueVerificationCompulsionField: "station_to",
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
            Enter: "consignor_gst",
        },
        idClearanceNeeded: "consignor_id",
        inputDataNeededInSuggestions: false,
        inputDataFilter: {
            pay_type: "same",
        },
    };

    let partyGstFieldInfo = {
        label: "Party GST",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "consignor_gst",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getConsignorSuggestions",
        url: SERVER_URL + "/consignor/",
        suggestionKeyword: "consignor_gst",
        suggestionKeywordForFetchApiArgs: "gst",
        suggestionChooseQueryKeyword: "consignor_id",
        suggestionSchema: {
            consignor_name: "consignor_name",
            consignor_gst: "consignor_gst",
            consignor_id: "consignor_id",
        },
        apiCallRequiredOnGetValue: true,
        toValidate: false,
        regExpValidation:
            "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
        keyboardNavigationMap: {
            Enter: "station_from_name",
        },
        idClearanceNeeded: "consignor_id",
    };

    let otherStationFromFieldInfo = {
        label: "Station From",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "other_station_from_name",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getCitySuggestions",
        url: SERVER_URL + "/branch/",
        suggestionKeyword: "name",
        suggestionKeywordForFetchApiArgs: "name",
        suggestionChooseQueryKeyword: "branch_id",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            branch_id: "other_station_from",
            name: "other_station_from_name",
        },
        toValidate: true,
        regExpValidation: "[a-zA-z]",
        keyboardNavigationMap: {
            Enter: "other_station_to_name",
        },
        valueVerificationFromSuggestionNeeded: true,
        valueVerificationCompulsionField: "other_station_from",
    };

    let otherStationToFieldInfo = {
        label: "Station To",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "other_station_to_name",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getCitySuggestions",
        url: SERVER_URL + "/branch/",
        suggestionKeyword: "name",
        suggestionKeywordForFetchApiArgs: "name",
        suggestionChooseQueryKeyword: "branch_id",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            branch_id: "other_station_to",
            name: "other_station_to_name",
        },
        toValidate: true,
        regExpValidation: "[a-zA-z]",
        keyboardNavigationMap: {
            Enter: "other_item_name",
        },
        valueVerificationFromSuggestionNeeded: true,
        valueVerificationCompulsionField: "other_station_to",
    };

    let otherItemFieldInfo = {
        type: "text",
        name: "other_item_name",
        label: "Item Name",
        className: "form-control-large-col",
        apiConfigKey: "getItemSuggestions",
        url: SERVER_URL + "/item/",
        suggestionKeyword: "name",
        suggestionKeywordForFetchApiArgs: "name",
        suggestionChooseQueryKeyword: "item_id",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            name: "other_item_name",
            item_id: "other_item_id",
        },
        newRowFocus: true,
        keyboardNavigationMap: {
            Enter: "consignee_name",
        },
        // isTable: true,
        // parentName: "item_in",
        toValidate: true,
        idClearanceNeeded: "other_item_id",
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
            Enter: "charge",
        },
        idClearanceNeeded: "consignee_id",
        inputDataNeededInSuggestions: false,
        inputDataFilter: {
            pay_type: "same",
        },
    };

    let consigneeGstFieldInfo = {
        label: "Party GST",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "consignee_gst",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getConsignorSuggestions",
        url: SERVER_URL + "/consignor/",
        suggestionKeyword: "consignee_gst",
        suggestionKeywordForFetchApiArgs: "gst",
        suggestionChooseQueryKeyword: "consignee_id",
        suggestionSchema: {
            consignor_name: "consignee_name",
            consignor_gst: "consignee_gst",
            consignor_id: "consignee_id",
        },
        apiCallRequiredOnGetValue: true,
        toValidate: false,
        regExpValidation:
            "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
        keyboardNavigationMap: {
            Enter: "station_from_name",
        },
        idClearanceNeeded: "consignee_id",
    };

    const handleRemoveSpecificRow = (idx) => () => {
        console.log("IN remove, BBB ", idx)
        const rows = [...this.props.pageStateArray];
        console.log("IN remove, ", idx)
        rows.splice(idx, 1);
        if (this.props.deleteEntryFromTableCallback != null) {
            this.props.deleteEntryFromTableCallback({ idx: idx, rows: rows });
            return;
        }
        // let dct = rows[idx]
        // dct.rate_info = rows
        // this.props.setPageState({ ...this.props.pageState, ...dct });
        this.props.setPageStateByField(this.props.fieldMapping, rows);
    };

    const handleRemoveAllRow = () => {
        let dct = { rate_info: [] }
        myForm.setPageState({ ...myForm.pageState, ...dct });
    };

    const handleEditSpecificRow = (idx, fieldMapping) => () => {
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
        rows.splice(idx, 1);


        if (fieldMapping == "rate_info") {
            console.log("DCT:- ", dct)
            dct.unit = dct.unit.toLowerCase()
            myForm.setPageState({ ...myForm.pageState, ...dct });
        }
        else {
            let newState = {}
            console.log("DCT:- new state ", dct)
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

            if (newState.consignee_id == null) {
                newState.consignee_id = ""
            }
            if (newState.consignee_name == null) {
                newState.consignee_name = ""
            }
            if (newState.from_c == "0") {
                newState.from_c = ""
            }
            if (newState.from_w == "0") {
                newState.from_w = ""
            }
            if (newState.to_c == "0") {
                newState.to_c = ""
            }
            if (newState.to_w == "0") {
                newState.to_w = ""
            }
            console.log("Only new state ", newState)
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

    const handleRemoveAllRowCharge = () => {
        let dct = { charge_info: [] }
        myForm.setPageState({ ...myForm.pageState, ...dct });
    };

    const linkBilty = async (e) => {
        console.log("LINK BILTY")
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
            if (
                myForm.pageState.station_to != "" &&
                myForm.pageState.station_from != ""
            ) {
                if (
                    myForm.pageState.item_name == "" ||
                    myForm.pageState.item_id == "" ||
                    myForm.pageState.item_id == null
                ) {
                    myForm.setPageMode("error");
                    myForm.setPopupError("Entering valid item is mandatory");
                    console.log("MMM")
                    return;
                }
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
                    commission: myForm.pageState.commission,
                    // refund: myForm.pageState.refund,
                };
                let objectToCompare = {
                    station_from: dummyObject.station_from,
                    station_to: dummyObject.station_to,
                    item_id: dummyObject.item_id,
                    unit: dummyObject.unit,
                    // rate:dummyObject.rate
                }
                if (dummyObject.unit == "f") {
                    dummyObject.truck_size = myForm.pageState.truck_size;
                    objectToCompare.truck_size = dummyObject.truck_size
                }

                // let exits = checkIfFieldAlreadyExistsObject(
                //   objectToCompare,
                //   myForm.pageState.rate_info
                // )
                // if(exits.status){
                //   console.log("In If",exits.id)  
                // handleRemoveSpecificRow(exits.id)
                // console.log("After function")}
                // console.log("Exists :- ",exits)

                if (
                    checkIfFieldAlreadyExistsObject(
                        objectToCompare,
                        myForm.pageState.rate_info
                    )
                ) {

                    myForm.setPageMode("error");
                    myForm.setPopupError("entry already exists");
                    return;
                }
                let objectToSave = {
                    rate_info: [dummyObject, ...myForm.pageState.rate_info],
                    // item_name: "",
                    // item_id: "",
                    station_to: "",
                    station_to_name: "",
                    rate: "",
                    // unit: "",
                    commission: "",
                    // refund: "",
                };
                myForm.setPageState({
                    ...myForm.pageState,
                    ...objectToSave,
                });
                myForm.makeFocusOnParticularField("station_from_name");
                return;
            }
            myForm.makeFocusOnParticularField("other_station_from_name");
        }
    };

    const otherLinkBilty = async (e) => {
        if (e.key == "Enter") {
            if (myForm.pageState.from_w != "" && myForm.pageState.from_c != "") {
                myForm.setPageMode("error");
                myForm.setPopupError(
                    "Value of From(w) and From(c) can't exist together."
                );
                return;
            }
            if (myForm.pageState.to_w != "" && myForm.pageState.to_c != "") {
                myForm.setPageMode("error");
                myForm.setPopupError("Value of To(w) and To(c) can't exist together.");
                return;
            }

            if (myForm.pageState.amount != "") {
                let dummyObject = {
                    consignor_id: myForm.pageState.consignor_id,
                    station_from: myForm.pageState.other_station_from,
                    station_from_name: myForm.pageState.other_station_from_name,
                    station_to: myForm.pageState.other_station_to,
                    station_to_name: myForm.pageState.other_station_to_name,
                    item_id: myForm.pageState.other_item_id,
                    item_name: myForm.pageState.other_item_name,
                    consignee_id: myForm.pageState.consignee_id,
                    consignee_name: myForm.pageState.consignee_name,
                    qty_from_kg: myForm.pageState.from_w,
                    qty_to_kg: myForm.pageState.to_w,
                    qty_from_case: myForm.pageState.from_c,
                    qty_to_case: myForm.pageState.to_c,
                    amount: myForm.pageState.amount,
                    charge: myForm.pageState.charge,
                    charge_type: myForm.pageState.charge_type,
                    created_by: myForm.pageState.created_by,
                    created_from: myForm.pageState.created_from,
                };

                for (let key in dummyObject) {
                    if (dummyObject[key] == "") {
                        dummyObject[key] = null;
                    }
                }

                let chargeMap = {
                    1: "Bilty Charge",
                    2: "DD Charge",
                    3: "Collection Charge",
                    4: "Hamali",
                    5: "Marfatiya Charge"
                };

                let chargeTypeMap = {
                    1: "Bilty Wise",
                    2: "Day Wise",
                    3: "Package Wise",
                    4: "Weight Wise",
                    5: "Vehicle Wise",
                    6: "Fix",
                };

                dummyObject.charge_name = chargeMap[myForm.pageState.charge];
                dummyObject.charge_type_name =
                    chargeTypeMap[myForm.pageState.charge_type];

                let objectToSave = {
                    charge_info: [...myForm.pageState.charge_info, dummyObject],
                    amount: "",
                    other_station_to_name: "",
                    from_w: "",
                    from_c: "",
                    other_station_to: "",
                    to_w: "",
                    to_c: "",
                    consignee_id: "",
                    consignee_gst: "",
                    consignee_name: "",
                    other_item_id: "",
                    other_item_name: "",
                };
                myForm.setPageState({
                    ...myForm.pageState,
                    ...objectToSave,
                });
                myForm.makeFocusOnParticularField("other_station_from_name");
                return;
            }
            myForm.makeFocusOnParticularField("save_button");
        }
    };

    const checkVisibilityCondition = (fieldInfo) => {
        if (fieldInfo.name == "edit_button") {
            return false;
        } else if (fieldInfo.name == "truck_size" && myForm.pageState.unit != "f") {
            return false;
        } else {
            return true;
        }
    };

    const checkDisabledCondition = (fieldInfo) => {
        if (fieldInfo.name == "consignor_gst") {
            return "disabled";
        } else {
            return "";
        }
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

            <div className="form-header">Party Rate Master</div>
            <div onSubmit={myForm.handleSubmit} className="form" noValidate>
                {/* <div className="form-title">
          <div>
            Party Rate Date:{" "}
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
        </div> */}
                <div className="form-input-content-block-0">
                    <div className="form-field-left">
                        <div
                            className={partyNameFieldInfo["className"]}
                            key={partyNameFieldInfo["name"]}
                        >
                            <label className={partyNameFieldInfo["labelClassName"]}>
                                {partyNameFieldInfo["label"]}
                            </label>
                            <Autosuggest
                                id={partyNameFieldInfo["name"]}
                                suggestions={myForm.suggestions}
                                onSuggestionsFetchRequested={(a) =>
                                    myForm.onSuggestionsFetchRequested(a, (b) =>
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
                                    onKeyPress: getPartyRate,
                                    disabled: checkDisabledCondition(partyNameFieldInfo),
                                }}
                            />
                            {myForm.internalValidationErrors[partyNameFieldInfo["name"]] && (
                                <p>
                                    {myForm.internalValidationErrors[partyNameFieldInfo["name"]]}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="form-field-right">
                        <div
                            className={partyGstFieldInfo["className"]}
                            key={partyGstFieldInfo["name"]}
                        >
                            <label className={partyGstFieldInfo["labelClassName"]}>
                                {partyGstFieldInfo["label"]}
                            </label>
                            <Autosuggest
                                id={partyGstFieldInfo["name"]}
                                suggestions={myForm.suggestions}
                                onSuggestionsFetchRequested={(a) =>
                                    myForm.onSuggestionsFetchRequested(a, (b) =>
                                        myForm.suggestionFetchApi(
                                            partyGstFieldInfo,
                                            b,
                                            getAdditionalInfoForSuggestionFetch(partyGstFieldInfo)
                                        )
                                    )
                                }
                                onSuggestionsClearRequested={() =>
                                    myForm.onSuggestionsClearRequested(partyGstFieldInfo)
                                }
                                getSuggestionValue={(suggestion) =>
                                    suggestion[partyGstFieldInfo.suggestionKeyword]
                                }
                                onSuggestionSelected={(a, b) =>
                                    myForm.getSuggestionValue(
                                        b.suggestion,
                                        partyGstFieldInfo,
                                        myForm.performSuggestions,
                                        myForm.updatePageStateForGetSuggestion
                                    )
                                }
                                renderSuggestion={(a) =>
                                    myForm.renderSuggestion(a, partyGstFieldInfo)
                                }
                                highlightFirstSuggestion={true}
                                ref={(a) => myForm.storeInputReference(a, false)}
                                inputProps={{
                                    placeholder: partyGstFieldInfo["placeholder"],
                                    value: String(myForm.pageState[partyGstFieldInfo["name"]]),
                                    onChange: (a, b) => {
                                        myForm.onChangeAutoSuggest(a, b, partyGstFieldInfo);
                                    },
                                    onBlur: () => {
                                        partyGstFieldInfo["toValidate"]
                                            ? myForm.onblurValidator(partyGstFieldInfo)
                                            : {};
                                    },
                                    onKeyPress: (a) =>
                                        myForm.onKeyPressForKeyNav(a, partyGstFieldInfo),
                                    disabled: checkDisabledCondition(partyGstFieldInfo),
                                }}
                            />
                            {myForm.internalValidationErrors[partyGstFieldInfo["name"]] && (
                                <p>
                                    {myForm.internalValidationErrors[partyGstFieldInfo["name"]]}
                                </p>
                            )}
                        </div>
                    </div>
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
                            getSuggestionValue={(suggestion) =>
                                suggestion[stationFromFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
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
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: partyGstFieldInfo["name"],
                                value: String(myForm.pageState[stationFromFieldInfo["name"]]),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, stationFromFieldInfo);
                                },
                                onBlur: () => {
                                    stationFromFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(stationFromFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, stationFromFieldInfo),
                                disabled: checkDisabledCondition(stationFromFieldInfo),
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
                            getSuggestionValue={(suggestion) =>
                                suggestion[stationToFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
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
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: partyGstFieldInfo["name"],
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
                            getSuggestionValue={(suggestion) =>
                                suggestion[itemFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
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
                            highlightFirstSuggestion={true}
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
                    <label className="chform-label">Unit (W/C/FTL)</label>
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
                                if (myForm.pageState.unit != "f") {
                                    myForm.makeFocusOnParticularField("rate");
                                } else {
                                    myForm.makeFocusOnParticularField("truck_size");
                                }
                            }
                        }}
                    >
                        <option value="w" key="w">
                            Weight
                        </option>
                        <option value="c" key="c">
                            Carton
                        </option>
                        <option value="f" key="f">
                            FTL
                        </option>
                    </select>
                    {checkVisibilityCondition({ name: "truck_size" }) && (
                        <>
                            <label className="chform-label">Truck Size</label>
                            <select
                                className="form-input-wc-dd"
                                onChange={(newValue) => {
                                    myForm.handleChangeForSelect(newValue, "truck_size");
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "truck_size")
                                }
                                value={myForm.pageState["truck_size"]}
                                onKeyPress={(a) => {
                                    if (a.key == "Enter") {
                                        a.preventDefault();
                                        myForm.makeFocusOnParticularField("rate");
                                    }
                                }}
                            >
                                <option value="9mt" key="9mt">
                                    9 MT
                                </option>
                                <option value="16mt" key="16mt">
                                    16 MT
                                </option>
                                <option value="20mt" key="20mt">
                                    20 MT
                                </option>
                                <option value="21mt" key="21mt">
                                    21 MT
                                </option>
                                <option value="25mt" key="25mt">
                                    25 MT
                                </option>
                                <option value="30mt" key="30mt">
                                    30 MT
                                </option>
                            </select>
                        </>
                    )}

                    {/* <label className="chform-label">Refund</label>
          <input
            className="chform-input"
            type="text"
            name="refund"
            placeholder=""
            value={myForm.pageState["refund"]}
            onChange={myForm.handleChange}
            onKeyPress={(a) => {
              if (a.key == "Enter") {
                myForm.makeFocusOnParticularField("commission");
              }
            }}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "refund")}
          /> */}
                    <label className="chform-label">Rate</label>
                    <input
                        className="chform-input"
                        type="text"
                        name="rate"
                        placeholder=""
                        value={myForm.pageState["rate"]}
                        onChange={myForm.handleChange}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("commission");
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "rate")}
                    />
                    <label className="chform-label">Commission</label>
                    <input
                        className="chform-input"
                        type="text"
                        name="commission"
                        placeholder=""
                        value={myForm.pageState["commission"]}
                        onChange={myForm.handleChange}
                        onKeyPress={linkBilty}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "commission")}
                    />
                </div>
                <div className="table-container">
                    <div><button
                        onClick={handleRemoveAllRow}
                        className="item-deleteall-btn"
                    >
                        Delete All
                    </button></div>
                    <DynamicViewTable
                        edit={1}
                        delete={1}
                        editRowFunction={handleEditSpecificRow}
                        tableHeader={partyRateTableHeader}
                        tableItems={partyRateTableItems}
                        tableValues={myForm.pageState["rate_info"]}
                        setPageStateByField={myForm.setPageStateByField}
                        setPageState={myForm.setPageState}
                        pageState={myForm.pageState}
                        setPageMode={myForm.setPageMode}
                        setPopupError={myForm.setPopupError}
                        pageStateArray={myForm.pageState["rate_info"]}
                        fieldMapping="rate_info"
                    />

                </div>
                <div className="chform-row">
                    <label className="chform-label">Station From</label>
                    <div className="chform-input">
                        <Autosuggest
                            id={otherStationFromFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequested(a, (b) =>
                                    myForm.suggestionFetchApi(otherStationFromFieldInfo, b)
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(otherStationFromFieldInfo)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[otherStationFromFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    otherStationFromFieldInfo,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, otherStationFromFieldInfo)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: partyGstFieldInfo["name"],
                                value: String(
                                    myForm.pageState[otherStationFromFieldInfo["name"]]
                                ),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, otherStationFromFieldInfo);
                                },
                                onBlur: () => {
                                    otherStationFromFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(otherStationFromFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, otherStationFromFieldInfo),
                                disabled: checkDisabledCondition(otherStationFromFieldInfo),
                            }}
                        />
                    </div>
                    <label className="chform-label">Station To</label>
                    <div className="chform-input">
                        <Autosuggest
                            id={otherStationToFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequested(a, (b) =>
                                    myForm.suggestionFetchApi(otherStationToFieldInfo, b)
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(otherStationToFieldInfo)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[otherStationToFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    otherStationToFieldInfo,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, otherStationToFieldInfo)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: partyGstFieldInfo["name"],
                                value: String(
                                    myForm.pageState[otherStationToFieldInfo["name"]]
                                ),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, otherStationToFieldInfo);
                                },
                                onBlur: () => {
                                    otherStationToFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(otherStationToFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, otherStationToFieldInfo),
                                disabled: checkDisabledCondition(otherStationToFieldInfo),
                            }}
                        />
                    </div>
                    <label className="chform-label">Item Name</label>
                    <div className="chform-input">
                        <Autosuggest
                            id={otherItemFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequested(a, (b) =>
                                    myForm.suggestionFetchApi(otherItemFieldInfo, b)
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(otherItemFieldInfo)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[otherItemFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    otherItemFieldInfo,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, otherItemFieldInfo)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: info["name"],
                                value: String(myForm.pageState[otherItemFieldInfo["name"]]),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, otherItemFieldInfo);
                                },
                                onBlur: () => {
                                    otherItemFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(otherItemFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, otherItemFieldInfo),
                                disabled: checkDisabledCondition(otherItemFieldInfo),
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
                    <label className="chform-label">Consignee GST</label>
                    <div className="chform-input">
                        <Autosuggest
                            id={consigneeGstFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequested(a, (b) =>
                                    myForm.suggestionFetchApi(consigneeGstFieldInfo, b)
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(consigneeGstFieldInfo)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[consigneeGstFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    consigneeGstFieldInfo,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, consigneeGstFieldInfo)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: info["name"],
                                value: String(myForm.pageState[consigneeGstFieldInfo["name"]]),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, consigneeGstFieldInfo);
                                },
                                onBlur: () => {
                                    consigneeGstFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(consigneeGstFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, consigneeGstFieldInfo),
                                disabled: "disabled",
                            }}
                        />
                    </div>
                </div>
                <div className="chform-row">
                    <label className="chform-label">Charge Type</label>
                    <select
                        className="form-input-wc-dd-big"
                        onChange={(newValue) => {
                            myForm.handleChangeForSelect(newValue, "charge");
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "charge")}
                        // disabled={checkDisabledCondition({ name: "is_crossing" })}
                        value={myForm.pageState["charge"]}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                a.preventDefault();
                                myForm.makeFocusOnParticularField("charge_type");
                            }
                        }}
                    >
                        <option value="1" key="1">
                            Bilty Charge
                        </option>
                        <option value="2" key="2">
                            DD Charge
                        </option>
                        <option value="3" key="3">
                            Collection Charge
                        </option>
                        <option value="4" key="4">
                            Hamali
                        </option>
                        <option value="5" key="5">
                            Marfatiya Charge
                        </option>
                    </select>
                    <label className="chform-label">Apply Type</label>
                    <select
                        className="form-input-wc-dd-big"
                        onChange={(newValue) => {
                            myForm.handleChangeForSelect(newValue, "charge_type");
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "charge_type")}
                        // disabled={checkDisabledCondition({ name: "is_crossing" })}
                        value={myForm.pageState["charge_type"]}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                a.preventDefault();
                                myForm.makeFocusOnParticularField("from_c");
                            }
                        }}
                    >
                        <option value="1" key="1">
                            Bilty Wise
                        </option>
                        <option value="2" key="2">
                            Day Wise
                        </option>
                        <option value="3" key="3">
                            Package Wise
                        </option>
                        <option value="4" key="4">
                            Weight Wise
                        </option>
                        <option value="5" key="5">
                            Vehicle Wise
                        </option>
                        <option value="6" key="6">
                            Fix
                        </option>
                    </select>
                </div>
                <div className="chform-row">
                    <label className="chform-label">From(Carton)</label>
                    <input
                        className="chform-input-med"
                        type="text"
                        name="from_c"
                        placeholder=""
                        value={myForm.pageState["from_c"]}
                        onChange={myForm.handleChange}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("to_c");
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "from_c")}
                    />
                    <label className="chform-label">To(Carton)</label>
                    <input
                        className="chform-input-med"
                        type="text"
                        name="to_c"
                        placeholder=""
                        value={myForm.pageState["to_c"]}
                        onChange={myForm.handleChange}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("from_w");
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "to_c")}
                    />
                    <label className="chform-label">From(Weight)</label>
                    <input
                        className="chform-input-med"
                        type="text"
                        name="from_w"
                        placeholder=""
                        value={myForm.pageState["from_w"]}
                        onChange={myForm.handleChange}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("to_w");
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "from_w")}
                    />
                    <label className="chform-label">To(Weight)</label>
                    <input
                        className="chform-input-med"
                        type="text"
                        name="to_w"
                        placeholder=""
                        value={myForm.pageState["to_w"]}
                        onChange={myForm.handleChange}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("amount");
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "to_w")}
                    />
                    <label className="chform-label">Amount</label>
                    <input
                        className="chform-input-med"
                        type="text"
                        name="amount"
                        placeholder=""
                        value={myForm.pageState["amount"]}
                        onChange={myForm.handleChange}
                        onKeyPress={otherLinkBilty}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "amount")}
                    />
                </div>
                <div className="table-container">
                    <div><button
                        onClick={handleRemoveAllRowCharge}
                        className="item-deleteall-btn"
                    >
                        Delete All
                    </button></div>
                    <DynamicViewTable
                        edit={1}
                        delete={1}
                        editRowFunction={handleEditSpecificRow}
                        tableHeader={otherRateTableHeader}
                        tableItems={otherRateTableItems}
                        tableValues={myForm.pageState["charge_info"]}
                        setPageState={myForm.setPageState}
                        pageState={myForm.pageState}
                        setPageMode={myForm.setPageMode}
                        setPopupError={myForm.setPopupError}
                        setPageStateByField={myForm.setPageStateByField}
                        pageStateArray={myForm.pageState["charge_info"]}
                        fieldMapping="charge_info"
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
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="party_rate_master_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        onClick={() => {
                            download_ref.current.handleDownload();
                        }}
                    >
                        Download as XLS
                    </button>
                    {ReportExcel.party_rate_master_report_excel_data(myForm.pageState.consignor_name, myForm.pageState["rate_info"], myForm.pageState["charge_info"])}
                    <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
                </div>
            </div>
        </div>
    );
};

export default PartyRateMasterForm;
