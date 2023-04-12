import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { stockOutwardApiConfig } from "../config/apiConfig.js";
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
    itemHeaders,
    items,
    stockItemHeaders,
    stockItems,
} from "../config/StockManagementConfig";
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

const StockOutward = ({ sessionObject }) => {
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
        // station_from: String(sessionObject.sessionVariables.branch_id),
        // station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    const myForm = useForm(
        "StockOutward",
        validate,
        { ...dataObject, ...variablesFromSession },
        stockOutwardApiConfig
    );

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

    const linkStock = async (e) => {
        if (e.target.value == "" && e.key == "Enter") {
            myForm.makeFocusOnParticularField("receive_user");
            return;
        }
        if (e.key == "Enter") {
            let url =
                SERVER_URL + "/stock_register/branch_stock/" + myForm.pageState.station_from;

            const resp = await fetch(url);

            if(resp.ok) {
                const stockInfo = await resp.json();
                myForm.setPageStateByField("stock_info", stockInfo);
            }
            
            myForm.makeFocusOnParticularField("receive_user");
        }
    };

    const handleEditSpecificRow = (idx, fieldMapping) => () => {

        // console.log("!!! inside edit row: ", idx, " -- ", fieldMapping);
        // console.log(myForm.pageState);

        const entryToEdit = myForm.pageState[fieldMapping][idx];

        let rows = [...myForm.pageState[fieldMapping]];

        rows.splice(idx, 1);

        myForm.setPageState({
            ...myForm.pageState,
            [fieldMapping]: rows,
            ...entryToEdit,
        });
    };

    const deleteEntryFromTableCallback = (infoObject) => {

    

        // console.log(infoObject);

        myForm.setPageState({
            ...myForm.pageState,
            "item_info": infoObject.rows,
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
        if(myForm.pageMode == "edit") {
            return true;
        }
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

        console.log(fieldInfo);


        if(fieldInfo.name == "station_to_name") {
            if(myForm.pageState.outward_type != "1" && myForm.pageState.outward_type != "2") {
                return false;
            }
        }
        if(fieldInfo.name == "inwarded") {
            if(myForm.pageState.outward_type == "3") {
                return false;
            }
        }

        if(fieldInfo.name == "vendor") {
            if(myForm.pageState.outward_type != "3" && myForm.pageState.outward_type != "4") {
                return false;
            }
        }

        if (fieldInfo.name == "edit_button") {
            if (myForm.pageMode != "view") {
                return false;
            }
        }

        //     if (myForm.pageState.is_inwarded != "1") {
        //         return true;
        //     }

        //     const roleId = sessionObject.sessionVariables.role_id;
        //     // console.log({roleId});
        //     if (roleId == "1" || roleId == "2") {
        //         return true;
        //     }
        //     return false;
        // }
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

            <div className="form-header">Stock Outward</div>
            <div
                onSubmit={myForm.handleSubmit}
                className="form"
                noValidate
                style={{ overflow: "auto" }}
            >
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Register No:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="register_no"
                            placeholder=""
                            value={myForm.pageState.register_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(e) => myForm.getPageOnKeyEnter(e, myForm.pageState.register_no)}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "register_no")}
                            disabled={checkDisabledCondition({ name: "register_no" })}
                            autoFocus={true}
                        />
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
                        <label className="form-label">Outward Date:{" "}</label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="outward_date"
                            placeholder=""
                            value={myForm.pageState.outward_date}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "outward_date")}
                            disabled={checkDisabledCondition({ name: "outward_date" })}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
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
                                onKeyPress: linkStock,
                                disabled: checkDisabledCondition(stationFromFieldInfo),
                            }}
                        />
                    </div>
                    <div>
                        <label className="form-label">Receiver: </label>
                        <input
                            className="form-input"
                            type="text"
                            name="receive_user"
                            placeholder=""
                            value={myForm.pageState.receive_user}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    myForm.makeFocusOnParticularField("outward_type");
                                }
                            }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "receive_user")}
                            disabled={checkDisabledCondition({ name: "receive_user" })}
                        />

                    </div>
                    <div>
                        <label className="form-label">Outward Type</label>
                        <select
                            className="form-input"
                            type="text"
                            name="outward_type"
                            placeholder=""
                            value={myForm.pageState.outward_type}
                            onChange={myForm.handleChange}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    e.preventDefault();
                                    myForm.makeFocusOnParticularField("station_to_name");
                                }
                            }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "outward_type")}
                            disabled={checkDisabledCondition({ name: "outward_type" })}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>

                        </select>

                    </div>

                    <div className="form-row">
                        <label className="form-last_bilty">Last Register No:</label>
                        <label className="form-last_bilty">
                            {myForm.pageState.last_register_no}
                        </label>
                    </div>
                </div>
                <DynamicViewTable
                    tableHeader={stockItemHeaders}
                    tableItems={stockItems}
                    tableValues={myForm.pageState["stock_info"]}
                    setPageStateByField={myForm.setPageStateByField}
                    pageStateArray={myForm.pageState["stock_info"]}
                    fieldMapping="stock_info"
                />
                <br />
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
                <DynamicViewTable
                    edit={1}
                    delete={1}
                    editRowFunction={handleEditSpecificRow}
                    tableHeader={itemHeaders}
                    tableItems={items}
                    tableValues={myForm.pageState["item_info"]}
                    setPageStateByField={myForm.setPageStateByField}
                    deleteEntryFromTableCallback={deleteEntryFromTableCallback}
                    pageStateArray={myForm.pageState["item_info"]}
                    fieldMapping="item_info"
                />

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
                        {myForm.pageMode == "edit" ? "Inward" :  "Save"}
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
                    {/* <ReactHTMLTableToExcel
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
                    {ReportExcel.excel_fleet_report_data(myForm.pageState)} */}
                    {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
                </div>
            </div>
        </div>
    );
};

export default StockOutward;
