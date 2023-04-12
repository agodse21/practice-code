import React, { useEffect } from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { mrPendingAmountApiConfig } from "../config/apiConfig.js";
import {
    groupInfo,
    dataObject,
    popupInfo,
    validate,
    mrPendingTableHeaders,
    mrPendingTableItems,
    mrPendingMrTableHeaders,
    mrPendingMrTableItems,
} from "../config/MrPendingAmount.js";
import { SERVER_URL } from "../config/config";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./TripForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import DatePicker from "react-datepicker";
import FormColumn from "./FormColumn.js";

const MrPendingAmount = ({ sessionObject }) => {
    let variablesFromSession = {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        role_id: String(sessionObject.sessionVariables.role_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    // useEffect(() => {
    //     console.log(myForm.pageState);
    // })

    const myForm = useForm(
        "MrPendingAmount",
        validate,
        { ...dataObject, ...variablesFromSession },
        mrPendingAmountApiConfig
    );

    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };

    const branchSuggestionConfig = {
        label: "Branch:",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "branch_name",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getCitySuggestions",
        url: SERVER_URL + "/branch/",
        suggestionKeyword: "name",
        suggestionKeywordForFetchApiArgs: "name",
        suggestionChooseQueryKeyword: "branch_id",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            branch_id: "branch_id",
            name: "branch_name",
        },
        toValidate: true,
        regExpValidation: "[a-zA-z]",
        // keyboardNavigationMap: {
        //     Enter: "input_date",
        // },
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
        //   console.log(myForm.pageState.role_id);
        if (fieldInfo.name == "edit_button" && (myForm.pageState.role_id != "1" && myForm.pageState.role_id != "2")) {
            return false;
        } else {
            return true;
        }
    };

    const checkDisabledCondition = (fieldInfo) => {
        if (myForm.pageMode == "view") {
            return true;
        } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
            return "disabled";
        } else {
            return "";
        }
    };

    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        // if (fieldInfoObject.name == "vehicle_no"){
        //   return {"limit": "10"};
        // }
        let additionalInfoObject = {};
        if (fieldInfoObject.name == "station_from_name") {
            additionalInfoObject.is_branch = true;
            // additionalInfoObject.pay_type = myForm.pageState.pay_type;
            return additionalInfoObject;
        }
        return null;
    };

    const handleDelete = async () => {
        // console.log(sessionObject.sessionVariables);
        const url = SERVER_URL + "/pending_mr_payment/" + `?branch_id=${sessionObject.sessionVariables.branch_id}`
                        + `&register_no=${myForm.pageState.sr_no}`
                        + "?companyId=" + myForm.pageState.company_id 
                        + "&fyear=" + myForm.pageState.fYear_get;

        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) {
            console.log("Not able to delete");
            myForm.setPageMode("error");
            myForm.setPopupError("Something Went Wrong ): ");
            return;
        }
        const temp_response = await response.json();
        if (temp_response.flag) {
            window.location.reload();
        }
        else {
            myForm.setPageMode("error");
            myForm.setPopupError("Something Went Wrong ): ");
        }
    };

    const deleteEntryFromTableCallback = (infoObject) => {
        myForm.setPageState({
            ...myForm.pageState,
            "table_entries": infoObject.rows,
        });
    };
    const deleteEntryFromMrTableCallback = (infoObject) => {
        myForm.setPageState({
            ...myForm.pageState,
            "mr_entries": infoObject.rows,
        });
    };

    const handleEditSpecificRow = (idx, fieldMapping) => () => {

        console.log("handle edit---------------------- for ", fieldMapping);
        console.log("!!! inside edit row: ", idx, " -- ", fieldMapping);
        console.log(myForm.pageState);

        const entryToEdit = myForm.pageState[fieldMapping][idx];
        console.log(entryToEdit);

        let rows = [...myForm.pageState[fieldMapping]];

        rows.splice(idx, 1);

        myForm.setPageState({
            ...myForm.pageState,
            [fieldMapping]: rows,
            ...entryToEdit,
        });
    };
    const handleEditSpecificMrRow = (idx, fieldMapping) => () => {

        const entryToEdit = myForm.pageState[fieldMapping][idx];

        let rows = [...myForm.pageState[fieldMapping]];
        rows.splice(idx, 1);
        myForm.setPageState({
            ...myForm.pageState,
            [fieldMapping]: rows,
            ...entryToEdit,
        });
    };



    useEffect(() => {
        myForm.makeFocusOnParticularField("sr_no");
        console.log(myForm.pageState);
    }, [])

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
            <div className="form-header">MR Pending Amount</div>
            <div onSubmit={myForm.handleSubmit} className="form" noValidate>
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Sr No:</label>
                        <input
                            className="form-input"
                            type="number"
                            name="sr_no"
                            placeholder=""
                            value={myForm.pageState.sr_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            autoFocus={true}
                            onKeyPress={(a) => {
                                myForm.getPageOnKeyEnter(a, myForm.pageState.sr_no)
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("branch_name")
                                }
                            }
                            }
                            disabled={checkDisabledCondition({ name: "sr_no" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "sr_no")}
                        />
                        {/* <label className="form-label">MR No:</label>
                        <input
                            className="form-input"
                            type="number"
                            name="mr_no"
                            placeholder=""
                            value={myForm.pageState.mr_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            autoFocus={true}
                            onKeyPress={(a) => {
                                myForm.getPageOnKeyEnter(a, myForm.pageState.mr_no)
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("branch_name")
                                }
                             }
                            }
                            disabled={checkDisabledCondition({ name: "mr_no" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "mr_no")}
                        /> */}
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
                        <label className="form-label">Branch: </label>
                        <input
                            className="form-input"
                            type="text"
                            name="branch_name"
                            placeholder=""
                            value={myForm.pageState.branch_name}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            autoFocus={true}
                            onKeyPress={(a) => {
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("input_date")
                                }
                            }
                            }
                            disabled={checkDisabledCondition({ name: "branch_name" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "branch_name")}
                        />
                        {/* <Autosuggest
                            id={branchSuggestionConfig["name"]}
                            suggestions={myForm.suggestions}
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequested(a, (b) =>
                                    myForm.suggestionFetchApi(branchSuggestionConfig, b)
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(branchSuggestionConfig)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[branchSuggestionConfig.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    branchSuggestionConfig,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, branchSuggestionConfig)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                //placeholder: info["name"],
                                value: String(myForm.pageState[branchSuggestionConfig["name"]]),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, branchSuggestionConfig);
                                },
                                onBlur: () => {
                                    branchSuggestionConfig["toValidate"]
                                        ? myForm.onblurValidator(branchSuggestionConfig)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, branchSuggestionConfig),
                                disabled: checkDisabledCondition(branchSuggestionConfig),
                            }}
                        /> */}
                        <label className="form-label">Date: </label>
                        <input
                            className="form-input"
                            type="date"
                            name="input_date"
                            value={myForm.pageState.input_date}
                            onChange={myForm.handleChange}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    myForm.makeFocusOnParticularField("party_name");
                                }
                            }}
                            disabled={checkDisabledCondition({ name: "input_date" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
                        />
                    </div>
                    {/* <div className="form-row">
                        <label className="form-last_bilty">Last Entry No:</label>
                        <label className="form-last_bilty">
                            {myForm.pageState.last_entry_no}
                        </label>
                    </div> */}
                    <div className="form-row">
                        <label className="form-last_bilty">Last Entry No:</label>
                        <label className="form-last_bilty">
                            {myForm.pageState.last_entry_no}
                        </label>
                    </div>
                </div>
                
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Party Name:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="party_name"
                            placeholder=""
                            value={myForm.pageState.party_name}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) => {
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("debit_amount")
                                }
                            }
                            }
                            disabled={checkDisabledCondition({ name: "party_name" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "party_name")}
                        />
                        <label className="form-label">Debit Amount:</label>
                        <input
                            className="form-input"
                            type="number"
                            name="debit_amount"
                            placeholder=""
                            value={myForm.pageState.debit_amount}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) => {
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("mr_no")
                                }
                            }
                            }
                            disabled={checkDisabledCondition({ name: "debit_amount" })}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "debit_amount")}
                        />

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
                <div className="two-table-container">
                    <DynamicViewTable
                        edit={1}
                        delete={1}
                        editRowFunction={handleEditSpecificMrRow}
                        deleteEntryFromTableCallback={deleteEntryFromMrTableCallback}
                        tableHeader={mrPendingMrTableHeaders}
                        tableItems={mrPendingMrTableItems}
                        tableValues={myForm.pageState["mr_entries"]}
                        setPageStateByField={myForm.setPageStateByField}
                        pageStateArray={myForm.pageState["mr_entries"]}
                        fieldMapping="mr_entries"
                    />
                    <DynamicViewTable
                        edit={1}
                        delete={1}
                        editRowFunction={handleEditSpecificRow}
                        deleteEntryFromTableCallback={deleteEntryFromTableCallback}
                        tableHeader={mrPendingTableHeaders}
                        tableItems={mrPendingTableItems}
                        tableValues={myForm.pageState["table_entries"]}
                        setPageStateByField={myForm.setPageStateByField}
                        pageStateArray={myForm.pageState["table_entries"]}
                        fieldMapping="table_entries"
                    />
                </div>
                <div style={{
                    marginLeft: "20px",
                    marginTop: "5px",

                }}>
                    <label className="form-label" style={{marginRight: "10px"}}>Remarks:</label>
                    <textarea
                        // className="form-input"
                        rows={1}
                        cols={70}
                        type="text"
                        name="remarks"
                        placeholder=""
                        value={myForm.pageState.remarks}
                        onChange={myForm.handleChange}
                        onBlur={() => { }}
                        autoFocus={true}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                myForm.makeFocusOnParticularField("save_button")
                            }
                        }
                        }
                        disabled={checkDisabledCondition({ name: "remarks" })}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "remarks")}
                    />
                </div>
                <div className="form-footer">
                    {/* <button
                        onClick={(e) => {
                            console.log("Values", myForm.pageState);
                            console.log("Values", myForm.pageState);
                            // myForm.setServerPrintNeeded(true);
                            // myForm.handleSubmit(e);
                        }}
                        type="button"
                        // ref={(a) => myForm.storeInputReferenceForSelect(a, "print_button")}
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
                    {myForm.pageMode != "write" && (
                        <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
                    )}
                    <button
                        onClick={
                            () => window.location.reload()
                        }
                        type="button"
                        className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "new_button")}
                    >
                        New
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MrPendingAmount;
