import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { fleetApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactHTMLTableToExcel from "react-html-table-to-excel";


// import { saveAs } from 'file-saver'

import print from "print-js";
import {
    groupInfo,
    dataObject,
    challanBiltyOriginalTableHeader,
    challanBiltyOriginalTableItems,
    validate,
    popupInfo,
    stationFromFieldInfo,
    tripItemHeaders,
    tripItems,
} from "../config/fleetManagementConfig.js";
import DatePicker from "react-datepicker";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import ReactToPrint from "react-to-print";
import TableToPrint from "./ChallanPrint";
import FormColumn from "./FormColumn.js";
import { useHistory } from "react-router-dom";
import FleetManagementPage from "./pages/FleetManagementPage";
import ReportExcel from "./ReportExcel";
let checkCwbResult = {};

const FleetManagement = ({ sessionObject }) => {
    const history = useHistory();
    const location = useLocation();
    const [checkCwbSubmitted, setcheckCwbSubmitted] = React.useState(false);
    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };

    useEffect(() => {
        console.log(myForm.pageState);
    })


    // useEffect(() => {
    //     // console.log(myForm.pageState);
    //     const defaultChallanNo = location.state ?? "";
    //     console.log(defaultChallanNo);
    //     if (defaultChallanNo != "") {
    //         myForm.setPageStateByField("challan_no", defaultChallanNo);

    //         const fakeKey = { key: "Enter" }
    //         // myForm.getPageOnKeyEnter(fakeKey, defaultChallanNo);
    //         myForm.setOverlay(true);
    //         let data = {
    //             apiUrlTail: defaultChallanNo + "?branch_id=" + myForm.pageState.created_from,
    //             apiType: "getChallan",
    //             apiConfig: challanApiConfig["getChallan"],
    //         };
    //         const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    //         data.apiUrlTail += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
    //         myForm.performSuggestions(data);
    //     }
    // }, []);

    let variablesFromSession = {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        created_by_name: String(sessionObject.sessionVariables.user_name),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    const myForm = useForm(
        "FleetManagement",
        validate,
        { ...dataObject, ...variablesFromSession },
        fleetApiConfig
    );

    useEffect(() => {

        let totalDebit = 0;
        let totalCredit = 0;
        let totalAmount = 0;

        totalDebit += parseFloat(myForm.pageState.diesel) || 0;
        totalDebit += parseFloat(myForm.pageState.rassa) || 0;
        totalDebit += parseFloat(myForm.pageState.hamali) || 0;
        totalDebit += parseFloat(myForm.pageState.toll) || 0;
        totalDebit += parseFloat(myForm.pageState.bhattha) || 0;
        totalDebit += parseFloat(myForm.pageState.salary) || 0;
        totalDebit += parseFloat(myForm.pageState.rto) || 0;
        totalDebit += parseFloat(myForm.pageState.miscellaneous) || 0;
        totalDebit += parseFloat(myForm.pageState.insurance) || 0;
        totalDebit += parseFloat(myForm.pageState.telephone) || 0;
        totalDebit += parseFloat(myForm.pageState.repair_tyre) || 0;
        totalDebit += parseFloat(myForm.pageState.repair_gen) || 0;
        totalDebit += parseFloat(myForm.pageState.repair_body) || 0;
        totalDebit += parseFloat(myForm.pageState.balance_freight) || 0;
        totalDebit += parseFloat(myForm.pageState.cash_driver) || 0;
        totalDebit += parseFloat(myForm.pageState.commission) || 0;

        totalCredit += parseFloat(myForm.pageState.advance) || 0;
        totalCredit += parseFloat(myForm.pageState.balance) || 0;
        totalCredit += parseFloat(myForm.pageState.truck_freight) || 0;
        totalCredit += parseFloat(myForm.pageState.silak) || 0;
        totalCredit += parseFloat(myForm.pageState.cash) || 0;
        totalCredit += parseFloat(myForm.pageState.bank) || 0;

        totalAmount = totalCredit - totalDebit;

        const oldCredit = parseFloat(myForm.pageState.total_credit) || 0;
        const oldDebit = parseFloat(myForm.pageState.total_debit) || 0;

        console.log({ totalCredit, totalDebit, oldCredit, oldDebit });

        if (oldCredit != totalCredit || oldDebit != totalDebit) {
            myForm.setPageState((oldState) => ({
                ...oldState,
                total_credit: totalCredit,
                total_debit: totalDebit,
                total_amount: Math.abs(totalAmount),
                balance_type: (totalCredit >= totalDebit ? "cr" : "dr"),
            }))
        }

    }, [myForm.pageState]);


    useEffect(() => {
        let startKm = parseInt(myForm.pageState.start_km) || 0;
        let endKm = parseInt(myForm.pageState.end_km) || 0;

        myForm.setPageStateByField("journey_km", (endKm - startKm));

    }, [myForm.pageState.start_km, myForm.pageState.end_km])

    useEffect(() => {
        let totalKm = parseInt(myForm.pageState.journey_km) || 0;
        let diesel = parseFloat(myForm.pageState.journey_diesel) || 0;

        console.log((totalKm / diesel));

        myForm.setPageStateByField("journey_avg", (totalKm / diesel).toFixed(2));

    }, [myForm.pageState.journey_diesel])


    // useEffect(() => {
    //     myForm.setPageStateByField("balance_freight", myForm.pageState.truck_freight);
    // }, [myForm.pageState.truck_freight])


    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        let additionalInfoObject = {};
        if (fieldInfoObject.name == "station_from_name") {
            additionalInfoObject.is_branch = true;
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

    const getFyearsOnKeyEnter = async (e, myFormName, page_id) => {
        if (e.key == "Enter") {
            e.persist();
            myForm.setOverlay(true);
            myForm.setPageStateByField("enterEvent", { ...e });

            // console.log(refStoreObject.current[e.target.name]);
            // console.log(e.target.name);
            // refStoreObject.current[e.target.name].blur();

            const company_id = myForm.pageState.company_id;
            let url = SERVER_URL;
            let dataToSend = {};
            let finalFyearList = [];

            if (myFormName == "Bilty Inquiry") {
                myForm.refStoreObject.current["bilty_no"].blur();
                // if (page_id == "") {
                //     setOverlay(false);
                //     makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                //     return;
                // }
                url += "/bilty/option";

                let flag = 0;
                if (
                    myForm.pageState.bilty_type == "c" ||
                    myForm.pageState.bilty_type == "C"
                ) {
                    flag = 1;
                }

                dataToSend = {
                    companyId: company_id,
                    bilty_no: page_id,
                    suffix: null,
                };
                dataToSend.owned_by = myForm.pageState.created_from;
                dataToSend.branch_id = myForm.pageState.created_from;
                dataToSend.module = "chalan";
                dataToSend.flag = flag;
            }

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })

            const respData = await resp.json();

            if (Array.isArray(respData)) {
                const fYearList = respData;
                console.log(fYearList);

                fYearList.forEach(obj => {
                    if ("fyear" in obj) {
                        finalFyearList.push(obj.fyear);
                    }
                })

                if (finalFyearList.length == 1) {
                    myForm.getSuffixesOfBilty(page_id, finalFyearList[0]);
                }
                else {
                    myForm.setPageStateByField("fyearList", finalFyearList);
                }
            }
            else {
                // got whole bilty
                if (!resp.ok) {
                    const temp_error = respData;
                    if ("detail" in temp_error) {
                        if (temp_error.detail == "Bilty not found") {
                            myForm.makeFocusOnParticularField("bilty_no");
                            myForm.setOverlay(false);
                            return;
                        }
                        myForm.setPreviousPageMode(myForm.pageMode);
                        myForm.setPageMode("error");
                        myForm.setPopupError(String(temp_error.detail));
                    } else {
                        myForm.setPreviousPageMode(myForm.pageMode);
                        myForm.setPageMode("error");
                        myForm.setPopupError("Invalid Bilty");
                    }
                    myForm.setPageState({
                        ...myForm.pageState,
                        ["No"]: "",
                        ["suffix"]: "",
                    });
                    myForm.setOverlay(false);
                    return;
                }
                linkBilty({}, respData);
            }
            myForm.setOverlay(false);
        }
    }

    const linkBilty = async (e, argResponse) => {
        console.log(e, argResponse);
        let temp_response;
        if (argResponse) {
            temp_response = argResponse;
        }
        else {
            if (myForm.pageState.No == "" && e.key == "Enter") {
                myForm.makeFocusOnParticularField("save_button");
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
                    "/bilty/chalan_in/" +
                    myForm.pageState.No +
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
                    const temp_error = await response.json();
                    if ("detail" in temp_error) {
                        if (temp_error.detail == "Bilty not found") {
                            myForm.makeFocusOnParticularField("bilty_no");
                            return;
                        }
                        myForm.setPreviousPageMode(myForm.pageMode);
                        myForm.setPageMode("error");
                        myForm.setPopupError(String(temp_error.detail));
                    } else {
                        myForm.setPreviousPageMode(myForm.pageMode);
                        myForm.setPageMode("error");
                        myForm.setPopupError("Invalid Bilty");
                    }
                    myForm.setPageState({
                        ...myForm.pageState,
                        ["No"]: "",
                        ["suffix"]: "",
                    });
                    return;
                }
                temp_response = await response.json();
            }
        }

        console.log(temp_response);

        // if("flag" in temp_response) {
        //     myForm.makeFocusOnParticularField("suffix");
        //     return;
        // }

        if (temp_response.check_fail) {
            myForm.setPageState({
                ...myForm.pageState,
                ["No"]: "",
                ["suffix"]: "",
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
                ["suffix"]: "",
            });
            myForm.setPreviousPageMode(myForm.pageMode);
            myForm.setPageMode("error");
            myForm.setPopupError("Already present");
            return;
        }
        const newState = {
            bilty_ids: [temp_response, ...myForm.pageState["bilty_ids"]],
            ["No"]: "",
            ["suffix"]: "",
        };
        myForm.setPageState({
            ...myForm.pageState,
            ...newState,
        });
        myForm.makeFocusOnParticularField("bilty_type");
    };

    const getTrip = async () => {

        if(myForm.pageState.trip_no == "") {
            myForm.makeFocusOnParticularField("station_to_name");
            return;
        }

        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
        let url =
            SERVER_URL + "/fleet_master/trip?trip_no=" +
            myForm.pageState.trip_no +
            "&branch_id=" +
            myForm.pageState.created_from +
            "&companyId=" + myForm.pageState.company_id +
            "&fyear=" + fYear_fetch

        if (myForm.pageState.vehicle_id != "") {
            url += "&vehicle_id=" + myForm.pageState.vehicle_id;
        }


        const response = await fetch(url);
        if (!response.ok) {
            console.log("Not able to get trip");
            return;
        }
        const temp_response = await response.json();
        console.log(temp_response);

        temp_response.trip_date = temp_response.trip_date.split('-').reverse().join('-');

        myForm.setPageState((oldState) => ({
            ...oldState,
            ...temp_response,
        }))
    };


    const handleEditSpecificRow = (idx, fieldMapping) => () => {

        // console.log("!!! inside edit row: ", idx, " -- ", fieldMapping);
        // console.log(myForm.pageState);

        const entryToEdit = myForm.pageState[fieldMapping][idx];

        let rows = [...myForm.pageState[fieldMapping]];

        rows.splice(idx, 1);

        let totalFinal = parseFloat(myForm.pageState.total_final_amount) || 0;

        if (entryToEdit.balance_type == "cr") {
            totalFinal -= parseFloat(entryToEdit.total_amount);
        }
        else {
            totalFinal += parseFloat(entryToEdit.total_amount);
        }

        myForm.setPageState({
            ...myForm.pageState,
            [fieldMapping]: rows,
            ...entryToEdit,
            total_final_amount: totalFinal,
        });
    };

    const deleteEntryFromTableCallback = (infoObject) => {

        let totalFinal = parseFloat(myForm.pageState.total_final_amount) || 0;

        let row = myForm.pageState.trip_info[infoObject.idx];
        if (row.balance_type == "cr") {
            totalFinal -= parseFloat(row.total_amount);
        }
        else {
            totalFinal += parseFloat(row.total_amount);
        }

        // console.log(infoObject);

        myForm.setPageState({
            ...myForm.pageState,
            "trip_info": infoObject.rows,
            total_final_amount: totalFinal,
        });
    };


    const handleDelete = async () => {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
        const url =
            SERVER_URL + "/challan/?booking_chalan_no=" + myForm.pageState.challan_no
            + "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
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

    const checkDisabledCondition = (fieldInfo) => {
        if (myForm.pageMode == "view") {
            return "disabled";
        } else if (fieldInfo.name == "cewb_no") {
            return "disabled";
        }
        else if (fieldInfo.name == "vehicle_no" || fieldInfo.name == "driver_name") {
            return true;
        }
        // else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
        //   return "disabled";
        // } 
        else {
            return "";
        }
    };

    const checkVisibilityCondition = (fieldInfo) => {

        if (fieldInfo.name == "edit_button") {
            if (myForm.pageMode != "view") {
                return false;
            }

            if (myForm.pageState.is_inwarded != "1") {
                return true;
            }

            const roleId = sessionObject.sessionVariables.role_id;
            // console.log({roleId});
            if (roleId == "1" || roleId == "2") {
                return true;
            }
            return false;
        }

        if (
            fieldInfo.name == "delete_button" &&
            myForm.pageState.is_inwarded == "1"
        ) {
            return false;
        }
        return true;
    };

    const takeInwardChallan = (row) => {
        let dummyObject = {
            multiple_popup: "0",
            multiple_popup_data: [],

        }
        myForm.setPageState({
            ...myForm.pageState,
            ...dummyObject,
        });
        let data = {
            apiUrlTail: row.booking_chalan_no + "?branch_id=" + myForm.pageState.created_from,
            apiType: "getChallan",
            apiConfig: challanApiConfig["getChallan"],
        };
        console.log("Get page data fff", data);
        myForm.performSuggestions(data);
    }

    // useEffect(() => {
    //     let newObj = {
    //         total_bilty: 0,
    //         total_pkgs: 0,
    //         total_weight: 0,
    //         total_eway: 0,
    //     }
    //     for (let i = 0; i < myForm.pageState.bilty_ids.length; i++) {
    //         newObj.total_bilty += 1
    //         newObj.total_pkgs += parseFloat(myForm.pageState.bilty_ids[i].no_of_package) || 0
    //         newObj.total_weight += parseFloat(myForm.pageState.bilty_ids[i].charge_weight) || 0
    //         newObj.total_eway += myForm.pageState.bilty_ids[i].eway_bill_info.length
    //     }
    //     myForm.setPageState({
    //         ...myForm.pageState, ...newObj
    //     })
    // }, [myForm.pageState.bilty_ids]);

    const handlePrintCewb = async () => {
        myForm.setOverlay(true);
        const url = SERVER_URL + "/challan/print-cweb"
            + `?cweb_no=${myForm.pageState.cewb_no}`;


        let response = await fetch(url)
            .then((r) => {
                console.log(r, typeof r);
                return r.blob();
            });
        print({ printable: URL.createObjectURL(response), type: "pdf", showModal: false });
        myForm.setOverlay(false);
    }

    return (
        <div className="challan-form-container">
            {
                USE_OVERLAY && (
                    <LoadingOverlay
                        active={myForm.overlay}
                        spinner
                        text="Loading your content..."
                        styles={{
                            wrapper: {
                                // width: '400px',
                                // height: '400px',
                                overflow: true ? "hidden" : "scroll",
                            },
                        }}
                    ></LoadingOverlay>
                )
            }
            <div>
                <div>]
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
                                                if (myForm.previousPageMode != "") {
                                                    myForm.setPageMode(myForm.previousPageMode);
                                                    myForm.setPreviousPageMode("");
                                                }
                                                else {
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
                                <div className="pop-up-header">
                                    Are you sure want to delete?
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        onClick={() => {
                                            handleDelete();
                                            myForm.setDeletePopup(false)
                                            close();
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="pop-up-button"
                                        onClick={() => {
                                            myForm.setDeletePopup(false)
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
                {/* <div>
                    <Popup
                        // trigger={<button className="button"> Open Modal </button>}
                        open={myForm.pageState.multiple_popup == "1"}
                        modal
                        contentStyle={contentStyle}
                        closeOnDocumentClick={false}
                    >
                        {(close) => (
                            <div className="pop-up-container">
                                <div className="pop-up-header">
                                    {" "}
                                    Multiple Challan Found With Same Manual No
                                </div>
                                <div className="pop-up-content">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>
                                                    Challan No
                                                </td>
                                                <td>
                                                    Branch
                                                </td>
                                                <td>
                                                    Take Inward
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                myForm.pageState.multiple_popup_data.map(
                                                    (row) => (
                                                        <tr>
                                                            <td>
                                                                {row.booking_chalan_no}
                                                            </td>
                                                            <td>
                                                                {row.branch_name}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() => {
                                                                        takeInwardChallan(row)
                                                                    }}
                                                                >
                                                                    Get
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        onClick={() => {
                                            if (myForm.pageMode == "submitted") {
                                                // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":myForm.pageState.bilty_no})
                                                myForm.setPageState({
                                                    ...ChallanInwardDataObject,
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
                </div> */}
            </div>

            <div className="form-header">Fleet Management</div>
            <div
                onSubmit={myForm.handleSubmit}
                className="form"
                noValidate
                style={{ overflow: "auto" }}
            >
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Fleet No:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="fleet_no"
                            placeholder=""
                            value={myForm.pageState.fleet_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(e) => myForm.getPageOnKeyEnter(e, myForm.pageState.fleet_no)}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "fleet_no")}
                            disabled={checkDisabledCondition({ name: "fleet_no" })}
                            autoFocus={true}
                        />

                        {myForm.internalValidationErrors["challan_no"] && (
                            <p>{myForm.internalValidationErrors["challan_no"]}</p>
                        )}
                        {checkVisibilityCondition({ name: "edit_button" }) && (
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
                        <label className="form-label">Fleet Date:{" "}</label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="fleet_date"
                            placeholder=""
                            value={myForm.pageState.fleet_date}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "fleet_date")}
                            disabled={checkDisabledCondition({ name: "fleet_date" })}
                            onKeyPress={(e) => {
                                if(e.key == "Enter") {
                                    myForm.makeFocusOnParticularField("station_from_name");
                                }
                            }}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Station From: </label>
                        <Autosuggest
                            id={stationFromFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            // onSuggestionsFetchRequested={(a) =>
                            //   myForm.onSuggestionsFetchRequested(a, (b) =>
                            //     myForm.suggestionFetchApi(stationFromFieldInfo, b)
                            //   )
                            // }
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequestedDebounced(
                                    a,
                                    (b) =>
                                        myForm.suggestionFetchApi(
                                            stationFromFieldInfo,
                                            b,
                                            getAdditionalInfoForSuggestionFetch(stationFromFieldInfo)
                                        )
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
                    <div>
                        <label className="form-label">Trip No: </label>
                        <input
                            className="form-input"
                            type="text"
                            name="trip_no"
                            placeholder=""
                            value={myForm.pageState.trip_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    getTrip();
                                }
                            }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "trip_no")}
                            disabled={checkDisabledCondition({ name: "trip_no" })}
                        />

                    </div>

                    <div className="form-row">
                        <label className="form-last_bilty">Last Fleet No:</label>
                        <label className="form-last_bilty">
                            {myForm.pageState.last_fleet_no}
                        </label>
                    </div>
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
                    <div className="form-field-right">
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
                <div className="form-input-content-block-0">
                    <div className="form-field-left">
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
                        <br />
                        <DynamicViewTable
                            edit={1}
                            delete={1}
                            editRowFunction={handleEditSpecificRow}
                            tableHeader={tripItemHeaders}
                            tableItems={tripItems}
                            tableValues={myForm.pageState["trip_info"]}
                            setPageStateByField={myForm.setPageStateByField}
                            deleteEntryFromTableCallback={deleteEntryFromTableCallback}
                            pageStateArray={myForm.pageState["trip_info"]}
                            fieldMapping="trip_info"
                        />
                    </div>
                    <div className="form-field-right">
                        <FormColumn
                            groupInfo={groupInfo}
                            groupName="group-4"
                            checkDisabledCondition={checkDisabledCondition}
                            checkVisibilityCondition={checkVisibilityCondition}
                            myFormObj={myForm}
                            getAdditionalInfoForSuggestionFetch={
                                getAdditionalInfoForSuggestionFetch
                            }
                        />
                    </div>
                </div>

                <div className="chform-row">
                    {/* <label className="chform-label">Balance Freight: </label>
                    <input
                        className="chform-input"
                        value={myForm.pageState.truck_freight}
                        disabled={true}
                    /> */}
                    <label className="chform-label">Balance: </label>
                    <input
                        className="chform-input"
                        type="text"
                        name="total_amount"
                        value={myForm.pageState.total_amount}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "total_amount")}
                        disabled={true}
                    />
                    <label className="chform-label">Balance Type: </label>
                    <input
                        className="chform-input"
                        type="text"
                        name="balance_type"
                        value={myForm.pageState.balance_type}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "balance_type")}
                        disabled={true}
                    />
                </div>

                <div className="chform-row">

                    <label className="chform-label">Total Balance: </label>
                    <input
                        className="chform-input"
                        type="text"
                        name="total_final_amount"
                        value={Math.abs(myForm.pageState.total_final_amount)}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "total_final_amount")}
                        disabled={true}
                    />
                    <label className="chform-label">Total Balance Type: </label>
                    <input
                        className="chform-input"
                        type="text"
                        name="final_balance_type"
                        value={myForm.pageState.total_final_amount >= 0 ? "cr" : "dr"}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "final_balance_type")}
                        disabled={true}
                    />
                </div>

                <div className="form-footer">
                    {/* <button
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
                    </button> */}
                    <button
                        onClick={myForm.handleSubmit}
                        type="button"
                        className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
                    >
                        Save
                    </button>
                    {/* {checkVisibilityCondition({ name: "delete_button" }) && (
                        <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
                    )} */}
                    <button
                        onClick={() => {
                            history.push("/");
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
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="fleet_report_excel"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                        onClick={() => {
                            ReportExcel.excel_fleet_report_data(myForm.pageState);
                        }}

                    />
                    {ReportExcel.excel_fleet_report_data(myForm.pageState)}
                    {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
                </div>
            </div>
        </div>
    );
};

export default FleetManagement;
