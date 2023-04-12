import React from "react";
import "./Form.css";
import {
    BiltyDataObjectForVerificationFromSuggestion,
    BiltyDataObjectForIdClearance,
} from "../config/Biltyform.js";
import { challanDataObject } from "../config/challanForm.js";
import { tripDataObject } from "../config/tripConfig.js";
import { mrDataObject } from "../config/mrForm.js";
import { useRef, useState, useEffect, useMemo } from "react";
import { useApiState } from "./useApiState.js";
import { apiWrapper } from "./apis.js";
import "./AutoSuggest.css";
import { SERVER_URL } from "../config/config";
import { date, object } from "yup";
import { checkIfAnyError } from "../utils/generalUtils.js";
import { biltyAutoUpdationEffectsDummy } from "../utils/biltyUtils.js";
import { mrAutoUpdationEffectsDummy } from "../utils/mrUtils.js";
import { applySchema } from "../utils/apiUtils.js";
import print from "print-js";
import useSessionVariables from "./useSessionVariables";
import Popup from "reactjs-popup";

var reqId = 0;

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

const useForm = (formName, validate, dataObject, apiConfig) => {
    const [pageState, setPageState] = useState(dataObject);

    const [initialpageState, setInitialPageState] = useState(dataObject); //NEW CODE FOR SENDING CLERANCE STATUS

    const [valueVerificationState, setValueVerificationState] = useState({});
    const [idClearancState, setIdClearancState] = useState({});
    const [pageMode, setPageMode] = useState("write");
    const [popupError, setPopupError] = useState("Error");
    const [internalValidationErrors, setInternalValidationErrors] = useState({
        username: "",
    });
    const [submitApiState, performSubmission, clearSubmitApiState] =
        useApiState(apiWrapper);
    const [suggestionApiState, performSuggestions, clearSuggestionApiState] =
        useApiState(apiWrapper);
    const [suggestions, setSuggestions] = useState([]);
    let refStoreObject = useRef({});
    const [previousPageMode, setPreviousPageMode] = useState("");
    const [serverPrintNeeded, setServerPrintNeeded] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [clearDataOnSave, setClearDataOnSave] = useState(false);
    const [overlay, setOverlay] = useState(false);

    const sessionObject = useSessionVariables();

    const makeFocusOnParticularField = (fieldName) => {
        console.log(refStoreObject, fieldName);
        refStoreObject.current[fieldName].focus();
    };

    const makeFocusOnParticularFieldForItem = (groupName, row, fieldName) => {
        refStoreObject.current[groupName][row][fieldName].focus();
    };

    const onKeyPressForKeyNav = (e, fieldInfoObject, formPageState) => {
        console.log({e, fieldInfoObject, formPageState});
        if (e.key == "Enter") {
            e.preventDefault();
            if ("onKeyPressEvent" in fieldInfoObject) {
                let inputObject = {
                    pageState,
                    setPageState,
                    refStoreObject,
                    setOverlay,
                    setPageStateByField
                }
                fieldInfoObject.onKeyPressEvent(inputObject);
            }
            // Block for keyboard navigation
            if ("keyboardNavigationMap" in fieldInfoObject) {
                if("required" in fieldInfoObject.keyboardNavigationMap) {
                    const goToNextField = fieldInfoObject.keyboardNavigationMap.required(formPageState);
                    // console.log({goToNextField});
                    if(goToNextField == false) return;
                }
                if (
                    "conditionalNav" in fieldInfoObject.keyboardNavigationMap &&
                    fieldInfoObject.keyboardNavigationMap.conditionalNav == true
                ) {
                    const nextFieldToFocus =
                        fieldInfoObject.keyboardNavigationMap.conditionalNavFunct(
                            pageState
                        );
                    makeFocusOnParticularField(nextFieldToFocus);
                    return;
                }
                if ("nextOnRow" in fieldInfoObject.keyboardNavigationMap) {
                    const nextFieldToFocus =
                        fieldInfoObject.keyboardNavigationMap.nextOnRowTableName;
                    const nextFieldColumnToFocus =
                        fieldInfoObject.keyboardNavigationMap.nextOnRowField;
                    refStoreObject.current[nextFieldToFocus][0][
                        nextFieldColumnToFocus
                    ].focus();
                } else {
                    const nextFieldToFocus =
                        fieldInfoObject.keyboardNavigationMap["Enter"];
                    makeFocusOnParticularField(nextFieldToFocus);
                }
            }
        }
    };

    const updateObjectInListInPageState = (idx, objectToUpdate, fieldName) => {
        const rows = [...pageState[fieldName]];
        let rowObject = rows[idx];
        rowObject = { ...rowObject, ...objectToUpdate };
        rows[idx] = rowObject;
        setPageStateByField(fieldName, rows);
    };

    const updateObjectInListInIdClearanceState = (
        idx,
        objectToUpdate,
        fieldName
    ) => {
        let rows = [];
        if (fieldName in idClearancState) {
            rows = [...idClearancState[fieldName]];
        }

        let rowObject = rows[idx];
        rowObject = { ...rowObject, ...objectToUpdate };
        rows[idx] = rowObject;
        setIdClearanceStateByField(fieldName, rows);
    };

    const updatePageStateForGetSuggestion = (responseForFrontend) => {
        setPageState({
            ...pageState,
            ...responseForFrontend,
        });
    };

    const storeInputReference = (
        autosuggest,
        isDyanmicTable,
        dynamicTableName
    ) => {
        if (autosuggest == null) {
            return;
        }
        if (!isDyanmicTable) {
            refStoreObject.current[autosuggest.props.id] = autosuggest.input;
        } else {
            // create list for dynamic table if it doesn't exist already
            if (!(dynamicTableName in refStoreObject.current)) {
                if (dynamicTableName == "item_in") {
                    refStoreObject.current["item_in"] = [
                        {
                            item_name: null,
                            unit: null,
                            pkgs: null,
                            weight: null,
                            rate: null,
                            amount: null,
                            packing_type: null,
                            truck_size: null,
                        },
                    ];
                }
                if (dynamicTableName == "eway_bill_no") {
                    refStoreObject.current["eway_bill_no"] = [
                        {
                            eway_bill_no: "",
                            new_row: "",
                        },
                    ];
                }
            }
            let [field_name, row_index] = autosuggest.props.id.split("#");
            if (row_index < refStoreObject.current[dynamicTableName].length) {
                refStoreObject.current[dynamicTableName][row_index][field_name] =
                    autosuggest.input;
            }
        }
    };

    const storeInputReferenceForSelect = (refObject, fieldName) => {
        if (refObject == null) {
            return;
        }
        refStoreObject.current[fieldName] = refObject;
    };

    const storeInputReferenceForSelectForDynamicTable = (
        refObject,
        fieldName,
        index,
        dynamicTableName
    ) => {
        if (refObject == null) {
            return;
        }
        // create list for dynamic table if it doesn't exist already
        if (!(dynamicTableName in refStoreObject.current)) {
            if (dynamicTableName == "item_in") {
                refStoreObject.current["item_in"] = [
                    {
                        item_name: null,
                        unit: null,
                        pkgs: null,
                        weight: null,
                        rate: null,
                        amount: null,
                        packing_type: null,
                    },
                ];
            }
            if (dynamicTableName == "eway_bill_no") {
                refStoreObject.current["eway_bill_no"] = [
                    {
                        eway_bill_no: "",
                        new_row: "",
                    },
                ];
            }
        }
        if (index < refStoreObject.current[dynamicTableName].length) {
            refStoreObject.current[dynamicTableName][index][fieldName] = refObject;
        }
    };

    function validator(values, value, regexp, valueVerification) {
        let errors = {};
        var regex = new RegExp(regexp);
        if (values.hasOwnProperty(value)) {
            if (!values[value] || !values[value].trim()) {
                errors[value] = "Required Field";
            } else if (!regex.test(values[value])) {
                errors[value] = "Validation Error";
            } else if (
                value in valueVerification &&
                values[value] != valueVerification[value]
            ) {
                errors[value] = "Invalid";
            } else {
                errors[value] = "";
            }
        }
        return errors;
    }

    const onblurValidator = async (fieldInfoObject) => {
        let fieldName = fieldInfoObject.name;
        let regexp = fieldInfoObject.regExpValidation;
        let dummyInternalValidationErrors = {};

        console.log({fieldInfoObject});

        if ("toValidate" in fieldInfoObject && fieldInfoObject.toValidate) {

            /*  
                we want conditional validation in toPay field of Bilty module.
            */
            if(formName == "Bilty" && (pageState.is_crossing != "Y" || pageState.pay_type != "1")) {
                return;
            }

            dummyInternalValidationErrors = validator(
                { [fieldName]: pageState[fieldName] },
                fieldName,
                regexp,
                valueVerificationState
            );

            console.log({dummyInternalValidationErrors});
            /**
             * If any field is supposed to select from suggestion and is not selected then
             * this block will throw internal validation error
             */
            if (
                "valueVerificationFromSuggestionNeeded" in fieldInfoObject &&
                fieldInfoObject.valueVerificationFromSuggestionNeeded &&
                pageState[fieldInfoObject.valueVerificationCompulsionField] == ""
            ) {
                if (
                    (fieldName in dummyInternalValidationErrors &&
                        dummyInternalValidationErrors[fieldName] == "") ||
                    !fieldName in dummyInternalValidationErrors
                ) {
                    dummyInternalValidationErrors[fieldName] = "Invalid";
                }
            }
            setInternalValidationErrors({
                ...internalValidationErrors,
                ...dummyInternalValidationErrors,
            });
        }

        /**
         * This part is independent of validation error.
         * This part won't do anything with internal validation error but it will only change
         * pageState and idClearanceState.
         *
         * Whenever we want to remove id of any field if we change its value, this block is used.
         * For example:- If we want to make the value of consignor_id = null when value of consignor_name
         * is changed, this block will come into picture.
         */
        if (fieldName in idClearancState) {
            // If Name from suggestion is not same as current name.
            if (pageState[fieldName] != idClearancState[fieldName].value) {
                let dummyObjectForPage = {};
                dummyObjectForPage[idClearancState[fieldName].fieldToClear] = null;
                setPageState({
                    ...pageState,
                    ...dummyObjectForPage,
                });
                let dummyObjectForClearance = {};
                dummyObjectForClearance[fieldName] = {
                    value: "",
                    fieldToClear: idClearancState[fieldName].fieldToClear,
                };
                setIdClearancState({
                    ...idClearancState,
                    ...dummyObjectForClearance,
                });
            }
        }
    };

    const onblurValidatorForTable = async (fieldMapping, idx, fieldName) => {
        if (fieldMapping in idClearancState) {
            // If Name from suggestion is not same as current name.
            if (
                pageState[fieldMapping][idx][fieldName] !=
                idClearancState[fieldMapping][idx][fieldName].value
            ) {
                //
                let dummyObjectForPage = {};
                dummyObjectForPage[
                    idClearancState[fieldMapping][idx][fieldName].fieldToClear
                ] = null;
                updateObjectInListInPageState(idx, dummyObjectForPage, fieldMapping);
                let dummyObjectForClearance = {};
                dummyObjectForClearance = {
                    value: "",
                    fieldToClear:
                        idClearancState[fieldMapping][idx][fieldName].fieldToClear,
                };
                updateObjectInListInIdClearanceState(
                    idx,
                    dummyObjectForClearance,
                    fieldMapping
                );
            }
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        console.log("Temp ", name, value);
        setPageState({
            ...pageState,
            [name]: value,
        });
    };

    // Handle change for select i.e. dropdowns
    const handleChangeForSelect = function (e, selectName) {
        const { name, value } = e.target;
        if(selectName == "pay_type" && formName == "Bilty") {
            setPageState((oldState) => ({
                ...oldState,
                [selectName]: value,
                "prev_pay_type": oldState.pay_type,
            }));
        }
        else {
            setPageState((oldState) => ({
                ...oldState,
                [selectName]: value,
            }));
        }
    };

    function getSuggestionValue(
        suggestion,
        fieldInfoObject,
        apiCallBack,
        updatePageStateForGetSuggestion,
        row_index
    ) {
        console.log({
            suggestion,
            fieldInfoObject,
            apiCallBack,
            updatePageStateForGetSuggestion,
            row_index
        });
        /**
         * Extracting useful information from
         * field Info Object
         */
        const fieldName = fieldInfoObject["name"];
        const suggestionKeyword = fieldInfoObject["suggestionKeyword"];
        const suggestionSchema = fieldInfoObject["suggestionSchema"];

        console.log(fieldName, suggestionKeyword, suggestionSchema);

        if (
            "apiCallRequiredOnGetValue" in fieldInfoObject &&
            fieldInfoObject["apiCallRequiredOnGetValue"]
        ) {
            
            let data = {
                fieldName,
                suggestionSchema,
                apiType: "SugesstionValue",
                fieldInfoObject: fieldInfoObject,
                index: row_index,
            };
            data.apiConfig = apiConfig[fieldInfoObject["apiConfigKey"]];
            console.log("!!!", apiConfig[fieldInfoObject["apiConfigKey"]]);
            if (
                !(
                    "tailTruncate" in apiConfig[fieldInfoObject["apiConfigKey"]] &&
                    apiConfig[fieldInfoObject["apiConfigKey"]].tailTruncate
                )
            ) {
                if ("suggestionChooseQueryKeywordCustom" in fieldInfoObject) {
                    data.apiUrlTail = fieldInfoObject.suggestionChooseQueryKeywordCustom(
                        suggestion,
                        pageState
                    );
                } else {
                    data.apiUrlTail =
                        suggestion[fieldInfoObject["suggestionChooseQueryKeyword"]];
                }
            }
            console.log("field Info Object", data);
            if (
                "inputDataNeededInSuggestions" in fieldInfoObject &&
                fieldInfoObject["inputDataNeededInSuggestions"]
            ) {
                if (row_index == null) {
                    let dummyObject = {};
                    for (let key in pageState) {
                        if (key in fieldInfoObject.inputDataFilter) {
                            if (fieldInfoObject.inputDataFilter[key] == "same") {
                                dummyObject[key] = pageState[key];
                            } else {
                                dummyObject[fieldInfoObject.inputDataFilter[key]] =
                                    pageState[key];
                            }
                        }
                    }
                    console.log("duundwd", dummyObject);
                    data.apiInputData = dummyObject;
                } else {
                    let dummyObject = {};
                    for (let key in pageState) {
                        if (key in fieldInfoObject.inputDataFilter) {
                            if (fieldInfoObject.inputDataFilter[key] == "same") {
                                dummyObject[key] = pageState[key];
                            } else {
                                dummyObject[fieldInfoObject.inputDataFilter[key]] =
                                    pageState[key];
                            }
                        }
                    }
                    let itemObject = pageState[fieldInfoObject.parentName][row_index];
                    for (let key in itemObject) {
                        if (key in fieldInfoObject.inputDataFilter) {
                            if (fieldInfoObject.inputDataFilter[key] == "same") {
                                dummyObject[key] = itemObject[key];
                            } else {
                                dummyObject[fieldInfoObject.inputDataFilter[key]] =
                                    itemObject[key];
                            }
                        }
                    }
                    if (formName == "Bilty") {
                        if (pageState.pay_type == "4") {
                            dummyObject.consignee_id = null;
                        } else {
                            dummyObject.consignor_id = null;
                        }
                        dummyObject.item_id =
                            suggestion[fieldInfoObject["suggestionChooseQueryKeyword"]];
                    }
                    data.apiInputData = dummyObject;
                }
            }
            console.log("Suggestion INput data fff", data);
            apiCallBack(data);
        } else {
            /**
             * If api call not required,
             * parse suggestion schema here only and update the page state.
             */
            let responseForFrontend = {};
            for (let key in suggestionSchema) {
                responseForFrontend[suggestionSchema[key]] = suggestion[key];
            }
            console.log("final suggestion fff", responseForFrontend, suggestion);
            updatePageStateForGetSuggestion(responseForFrontend);
        }
        return suggestion[suggestionKeyword];
    }

    function renderSuggestion(suggestion, fieldInfoObject) {
        /**
         * Extracting useful information from
         * field Info Object
         */
        const suggestionKeyword = fieldInfoObject["suggestionKeyword"];
        if ("suggestionKeywordExtra" in fieldInfoObject) {
            return (
                <div>
                    <span>{suggestion[suggestionKeyword]}</span>
                    <span>{"\n"}</span>
                    <span style={{ color: "blue" }}>
                        {suggestion[fieldInfoObject["suggestionKeywordExtra"]]}
                    </span>
                </div>
            );
        }
        return <span>{suggestion[suggestionKeyword]}</span>;
    }

    const onSuggestionsFetchRequested = async ({ value }, suggestionFetchApi) => {
        /**
         * Business logic of suggestion fetch Api.
         */
        console.log({suggestionFetchApi});
        const responseObject = await suggestionFetchApi(value);
        /**
         * Setting state of suggestions hook.
         */
        setSuggestions(responseObject);
    };

    const onSuggestionsFetchRequestedDebounced = useMemo(
        () => _.debounce(onSuggestionsFetchRequested, 400),
        []
    );

    const onSuggestionsClearRequested = (fieldInfoObject) => {
        /**
         * Extracting useful information from
         * field Info Object
         */
        const fieldName = fieldInfoObject["name"];

        setSuggestions([]);
    };

    const onChangeAutoSuggest = (
        _,
        { newValue },
        fieldInfoObject,
        handleChangeDT
    ) => {
        /**
         * Extracting useful information from
         * field Info Object
         */
        const fieldName = fieldInfoObject["name"];
        /**
         * Block for dynamic table auto suggest change.
         */
        if (handleChangeDT) {
            handleChangeDT(fieldName, newValue);
            return;
        }

        /**
         * Block for normal form Auto suggest change
         */
        setPageStateByField(fieldName, newValue);
    };

    async function handleSuccess() {
        console.log("suc");
        let submitObject = pageState;
        console.log({ submitObject });
        if ("save_button" in refStoreObject.current) {
            refStoreObject.current["save_button"].setAttribute(
                "disabled",
                "disabled"
            );
        }
        if ("print_button" in refStoreObject.current) {
            refStoreObject.current["print_button"].setAttribute(
                "disabled",
                "disabled"
            );
        }

        /**
         * SUbmit object adding extra values.
         */
        if (formName == "Bilty") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/bilty/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveBilty,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/bilty/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyBilty,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "Challan") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveChallan,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyChallan,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "FleetManagement") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/fleet_master/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveFleet,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/fleet_master/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveFleet,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "StockOutward") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/stock_register/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveStockOutward,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/edit_stock_register/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.editStockOutward,
                };
                await performSubmission(apiObj);
            }
        }  else if (formName == "StockInward") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/stock_register/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveStockInward,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/edit_stock_register/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.editStockOutward,
                };
                await performSubmission(apiObj);
            }
        }  
        else if (formName == "SeparateEwb") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveChallan,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyChallan,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "BiltyStatement") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveBiltyStatement,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyBiltyStatement,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "MrStatement") {
            if (pageMode == "write" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveMrStatement,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/challan/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyChallan,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "PodChallan") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/pod/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveChallan,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/pod/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyChallan,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "MR") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveMr,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyMr,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "Trip") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/trip/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveTrip,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/trip/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyTrip,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "VehicleRegister") {
            console.log("Here BEFORE WRITE")
            if (pageMode == "write") {
                console.log("Here IN WRITE")
                let apiObj = {
                    url: SERVER_URL + "/vehicleregister/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveVehicleRegister,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/vehicleregister/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyVehicleRegister,
                };
                await performSubmission(apiObj);
            }
        }  else if (formName == "MrPendingAmount") {
            console.log("Here BEFORE WRITE")
            if (pageMode == "write") {
                console.log("Here IN WRITE")
                let apiObj = {
                    url: SERVER_URL + "/saveMrPending/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveMrPending,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/modifyMrPending/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyMrPending,
                };
                await performSubmission(apiObj);
            }
        } 
        else if (formName == "BankClearance") {
            if (pageMode == "write") {
                console.log("Here IN WRITE")
                let apiObj = {
                    url: SERVER_URL + apiConfig.modifyBankClearance,
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyBankClearance,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {

            }
        }
        else if (formName == "Vehicle") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/vehicle/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveVehicle,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/vehicle/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyVehicle,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "StationMaster") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/branch/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveStationMaster,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/branch/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyStationMaster,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "ItemMaster") {
            console.log("pagemode in item", pageMode);
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/item/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveItemMaster,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/iteme/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyItemMaster,
                };
                await performSubmission(apiObj);
            }
        }
        else if (formName == "GroupMaster") {
            console.log("pagemode in group", pageMode);
            let apiObj = {
                url: SERVER_URL + "/group/",
                apiInputData: submitObject,
                apiConfig: apiConfig.saveGroupMaster,
            };
            // console.log();
            await performSubmission(apiObj);
            // if (pageMode == "write") {
            // } else if (pageMode == "edit") {
            //     let apiObj = {
            //         url: SERVER_URL + "/iteme/",
            //         apiInputData: submitObject,
            //         apiConfig: apiConfig.modifyItemMaster,
            //     };
            //     await performSubmission(apiObj);
            // }
        }
        else if (formName == "SubgroupMaster") {
            console.log("pagemode in group", pageMode);
            let apiObj = {
                // url: SERVER_URL + "/group/",
                apiInputData: submitObject,
                apiConfig: apiConfig.saveSubgroupMaster,
            };
            await performSubmission(apiObj);
            // if (pageMode == "write") {
            // } else if (pageMode == "edit") {
            //     let apiObj = {
            //         url: SERVER_URL + "/iteme/",
            //         apiInputData: submitObject,
            //         apiConfig: apiConfig.modifyItemMaster,
            //     };
            //     await performSubmission(apiObj);
            // }
        }
        else if (formName == "AccountMaster") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/transporter/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveAccountMaster,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/transporter/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyAccountMaster,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "CROSSINGIN") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/crossing_inward/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveCrossingIn,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/crossing_inward/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyCrossingIn,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "CROSSINGOUT") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/crossing_outward/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveCrossingOut,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/crossing_outward/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyCrossingOut,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "CONSIGNORBILLING") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveCrossingBill,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit" || pageMode == "view") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyCrossingBill,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "TripBhada") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/trip/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveTrip,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                console.log("edit!!!");
                let apiObj = {
                    url: SERVER_URL + "/trip/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.modifyTripBhada,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "CROSSINGBILLING") {
            if (pageMode == "write") {
                if (pageState.type == "1") {
                    let apiObj = {
                        url: SERVER_URL + "/trip/",
                        apiInputData: submitObject,
                        apiConfig: apiConfig.saveCrossingBillIn,
                    };
                    await performSubmission(apiObj);
                }
                else {
                    let apiObj = {
                        url: SERVER_URL + "/trip/",
                        apiInputData: submitObject,
                        apiConfig: apiConfig.saveCrossingBillOut,
                    };
                    await performSubmission(apiObj);
                }

            } else if (pageMode == "edit") {
                if (pageState.type == "1") {
                    let apiObj = {
                        url: SERVER_URL + "/trip/",
                        apiInputData: submitObject,
                        apiConfig: apiConfig.modifyCrossingBillIn,
                    };
                    await performSubmission(apiObj);
                }
                else {
                    let apiObj = {
                        url: SERVER_URL + "/trip/",
                        apiInputData: submitObject,
                        apiConfig: apiConfig.modifyCrossingBillOut,
                    };
                    await performSubmission(apiObj);
                }
            }
        } else if (formName == "PARTYRATEMASTER") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/party_rate/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.savePartyRateMaster,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "GENERALRATEMASTER") {
            if (pageMode == "write") {
                let apiObj = {
                    apiInputData: submitObject,
                    apiConfig: apiConfig.saveGeneralRateMaster,
                };
                await performSubmission(apiObj);
            }
        } else if (formName == "PODSTATEMENT") {
            if (pageMode == "write" || pageMode == "view" || pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.savePage,
                };
                await performSubmission(apiObj);
            } 
            // else if (pageMode == "edit") {
            //     let apiObj = {
            //         url: SERVER_URL + "/money_receipt/",
            //         apiInputData: submitObject,
            //         apiConfig: apiConfig.modifyPage,
            //     };
            //     await performSubmission(apiObj);
            // }
        } else if (formName == "AccountTransaction") {
            if (pageMode == "write") {
                let apiObj = {
                    url: SERVER_URL + "/money_receipt/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.savePage,
                };
                await performSubmission(apiObj);
            } else if (pageMode == "edit") {
                let apiObj = {
                    url: SERVER_URL + "/account_trans/",
                    apiInputData: submitObject,
                    apiConfig: apiConfig.savePage,
                };
                await performSubmission(apiObj);
            }
        }
    }

    async function suggestionFetchApi(fieldInfoObject, value, additionalInfo) {
        /**
         * Extracting useful information from
         * field Info Object
         */
        console.log({fieldInfoObject, value, additionalInfo});
        const fieldName = fieldInfoObject["name"];
        const url = fieldInfoObject["url"];
        const suggestionKeyword =
            fieldInfoObject["suggestionKeywordForFetchApiArgs"];
        let inputData = {};
        let dummyReqId = Math.floor(Math.random() * 100 + 1);
        reqId = dummyReqId;

        if(value == "") {
            return [];
        }

        // Conditional turn off suggestions block
        if ("conditionalTurnOffSuggestions" in fieldInfoObject) {
            if (fieldInfoObject.conditionalTurnOffSuggestions(value)) {
                return [];
            }
        }
        if (additionalInfo != null) {
            inputData = {
                [suggestionKeyword]: value,
                search: "like",
                limit: "10",
                companyId: pageState.company_id,
                additional_info: additionalInfo,
            };
        } else {
            inputData = {
                [suggestionKeyword]: value,
                search: "like",
                limit: "10",
                companyId: pageState.company_id,
            };
        }
        const rawResponse = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        })
        .catch((err) => {
            console.log({err});
            // throw new Error(err)
        });

        if (dummyReqId != reqId) {
            return [];
        }
        let responseObject = await rawResponse.json();
        return responseObject;
    }

    const setPageStateByField = (name, newValue) => {
        setPageState((pageState) => ({
            ...pageState,
            [name]: newValue,
        }));
    };

    const setIdClearanceStateByField = (name, newValue) => {
        setIdClearancState({
            ...idClearancState,
            [name]: newValue,
        });
    };

    const handleSubmit = (e) => {
          console.log("handle submit!!!");
        e.preventDefault();

        let internalErrorsDummy = validate(pageState);
        console.log(internalErrorsDummy);
        setInternalValidationErrors(internalErrorsDummy);
        if (!checkIfAnyError(internalErrorsDummy)) {
            handleSuccess();
        }
    };

    const synchronousSave = async () => {
        let internalErrorsDummy = validate(pageState);
        setInternalValidationErrors(internalErrorsDummy);
        if (!checkIfAnyError(internalErrorsDummy)) {
            if ("save_button" in refStoreObject.current) {
                refStoreObject.current["save_button"].setAttribute(
                    "disabled",
                    "disabled"
                );
            }
            if ("print_button" in refStoreObject.current) {
                refStoreObject.current["print_button"].setAttribute(
                    "disabled",
                    "disabled"
                );
            }
            if (formName == "Bilty") {
                if (pageMode == "write") {
                    let apiObj = {
                        url: SERVER_URL + "/bilty/",
                        apiInputData: pageState,
                        apiConfig: apiConfig.saveBilty,
                    };
                    return await apiWrapper(apiObj);
                } else if (pageMode == "edit" || pageMode == "view") {
                    let apiObj = {
                        url: SERVER_URL + "/bilty/",
                        apiInputData: pageState,
                        apiConfig: apiConfig.modifyBilty,
                    };
                    return await apiWrapper(apiObj);
                }
            } else if (formName == "MR") {
                if (pageMode == "write") {
                    let apiObj = {
                        url: SERVER_URL + "/money_receipt/",
                        apiInputData: pageState,
                        apiConfig: apiConfig.saveMr,
                    };
                    return await apiWrapper(apiObj);
                } else if (pageMode == "edit" || pageMode == "view") {
                    let apiObj = {
                        url: SERVER_URL + "/money_receipt/",
                        apiInputData: pageState,
                        apiConfig: apiConfig.modifyMr,
                    };
                    return await apiWrapper(apiObj);
                }
            }
        }
    };

    const handleValueUpdate = (inputObject) => {
        let newObject = {};
        for (let key in pageState) {
            if (key in inputObject) {
                newObject[key] = inputObject[key];
            } else {
                newObject[key] = pageState[key];
            }
        }
        setPageState(newObject);
    };

    const renderSubmitApiResponseStatus = () => {
        if (submitApiState.loading) return "Loading...";

        if (submitApiState.error) return `Error: ${submitApiState.error.msg}`;

        if (submitApiState.data) {
            return `Data: ${JSON.stringify(submitApiState.data.response)}`;
        }
        return "Hit an APi for response";
    };

    const onKeyChange = (e) => {
        if (e.key == "Tab" || e.key == "Enter") {
            console.log("!2", e, e.key);
        }
    };

    const getSuffixesOfBilty = async (bilty_no, fyear) => {
        setPageStateByField("fyear_get_bilty", fyear);
        // setOverlay(true);
        const dataToSend = {
            bilty_no,
            fyear,
        }
    
        const url = SERVER_URL + "/bilty/suffix_option";
        const resp = await fetch(url,{
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
    
        if(resp.ok) {
            const suffixObj = await resp.json();
            console.log(suffixObj);
    
            if("options" in suffixObj && suffixObj.options.length > 0) {
              
              suffixObj.options = suffixObj.options.map(suff => {
                  return (suff == null ? "" : suff)
              });
    
              // console.log(suffixObj.options);
    
                setPageState((oldState) => ({
                    ...oldState,
                    suffix_options: suffixObj.options,
                    suffix: suffixObj.options[0],
                }))
                makeFocusOnParticularField("suffix");
            }
            else {
                setPageState((oldState) => ({
                    ...oldState,
                    suffix_options: [],
                    suffix: "",
                }))
            }
        }
        else {
          setPageState((oldState) => ({
              ...oldState,
              suffix_options: [],
              suffix: "",
          }))
        }

        // setOverlay(false);
    }

    const getFyearsOnKeyEnter = async (e, myFormName, page_id) => {
        
        if(e.key == "Enter") {
            e.persist();
            setOverlay(true);
            setPageStateByField("enterEvent", {...e});

            // console.log(refStoreObject.current[e.target.name]);
            // console.log(e.target.name);
            // refStoreObject.current[e.target.name].blur();

            const company_id = pageState.company_id;
            let url = SERVER_URL;
            let dataToSend = {};
            let finalFyearList = [];

            if(myFormName == "Bilty Inquiry") {
                refStoreObject.current["bilty_no"].blur();
                if (page_id == "") {
                    setOverlay(false);
                    makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                    return;
                }
                url += "/bilty/option";

                dataToSend = {
                    companyId: company_id,
                    bilty_no: page_id,
                    suffix: null,
                };

                if(formName == "MR" || formName == "Challan") {
                    dataToSend.owned_by = pageState.created_from;
                }

                // if(dataToSend.suffix == "") {
                //     dataToSend.suffix = null;
                // }
            }
            else if(myFormName == "Challan") {
                refStoreObject.current["challan_no"].blur();
                if (page_id == "") {
                    setOverlay(false);
                    makeFocusOnParticularField("manual_no");
                    return;
                }

                url += "/challan/options";

                dataToSend = {
                    companyId: company_id,
                    chalan_no: page_id,
                };
            }
            else if(myFormName == "MR") {
                refStoreObject.current["mr_no"].blur();
                if (page_id == "") {
                    setOverlay(false);
                    makeFocusOnParticularField("bilty_type");
                    return;
                }

                url += "/money_receipt/options";

                dataToSend = {
                    companyId: company_id,
                    mr_no: page_id,
                };
            }

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })

            if(resp.ok) {
                const fYearList = await resp.json();
                console.log(fYearList);

                fYearList.forEach(obj => {
                    if("fyear" in obj) {
                        finalFyearList.push(obj.fyear);
                    }
                })
            }

            if(finalFyearList.length == 1) {
                if(myFormName == "Bilty Inquiry") {
                    getSuffixesOfBilty(page_id, finalFyearList[0]);
                }
                else {

                    // console.log(pageState["enterEvent"], e.target);
                    getPageOnKeyEnter(e, e.target.value, finalFyearList[0])
                }
            }
            else {
                setPageStateByField("fyearList", finalFyearList);      
            }

            setOverlay(false);
        }
    }

    useEffect(() => {

        window.addEventListener("Fyear-Changed", () => {
            console.log("Helli");
            window.location.reload();
        })

        return () => {
            window.removeEventListener("Fyear-Changed", null)
        }

    }, [])

    const displayFyearPopup = (close) => (
        <div className="pop-up-container">
            <div className="pop-up-header">
                <div>Please Choose the Financial Year</div>
                <div>
                    <a className="pop-up-close btn" onClick={() => {
                        setPageStateByField("fyearList", []);
                        close();
                    }}>
                        &times;
                    </a>
                </div>
            </div>
            <div style={{
                padding: "20px",
                display: "flex",
                gap: "10px"
            }}>
                {pageState.fyearList.map(year => {
                    return <button
                        style={{
                            fontSize: "20px",
                        }}  
                        key={year}
                        value={year}
                        onClick={(e) => {
                            const targetName = pageState.enterEvent.target.name;
                            if(targetName == "Bilty No" || targetName == "bilty_no" || targetName == "No") {
                                getSuffixesOfBilty(pageState.enterEvent.target.value, e.target.value);
                            }
                            else {
                                getPageOnKeyEnter(pageState.enterEvent, pageState.enterEvent.target.value, e.target.value)
                            }
                            setPageStateByField("fyearList", []);
                            close();
                        }}
                        onKeyPress={(e) => {
                            if(e.key == "Enter") {
                                // console.log(e.target.value);
                                // console.log(pageState.enterEvent.target);
                                const targetName = pageState.enterEvent.target.name;
                                if(targetName == "Bilty No" || targetName == "bilty_no" || targetName == "No") {
                                    getSuffixesOfBilty(pageState.enterEvent.target.value, e.target.value);
                                }
                                else {
                                    getPageOnKeyEnter(pageState.enterEvent, pageState.enterEvent.target.value, e.target.value)
                                }
                                setPageStateByField("fyearList", []);
                                close();
                                // var temp = document.getElementById("bilty_no");
                                // console.log(temp, refStoreObject);
                                // document.getElementById("bilty_no").dispatchEvent(new KeyboardEvent("keypress", 
                                // {key: "Enter", keyCode: 13, }
                                // ))
                            }
                        }}
                    >{year}</button>
                })}
            </div>

            {/* <div className="pop-up-actions">
                <button
                    className="pop-up-button"
                    onClick={() => {
                        setPageStateByField("fyearList", []);
                        close();
                    }}
                >
                    Okay
                </button>
            </div> */}
        </div>
    )

    const getPageOnKeyEnter = (e, page_id, popupFyear) => {
        // console.log(popupFyear, page_id);
        // console.log(pageState);
        const fYear_fetch = popupFyear ?? JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
        const companyId = pageState.company_id; // yet to set
        // console.log(fYear_fetch);

        // console.log(e.key, page_id);
        if (e.key == "Enter") {
            if (formName == "Bilty") {

                if (page_id == "") {
                    makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                    return;
                }
                setOverlay(true);
                console.log(pageState);
                let suffix = pageState.suffix;
                if (suffix == "") {
                    suffix = "null";
                }
                let data = {
                    apiUrlTail:
                        page_id +
                        "?branch_id=" +
                        pageState.created_from +
                        "&suffix=" +
                        suffix,
                    apiType: "getBilty",
                    apiConfig: apiConfig["getBilty"],
                };
                if (pageState.suffix != "") {
                    data.apiUrlTail =
                        page_id +
                        "?branch_id=" +
                        pageState.created_from +
                        "&suffix=" +
                        pageState.suffix;
                }
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                if(pageState.is_crossing == "Y") {
                    if(pageState.suffix == "") {
                        setOverlay(false);
                        return;
                    }
                    // data.apiUrlTail += "&transporter_id=" + pageState.transporter_id;
                }

                performSuggestions(data);
            } else if (formName == "Bilty Inquiry") {
                if (page_id == "") {
                    makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                    return;
                }
                setOverlay(true);
                let suffix = pageState.suffix;
                if (suffix == "") {
                    suffix = "null";
                }
                let data = {
                    apiUrlTail:
                        "inquiry/" +
                        page_id +
                        "?branch_id=" +
                        pageState.created_from +
                        "&suffix=" +
                        suffix,
                    apiType: "getBiltyInquiry",
                    apiConfig: apiConfig["getBiltyInquiry"],
                };
                if (pageState.suffix != "") {
                    data.apiUrlTail =
                        "inquiry/" +
                        page_id +
                        "?branch_id=" +
                        pageState.created_from +
                        "&suffix=" +
                        pageState.suffix;
                }
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                performSuggestions(data);
            } else if (formName == "Challan") {
                if (e.target.name == "challan_no") {
                    if (page_id == "") {
                        makeFocusOnParticularField("manual_no");
                        return;
                    }
                    if ("challan_no" in refStoreObject.current) {
                        refStoreObject.current.challan_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getChallan"],
                    };
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                } else {
                    if (page_id == "") {
                        makeFocusOnParticularField("vehicle_no");
                        return;
                    }
                    if ("manual_no" in refStoreObject.current) {
                        refStoreObject.current.manual_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getManualChallan"],
                    };
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    console.log("Get page data fff", data);
                    performSuggestions(data);
                }
            } else if (formName == "FleetManagement") {
                if (e.target.name == "fleet_no") {
                    if (page_id == "") {
                        makeFocusOnParticularField("fleet_date");
                        return;
                    }
                    if ("fleet_no" in refStoreObject.current) {
                        refStoreObject.current.fleet_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getFleet",
                        apiConfig: apiConfig["getFleet"],
                    };
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                } else {
                    if (page_id == "") {
                        makeFocusOnParticularField("vehicle_no");
                        return;
                    }
                    if ("manual_no" in refStoreObject.current) {
                        refStoreObject.current.manual_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getManualChallan"],
                    };
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    console.log("Get page data fff", data);
                    performSuggestions(data);
                }
            } else if (formName == "StockOutward") {
                if (e.target.name == "register_no") {
                    if (page_id == "") {
                        makeFocusOnParticularField("outward_date");
                        return;
                    }

                    if ("register_no" in refStoreObject.current) {
                        refStoreObject.current.register_no.blur();
                    }
                    
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?type=2",
                        apiType: "getStockOutward",
                        apiConfig: apiConfig["getStockOutward"],
                    };
                    
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                } else {
                    if (page_id == "") {
                        makeFocusOnParticularField("vehicle_no");
                        return;
                    }
                    if ("manual_no" in refStoreObject.current) {
                        refStoreObject.current.manual_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getManualChallan"],
                    };
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    console.log("Get page data fff", data);
                    performSuggestions(data);
                }
            }  else if (formName == "StockInward") {
                if (e.target.name == "register_no") {
                    if (page_id == "") {
                        makeFocusOnParticularField("inward_date");
                        return;
                    }

                    if ("register_no" in refStoreObject.current) {
                        refStoreObject.current.register_no.blur();
                    }
                    
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?type=1",
                        apiType: "getStockInward",
                        apiConfig: apiConfig["getStockInward"],
                    };
                    
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                } 
            }  
            else if (formName == "SeparateEwb") {
                if (e.target.name == "challan_no") {
                    if (page_id == "") {
                        makeFocusOnParticularField("manual_no");
                        return;
                    }
                    if ("challan_no" in refStoreObject.current) {
                        refStoreObject.current.challan_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getChallan"],
                    };
                    console.log("Get page data fff", data);
                    performSuggestions(data);
                } else {
                    if (page_id == "") {
                        makeFocusOnParticularField("vehicle_no");
                        return;
                    }
                    if ("manual_no" in refStoreObject.current) {
                        refStoreObject.current.manual_no.blur();
                    }
                    setOverlay(true);
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getChallan",
                        apiConfig: apiConfig["getManualChallan"],
                    };
                    console.log("Get page data fff", data);
                    performSuggestions(data);
                }
            }
             else if (formName == "MR") {
                if (page_id == "") {
                    makeFocusOnParticularField("bilty_type");
                    return;
                }
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getMr",
                    apiConfig: apiConfig["getMr"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "MR Inquiry") {
                // if (page_id == "") {
                //   makeFocusOnParticularField("bilty_type");
                //   return;
                // }
                let data = {
                    apiUrlTail:
                        "inquiry/" + page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getMrInquiry",
                    apiConfig: apiConfig["getMrInquiry"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "Trip") {
                if (page_id == "") {
                    makeFocusOnParticularField("vehicle_no");
                    return;
                }
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getTrip",
                    apiConfig: apiConfig["getTrip"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            }
            else if (formName == "VehicleRegister") {
                if (page_id == "") {
                    makeFocusOnParticularField("letter_no");
                    return;
                }
                let data = {
                    apiUrlTail: page_id,
                    apiType: "getVehicleRegister",
                    apiConfig: apiConfig["getVehicleRegister"],
                };
                data.apiUrlTail += "?fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "MrPendingAmount") {
                if (page_id == "") {
                    makeFocusOnParticularField("mr_no");
                    return;
                }
                // branch id as well
                let data = {
                    apiUrlTail: `${pageState.created_from}/${page_id}`,
                    apiType: "getMrPending",
                    apiConfig: apiConfig["getMrPending"],
                };
                data.apiUrlTail += "?fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            }
            else if (formName == "Vehicle") {
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getVehicle",
                    apiConfig: apiConfig["getVehicle"],
                };
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "AccountMaster") {
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getTransporterSuggestions",
                    apiConfig: apiConfig["getTransporterSuggestions"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "CROSSINGIN") {
                if (page_id == "") {
                    makeFocusOnParticularField("transporter_name");
                    return;
                }
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getCrossingIn",
                    apiConfig: apiConfig["getCrossingIn"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "StationMaster") {
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getStationMaster",
                    apiConfig: apiConfig["getStationMaster"],
                };
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "ItemMaster") {
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getItemMaster",
                    apiConfig: apiConfig["getItemMaster"],
                };
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "PodChallan") {
                if ("pod_challan_no" in refStoreObject.current) {
                    refStoreObject.current.pod_challan_no.blur();
                }
                if (page_id == "") {
                    makeFocusOnParticularField("station_to_name");
                    return;
                }
                setOverlay(true);
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getChallan",
                    apiConfig: apiConfig["getChallan"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "CROSSINGOUT") {
                if (page_id == "") {
                    makeFocusOnParticularField("transporter_name");
                    return;
                }
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getCrossingOut",
                    apiConfig: apiConfig["getCrossingOut"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "CONSIGNORBILLING") {
                if (page_id == "") {
                    makeFocusOnParticularField("amount");
                    return;
                }
                if ("bill_no" in refStoreObject.current) {
                    refStoreObject.current.bill_no.blur();
                }
                setOverlay(true);
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getCrossingBill",
                    apiConfig: apiConfig["getCrossingBill"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "TripBhada") {
                if (page_id == "") {
                    makeFocusOnParticularField("vehicle_no");
                    return;
                }
                let data = {
                    // apiUrlTail: "payable/" + page_id + "?branch_id=" + pageState.created_from +"&station_from="+String(pageState.station_from),
                    apiUrlTail: "payable/" + page_id + "?station_from=" + String(pageState.station_from),
                    apiType: "getTrip",
                    apiConfig: apiConfig["getTrip"],
                };
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            } else if (formName == "CROSSINGBILLING") {
                if (page_id == "") {
                    makeFocusOnParticularField("date_to");
                    return;
                }
                if (pageState.type == "1") {
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getCrossingBill",
                        apiConfig: apiConfig["getCrossingBill"],
                    };
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                }
                else {
                    let data = {
                        apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                        apiType: "getCrossingBill",
                        apiConfig: apiConfig["getCrossingBillOut"],
                    };
                    console.log("Get page data fff", data);
                    data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                    performSuggestions(data);
                }
                // let data = {
                //   apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                //   apiType: "getCrossingBill",
                //   apiConfig: apiConfig["getCrossingBill"],
                // };
                // console.log("Get page data fff", data);
                // performSuggestions(data);
            } else if (formName == "PODSTATEMENT") {
                if (page_id == "") {
                    makeFocusOnParticularField("consignor_name");
                    return;
                }
                setOverlay(true);
                let data = {
                    apiUrlTail: page_id + "?branch_id=" + pageState.created_from,
                    apiType: "getPage",
                    apiConfig: apiConfig["getPage"],
                };
                console.log("Get page data fff", data);
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                performSuggestions(data);
            } else if (formName == "AccountTransaction") {
                if (page_id == "") {
                    // if (pageState.voucher_type == "cr") {
                    //   makeFocusOnParticularField("consignee_name");
                    // } 
                    // else if (pageState.voucher_type == "br") {
                    //   makeFocusOnParticularField("consignee_name");
                    // } 
                    // else if (pageState.voucher_type == "bp") {
                    //   makeFocusOnParticularField("consignor_name");
                    // } 
                    // else {
                    //   makeFocusOnParticularField("consignor_name");
                    // }
                    makeFocusOnParticularField("input_date")

                    return;
                }
                let data = {
                    // apiUrlTail:
                    //   page_id +
                    //   "?voucher_type=" +
                    //   pageState.voucher_type +
                    //   "&branch_id=" +
                    //   pageState.created_from,
                    apiType: "getPage",
                    apiConfig: apiConfig["getPage"],
                };
                let tempUrl = page_id + "?voucher_type=" +
                    pageState.voucher_type + "&branch_id=" +
                    pageState.created_from;
                if (pageState.voucher_type == "jv") {
                    tempUrl += "&account_id=1154"
                } else if (pageState.voucher_type == "cr" || pageState.voucher_type == "br") {
                    tempUrl += "&account_id=" + String(pageState.consignor_id)
                } else if (pageState.voucher_type == "cp" || pageState.voucher_type == "bp") {
                    tempUrl += "&account_id=" + String(pageState.consignee_id)
                }
                data.apiUrlTail = tempUrl
                data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + companyId;
                console.log("Get page data fff", data);
                performSuggestions(data);
            }
        }
    };

    const executeServerPrint = async (submitApiStateData) => {
        // submitApiState.apiInputData.license_no = "12345678"
        let apiInputData = submitApiStateData.apiInputData;
        let extraDataObject = {};
        let url = "";
        if (submitApiStateData.apiConfig.paramSchema) {
            apiInputData = applySchema(
                apiInputData,
                submitApiStateData.apiConfig.paramSchema
            );
        }
        if (formName == "Challan") {
            url = SERVER_URL + "/challan/print/";
            if (pageMode == "write") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.booking_chalan_no =
                    submitApiState.data.response.challan_no;
            }
        } else if (formName == "BiltyStatement") {
            url = SERVER_URL + "/paid_statement/print/";
            if (pageMode == "write" || pageMode == "view") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.id = submitApiState.data.response.paid_statement_no;
            }
        } else if (formName == "MrStatement") {
            url = SERVER_URL + "/mr_statement/print/";
            
            if (pageMode == "write" || pageMode == "view" || pageMode == "edit") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.mr_statement_no =
                    submitApiState.data.response.mr_statement_no;

                const fYear_fetch = sessionObject.sessionVariables.financial_year_for_fetch;

                extraDataObject.fyear = fYear_fetch;
            }
        } else if (formName == "CROSSINGOUT") {
            url = SERVER_URL + "/crossing_outward/print/";
            if (pageMode == "write" || pageMode == "view") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.crossing_outward_no =
                    submitApiState.data.response.crossing_out_no;
            }
        } else if (formName == "CONSIGNORBILLING") {
            url = SERVER_URL + "/tbb_billing_statement/print/";
            if (pageMode == "write" || pageMode == "view" || pageMode == "edit") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.bill_no = submitApiState.data.response.id;
            }
        } else if (formName == "CROSSINGBILLING") {
            url = SERVER_URL + "/crossing_bill_in/print_data/";
            if (pageMode == "write" || pageMode == "view" || pageMode == "edit") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.bill_no = submitApiState.data.response.bill_no;
                extraDataObject.branch_id = pageState.created_from
            }
        }
        else if (formName == "Trip") {
            url =
                SERVER_URL +
                "/trip/print/" +
                String(submitApiState.data.response.trip_no) +
                "?branch_id=" +
                String(pageState.created_from);

            if (pageMode == "write") {
                console.log("Submit api satt", submitApiState.data);
                extraDataObject.trip_no = submitApiState.data.response.trip_no;
                extraDataObject.id = submitApiState.data.response.id;
            }
            extraDataObject.user_role = pageState.role_id;
        }

        console.log("Extra data objecy", extraDataObject);
        console.log("2", { ...apiInputData, ...extraDataObject });
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...apiInputData, ...extraDataObject }),
        }).then((r) => r.blob());
        console.log("response", response);
        print({
            printable: URL.createObjectURL(response),
            type: "pdf",
            showModal: false,
        });
    };

    if (formName == "Bilty") {
        useEffect(
            // Effect for clearing out client side validation
            () => {
                refStoreObject.current["item_in"] = [];
                for (let index = 0; index < pageState.item_in.length; index++) {
                    refStoreObject.current["item_in"].push({
                        item_name: null,
                        unit: null,
                        pkgs: null,
                        weight: null,
                        rate: null,
                        amount: null,
                        new_row: null,
                        packing_type: null,
                        truck_size: null,
                    });
                }
                refStoreObject.current["eway_bill_no"] = [];
                for (let index = 0; index < pageState.eway_bill_no.length; index++) {
                    refStoreObject.current["eway_bill_no"].push({
                        eway_bill_no: null,
                        new_row: null,
                    });
                }
            },
            [pageState.item_in.length, pageState.eway_bill_no.length]
        );
    }

    const fetchLastData = async () => {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
        const companyId = pageState.company_id;

        if (formName == "Bilty") {
            const url =
                SERVER_URL +
                "/bilty/last_bilty/" +
                pageState.created_from +
                "/" +
                pageState.created_by + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_bilty_no", "Error");
                return;
            } else {
                let resp = await response.json();
                resp.last_suffix = resp.suffix;
                console.log("SUFFIX", resp.suffix);
                resp.eway_bill_no = [
                    {
                        eway_bill_no: "",
                        new_row: "N",
                    },
                ];
                resp.item_in = [
                    {
                        amount: "",
                        item_name: "",
                        pkgs: "",
                        rate: "",
                        unit: "C",
                        weight: "",
                        new_row: "N",
                        packing_type: "1",
                        truck_size: "9mt",
                    },
                ];
                delete resp.suffix;
                let idClearanceDummy = {};
                if ("consignor_name" in resp) {
                    idClearanceDummy.consignor_name = {
                        value: resp.consignor_name,
                        fieldToClear: "consignor_id",
                    };
                }
                if ("consignor_gst" in resp) {
                    idClearanceDummy.consignor_gst = {
                        value: resp.consignor_gst,
                        fieldToClear: "consignor_id",
                    };
                }
                setIdClearancState({
                    ...idClearancState,
                    ...idClearanceDummy,
                });
                setPageState(oldState => ({...oldState, ...resp}));
            }
        }
        if (formName == "Challan") {
            const url =
                SERVER_URL +
                "/challan/last_chalan/" +
                pageState.created_from +
                "/" +
                pageState.created_by + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_challan_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState({
                    ...pageState,
                    ...{
                        last_challan_no: resp.last_booking_chalan_no,
                        input_date: new Date(resp.current_date),
                    },
                });
            }
        }
        if (formName == "FleetManagement") {
            const url =
                SERVER_URL +
                "/fleet_master/last/?user_id=" +
                pageState.created_by +
                "&branch_id="+
                pageState.created_from + 
                "&companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_fleet_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState({
                    ...pageState,
                    ...{
                        last_fleet_no: resp.last_fleet_no,
                    },
                });
            }
        }
        if (formName == "StockOutward") {
            const url =
                SERVER_URL +
                "/stock_register/last/2";
            
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_register_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState({
                    ...pageState,
                    ...{
                        last_register_no: resp,
                    },
                });
            }
        }
        if (formName == "StockInward") {
            const url =
                SERVER_URL +
                "/stock_register/last/1";
            
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_register_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState({
                    ...pageState,
                    ...{
                        last_register_no: resp,
                    },
                });
            }
        }
        if (formName == "SeparateEwb") {
            const url =
                SERVER_URL +
                "/separate-ewb/last_chalan/"
                + pageState.created_from
                + "/" 
                + pageState.created_by

            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_challan_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState({
                    ...pageState,
                    ...{
                        last_challan_no: resp.last_booking_chalan_no,
                        input_date: new Date(resp.current_date),
                    },
                });
            }
        }
        if (formName == "CONSIGNORBILLING") {
            const url =
                SERVER_URL + "/tbb_billing_statement/last/" + pageState.created_from
                + "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_consignor_bill_no", "Error");
                return;
            } else {
                let resp = await response.json();
                if (resp != null) {
                    setPageStateByField("last_consignor_bill_no", resp.bill_no);
                }
            }
        }
        if (formName == "CROSSINGBILLING") {
            const url =
                SERVER_URL + "/crossing_bill_in/last/" + pageState.created_from
                + "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_consignor_bill_no", "Error");
                return;
            } else {
                let resp = await response.json();
                if (resp != null) {
                    setPageStateByField("last_consignor_bill_no", resp.bill_no);
                }
            }
        }
        if (formName == "PODSTATEMENT") {
            const url = SERVER_URL + "/pod_statement/last/" + pageState.created_from
                        + "?companyId=" + companyId 
                        + "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_consignor_bill_no", "Error");
                return;
            } else {
                let resp = await response.json();
                if (resp != null) {
                    setPageStateByField("last_consignor_bill_no", resp.pod_statement_no);
                }
            }
        }
        if (formName == "PodChallan") {
            const url =
                SERVER_URL +
                "/pod/last_pod/" +
                pageState.created_from +
                "/" +
                pageState.created_by + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;

            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_challan_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_challan_no", resp.last_pod_chalan_no);
            }
        }
        if (formName == "BiltyStatement") {
            // const url =
            //   SERVER_URL + "/bilty/paid_statement/" + pageState.created_from;
            // const response = await fetch(url);
            // if (!response.ok) {
            // } else {
            //   var resp = await response.json();

            //   let total_biltys = 0;
            //   let total_packages = 0;
            //   let total_weight = 0;
            //   let total_freight = 0;
            //   // console.log("112", newState.bilty_info_list);
            //   for (let biltys in resp["bilty_info_list"]) {
            //     total_biltys += 1;

            //     if (
            //       resp["bilty_info_list"][biltys].no_of_package != "" &&
            //       resp["bilty_info_list"][biltys].no_of_package != null
            //     ) {
            //       total_packages += parseInt(
            //         resp["bilty_info_list"][biltys].no_of_package
            //       );
            //     }
            //     console.log("weight", resp["bilty_info_list"][biltys].charge_weight);
            //     if (
            //       resp["bilty_info_list"][biltys].charge_weight != "" &&
            //       resp["bilty_info_list"][biltys].charge_weight != null
            //     ) {
            //       console.log("in");
            //       total_weight += parseInt(
            //         resp["bilty_info_list"][biltys].charge_weight
            //       );
            //     }

            //     if (
            //       resp["bilty_info_list"][biltys].freight != "" &&
            //       resp["bilty_info_list"][biltys].freight != null
            //     ) {
            //       total_freight += parseInt(resp["bilty_info_list"][biltys].total_amount);
            //     }
            //   }
            //   pageState.bilty_count = total_biltys;
            //   pageState.no_of_articles = total_packages;
            //   pageState.weight = total_weight;
            //   pageState.total_amount = total_freight;

            //   console.log("New state", total_biltys);
            //   // setPageStateByField("amount_list", resp["amount_list"]);

            //   // setPageStateByField("bilty_info_list", resp["bilty_info_list"]);
            // }

            let last_url =
                SERVER_URL + "/paid_statement/last/" + pageState.created_from;
            last_url += "?companyId=" + companyId + 
            "&fyear=" + fYear_fetch;
            const last_response = await fetch(last_url);

            if (!last_response.ok) {
                setPageStateByField("last_bilty_statement_no", "Error");

                if (!response.ok) {
                    var newState = {
                        last_bilty_statement_no: "",
                    };
                } else {
                    var newState = {
                        // amount_list: resp["amount_list"],
                        // bilty_info_list: resp["bilty_info_list"],
                        last_bilty_statement_no: "error",
                    };
                }

                setPageState({
                    ...pageState,
                    ...newState,
                });
                return;
            } else {
                var last_resp = await last_response.json();
                if (last_resp == null) {
                    var newState = {
                        last_bilty_statement_no: "",
                    };
                } else {
                    var newState = {
                        last_bilty_statement_no: last_resp["paid_statement_no"],
                    };
                }
            }

            // if (!response.ok) {
            //   // var newState = {
            //   //   last_bilty_statement_no: "",
            //   // };
            // } else {
            //   // newState.amount_list = resp["amount_list"]
            //   // newState.bilty_info_list = resp["bilty_info_list"]
            // }

            setPageState({
                ...pageState,
                ...newState,
            });
        }
        if (formName == "MrStatement") {
            const url =
                SERVER_URL + "/money_receipt/mr_statement/" + pageState.created_from + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
            } else {
                var resp = await response.json();

                let total_mrs = 0;
                let total_amounts = 0;
                // console.log("112", newState.mr_info_list);
                for (let mrs in resp["mr_info_list"]) {
                    total_mrs += 1;

                    if (
                        resp["mr_info_list"][mrs].total_amount != "" &&
                        resp["mr_info_list"][mrs].total_amount != null
                    ) {
                        total_amounts += parseInt(resp["mr_info_list"][mrs].total_amount);
                        // console.log("This is the final total amount -> ", parseInt(resp["mr_info_list"][mrs].total_amount));
                    }
                }
                // pageState.mr_count = total_mrs;
                // pageState.total_amount = total_amounts;
            }

            const last_url =
                SERVER_URL + "/mr_statement/last/" + pageState.created_from + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const last_response = await fetch(last_url);

            if (!last_response.ok) {
                setPageStateByField("last_mr_statement_no", "");

                if (!response.ok) {
                    var newState = {
                        last_mr_statement_no: "",
                    };
                } else {
                    var newState = {
                        mr_info_list: resp["mr_info_list"],
                    };
                }

                setPageState({
                    ...pageState,
                    ...newState,
                });
                return;
            } else {
                var last_resp = await last_response.json();
                var newState = {
                    last_mr_statement_no: last_resp["mr_statement_no"],
                };
            }
            if (!response.ok) {
            } else {
                // newState.mr_info_list = resp["mr_info_list"]
            }
            setPageState({
                ...pageState,
                ...newState,
            });
        }
        if (formName == "VehicleRegister") {
            const url =
                SERVER_URL +
                "/vehicleregister/last/" + pageState.created_from
                + "?companyId=" + pageState.company_id + 
                "&fyear=" + fYear_fetch;
                
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_entry_no", "");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_entry_no", resp.vr_no);
            }
        }  
        if (formName == "MrPendingAmount") {
            const url =
                SERVER_URL +
                "/pending_mr_payment/last/" + pageState.created_from +
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_entry_no", "");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_entry_no", resp);
            }
        }
        if (formName == "Trip") {
            const url =
                SERVER_URL +
                "/trip/last_trip/" +
                pageState.created_from +
                "/" +
                pageState.created_by +
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_trip_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageState((pageState) => ({
                    ...pageState,
                    ...{
                        last_trip_no: resp.last_booking_chalan_no,
                        input_date: formatDate(new Date(resp.current_date)),
                    },
                }));
            }
        }
        // if (formName == "VehicleRegister") {
        //   const url =
        //     SERVER_URL +
        //     "/vehicleregister/last/" +
        //     pageState.created_from +
        //     "/" +
        //     pageState.created_by;
        //   const response = await fetch(url);
        //   if (!response.ok) {
        //     setPageStateByField("last_trip_no", "Error");
        //     return;
        //   } else {
        //     let resp = await response.json();
        //     setPageStateByField("last_trip_no", resp.last_trip_no);
        //   }
        // }
        if (formName == "MR") {
            const url =
                SERVER_URL +
                "/money_receipt/last_mr/" +
                pageState.created_from +
                "/" +
                pageState.created_by + 
                "?companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_mr_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_mr_no", resp.last_mr_no);
            }
        }
        if (formName == "CROSSINGIN") {
            const url =
                SERVER_URL +
                "/crossing_inward/last/?branch_id=" +
                pageState.created_from +
                "&user_id=" +
                pageState.created_by +
                "&companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_crossing_no", resp.crossing_inward_no);
            }
        }
        if (formName == "CROSSINGOUT") {
            const url =
                SERVER_URL +
                "/crossing_outward/last/?branch_id=" +
                pageState.created_from +
                "&user_id=" +
                pageState.created_by + 
                "&companyId=" + companyId + 
                "&fyear=" + fYear_fetch;
                
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("last_crossing_no", resp.crossing_outward_no);
            }
        }
        if (formName == "ChallanInward") {
            const url = SERVER_URL + "/challan/all_challan/" + pageState.created_from
                        + "?companyId=" + companyId + 
                        "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            }
            let resp = await response.json();
            console.log("reeeesspooonse", resp);
            setPageStateByField("challan_ids", resp);
        }
        if (formName == "PodChallanInward") {
            const url = SERVER_URL + "/pod/all_pod/" + pageState.created_from
                        + "?companyId=" + companyId + 
                        "&fyear=" + fYear_fetch;

            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            }
            let resp = await response.json();
            console.log("reeeesspooonse", resp);
            setPageStateByField("pod_info_list", resp);
        }
        if (formName == "TRIPIN") {
            const url = SERVER_URL + "/trip/all_trip/" + pageState.created_from;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            }
            let resp = await response.json();
            setPageStateByField("trip_ids", resp);
        }
        if (formName == "EwbEx") {
            const url = SERVER_URL + "/trip/all_trip/" + pageState.created_from;
            const response = await fetch(url);
            if (!response.ok) {
                setPageStateByField("last_crossing_no", "Error");
                return;
            }
            let resp = await response.json();
            setPageStateByField("trip_ids", resp);
        }
        if (formName == "TripBhada") {
            const url = SERVER_URL + "/trip/all_payable/" + pageState.created_from + 
                        "?companyId=" + companyId + 
                        "&fyear=" + fYear_fetch;
            const response = await fetch(url);
            if (!response.ok) {
                // setPageStateByField("last_trip_bhada_no", "Error");
                return;
            } else {
                let resp = await response.json();
                setPageStateByField("trip_info", resp);
            }
        }
    };

    useEffect(
        // Effect for Focus
        () => {
            if (formName == "Bilty" && "is_crossing" in refStoreObject.current) {
                refStoreObject.current["is_crossing"].focus();
            }
            if (formName == "Challan" && "challan_no" in refStoreObject.current) {
                refStoreObject.current["challan_no"].focus();
            }
            if (
                formName == "PodChallan" &&
                "pod_challan_no" in refStoreObject.current
            ) {
                refStoreObject.current["pod_challan_no"].focus();
            }
            if (formName == "StationMaster" && "name" in refStoreObject.current) {
                refStoreObject.current["is_branch"].focus();
            }
            if (
                formName == "BiltyStatement" &&
                "paid_statement_no" in refStoreObject.current
            ) {
                refStoreObject.current["paid_statement_no"].focus();
            }
            if (
                formName == "MrStatement" &&
                "mr_statement_no" in refStoreObject.current
            ) {
                refStoreObject.current["mr_statement_no"].focus();
            }
            if (formName == "ItemMaster" && "name" in refStoreObject.current) {
                refStoreObject.current["name"].focus();
            }
            if (
                formName == "PodChallanInward" &&
                "pod_challan_no" in refStoreObject.current
            ) {
                refStoreObject.current["pod_challan_no"].focus();
            }
            if (formName == "MR" && "mr_no" in refStoreObject.current) {
                refStoreObject.current["mr_no"].focus();
            }
            if (formName == "BillPaid" && "station_to_name" in refStoreObject.current) {
                refStoreObject.current["station_to_name"].focus();
            }
            if (formName == "Trip" && "trip_no" in refStoreObject.current) {
                refStoreObject.current["trip_no"].focus();
            }
            if (formName == "VehicleRegister" && "vehicle_register_id" in refStoreObject.current) {
                refStoreObject.current["vehicle_register_id"].focus();
            }
            if (formName == "Vehicle" && "vehicle_no" in refStoreObject.current) {
                refStoreObject.current["vehicle_no"].focus();
            }
            if (
                formName == "ChallanInward" &&
                "challan_no" in refStoreObject.current
            ) {
                refStoreObject.current["challan_no"].focus();
            }
            if (
                formName == "CONSIGNORBILLING" &&
                "bill_no" in refStoreObject.current
            ) {
                refStoreObject.current["bill_no"].focus();
            }
            if (
                formName == "PodChallanInward" &&
                "challan_no" in refStoreObject.current
            ) {
                refStoreObject.current["challan_no"].focus();
            }
            if (
                formName == "CROSSINGIN" &&
                "crossing_in_no" in refStoreObject.current
            ) {
                refStoreObject.current["crossing_in_no"].focus();
            }
            if (
                formName == "CROSSINGOUT" &&
                "crossing_out_no" in refStoreObject.current
            ) {
                refStoreObject.current["crossing_out_no"].focus();
            }
            if (formName == "TRIPIN" && "trip_no" in refStoreObject.current) {
                refStoreObject.current["trip_no"].focus();
            }
            if (
                formName == "TripBhada" &&
                "station_from_name" in refStoreObject.current
            ) {
                refStoreObject.current["station_from_name"].focus();
            }
            if (formName == "CROSSINGBILLING" && "type" in refStoreObject.current) {
                refStoreObject.current["type"].focus();
            }
            if (
                formName == "PARTYRATEMASTER" &&
                "consignor_name" in refStoreObject.current
            ) {
                refStoreObject.current["consignor_name"].focus();
            }
            if (
                formName == "GENERALRATEMASTER" &&
                "station_from_name" in refStoreObject.current
            ) {
                refStoreObject.current["station_from_name"].focus();
            }
            if (formName == "CONSIGNORBILLING" && "id" in refStoreObject.current) {
                refStoreObject.current["id"].focus();
            }
            if (formName == "PODSTATEMENT" && "id" in refStoreObject.current) {
                refStoreObject.current["id"].focus();
            }
            if (
                formName == "Bilty Inquiry" &&
                "is_crossing" in refStoreObject.current
            ) {
                refStoreObject.current["is_crossing"].focus();
            }
            if (formName == "AccountMaster" && "name" in refStoreObject.current) {
                refStoreObject.current["name"].focus();
            }
            fetchLastData();
        },
        []
    );

    useEffect(
        // Effect for clearing out server side validation
        () => {
            if (submitApiState.error) {
                if (overlay) {
                    setOverlay(false);
                }
                console.log("Hoooooo", submitApiState.error.msg);
                setPreviousPageMode(pageMode);
                setPageMode("error");
                if ("save_button" in refStoreObject.current) {
                    refStoreObject.current["save_button"].removeAttribute("disabled");
                }
                if ("print_button" in refStoreObject.current) {
                    refStoreObject.current["print_button"].removeAttribute("disabled");
                }
                setPopupError(submitApiState.error.msg);
                clearSubmitApiState();
            }
            if (submitApiState.data) {
                if (overlay) {
                    setOverlay(false);
                }
                console.log("Submit api final fff", submitApiState.data);
                if (serverPrintNeeded) {
                    console.log("In Print");
                    executeServerPrint(submitApiState.data);
                }
                // refStoreObject.current["save_button"].removeAttribute("disabled");
                // refStoreObject.current["print_button"].removeAttribute("disabled");
                setPageState({
                    ...pageState,
                    ...submitApiState.data.response,
                });
                if (clearDataOnSave) {
                    setClearDataOnSave(false);
                    window.location.reload();
                }
                setPageMode("submitted");
                clearSubmitApiState();
            }
        },
        [submitApiState]
    );

    useEffect(
        // Effect for handling Api response
        () => {
            console.log({suggestionApiState});
            // Suggestion Api response handeling
            if (
                suggestionApiState.data &&
                suggestionApiState.data.apiType == "SugesstionValue"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                let text = {
                    responseForFrontend: {},
                };
                if (formName == "Vehicle") {
                    if ("modified_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.modified_date = formatDate(
                            new Date(suggestionApiState.data.response.entry_date)
                        );
                    }
                    if ("second_owner_entry_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.second_owner_entry_date = formatDate(
                            new Date(suggestionApiState.data.response.second_owner_entry_date)
                        );
                    }
                    if ("third_owner_entry_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.third_owner_entry_date = formatDate(
                            new Date(suggestionApiState.data.response.third_owner_entry_date)
                        );
                    }
                }
                for (let key in suggestionApiState.data.suggestionSchema) {
                    if (suggestionApiState.data.response[key] == null) {
                        text.responseForFrontend[
                            suggestionApiState.data.suggestionSchema[key]
                        ] = "";
                        continue;
                    }
                    text.responseForFrontend[
                        suggestionApiState.data.suggestionSchema[key]
                    ] = suggestionApiState.data.response[key];
                }
                if (
                    suggestionApiState.data.fieldInfoObject
                        .valueVerificationFromSuggestionNeeded
                ) {
                    setValueVerificationState({
                        ...valueVerificationState,
                        ...text.responseForFrontend,
                    });
                }

                if (
                    "idClearanceNeeded" in suggestionApiState.data.fieldInfoObject &&
                    suggestionApiState.data.fieldInfoObject.idClearanceNeeded != ""
                ) {
                    let idClearanceObject = {};
                    for (let key in text.responseForFrontend) {
                        if (
                            "onChangeIgnoreClearance" in
                            suggestionApiState.data.fieldInfoObject
                        ) {
                            if (
                                !suggestionApiState.data.fieldInfoObject.onChangeIgnoreClearance.includes(
                                    key
                                )
                            ) {
                                idClearanceObject[key] = {};
                                idClearanceObject[key].value = text.responseForFrontend[key];
                                idClearanceObject[key].fieldToClear =
                                    suggestionApiState.data.fieldInfoObject.idClearanceNeeded;
                            }
                        } else {
                            idClearanceObject[key] = {};
                            idClearanceObject[key].value = text.responseForFrontend[key];
                            idClearanceObject[key].fieldToClear =
                                suggestionApiState.data.fieldInfoObject.idClearanceNeeded;
                        }
                    }
                    if (
                        "isTable" in suggestionApiState.data.fieldInfoObject &&
                        suggestionApiState.data.fieldInfoObject.isTable
                    ) {
                        let parentFieldName =
                            suggestionApiState.data.fieldInfoObject.parentName;
                        updateObjectInListInIdClearanceState(
                            suggestionApiState.data.index,
                            idClearanceObject,
                            parentFieldName
                        );
                    } else {
                        setIdClearancState({
                            ...idClearancState,
                            ...idClearanceObject,
                        });
                    }
                }

                if (
                    "isTable" in suggestionApiState.data.fieldInfoObject &&
                    suggestionApiState.data.fieldInfoObject.isTable
                ) {
                    let parentFieldName =
                        suggestionApiState.data.fieldInfoObject.parentName;
                    updateObjectInListInPageState(
                        suggestionApiState.data.index,
                        text.responseForFrontend,
                        parentFieldName
                    );
                } else {
                    setPageState({
                        ...pageState,
                        ...text.responseForFrontend,
                    });
                }
            }
            // Get Bilty Api response handeling
            if (
                suggestionApiState.data &&
                (suggestionApiState.data.apiType == "getBilty" ||
                    suggestionApiState.data.apiType == "getMrInquiry" ||
                    suggestionApiState.data.apiType == "getBiltyInquiry" ||
                    suggestionApiState.data.apiType == "getChallan" ||
                    suggestionApiState.data.apiType == "getFleet" ||
                    suggestionApiState.data.apiType == "getStockOutward" ||
                    suggestionApiState.data.apiType == "getStockInward" ||
                    suggestionApiState.data.apiType == "getTrip" ||
                    suggestionApiState.data.apiType == "getVehicleRegister" ||
                    suggestionApiState.data.apiType == "getMrPending" ||
                    suggestionApiState.data.apiType == "getVehicle" ||
                    suggestionApiState.data.apiType == "getCrossingIn" ||
                    suggestionApiState.data.apiType == "getCrossingOut" ||
                    suggestionApiState.data.apiType == "getCrossingBill" ||
                    suggestionApiState.data.apiType == "getTripBhada" ||
                    suggestionApiState.data.apiType == "getPage" ||
                    suggestionApiState.data.apiType == "getMr")
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                if (
                    "is_deleted" in suggestionApiState.data.response &&
                    suggestionApiState.data.response.is_deleted == "1"
                ) {
                    clearSuggestionApiState();
                    return;
                }

                if (suggestionApiState.data.apiType == "getChallan") {
                    clearSuggestionApiState();
                    console.log("assa", suggestionApiState.data.response);
                    if ("multiple_manual_chalan" in suggestionApiState.data.response) {
                        console.log("Hererer");
                        let dummyObject = {
                            multiple_popup: "1",
                            multiple_popup_data:
                                suggestionApiState.data.response["multiple_manual_chalan"],
                        };
                        console.log(dummyObject, "asdfdgh");
                        // myForm.setPageStateByField("multiple_popup", "1")
                        setPageState({
                            ...pageState,
                            ...dummyObject,
                        });
                        return;
                    }
                }
                if (formName == "VehicleRegister") {
                    if ("received_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.received_date = formatDate(
                            new Date(suggestionApiState.data.response.received_date)
                        );
                    }
                    if ("register_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.register_date = formatDate(
                            new Date(suggestionApiState.data.response.register_date)
                        );
                    }
                    if ("x_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.x_date = formatDate(
                            new Date(suggestionApiState.data.response.x_date)
                        );
                    }
                }

                if(formName == "FleetManagement") {
                    let tmp = suggestionApiState.data.response.arrive_date.split('T')[0];
                    suggestionApiState.data.response.arrive_date = tmp;

                    tmp = suggestionApiState.data.response.depart_date.split('T')[0];
                    suggestionApiState.data.response.depart_date = tmp;

                    
                    tmp = suggestionApiState.data.response.fleet_date.split('T')[0];
                    suggestionApiState.data.response.fleet_date = tmp;


                    suggestionApiState.data.response.trip_info = suggestionApiState.data.response.trip_info.map((row) => {
                        for(let key in row) {
                            if(row[key] == null) {
                                row[key] = "";
                            }
                            if(key == "trip_date") {
                                row[key] = row[key].split('T')[0];
                            }
                        }

                        return row;
                    })
               
                }
                if(formName == "StockOutward") {
                    let tmp = suggestionApiState.data.response.outward_date.split('T')[0];
                    suggestionApiState.data.response.outward_date = tmp;
                }
                if(formName == "StockInward") {
                    let tmp = suggestionApiState.data.response.inward_date.split('T')[0];
                    suggestionApiState.data.response.inward_date = tmp;

                    suggestionApiState.data.response.item_info = suggestionApiState.data.response.item_info.map(item => {
                        item.valid_upto = item.valid_upto?.split('T')[0];
                        return item;
                    })
                }

                if ("input_date" in suggestionApiState.data.response) {
                    if (formName == "CROSSINGIN" || formName == "CONSIGNORBILLING" || formName == "CROSSINGBILLING"
                        || formName == "AccountTransaction" || formName == "Trip" || formName == "MrPendingAmount"
                        || formName == "TripBhada"
                    ) {
                        console.log("HERE");
                        suggestionApiState.data.response.input_date = formatDate(
                            new Date(suggestionApiState.data.response.input_date)
                        );
                    } else if (formName == "MR") {
                    } else {
                        suggestionApiState.data.response.input_date = new Date(
                            suggestionApiState.data.response.input_date
                        );
                    }
                }

                if(formName == "PODSTATEMENT") {
                    if("pod_receive_date" in suggestionApiState.data.response) {
                        suggestionApiState.data.response.pod_receive_date = new Date(
                            suggestionApiState.data.response.pod_receive_date
                        );
                    }
                }

                console.log("asasa", suggestionApiState.data.response);
                if ("date_to" in suggestionApiState.data.response) {
                    if (formName == "CROSSINGBILLING") {
                        console.log("HERE");
                        suggestionApiState.data.response.date_to = formatDate(
                            new Date(suggestionApiState.data.response.date_to)
                        );
                    }
                }
                if ("bhada_paid_date" in suggestionApiState.data.response) {
                    if(formName == "TripBhada" || formName == "Trip") {
                        if(suggestionApiState.data.response.bhada_paid_date) {
                          
                            suggestionApiState.data.response.bhada_paid_date = formatDate(suggestionApiState.data.response.bhada_paid_date);
                        }
                    }
                    else {
                        suggestionApiState.data.response.bhada_paid_date = new Date(
                            suggestionApiState.data.response.bhada_paid_date
                        );
                    }
                }
                if ("bill_date" in suggestionApiState.data.response) {
                    suggestionApiState.data.response.bill_date = formatDate(
                        new Date(suggestionApiState.data.response.bill_date)
                    );
                }
                /**
                 * Convert value of items into string.
                 */
                if ("item_in" in suggestionApiState.data.response) {
                    for (
                        let index = 0;
                        index < suggestionApiState.data.response["item_in"].length;
                        index++
                    ) {
                        for (let key in suggestionApiState.data.response["item_in"][
                            index
                        ]) {
                            suggestionApiState.data.response["item_in"][index][key] = String(
                                suggestionApiState.data.response["item_in"][index][key]
                            );
                        }
                        if (
                            index ==
                            suggestionApiState.data.response["item_in"].length - 1
                        ) {
                            suggestionApiState.data.response["item_in"][index]["new_row"] =
                                "N";
                        } else {
                            suggestionApiState.data.response["item_in"][index]["new_row"] =
                                "Y";
                        }
                    }
                }
                if ("eway_bill_no" in suggestionApiState.data.response) {
                    for (
                        let index = 0;
                        index < suggestionApiState.data.response["eway_bill_no"].length;
                        index++
                    ) {
                        for (let key in suggestionApiState.data.response["eway_bill_no"][
                            index
                        ]) {
                            suggestionApiState.data.response["eway_bill_no"][index][key] =
                                String(
                                    suggestionApiState.data.response["eway_bill_no"][index][key]
                                );
                        }
                        if (
                            index ==
                            suggestionApiState.data.response["eway_bill_no"].length - 1
                        ) {
                            suggestionApiState.data.response["eway_bill_no"][index][
                                "new_row"
                            ] = "N";
                        } else {
                            suggestionApiState.data.response["eway_bill_no"][index][
                                "new_row"
                            ] = "Y";
                        }
                    }
                }
                if (
                    "transporter_id" in suggestionApiState.data.response &&
                    suggestionApiState.data.apiType == "getBilty" &&
                    suggestionApiState.data.response.transporter_id != null &&
                    suggestionApiState.data.response.transporter_id != ""
                ) {
                    suggestionApiState.data.response.is_crossing = "Y";
                }
                /**
                 *Set hooks.
                 */
                if (formName == "Bilty") {
                    let verificationObject = {};
                    let idClearanceObject = {};
                    for (let key in BiltyDataObjectForVerificationFromSuggestion) {
                        if (BiltyDataObjectForVerificationFromSuggestion[key]) {
                            verificationObject[key] = suggestionApiState.data.response[key];
                        }
                    }
                    for (let key in BiltyDataObjectForIdClearance) {
                        idClearanceObject[key] = {};
                        idClearanceObject[key].value =
                            suggestionApiState.data.response[key];
                        idClearanceObject[key].fieldToClear =
                            BiltyDataObjectForIdClearance[key].fieldToClear;
                    }
                    console.log("verif", verificationObject);
                    setValueVerificationState({
                        ...valueVerificationState,
                        ...verificationObject,
                    });
                    setIdClearancState({
                        ...idClearancState,
                        ...idClearanceObject,
                    });
                }
                if (formName == "Challan") {
                    (suggestionApiState.data.response.No = ""),
                        (suggestionApiState.data.response.bilty_type = "D");
                }

                console.log("xxx yyy", suggestionApiState.data.response);
                setPageMode("view");
                setPageState({
                    ...pageState,
                    ...suggestionApiState.data.response,
                });
// NEW CODE FOR SENDING CLERANCE STATUS

                if(formName == "AccountTransaction"){
                setInitialPageState({
                    ...initialpageState,
                    ...suggestionApiState.data.response,
                });
                }
// END

            }
            if (
                suggestionApiState.data &&
                (suggestionApiState.data.apiType == "getEwbInfo" ||
                    suggestionApiState.data.apiType == "generateCwb")
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                if (suggestionApiState.data.apiType == "getEwbInfo") {
                    makeFocusOnParticularField("station_from_name");
                }
                let idClearanceDummy = {
                    consignor_gst: {
                        value: suggestionApiState.data.response.consignor_gst,
                        fieldToClear: "consignor_id"
                    },
                    consignor_name: {
                        value: suggestionApiState.data.response.consignor_name,
                        fieldToClear: "consignor_id"
                    }
                }
                console.log("ashdh", suggestionApiState.data.response);
                setIdClearancState({
                    ...idClearancState,
                    ...idClearanceDummy,
                });
                setPageState({
                    ...pageState,
                    ...suggestionApiState.data.response,
                });

            }
        },
        [suggestionApiState.data]
    );

    useEffect(
        // Effect for handling Api response
        () => {
            // if(overlay){
            //   setOverlay(false);
            // }
            // Get Bilty Api response handeling
            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getBilty"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                let urlTailString = suggestionApiState.error.data.apiUrlTail;
                let bilty_no = urlTailString.split("?")[0];
                // console.log("Bilt no", bilty_no);
                // if (bilty_no.length == 8 || bilty_no.length == 9) {
                //   setPageMode("error");
                //   setPopupError(
                //     "Bilty number you are trying to fetch is invalid automatic bilty."
                //   );
                //   return;
                // }
                makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                // makeFocusOnParticularField("is_crossing");
            }

            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getChallan"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                // let urlTailString = suggestionApiState.error.data.apiUrlTail;
                // let bilty_no = urlTailString.split("?")[0];
                makeFocusOnParticularField("vehicle_no")
            }
            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getFleet"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                // let urlTailString = suggestionApiState.error.data.apiUrlTail;
                // let bilty_no = urlTailString.split("?")[0];
                makeFocusOnParticularField("fleet_no");
            }
            if (
                suggestionApiState.error &&
                (suggestionApiState.error.data.apiType == "getStockOutward" ||
                suggestionApiState.error.data.apiType == "getStockInward")
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                // let urlTailString = suggestionApiState.error.data.apiUrlTail;
                // let bilty_no = urlTailString.split("?")[0];
                makeFocusOnParticularField("register_no");
            }

            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getCrossingBill"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                // let urlTailString = suggestionApiState.error.data.apiUrlTail;
                // let bilty_no = urlTailString.split("?")[0];
                // makeFocusOnParticularField("bill_no")
            }

            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getVehicleRegister"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                // let urlTailString = suggestionApiState.error.data.apiUrlTail;
                // let bilty_no = urlTailString.split("?")[0];
                makeFocusOnParticularField("letter_no")
            }

            // Get Ewb error popup
            if (
                suggestionApiState.error &&
                suggestionApiState.error.data.apiType == "getEwbInfo"
            ) {
                if (overlay) {
                    setOverlay(false);
                }
                setPageMode("error");
                setPopupError(suggestionApiState.error.msg);
                makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
            }

            // if (
            //   suggestionApiState.error &&
            //   suggestionApiState.error.data.apiType == "getPodChallan"
            // ) {
            //   setPageMode("error");
            //   setPopupError(
            //     "Ewb Entered is either invalid or not for this transporter."
            //   );
            // }
        },
        [suggestionApiState.error]
    );

    if (formName == "Bilty") {
        useEffect(() => {
            let needsUpdate = false;
            let updatedPageStateTotal = {};
            [needsUpdate, updatedPageStateTotal] =
                biltyAutoUpdationEffectsDummy(pageState);
            if (needsUpdate) {
                setPageState(oldState => ({...oldState, ...updatedPageStateTotal }));
            }
        }, [pageState]);
    }

    if (formName == "MR") {
        useEffect(() => {
            let needsUpdate = false;
            let updatedPageStateTotal = {};
            [needsUpdate, updatedPageStateTotal] =
                mrAutoUpdationEffectsDummy(pageState);
            if (needsUpdate) {
                setPageState({ ...pageState, ...updatedPageStateTotal });
            }
        }, [pageState]);
    }

    if (formName == "Trip") {
        useEffect(() => {
            let amount = parseFloat(pageState.amount) || 0;
            let advance_bhada = parseFloat(pageState.advance_bhada) || 0;
            let balance_bhada = parseFloat(pageState.balance_bhada) || 0;
            let tds_rate = parseFloat(pageState.tds_rate) || 0;
            let tds_amount = parseFloat(pageState.tds_amount) || 0;

            // console.log(amount, advance_bhada, balance_bhada, tds_rate);
            // console.log(pageState);

            let balance = amount - advance_bhada;
            let tdsAmount = (amount * tds_rate) / 100;
            let netBalance = balance - tdsAmount;

            // console.log(newAmount);

            let objectToUpdate = {
                balance_bhada: String(balance),
                tds_amount: tdsAmount,
                net_balance: netBalance,
            };
            if (balance_bhada != balance || tdsAmount != tds_amount) {
                // console.log("updating");
                // setPageState({ ...pageState, ...objectToUpdate });
                // setPageStateByField("balance_bhada", String(newAmount));
                setPageState((oldState) => ({
                    ...oldState,
                    ...objectToUpdate,
                }))
            }
        }, [pageState.amount, pageState.advance_bhada, pageState.tds_rate]);
    }

    if (formName == "CONSIGNORBILLING" || formName == "CROSSINGBILLING") {
        useEffect(() => {
            let needsUpdate = false;
            let objectToUpdate = {};
            let total_amount = parseInt(pageState.total_amount) || 0;
            let add = parseInt(pageState.add) || 0;
            let net_amount = parseInt(pageState.net_amount) || 0;
            let gross_amount = parseInt(pageState.gross_amount) || 0;
            let amt1 = parseInt(pageState.amt1) || 0;
            let amt2 = parseInt(pageState.amt2) || 0;
            let extra_percentage = parseInt(pageState.extra_percentage) || 0;
            let extra_percentage_amount =
                parseInt(pageState.extra_percentage_amount) || 0;
            // let extra = gross_amount*extra_percentage/100 + gross_amount

            // Check if extra amount needs to be updated or not.
            if (
                extra_percentage_amount !=
                parseInt((gross_amount * extra_percentage) / 100)
            ) {
                needsUpdate = true;
                console.log(
                    "In extra percentage",
                    extra_percentage_amount,
                    (gross_amount * extra_percentage) / 100
                );
                objectToUpdate.extra_percentage_amount =
                    (gross_amount * extra_percentage) / 100;
            }
            if (
                net_amount !=
                total_amount + add + extra_percentage_amount + amt1 + amt2
            ) {
                needsUpdate = true;
                console.log(
                    "In net amount",
                    net_amount,
                    total_amount + add + extra_percentage_amount
                );
                objectToUpdate.net_amount =
                    total_amount + add + extra_percentage_amount + amt1 + amt2;
            }
            console.log("Needs Flag last", needsUpdate);
            if (needsUpdate) {
                console.log("Net Amount", objectToUpdate);
                // objectToUpdate.net_amount = String(parseInt(objectToUpdate.net_amount) + parseInt(objectToUpdate.extra_percentage_amount))
                setPageState((pageStateOld) => ({ ...pageStateOld, ...objectToUpdate }));
            }
            // else if(extra_percentage > 0){
            // objectToUpdate.net_amount = String(parseInt(net_amount) + parseInt(extra))
            // setPageState({ ...pageState, ...objectToUpdate });
            // }
        }, [pageState]);
    }

    if (formName == "BillPaid") {
        useEffect(() => {
            let needsUpdate = false;
            let objectToUpdate = {};
            let net_amount = parseInt(pageState.net_amount) || 0;
            let tds_per = parseInt(pageState.tds_per) || 0;
            let tds =
                parseInt(pageState.tds) || 0;
            // let extra = gross_amount*extra_percentage/100 + gross_amount

            // Check if extra amount needs to be updated or not.
            if (
                tds !=
                parseInt((net_amount * tds_per) / 100)
            ) {
                needsUpdate = true;
                console.log(
                    "In tds percentage",
                    tds,
                    (net_amount * tds_per) / 100
                );
                objectToUpdate.tds =
                    (net_amount * tds_per) / 100;
            }
            // if (
            //   net_amount !=
            //   total_amount + add + extra_percentage_amount + amt1 + amt2
            // ) {
            //   needsUpdate = true;
            //   console.log(
            //     "In net amount",
            //     net_amount,
            //     total_amount + add + extra_percentage_amount
            //   );
            //   objectToUpdate.net_amount =
            //     total_amount + add + extra_percentage_amount + amt1 + amt2;
            // }
            // console.log("Needs Flag last", needsUpdate);
            if (needsUpdate) {
                console.log("Net Amount", objectToUpdate);
                // objectToUpdate.net_amount = String(parseInt(objectToUpdate.net_amount) + parseInt(objectToUpdate.extra_percentage_amount))
                setPageState({ ...pageState, ...objectToUpdate });
            }
            // else if(extra_percentage > 0){
            // objectToUpdate.net_amount = String(parseInt(net_amount) + parseInt(extra))
            // setPageState({ ...pageState, ...objectToUpdate });
            // }
        }, [pageState]);

    }

    return {
        pageState,
        setPageState,
        internalValidationErrors,
        setInternalValidationErrors,
        submitApiState,
        performSubmission,
        suggestionApiState,
        performSuggestions,
        suggestions,
        setSuggestions,
        handleChange,
        handleChangeForSelect,
        getSuggestionValue,
        renderSuggestion,
        onSuggestionsFetchRequested,
        onSuggestionsClearRequested,
        onChangeAutoSuggest,
        handleSuccess,
        suggestionFetchApi,
        setPageStateByField,
        handleSubmit,
        handleValueUpdate,
        renderSubmitApiResponseStatus,
        onKeyChange,
        onblurValidator,
        getPageOnKeyEnter,
        pageMode,
        setPageMode,
        refStoreObject,
        storeInputReference,
        makeFocusOnParticularField,
        onKeyPressForKeyNav,
        updatePageStateForGetSuggestion,
        valueVerificationState,
        makeFocusOnParticularFieldForItem,
        storeInputReferenceForSelect,
        idClearancState,
        setIdClearancState,
        onblurValidatorForTable,
        storeInputReferenceForSelectForDynamicTable,
        popupError,
        setPopupError,
        serverPrintNeeded,
        setServerPrintNeeded,
        previousPageMode,
        setPreviousPageMode,
        synchronousSave,
        deletePopup,
        setDeletePopup,
        clearDataOnSave,
        setClearDataOnSave,
        onSuggestionsFetchRequestedDebounced,
        overlay,
        setOverlay,
        getFyearsOnKeyEnter,
        displayFyearPopup,
        getSuffixesOfBilty,
        initialpageState //NEW CODE FOR SENDING CLERANCE STATUS
    };
};

export default useForm;
