import React, { useEffect, useRef, useState } from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { BankClearanceApiConfig } from "../config/apiConfig.js";
import './BankClearanceComponent.css'
// import "./biltyReport.css";
import {
    groupInfo,
    dataObject,
    popupInfo,
    validate,
    BankClearanceTableHeaders,
    BankClearanceTableItems,
    isoToDash,
} from "../config/BankClearanceConfig";
import { SERVER_URL } from "../config/config";
import ReportExcel from "./ReportExcel.js";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./TripForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";
import print from "print-js";
import getLoggedinFyear from "../utils/getLoggedinFyear";

const BankClearance = ({ sessionObject }) => {
    const download_ref = useRef(null);
    const [excelData, setExcelData] = useState([]);

    useEffect(() => {
        myForm.makeFocusOnParticularField("consignor_name");
    }, [])

    const fyearObj = getLoggedinFyear(sessionObject);
    let variablesFromSession = {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
        date_from: fyearObj.start_fyear,
        date_to: fyearObj.end_fyear,
    };

    const myForm = useForm(
        "BankClearance",
        validate,
        { ...dataObject, ...variablesFromSession },
        BankClearanceApiConfig
    );

    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
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
        return true;
    };

    const checkDisabledCondition = (fieldInfo) => {
        return "";
    };

    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        // if (fieldInfoObject.name == "vehicle_no"){
        //   return {"limit": "10"};
        // }
        let additionalInfoObject = {};
        additionalInfoObject.branch_id = myForm.pageState.created_from;
        additionalInfoObject.subgroup_id = "8";
        return additionalInfoObject;
    };

    const linkBilty = async (e) => {
        if (e.target.value == "" && e.key == "Enter") {
            myForm.makeFocusOnParticularField("save_button");
            return;
        }
        if (e.key == "Enter") {
            // TODO: hit api here, changes for bilty_info
            const url = SERVER_URL + "/challan/trip_in/" + e.target.value;
            const response = await fetch(url);

            console.log("Response", response);
            if (!response.ok) {
                myForm.setPageState({
                    ...myForm.pageState,
                    ["No"]: "Invalid Challan",
                });
                return;
            }
            const temp_response = await response.json();
            if (temp_response.check_fail) {
                myForm.setPageState({
                    ...myForm.pageState,
                    ["No"]: "Not possible to add this challan",
                });
                return;
            }
            if (
                checkIfFieldAlreadyExists(
                    "booking_chalan_no",
                    temp_response.booking_chalan_no,
                    myForm.pageState.challan_ids
                )
            ) {
                myForm.setPageState({
                    ...myForm.pageState,
                    ["No"]: "Already Present",
                });
                return;
            }
            const newState = {
                challan_ids: [...myForm.pageState["challan_ids"], temp_response],
                ["No"]: "",
            };
            myForm.setPageState({
                ...myForm.pageState,
                ...newState,
            });
        }
    };

    const handleDelete = async () => {
        const url = SERVER_URL + "/vehicleregister/?vehicle_register_id=" + myForm.pageState.vehicle_register_id;
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

    const selectAll = () => {
        let dummy = myForm.pageState.clearance_entries;
        const clearanceDate = isoToDash(myForm.pageState.clearance_date.toISOString());
        // 1 - clearance
        let totalAmt = 0;
        dummy.forEach(row => {
            totalAmt += parseInt(row.amount);
            row.clearance_status = "1";
            row.checked = "1";
            row.clearance_date = clearanceDate;
        });
        myForm.setPageState({
            ...myForm.pageState,
            "clearance_entries": dummy,
            "clear": totalAmt,
            "unclear": 0,
        })
    }

    const deselectAll = () => {
        let dummy = myForm.pageState.clearance_entries;
        // 0 - unclearance
        let totalAmt = 0;
        dummy.forEach(row => {
            totalAmt += parseInt(row.amount);
            row.clearance_status = "0";
            row.checked = "0";
            row.clearance_date = null;
        });
        myForm.setPageState({
            ...myForm.pageState,
            "clearance_entries": dummy,
            "clear": 0,
            "unclear": totalAmt,
        })
    }

    const getSelectAllValue = () => {
        for (let i = 0; i < myForm.pageState.clearance_entries.length; i++) {
            if (myForm.pageState.clearance_entries[i].checked != "1") {
                return false;
            }
        }
        return true;
    };

    const handleCheckboxChange = (arr, item, idx) => {

        // console.log({arr, item, idx});
        let dummy = myForm.pageState.clearance_entries;
        let clear = myForm.pageState.clear;
        let unClear = myForm.pageState.unclear;

        // clearance
        if (dummy[idx].clearance_status == "1") {
            dummy[idx].clearance_status = dummy[idx].checked = "0";
            dummy[idx].clearance_date = null;
            console.log("!!!!!!!!!!!!!!!!", dummy[idx].clearance_date);

            const amt = parseInt(dummy[idx].amount);
            clear -= amt;
            unClear += amt;
        }
        else {
            // console.log(myForm.pageState.clearance_date.toISOString().split('T')[0]);
            dummy[idx].clearance_status = dummy[idx].checked = "1";
            dummy[idx].clearance_date = isoToDash(myForm.pageState.clearance_date.toISOString());

            const amt = parseInt(dummy[idx].amount);
            clear += amt;
            unClear -= amt;
        }

        myForm.setPageState({
            ...myForm.pageState,
            "clearance_entries": dummy,
            "clear": clear,
            "unclear": unClear,
        })
    }

    // let isBlocking = (myForm.pageState!=dataObject);
    return (
        <div className="challan-form-container">
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
                                    {/* <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <div className="pop-up-field-label">
                                                {popupInfo.field_label_success}
                                            </div>
                                            <div className="pop-up-field-value">
                                                {myForm.pageState[popupInfo.field_name_success]}
                                            </div>
                                        </div>
                                    </div> */}
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
            <div className="form-header">Bank Clearance</div>
            <div onSubmit={myForm.handleSubmit} className="form" noValidate>
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
                <div className="table-container">
                    <DynamicViewTable
                        checkBox={1}
                        tableHeader={BankClearanceTableHeaders}
                        tableItems={BankClearanceTableItems}
                        tableValues={myForm.pageState["clearance_entries"]}
                        setPageStateByField={myForm.setPageStateByField}
                        handleCheckboxChange={handleCheckboxChange}
                        pageStateArray={myForm.pageState["clearance_entries"]}
                        fieldMapping="bank-clearance"
                        getSelectAllValue={getSelectAllValue}
                        selectAll={selectAll}
                        deselectAll={deselectAll}
                    />
                </div>
                <div className="bc-footer">
                    <div>
                        <label> Clearance Date </label>
                        <DatePicker
                            className='bc-form-input'
                            dateFormat="dd/MM/yyyy"
                            name='clearance_date'
                            selected={myForm.pageState.clearance_date}
                            onChange={date => {
                                // console.log({date});
                                myForm.setPageStateByField("clearance_date", date)
                            }}
                        />
                    </div>
                    <div>
                        <label>Un Clear </label>
                        <input
                            type="number"
                            disabled
                            value={myForm.pageState.unclear}
                            style={{ textAlign: "right" }}
                        />
                    </div>
                    <div>
                        <label>Clear </label>
                        <input
                            type="number"
                            disabled
                            value={myForm.pageState.clear}
                            style={{ textAlign: "right" }}
                        />
                    </div>
                </div>
                <div className="form-footer">
                    <button
                        onClick={myForm.handleSubmit}
                        type="button"
                        className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
                    >
                        Save
                    </button>
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="concillation_report_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        onClick={async () => {
                            const tmp = myForm.pageState;
                            let dataToSend = {
                                date_from: new Date(tmp.date_from).toISOString(),
                                date_to: new Date(tmp.date_to).toISOString(),
                                bank_id: tmp.consignor_id,
                                created_from: tmp.created_from,
                                companyId: myForm.pageState.company_id,
                                fyear: myForm.pageState.fYear,    
                            };
                            console.log("data to send: ", dataToSend);
                            let resp = await fetch(SERVER_URL + "/account_trans/reconciliation_report", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(dataToSend),
                            });
                            let response = await resp.json();

                            console.log({ response });
                            setExcelData(response);

                            download_ref.current.handleDownload();
                            // setTimeout(() => {
                            // }, 2000);
                        }}
                    >
                        Download as XLS
                    </button>
                    {
                        ReportExcel.excel_concillation_report_data(myForm.pageState, excelData)
                    }
                </div>
            </div>
        </div>
    );
};

export default BankClearance;

// HDFC BANK LTD-59200000005661