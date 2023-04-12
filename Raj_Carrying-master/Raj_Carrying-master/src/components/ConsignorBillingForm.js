import React, { useEffect, useState } from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import print from "print-js";
import "./CrossingInward.css";
import {
    challanBiltyTableItems,
    challanBiltyTableHeader,
} from "../config/challanForm.js";
import { consignorBillingApiConfig } from "../config/apiConfig.js";
import {
    dataObject,
    validate,
    consignorBillingTableHeader,
    consignorBillingTableItems,
} from "../config/ConsignorBilling.js";
import FormColumn from "./FormColumn.js";
import { groupInfo, popupInfo } from "../config/ConsignorBilling.js";
import DatePicker from "react-datepicker";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import LoadingOverlay from "react-loading-overlay";
import ReportExcel from "./ReportExcel.js";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useLocation } from "react-router-dom";

const ConsignorBillingForm = ({ sessionObject }) => {
    const [mailStatus, setMailStatus] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");
    const [isPodBilling, setIsPodBilling] =  useState(false);
    const location = useLocation();

    let variablesFromSession = {
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    useEffect(() => {
        console.log(myForm.pageState);
    })

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
      };
    let query = useQuery();

    // useEffect(() => {
    //     console.log(myForm.pageState, myForm.pageMode);
    // })

    useEffect(() => {

        const podBilling = query.get("pod_billing");
        console.log(podBilling);
        if(podBilling == 1) setIsPodBilling(true);
        else setIsPodBilling(false);

        const defaultConsignorBillNo = location.state ?? "";
        console.log(defaultConsignorBillNo);
        if(defaultConsignorBillNo != "") {
            myForm.setPageStateByField("bill_no", defaultConsignorBillNo);

            const fakeKey = { key: "Enter" }
            myForm.getPageOnKeyEnter(fakeKey, defaultConsignorBillNo);
        }


    }, []);

    const updateBiltyRate = async () => {
        myForm.setOverlay(true);

        const url = SERVER_URL + "/bilty/update_rate";
        const dataToSend = {
            date_from: new Date(myForm.pageState.update_date_from).toISOString(),
            date_to: new Date(myForm.pageState.update_date_to).toISOString(),
            consignor_id: parseInt(myForm.pageState.consignor_id),
            bill_id: parseInt(myForm.pageState.id),
            station_from: parseInt(myForm.pageState.created_from),
        };

        let resp = await fetch(url, { 
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(dataToSend),
        })

        if(resp.ok) {
            const details = await resp.json();
            if("flag" in details && details.flag == "1") {
                setUpdateStatus("Updation Successful!");
            }
            else {
                setUpdateStatus(details.detail);
            }
        }
        else {
            setUpdateStatus("Something went wrong, Could not update.")
        }
        myForm.setOverlay(false);
    }

    const myForm = useForm(
        "CONSIGNORBILLING",
        validate,
        { ...dataObject, ...variablesFromSession },
        consignorBillingApiConfig
    );

    const handlePrint = async () => {
        let url = SERVER_URL + "/tbb_billing_statement/print/";

        let apiInputData = {
            ...myForm.pageState,
            fyear: myForm.pageState.fYear_get,
            companyId: myForm.pageState.company_id,
        }

        let response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(apiInputData),
        }).then((r) => r.blob());
        console.log("response", response);
        print({ printable: URL.createObjectURL(response), type: "pdf", showModal: false });
    }

    const download_ref = React.useRef(null);

    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };

    const transporterFieldInfo = {
        label: "Consignor Name",
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
            Enter: "remarks",
        },
        idClearanceNeeded: "consignor_id",
        inputDataNeededInSuggestions: false,
        inputDataFilter: {
            pay_type: "same",
        },
    };

    // useEffect(() => {
    //     if(myForm.pageMode == "edit") {
    //         // document.getElementById("consignor_name").dispatchEvent(new KeyboardEvent('keypress', {'key': 'Enter'}));
    //         linkBilty({key: "Enter", target: { value: "fake"} } );
    //     }
    // }, [myForm.pageMode]);

    const linkBilty = async (e) => {
        if (e.target.value == "" && e.key == "Enter") {
            myForm.makeFocusOnParticularField("remarks");
            return;
        }
        if (e.key == "Enter") {
            // TODO: hit api here, changes for bilty_info
            const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

            const temp = (isPodBilling) ? "pod_billing" : "tbb_billing";

            let url =
                SERVER_URL +
                `/bilty/${temp}/?branch_id=` +
                String(myForm.pageState.created_from);


            if ("consignor_name" in myForm.refStoreObject.current) {
                myForm.refStoreObject.current.consignor_name.blur();
            }
            myForm.setOverlay(true);
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    date_to: myForm.pageState.input_date,
                    amount: myForm.pageState.amount,
                    consignor_id: myForm.pageState.consignor_id,
                    id: myForm.pageState.id,
                    fyear: fYear_fetch,
                    companyId: myForm.pageState.company_id,
                }),
            });
            if (!response.ok) {
                myForm.setPageState({
                    ...myForm.pageState,
                    ["Bilty No"]: "Invalid Bilty",
                });
                myForm.setOverlay(false);
                return;
            }
            const temp_response = await response.json();
            console.log("Temp response", temp_response);
            if (temp_response.check_fail) {
                myForm.setPageState({
                    ...myForm.pageState,
                    ["Bilty No"]: "Not possible to add this bilty",
                });
                myForm.setOverlay(false);
                return;
            }
            myForm.setOverlay(false);
            let partyName = "";
            let total_amount = 0;
            let newState = {
                bilty_ids: temp_response,
            };
            let tran_freight = 0;
            let our_freight = 0;
            let to_pay = 0;
            let paid = 0;
            let pkgs = 0;
            let bilty_charge = 0;
            let extra_hamali = 0;
            let dd_charge = 0;
            let biltyObj = {};
            for (let i = 0; i < newState.bilty_ids.length; i++) {
                newState.bilty_ids[i].checked = "1";
                biltyObj = newState.bilty_ids[i];
                tran_freight += parseFloat(biltyObj.transporter_freight) || 0;
                our_freight += parseFloat(biltyObj.item_amount) || 0;
                bilty_charge += parseFloat(biltyObj.bilty_charge) || 0;
                dd_charge += parseFloat(biltyObj.door_del_charge) || 0;
                extra_hamali += parseFloat(biltyObj.hamali) || 0;
                if (biltyObj.pay_type == "1") {
                    to_pay += parseFloat(biltyObj.transporter_freight) || 0;
                } else {
                    paid += parseFloat(biltyObj.transporter_freight) || 0;
                }
                pkgs += parseFloat(biltyObj.no_of_package) || 0;
            }
            //   newState.transporter_freight = String(tran_freight);
            total_amount = our_freight + bilty_charge + dd_charge + extra_hamali;
            newState.gross_amount = String(parseInt(our_freight));
            newState.bilty_charge = String(bilty_charge);
            newState.door_del_charge = String(dd_charge);
            newState.extra_hamali = String(extra_hamali);
            newState.total_amount = String(parseInt(total_amount));

            //   newState.pkgs = String(pkgs);
            //   newState.to_pay = String(to_pay);
            //   newState.paid = String(paid);
            //   newState.balance = String(our_freight - to_pay);

            // TODO: set fyear? if not setting automatically
            console.log("New state", newState);
            myForm.setPageState({
                ...myForm.pageState,
                ...newState,
            });
            myForm.makeFocusOnParticularField("bill_date");
        }
    };

    const handleDelete = async () => {
        const url =
            SERVER_URL +
            "/tbb_billing_statement/?tbb_statement_id=" +
            myForm.pageState.id
            + "&fyear=" + myForm.pageState.fYear_get;
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) {
            console.log("Not able to delete Bill");
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

    const handleCheckboxChange = (arr, item, idx) => {
        console.log("item", item);
        console.log("arrr", arr.target, arr.target.checked);
        let dummyArray = myForm.pageState.bilty_ids;
        console.log("bilty ids dummy", dummyArray);
        if (arr.target.checked) {
            dummyArray[idx].checked = "1";
        } else {
            dummyArray[idx].checked = "0";
        }
        let newState = {
            bilty_ids: dummyArray,
        };
        let total_amount = 0;
        let tran_freight = 0;
        let our_freight = 0;
        let to_pay = 0;
        let paid = 0;
        let pkgs = 0;
        let bilty_charge = 0;
        let extra_hamali = 0;
        let dd_charge = 0;
        let biltyObj = {};
        for (let i = 0; i < newState.bilty_ids.length; i++) {
            if (newState.bilty_ids[i].checked == "0") {
                continue;
            }
            biltyObj = newState.bilty_ids[i];
            tran_freight += parseFloat(biltyObj.transporter_freight) || 0;
            our_freight += parseFloat(biltyObj.item_amount) || 0;
            bilty_charge += parseFloat(biltyObj.bilty_charge) || 0;
            dd_charge += parseFloat(biltyObj.door_del_charge) || 0;
            extra_hamali += parseFloat(biltyObj.hamali) || 0;
            if (biltyObj.pay_type == "1") {
                to_pay += parseFloat(biltyObj.transporter_freight) || 0;
            } else {
                paid += parseFloat(biltyObj.transporter_freight) || 0;
            }
            pkgs += parseFloat(biltyObj.no_of_package) || 0;
        }
        //   newState.transporter_freight = String(tran_freight);
        total_amount = our_freight + bilty_charge + dd_charge + extra_hamali;
        newState.gross_amount = String(parseInt(our_freight));
        newState.bilty_charge = String(bilty_charge);
        newState.door_del_charge = String(dd_charge);
        newState.extra_hamali = String(extra_hamali);
        newState.total_amount = String(parseInt(total_amount));
        // myForm.setPageStateByField("bilty_ids", dummyArray)
        myForm.setPageState({
            ...myForm.pageState,
            ...newState,
        });
    };

    const selectAll = () => {
        let dummyArray = myForm.pageState.bilty_ids;
        for (let i = 0; i < dummyArray.length; i++) {
            dummyArray[i].checked = "1";
        }
        let newState = {
            bilty_ids: dummyArray,
        };
        let total_amount = 0;
        let tran_freight = 0;
        let our_freight = 0;
        let to_pay = 0;
        let paid = 0;
        let pkgs = 0;
        let bilty_charge = 0;
        let extra_hamali = 0;
        let dd_charge = 0;
        let biltyObj = {};
        for (let i = 0; i < newState.bilty_ids.length; i++) {
            if (newState.bilty_ids[i].checked == "0") {
                continue;
            }
            biltyObj = newState.bilty_ids[i];
            tran_freight += parseFloat(biltyObj.transporter_freight) || 0;
            our_freight += parseFloat(biltyObj.item_amount) || 0;
            bilty_charge += parseFloat(biltyObj.bilty_charge) || 0;
            dd_charge += parseFloat(biltyObj.door_del_charge) || 0;
            extra_hamali += parseFloat(biltyObj.hamali) || 0;
            if (biltyObj.pay_type == "1") {
                to_pay += parseFloat(biltyObj.transporter_freight) || 0;
            } else {
                paid += parseFloat(biltyObj.transporter_freight) || 0;
            }
            pkgs += parseFloat(biltyObj.no_of_package) || 0;
        }
        //   newState.transporter_freight = String(tran_freight);
        total_amount = our_freight + bilty_charge + dd_charge + extra_hamali;
        newState.gross_amount = String(parseInt(our_freight));
        newState.bilty_charge = String(bilty_charge);
        newState.door_del_charge = String(dd_charge);
        newState.extra_hamali = String(extra_hamali);
        newState.total_amount = String(parseInt(total_amount));
        // myForm.setPageStateByField("bilty_ids", dummyArray)
        myForm.setPageState({
            ...myForm.pageState,
            ...newState,
        });
    };

    const deselectAll = () => {
        let dummyArray = myForm.pageState.bilty_ids;
        for (let i = 0; i < dummyArray.length; i++) {
            dummyArray[i].checked = "0";
        }
        let newState = {
            bilty_ids: dummyArray,
        };
        let total_amount = 0;
        let tran_freight = 0;
        let our_freight = 0;
        let to_pay = 0;
        let paid = 0;
        let pkgs = 0;
        let bilty_charge = 0;
        let extra_hamali = 0;
        let dd_charge = 0;
        let biltyObj = {};
        for (let i = 0; i < newState.bilty_ids.length; i++) {
            if (newState.bilty_ids[i].checked == "0") {
                continue;
            }
            biltyObj = newState.bilty_ids[i];
            tran_freight += parseFloat(biltyObj.transporter_freight) || 0;
            our_freight += parseFloat(biltyObj.item_amount) || 0;
            bilty_charge += parseFloat(biltyObj.bilty_charge) || 0;
            dd_charge += parseFloat(biltyObj.door_del_charge) || 0;
            extra_hamali += parseFloat(biltyObj.hamali) || 0;
            if (biltyObj.pay_type == "1") {
                to_pay += parseFloat(biltyObj.transporter_freight) || 0;
            } else {
                paid += parseFloat(biltyObj.transporter_freight) || 0;
            }
            pkgs += parseFloat(biltyObj.no_of_package) || 0;
        }
        //   newState.transporter_freight = String(tran_freight);
        total_amount = our_freight + bilty_charge + dd_charge + extra_hamali;
        newState.gross_amount = String(parseInt(our_freight));
        newState.bilty_charge = String(bilty_charge);
        newState.door_del_charge = String(dd_charge);
        newState.extra_hamali = String(extra_hamali);
        newState.total_amount = String(parseInt(total_amount));
        // myForm.setPageStateByField("bilty_ids", dummyArray)
        myForm.setPageState({
            ...myForm.pageState,
            ...newState,
        });
    };

    const getSelectAllValue = () => {
        for (let i = 0; i < myForm.pageState.bilty_ids.length; i++) {
            if (myForm.pageState.bilty_ids[i].checked != "1") {
                return false;
            }
        }
        return true;
    };

    const checkVisibilityCondition = (fieldInfo) => {
        if (fieldInfo.name == "edit_button" && myForm.pageMode == "edit") {
            return true;
        } else if (fieldInfo.name == "total_amount") {
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
        if (fieldInfo.name == "consignor_gst") {
            return "disabled";
        } else if (fieldInfo.name == "extra_hamali") {
            return "disabled";
        } else if (fieldInfo.name == "door_del_charge") {
            return "disabled";
        } else if (fieldInfo.name == "extra_percentage_amount") {
            return "disabled";
        } else if (fieldInfo.name == "bilty_charge") {
            return "disabled";
        } else if (fieldInfo.name == "gross_amount") {
            return "disabled";
        } else if (fieldInfo.name == "x") {
            return "disabled";
        } else if (fieldInfo.name == "total_amount") {
            return "disabled";
        } else if (myForm.pageMode == "view") {
            return "disabled";
        } else if (myForm.pageMode == "edit" && fieldInfo.name == "party_name") {
            return "disabled";
        } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
            // return "disabled";
        } else {
            return "";
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
    //     myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
    //     myForm.setPageMode("write");
    //     window.location.reload();
    //     return;
    //   }
    // };

    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        // if (fieldInfoObject.name == "vehicle_no"){
        //   return {"limit": "10"};
        // }
        return null;
    };

    const deleteEntryFromTableCallback = (infoObject) => {
        console.log("Info objecyt", infoObject);
        let biltyObj = myForm.pageState.bilty_ids[infoObject.idx];
        console.log("Bilty objecy", biltyObj);
        let newState = {};
        let tran_freight = parseFloat(myForm.pageState.transporter_freight) || 0;
        let our_freight = parseFloat(myForm.pageState.our_freight) || 0;
        let to_pay = parseFloat(myForm.pageState.to_pay) || 0;
        let paid = parseFloat(myForm.pageState.paid) || 0;
        let pkgs = parseFloat(myForm.pageState.pkgs) || 0;

        tran_freight -= parseFloat(biltyObj.transporter_freight) || 0;
        our_freight -= parseFloat(biltyObj.total_amount) || 0;
        if (biltyObj.pay_type == "1") {
            to_pay -= parseFloat(biltyObj.transporter_freight) || 0;
        } else {
            paid -= parseFloat(biltyObj.transporter_freight) || 0;
        }
        pkgs -= parseFloat(biltyObj.no_of_package) || 0;

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

    const handleSendEmail = async () => {

        let ccEmails = myForm.pageState.cc_emails;
        ccEmails = ccEmails.split("\n").join(",");
        // console.log(ccEmails);

        myForm.setOverlay(true);

        const mailBody = myForm.pageState.body_start + "|" + myForm.pageState.body_end;

        const dataToSend = {
            tbb_statement_id: myForm.pageState.bill_no,
            branch_id: sessionObject.sessionVariables.branch_id,
            receiver_mail: myForm.pageState.email,
            subject: myForm.pageState.subject,
            cc: ccEmails,
            user_id: sessionObject.sessionVariables.user_id,
            body: mailBody,
            fyear: myForm.pageState.fYear_get,
            companyId: myForm.pageState.company_id,
        }

        const url = SERVER_URL + "/tbb_billing_statement/send_bill_mail";

        const resp = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })

        myForm.setOverlay(false);

        if (resp.ok) {
            const data = await resp.json();
            console.log({ data });
            setMailStatus(data.message);
        }
        else {
            setMailStatus("Something went wrong while sending an Email ):")
        }

    }

    let ccEmailFieldInfo = {
        // display
        label: "CC",

        // styling
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",

        // dataobject name
        name: "cc_email",

        // type
        type: "text",
        placeHolder: "",

        // when selected some suggestion
        // apiConfigKey: "getConsigneeSuggestions",

        // suggesion api
        url: SERVER_URL + "/mail/",

        // from resp of suggestion api, which field to show
        suggestionKeyword: "email",

        // along with suggesions, which field to show
        suggestionKeywordExtra: "company_id",

        // typed text in api, based on which results come
        suggestionKeywordForFetchApiArgs: "email",

        // when some suggestion is chosen, by which field that suggestion to fetch
        // suggestionChooseQueryKeyword: "id",

        /**
         * If api call not required,
         * parse suggestion schema here only and update the page state.
         */
        suggestionSchema: {
            email: "cc_email"
        },

        // apiCallRequiredOnGetValue: true,
        toValidate: true,
        // regExpValidation: "[a-zA-z]",
        // keyboardNavigationMap: {
        //     conditionalNav: true,
        //     conditionalNavFunct: (pageState) => {
        //         if (pageState.voucher_type == "cp") {
        //             return "amount";
        //         }
        //         else if (pageState.voucher_type == "bp") {
        //             return "id";
        //         }
        //         else if (pageState.voucher_type == "cr") {
        //             return "amount";
        //         }
        //         else if (pageState.voucher_type == "jv") {
        //             return "amount";
        //         }
        //         else if (pageState.voucher_type == "br") {
        //             return "amount";
        //         }
        //         else {
        //             return "consignee_name";
        //         }
        //     },
        // },
        // idClearanceNeeded: "consignee_id",
        // inputDataNeededInSuggestions: false,
        // inputDataFilter: {
        //     pay_type: "same",
        // },
    };

    return (
        <div className="mr-form-container">
            {USE_OVERLAY && (
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
            )}
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
            <div>
                <Popup
                    open={myForm.pageState.send_email == true}
                    modal
                    contentStyle={contentStyle}
                    closeOnDocumentClick={false}
                >
                    {(close) => {
                        return (
                            <div className="pop-up-container">
                                <div className="pop-up-header">
                                    Send Email
                                    <div>
                                        <a className="pop-up-close btn" onClick={() => {
                                            myForm.setPageState((pageState) => ({
                                                ...pageState,
                                                "send_email": false,
                                                "email": "",
                                                "subject": "",
                                                "cc_email": "",
                                                "cc_emails": "",
                                            }))
                                            close();
                                        }}>
                                            &times;
                                        </a>
                                    </div>
                                </div>
                                <div className="popup-content">
                                    <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <label className="form-label">From </label>
                                            <input
                                                className="form-input"
                                                type="email"
                                                name="email_from"
                                                value={myForm.pageState.email_from}
                                                disabled={true}
                                            />

                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">To </label>
                                            <input
                                                className="form-input"
                                                type="email"
                                                name="email"
                                                value={myForm.pageState.email}
                                                onChange={myForm.handleChange}
                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        document.getElementById("cc_email").focus();
                                                    }
                                                }}
                                                autoFocus={true}
                                            />

                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">CC </label>
                                            {/* <input
                                                className="form-input"
                                                type="email"
                                                name="cc_email"
                                                id="cc_email"
                                                value={myForm.pageState.cc_email}
                                                onChange={myForm.handleChange}
                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        let ccEmail = myForm.pageState.cc_email;
                                                        let ccEmails = myForm.pageState.cc_emails;
                                                        if (ccEmail.length > 0) {
                                                            ccEmails += ccEmail + "\n";
                                                        }

                                                        myForm.setPageState({
                                                            ...myForm.pageState,
                                                            "cc_email": "",
                                                            "cc_emails": ccEmails,
                                                        })
                                                        document.getElementById("subject").focus();
                                                    }
                                                }}
                                            /> */}
                                            <Autosuggest
                                                suggestions={myForm.suggestions}
                                                onSuggestionsFetchRequested={(a) =>
                                                    myForm.onSuggestionsFetchRequestedDebounced(
                                                        a,
                                                        (b) =>
                                                            myForm.suggestionFetchApi(
                                                                ccEmailFieldInfo,
                                                                b
                                                            )
                                                    )
                                                }
                                                onSuggestionsClearRequested={() =>
                                                    myForm.onSuggestionsClearRequested(ccEmailFieldInfo)
                                                }
                                                getSuggestionValue={(suggestion) =>
                                                    suggestion[ccEmailFieldInfo.suggestionKeyword]
                                                }
                                                onSuggestionSelected={(a, b) =>
                                                    myForm.getSuggestionValue(
                                                        b.suggestion,
                                                        ccEmailFieldInfo,
                                                        myForm.performSuggestions,
                                                        myForm.updatePageStateForGetSuggestion
                                                    )
                                                }
                                                renderSuggestion={(a) =>
                                                    myForm.renderSuggestion(a, ccEmailFieldInfo)
                                                }
                                                highlightFirstSuggestion={true}
                                                ref={(a) => myForm.storeInputReference(a, false)}
                                                inputProps={{
                                                    id: "cc_email",
                                                    // placeholder: ccEmailFieldInfo["placeholder"],
                                                    value: String(
                                                        myForm.pageState[ccEmailFieldInfo["name"]]
                                                    ),
                                                    onChange: (a, b) => {
                                                        myForm.onChangeAutoSuggest(a, b, ccEmailFieldInfo);
                                                    },
                                                    onBlur: () => {
                                                        ccEmailFieldInfo["toValidate"]
                                                            ? myForm.onblurValidator(ccEmailFieldInfo)
                                                            : {};
                                                    },
                                                    onKeyPress: (e) => {
                                                        if (e.key == "Enter") {
                                                            let ccEmail = myForm.pageState.cc_email;
                                                            let ccEmails = myForm.pageState.cc_emails;
                                                            if (ccEmails.length > 0) {
                                                                ccEmails += "\n";
                                                            }
                                                            ccEmails += ccEmail;

                                                            myForm.setPageState({
                                                                ...myForm.pageState,
                                                                "cc_email": "",
                                                                "cc_emails": ccEmails,
                                                            })
                                                            document.getElementById("subject").focus();
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">Final CC </label>
                                            <textarea
                                                className="form-input"
                                                type="textbox"
                                                name="cc_emails"
                                                id="cc_emails"
                                                disabled
                                                value={myForm.pageState.cc_emails}
                                                style={{
                                                    color: "grey",
                                                    overflow: "auto",
                                                    height: "70px",
                                                    resize: "none"
                                                }}
                                            />
                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">Subject </label>
                                            <input
                                                className="form-input"
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                value={myForm.pageState.subject}
                                                onChange={myForm.handleChange}
                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        e.preventDefault();
                                                        document.getElementById("body_start").focus();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">Body Start </label>
                                            <textarea
                                                className="form-input"
                                                type="text"
                                                name="body_start"
                                                id="body_start"
                                                style={{height: "50px"}}
                                                value={myForm.pageState.body_start}
                                                onChange={myForm.handleChange}
                                                // onKeyPress={(e) => {
                                                //     if (e.key == "Enter") {
                                                //         e.preventDefault();
                                                //         document.getElementById("body_end").focus();
                                                //     }
                                                // }}
                                            />
                                        </div>
                                        <div className="pop-up-field">
                                            <label className="form-label">Body End </label>
                                            <textarea
                                                className="form-input"
                                                type="text"
                                                name="body_end"
                                                id="body_end"
                                                style={{height: "50px"}}
                                                value={myForm.pageState.body_end}
                                                onChange={myForm.handleChange}
                                                // onKeyPress={(e) => {
                                                //     if (e.key == "Enter") {
                                                //         e.preventDefault();
                                                //         document.getElementById("send").focus();
                                                //     }
                                                // }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        id="send"
                                        type="submit"
                                        onClick={() => {
                                            handleSendEmail();
                                            myForm.setPageState((pageState) => ({
                                                ...pageState,
                                                "send_email": false,
                                                "email": "",
                                                "subject": "",
                                                "cc_email": "",
                                                "cc_emails": "",
                                            }))
                                            close();
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                </Popup>
            </div>
            <div>
                <Popup
                    open={mailStatus != ""}
                    modal
                    contentStyle={contentStyle}
                    closeOnDocumentClick={false}
                >
                    {(close) => {
                        return (
                            <div className="pop-up-container">
                                <div className="pop-up-header">
                                    Status of Email
                                    <div>
                                        <a className="pop-up-close btn" onClick={() => {
                                            setMailStatus("");
                                            close();
                                        }}>
                                            &times;
                                        </a>
                                    </div>
                                </div>
                                <div className="popup-content">
                                    <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <label className="">Message : </label>
                                            <div className="">
                                                {mailStatus}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        onClick={() => {
                                            setMailStatus("");
                                            close();
                                        }}
                                    >
                                        Okay
                                    </button>
                                </div>
                            </div>
                        );
                    }}
                </Popup>
            </div>
            <div>
                <Popup
                    open={updateStatus != ""}
                    modal
                    contentStyle={contentStyle}
                    closeOnDocumentClick={false}
                >
                    {(close) => {
                        return (
                            <div className="pop-up-container">
                                <div className="pop-up-header">
                                    Status of Update
                                    <div>
                                        <a className="pop-up-close btn" onClick={() => {
                                            setUpdateStatus("");
                                            close();
                                        }}>
                                            &times;
                                        </a>
                                    </div>
                                </div>
                                <div className="popup-content">
                                    <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <label className="">Message : </label>
                                            <div className="">
                                                {updateStatus}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pop-up-actions">
                                    <button
                                        className="pop-up-button"
                                        onClick={() => {
                                            setUpdateStatus("");
                                            close();
                                        }}
                                    >
                                        Okay
                                    </button>
                                </div>
                            </div>
                        );
                    }}
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
            <div className="form-header">{isPodBilling ? "Consignor POD Billing" : "Consignor Billing"}</div>
            <div className="form">
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Consignor Billing No:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="bill_no"
                            placeholder=""
                            value={myForm.pageState.bill_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) =>
                                myForm.getPageOnKeyEnter(a, myForm.pageState.bill_no)
                            }
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "bill_no")}
                            disabled={myForm.pageMode == "view" ? "disabled" : ""}
                        />
                        {myForm.internalValidationErrors["challan_no"] && (
                            <p>{myForm.internalValidationErrors["challan_no"]}</p>
                        )}
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
                                {/* <button onClick={handleDelete}>Delete</button> */}
                            </>
                        )}
                    </div>
                    <div className="form-row">
                        <label className="form-label">{"Amount >="}</label>
                        <input
                            className="form-input"
                            type="text"
                            name="amount"
                            placeholder=""
                            value={myForm.pageState.amoun}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) => {
                                console.log("Here");
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("input_date");
                                }
                            }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "amount")}
                            disabled={myForm.pageMode == "view" ? "disabled" : ""}
                        />
                    </div>
                    <div className="form-row-m">
                        <label className="form-label">Bilty Date To:</label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="input_date"
                            placeholder=""
                            value={myForm.pageState.input_date}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
                            disabled={checkDisabledCondition({ name: "input_date" })}
                            onKeyPress={(a) => {
                                console.log("Here");
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("consignor_name");
                                }
                            }}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Consignor Name</label>
                        {myForm.pageMode == "edit" 
                        ? <input
                            type="text"
                            name="consignor_name"
                            value={myForm.pageState.consignor_name}
                            onChange={myForm.handleChange}
                            className="form-input"
                            onKeyPress={linkBilty}
                        />
                        : 
                       <Autosuggest
                            id={transporterFieldInfo["name"]}
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
                                onKeyPress: linkBilty,
                                disabled: checkDisabledCondition(transporterFieldInfo),
                            }}
                        />
                        }
                    
                    </div>
                    <div>
                        <label className="form-label">Bill Date:</label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="bill_date"
                            placeholder=""
                            value={myForm.pageState.bill_date}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "bill_date")}
                            disabled={checkDisabledCondition({ name: "bill_date" })}
                            onKeyPress={(a) => {
                                console.log("Here");
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("remarks");
                                }
                            }}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-last_bilty">Last Consignor Bill:</label>
                        <label className="form-consignor_bill">
                            {myForm.pageState.last_consignor_bill_no}
                        </label>
                    </div>
                </div>
                <div className="form-title-b">
                    <div className="form-row">
                        <label className="form-label">Remarks</label>
                        <input
                            className="form-input-w"
                            type="text"
                            name="remarks"
                            placeholder=""
                            value={myForm.pageState.remarks}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) => {
                                console.log("Here");
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("description1");
                                }
                            }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "remarks")}
                            disabled={myForm.pageMode == "view" ? "disabled" : ""}
                        />
                    </div>
                   
                </div>

                <div className="table-container">
                    <DynamicViewTable
                        checkBox={1}
                        tableHeader={consignorBillingTableHeader}
                        tableItems={consignorBillingTableItems}
                        tableValues={myForm.pageState["bilty_ids"]}
                        setPageStateByField={myForm.setPageStateByField}
                        pageStateArray={myForm.pageState["bilty_ids"]}
                        deleteEntryFromTableCallback={deleteEntryFromTableCallback}
                        handleCheckboxChange={handleCheckboxChange}
                        fieldMapping="bilty_ids"
                        getSelectAllValue={getSelectAllValue}
                        selectAll={selectAll}
                        deselectAll={deselectAll}
                    />
                </div>
                <div className="form-input-c">
                    <div className="form-field-left">
                        <div>
                            Amt{" "}
                            <input
                                size="10"
                                name="gross_amount"
                                placeholder=""
                                value={myForm.pageState.gross_amount}
                                onChange={myForm.handleChange}
                                disabled={checkDisabledCondition({ name: "gross_amount" })}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("door_del_charge");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "gross_amount")
                                }
                            ></input>
                        </div>
                        <div>
                            <p />
                        </div>

                        <table border="1px">
                            <tr>
                                <th className="bill-input-small"> No.</th>
                                <th className="bill-input-small">Description</th>
                                <th className="bill-input-small">Amt</th>
                            </tr>
                            <tr>
                                <td className="bill-input-small">1</td>
                                <td className="bill-input-small">
                                    <input
                                        className="bill-input-large"
                                        name="description1"
                                        placeholder=""
                                        value={myForm.pageState.description1}
                                        onChange={myForm.handleChange}
                                        disabled={checkDisabledCondition({ name: "description1" })}
                                        onBlur={() => { }}
                                        onKeyPress={(a) => {
                                            console.log("Here");
                                            if (a.key == "Enter") {
                                                myForm.makeFocusOnParticularField("amt1");
                                            }
                                        }}
                                        ref={(a) =>
                                            myForm.storeInputReferenceForSelect(a, "description1")
                                        }
                                    ></input>
                                </td>
                                <td className="bill-input-small">
                                    <input
                                        className="bill-input-small"
                                        name="amt1"
                                        placeholder=""
                                        value={myForm.pageState.amt1}
                                        onChange={myForm.handleChange}
                                        disabled={checkDisabledCondition({ name: "amt1" })}
                                        onBlur={() => { }}
                                        onKeyPress={(a) => {
                                            console.log("Here");
                                            if (a.key == "Enter") {
                                                myForm.makeFocusOnParticularField("description2");
                                            }
                                        }}
                                        ref={(a) => myForm.storeInputReferenceForSelect(a, "amt1")}
                                    ></input>
                                </td>
                            </tr>
                            <tr>
                                <td className="bill-input-small">2</td>
                                <td className="bill-input-small">
                                    <input
                                        className="bill-input-large"
                                        name="description2"
                                        placeholder=""
                                        value={myForm.pageState.description2}
                                        onChange={myForm.handleChange}
                                        disabled={checkDisabledCondition({ name: "description2" })}
                                        onBlur={() => { }}
                                        onKeyPress={(a) => {
                                            console.log("Here");
                                            if (a.key == "Enter") {
                                                myForm.makeFocusOnParticularField("amt2");
                                            }
                                        }}
                                        ref={(a) =>
                                            myForm.storeInputReferenceForSelect(a, "description2")
                                        }
                                    ></input>
                                </td>
                                <td className="bill-input-small">
                                    <input
                                        className="bill-input-small"
                                        name="amt2"
                                        placeholder=""
                                        value={myForm.pageState.amt2}
                                        onChange={myForm.handleChange}
                                        disabled={checkDisabledCondition({ name: "amt2" })}
                                        onBlur={() => { }}
                                        onKeyPress={(a) => {
                                            console.log("Here");
                                            if (a.key == "Enter") {
                                                myForm.makeFocusOnParticularField("extra_percentage");
                                            }
                                        }}
                                        ref={(a) => myForm.storeInputReferenceForSelect(a, "amt2")}
                                    ></input>
                                </td>
                            </tr>
                        </table>
                        {/* <FormColumn
              groupInfo={groupInfo}
              groupName="group-0"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            /> */}
                    </div>
                    <div className="form-field-left">
                        {/* <FormColumn
              groupInfo={groupInfo}
              groupName="group-2"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
            /> */}
                        <div className="bill-margin">
                            Extra(%) &nbsp; &nbsp; &nbsp; &nbsp;
                            <input
                                size="3"
                                name="extra_percentage"
                                placeholder=""
                                value={myForm.pageState.extra_percentage}
                                onChange={myForm.handleChange}
                                // disabled={checkDisabledCondition({name:"amt1"})}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("add");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "extra_percentage")
                                }
                            />
                            <input
                                size="10"
                                name="extra_percentage_amount"
                                placeholder=""
                                value={myForm.pageState.extra_percentage_amount}
                                onChange={myForm.handleChange}
                                disabled={checkDisabledCondition({
                                    name: "extra_percentage_amount",
                                })}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("amount");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(
                                        a,
                                        "extra_percentage_amount"
                                    )
                                }
                            ></input>
                        </div>
                        <div>
                            <p />
                        </div>
                        <div>
                            Extra Hamali{" "}
                            <input
                                size="16"
                                name="extra_hamali"
                                placeholder=""
                                value={myForm.pageState.extra_hamali}
                                onChange={myForm.handleChange}
                                disabled={checkDisabledCondition({ name: "extra_hamali" })}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("door_del_charge");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "extra_hamali")
                                }
                            ></input>
                        </div>
                        <div>
                            DD Charge &nbsp; &nbsp;
                            <input
                                size="16"
                                name="door_del_charge"
                                placeholder=""
                                value={myForm.pageState.door_del_charge}
                                onChange={myForm.handleChange}
                                disabled={checkDisabledCondition({ name: "door_del_charge" })}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("bilty_charge");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "door_del_charge")
                                }
                            ></input>
                        </div>
                        <div>
                            Bilty Charge &nbsp;
                            <input
                                size="16"
                                name="bilty_charge"
                                placeholder=""
                                value={myForm.pageState.bilty_charge}
                                onChange={myForm.handleChange}
                                disabled={checkDisabledCondition({ name: "bilty_charge" })}
                                onBlur={() => { }}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("add");
                                    }
                                }}
                                ref={(a) =>
                                    myForm.storeInputReferenceForSelect(a, "bilty_charge")
                                }
                            ></input>
                        </div>
                    </div>
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
                </div>

                {myForm.pageMode == "edit" && <div className="form-title-b">      
                    <div className="form-row-m"  style={{paddingTop: "10px"}}>
                            <label className="form-label">Date From:</label>
                            <input
                                className="form-input-mr-statement-date"
                                type="date"
                                name="update_date_from"
                                placeholder=""
                                value={myForm.pageState.update_date_from}
                                onChange={myForm.handleChange}
                                ref={(a) => myForm.storeInputReferenceForSelect(a, "update_date_from")}
                                disabled={checkDisabledCondition({ name: "update_date_from" })}
                                onKeyPress={(a) => {
                                    console.log("Here");
                                    if (a.key == "Enter") {
                                        myForm.makeFocusOnParticularField("update_date_to");
                                    }
                                }}
                            />
                    </div>
                    <div className="form-row-m"  style={{paddingTop: "10px"}}>
                        <label className="form-label">Date To:</label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="update_date_to"
                            placeholder=""
                            value={myForm.pageState.update_date_to}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "update_date_to")}
                            disabled={checkDisabledCondition({ name: "update_date_to" })}
                            onKeyPress={(a) => {
                                console.log("Here");
                                if (a.key == "Enter") {
                                    myForm.makeFocusOnParticularField("update_button");
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={updateBiltyRate}
                        type="button"
                        style={{marginTop: "1px" }}
                        // className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "update_button")}
                    >
                        Update
                    </button>
                    
                </div>}

                <div className="form-footer">
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="bilty_report_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        onClick={async () => {
                            download_ref.current.handleDownload();
                        }}
                    >
                        Download as XLS
                    </button>
                    {ReportExcel.excel_party_bill(myForm.pageState)}

                    {checkVisibilityCondition({ name: "print_button" }) && (
                        <button
                            onClick={(e) => {
                                if (myForm.pageState.edit_bill == "0") {
                                    handlePrint()
                                    return;
                                }
                                console.log("Values", myForm.pageState);
                                console.log("Values", myForm.pageState);
                                myForm.setServerPrintNeeded(true);
                                myForm.handleSubmit(e);
                            }}
                            type="button"
                            className="btn btn-primary"
                            ref={(a) =>
                                myForm.storeInputReferenceForSelect(a, "print_button")
                            }
                        >
                            Print
                        </button>
                    )}
                    {/* <button
            onClick={() => {
              console.log("Values", myForm.pageState);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button> */}
                    <button
                        onClick={myForm.handleSubmit}
                        type="button"
                        className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
                    >
                        Save
                    </button>
                    <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
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
                    
                    {myForm.pageState.bilty_ids.length > 0 &&
                        <button onClick={async () => {

                            const url = SERVER_URL
                                + `/mail/${myForm.pageState.consignor_id}`
                                + `?user_id=${sessionObject.sessionVariables.user_id}`
                                // + "&fyear=" + myForm.pageState.fYear 
                                + "&companyId=" + myForm.pageState.company_id;

                            const resp = await fetch(url);
                            let finalCC = "", finalTo = "", finalFrom = "", subject = "", body_start = "", body_end = "";
                            if (resp.ok) {
                                // console.log("inside");
                                const data = await resp.json();
                                
                                subject = data.subject;
                                body_start = data.body_start;
                                body_end = data.body_end;

                                console.log({ data });

                                if(data.flag == 1) {
                                    finalTo = data.to ?? "";
                                    finalFrom = data.sender ?? "";
    
                                    const cc = data.cc;
                                    cc.forEach(mail => {
                                        if (finalCC.length > 0) finalCC += "\n";
                                        finalCC += mail;
                                    })

                                }
                                // console.log("bar");
                            }

                            // console.log("setting data");
                            myForm.setPageState({
                                ...myForm.pageState,
                                send_email: true,
                                email: finalTo,
                                cc_emails: finalCC,
                                email_from: finalFrom,
                                subject: subject,
                                body_end: body_end,
                                body_start: body_start
                            })
                        }
                        }>
                            Send Email
                        </button>}
                </div>
            </div>
        </div>
    );
};

export default ConsignorBillingForm;
