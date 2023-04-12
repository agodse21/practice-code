import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import "./ChallanForm.css";
import "./Form.css";
import "./ProfitLossReport.css";
import {
    challanBiltyTableItems,
    challanBiltyTableHeader,
} from "../config/challanForm.js";
import { accountReportApiConfig } from "../config/apiConfig.js";
import {
    dataObject,
    validate,
    //   groupInfo,
    popupInfo,
    partyRateTableHeader,
    partyRateTableHeaderExcel,
    partyRateTableItems,
    partyRateTableItemsExcel,
    groupInfo,
} from "../config/ProfitLossReport";
import print from "print-js";

import DatePicker from "react-datepicker";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL } from "../config/config";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./AccountReportExcel.css";
import { date } from "yup/lib/locale";
import ReportExcel from "./ReportExcel.js";
import getLoggedinFyear from "../utils/getLoggedinFyear";

let ex_data = [];

const AccountReportForm = ({ sessionObject }) => {
    const fyearObj = getLoggedinFyear(sessionObject);
    let variablesFromSession = {
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_from_name: String(sessionObject.sessionVariables.branch_name),
        created_by: String(sessionObject.sessionVariables.user_id),
        branch_list: [parseInt(sessionObject.sessionVariables.branch_id)],
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
        date_from: fyearObj.start_fyear,
        date_to: fyearObj.end_fyear,
    };

    // React.useEffect(() => {
    //     console.log(myForm.pageState, sessionObject);

    // });


    const [dateState, setDateState] = React.useState({
        date_from: new Date(),
        date_to: new Date(),
    });
    const download_ref = React.useRef(null);
    const [loading, setLoading] = React.useState(false);

    const myForm = useForm(
        "ACCOUNTREPORT",
        validate,
        { ...dataObject, ...variablesFromSession },
        accountReportApiConfig
    );

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

    const getAccountReport = async (e) => {
        if (e.key == "Enter") {
            const url = SERVER_URL + "/account_trans/report";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date_from: myForm.pageState.date_from,
                    date_to: myForm.pageState.date_to,
                    party_id: myForm.pageState.party_id,
                }),
            });
            const resp = await response.json();
            console.log("Report :- ", resp);
            myForm.setPageStateByField("report", resp.report);
            console.log("Report after :- ", myForm.pageState);
            // myForm.makeFocusOnParticularField("item_name");
        }
    };

    const handlePrint = async () => {
        let url = SERVER_URL + "/account_trans/acc_report_print"
                + "?branch_name=" + myForm.pageState.created_from_name;
        
        let branches = "";
        myForm.pageState.branch_list.forEach(branch => branches += (branch + ','));
        branches = branches.substring(0, branches.length - 1);
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

        let dataToSend = {
            date_from: myForm.pageState.date_from,
            date_to: myForm.pageState.date_to,
            branch_id: branches,
            report_type: myForm.pageState.report_type,
            only_opening_balance: myForm.pageState.opening_balance,
            companyId: myForm.pageState.company_id,
            fyear: fYear_fetch, 
        };

        let response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        }).then((r) => r.blob());
        
        console.log(response);
        print({
            printable: URL.createObjectURL(response),
            type: "pdf",
            showModal: false,
        });
      }

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
        name: "party_name",
        label: "Party Name",
        className: "form-control-large-col",
        apiConfigKey: "getTransporterSuggestions",
        url: SERVER_URL + "/transporter/",
        suggestionKeyword: "transporter_name",
        suggestionKeywordForFetchApiArgs: "name",
        suggestionChooseQueryKeyword: "transporter_id",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            transporter_name: "party_name",
            transporter_id: "party_id",
        },
        apiCallRequiredOnGetValue: true,
        toValidate: true,
        regExpValidation: "[a-zA-z]",
        // keyboardNavigationMap: {
        //   Enter: "bilty_no",
        // },
        valueVerificationFromSuggestionNeeded: true,
        valueVerificationCompulsionField: "transporter_id",
        // newRowFocus: true,
        // keyboardNavigationMap: {
        // Enter: "unit",
        // },
        // isTable: true,
        // parentName: "item_in",
        toValidate: true,
        // idClearanceNeeded: "item_id",
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
                };
                if (dummyObject.item_id == "") {
                    dummyObject.item_id = null;
                }
                let objectToSave = {
                    report: [...myForm.pageState.report, dummyObject],
                    item_name: "",
                    item_id: "",
                    rate: "",
                    //   unit: "",
                };
                myForm.setPageState({
                    ...myForm.pageState,
                    ...objectToSave,
                });
                myForm.makeFocusOnParticularField("item_name");
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

    const handleDelete = async () => {
        const url = SERVER_URL + "/general_rate/";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rate_info: [],
                station_from: myForm.pageState.station_from,
                station_to: myForm.pageState.station_to,
            }),
        });
        let objtosave = {
            rate_info: [],
        };
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

    const handleBranchItemChange = (key) => {
        // console.log(key)  

        const newBranchList = [...myForm.pageState.branch_list];

        const index = newBranchList.indexOf(key);
        if (index > -1) {
            newBranchList.splice(index, 1);
        }
        else {
            newBranchList.push(key);
        }

        // console.log(newBranchList)

        myForm.setPageStateByField("branch_list", newBranchList);
    }

    const handleSelectAllBranch = (e) => {
        const oldBranchList = [...myForm.pageState.branch_list];
        if (oldBranchList.length == groupInfo['branches'].length) {
            myForm.setPageStateByField("branch_list", [])
            return;
        }

        const newBranchList = [];
        for (let obj of groupInfo['branches']) {
            const { key } = obj;
            newBranchList.push(key);
        }

        myForm.setPageStateByField("branch_list", newBranchList)
    }

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

            <div className="form-header">PL Report</div>
            <div onSubmit={myForm.handleSubmit} className="form" noValidate>
                <div className="form-title">
                    {/* <div>
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
          </div> */}
                </div>
                <div className="form-input-content-block-0"></div>
                <div className="pl-report-wrapper">
                    <div className="pl-report-left">
                        <div className="form-row">
                            <label className="form-label">Date From</label>
                            <input
                                className="pl-report-inp"
                                type="date"
                                name="date_from"
                                placeholder=""
                                value={myForm.pageState.date_from}
                                onChange={myForm.handleChange}
                                onKeyPress={(a) => {
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("date_to");
                                    }
                                }}
                                ref={(a) => myForm.storeInputReferenceForSelect(a, "date_from")}
                                disabled={checkDisabledCondition({ name: "date_from" })}
                            />

                        </div>
                        <div className="form-row">
                            <label className="form-label">Date To</label>
                            <input
                                className="pl-report-inp"
                                type="date"
                                name="date_to"
                                placeholder=""
                                value={myForm.pageState.date_to}
                                onChange={myForm.handleChange}
                                onKeyPress={(a) => {
                                    if (a.key == "Enter") {
                                        // myForm.makeFocusOnParticularField("date_to");
                                    }
                                }}
                                ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
                                disabled={checkDisabledCondition({ name: "date_to" })}
                            />
                        </div>

                        <div className="form-row">
                            <label className="form-label">Report Type </label>
                            <select
                                className="pl-report-inp"
                                onChange={(newValue) => {
                                    myForm.handleChangeForSelect(newValue, "report_type");
                                }}
                                ref={(a) => myForm.storeInputReferenceForSelect(a, "report_type")}
                                // disabled={checkDisabledCondition({ name: "report_type" })}
                                value={myForm.pageState["report_type"]}
                            // onKeyPress={(a) => {
                            //   if (a.key == "Enter") {
                            //     myForm.makeFocusOnParticularField("station_to_name");
                            //   }
                            // }}
                            >
                                <option value="pl" key="pl">
                                    P & L Report
                                </option>
                                <option value="tb" key="tb">
                                    Trial Balance Sheet
                                </option>
                                <option value="bs" key="bs">
                                    Balance Sheet
                                </option>
                            </select>

                        </div>

                        <div className="form-row">
                            <label className="chform-label">Opening Balance</label>
                            <input
                                className="chform-input"
                                name="opening_balance"
                                checked={myForm.pageState.opening_balance}
                                type="checkbox"
                                onChange={(e) => {
                                    myForm.setPageState({
                                        ...myForm.pageState,
                                        [e.target.name]: !myForm.pageState.opening_balance,
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <div className="pl-report-right">
                        <label className="chform-label">Branch</label>
                        <div className='form-input-box' style={{ width: "80%", overflow: "auto" }}>
                                <button type='button' onClick={handleSelectAllBranch}>Select all</button> <br />
                                <div id="signup-branch-name-div">
                                    {
                                        groupInfo['branches'].map(({ key, branch_name }) => {
                                            return (
                                                <>
                                                    <label>
                                                        <input
                                                            id={key}
                                                            name='branch_info'
                                                            type='checkbox'
                                                            value={branch_name}
                                                            checked={myForm.pageState.branch_list.indexOf(key) > -1}
                                                            onChange={() => handleBranchItemChange(key)}
                                                        />
                                                        {branch_name}
                                                    </label> <br />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                    </div>
                    {/* <div className="pl-report-right">
                        <div id="party-belongs-to-branch-div">
                            <label id="party-belongs-to-branch-label">
                                Party Belongs To Branch
                            </label>
                            <div id="break"></div>
                            <div id="party-belongs-to-branch-check">
                                <button onClick={handleSelectAllBranch}>Select all</button>
                                <div id="branch-name-div">
                                    {
                                        groupInfo['branches'].map(({ key, branch_name }) => {
                                            return (
                                                <>
                                                    <label>
                                                        <input
                                                            id={key}
                                                            name='branch_info'
                                                            type='checkbox'
                                                            value={branch_name}
                                                            checked={myForm.pageState.branch_list.indexOf(key) > -1}
                                                            onChange={() => handleBranchItemChange(key)}
                                                        />
                                                        {branch_name}
                                                    </label> <br />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="form-footer">
                <button
                    onClick={handlePrint}
                >
                    Print
                </button>
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="balance_sheet_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        onClick={async () => {
                            setLoading(true);

                            let branches = "";
                            myForm.pageState.branch_list.forEach(branch => branches += (branch + ','));
                            branches = branches.substring(0, branches.length - 1);
                            console.log({ branches });

                            const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
                            let dataToSend = {
                                date_from: myForm.pageState.date_from,
                                date_to: myForm.pageState.date_to,
                                branch_id: branches,
                                report_type: myForm.pageState.report_type,
                                only_opening_balance: myForm.pageState.opening_balance,
                                companyId: myForm.pageState.company_id,
                                fyear: fYear_fetch,
                            };
                            let resp = await fetch(SERVER_URL + "/account_trans/acc_report_updated", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(dataToSend),
                            });
                            let response = await resp.json();
                            ex_data = response
                            setLoading(false);
                            console.log("reference", download_ref);
                            download_ref.current.handleDownload();
                        }}
                    >
                        Download as XLS
                    </button>
                    {ReportExcel.balance_sheet_excel(
                        ex_data,
                        {
                            date_to: myForm.pageState.date_to,
                            date_from: myForm.pageState.date_from,
                        },
                        myForm.pageState.report_type
                    )}
                </div>

            </div>
        </div>
    );
};

export default AccountReportForm;
