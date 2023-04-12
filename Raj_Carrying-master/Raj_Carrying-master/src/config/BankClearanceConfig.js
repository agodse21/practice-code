import { some } from "lodash";
import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2"];

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    const ans = [year, month, day].join('-');
    // console.log({ans});
    return ans;
}

function isoToDash(date) {
    let temp = date.split('T')[0].split('-');
    temp.reverse()
    temp = temp.join('-');
    return temp;
}

const groupInfo = {
    "group-1": [
        {
            label: "Bank Name",
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
                Enter: "voucher_type",
            },
            idClearanceNeeded: "consignor_id",
            inputDataNeededInSuggestions: false,
            inputDataFilter: {
                pay_type: "same",
            },
        },
        {
            label: "Receipt/Payment",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "voucher_type",
            dropdown_items: [
                { value: "br", label: "Receipt" },
                { value: "bp", label: "Payment" },
            ],
            type: "dropdown",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "clearance_status",
            },
        },
        {
            label: "Clearance Status",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "clearance_status",
            dropdown_items: [
                { value: "1", label: "Clearance" },
                { value: "0", label: "Un Clearance" },
                { value: "2", label: "All" },
            ],
            type: "dropdown",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "date_from",
            },
        },
    ],
    "group-2": [
        {
            label: "Date From",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "date_from",
            type: "date",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "date_to",
            },
        },
        {
            label: "Date to",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "date_to",
            type: "date",
            placeHolder: "",
            onKeyPressEvent: async (inputObject) => {
                console.log({ inputObject });
                inputObject.setOverlay(true);

                const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

                let dateFrom = new Date(inputObject.pageState.date_from).toISOString();
                let dateTo = new Date(inputObject.pageState.date_to).toISOString();

                const dataToSend = {
                    date_from: dateFrom,
                    date_to: dateTo,
                    voucher_type: inputObject.pageState.voucher_type,
                    clearance_status: parseInt(inputObject.pageState.clearance_status),
                    bank_id: inputObject.pageState.consignor_id, // Bank
                    created_from: inputObject.pageState.created_from,
                    companyId: inputObject.pageState.company_id,
                    fyear: fYear_fetch,        
                }
                // const dataToSend = {
                //     "voucher_type": "bp",
                //     "bank_id": 29368,
                //     "date_from": "2021-04-01T00:00:00.000Z",
                //     "date_to": "2022-01-17T00:00:00.000Z",
                //     "created_from": "1",
                //     "clearance_status": 2
                // }

                const url =
                    SERVER_URL +
                    "/account_trans/clearance_report";
                const response = await fetch(url,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: JSON.stringify(dataToSend)
                    }
                )
                if (!response.ok) {
                    inputObject.setPageStateByField("date_to", "error");
                    inputObject.setOverlay(false);
                    return;
                }
                const temp_response = await response.json();
                // console.log({ temp_response });

                let clear = 0, unClear = 0;
                temp_response.forEach(row => {

                    // isoString is coming
                    if(row.clearance_date != null) row.clearance_date = isoToDash(row.clearance_date);

                    // clearance mode
                    if (row.clearance_status == "1") {
                        row.checked = "1";
                        clear += parseInt(row.amount);
                    }
                    else {
                        row.checked = "0";
                        unClear += parseInt(row.amount);
                    }
                })

                inputObject.setOverlay(false);
                inputObject.setPageState((oldState) => ({
                    ...oldState,
                    "clearance_entries": temp_response,
                    "clear": clear,
                    "unclear": unClear,
                }))

                if(temp_response.length > 0) {
                    inputObject.refStoreObject.current.save_button.focus();
                }
                return;
            },
            // keyboardNavigationMap: {
            //     required: (pageState) => {
            //         console.log(pageState.clearance_entries.length);
            //         return pageState.clearance_entries.length != 0;
            //     },
            //     Enter: "save_button",
            // },
            // keyboardNavigationMap: {
            //     Enter: "save_button",
            // },
        },
    ],
};

// const fyearObj = getLoggedinFyear();
const dataObject = {
    consignor_name: "",
    consignor_id: "",
    consignor_gst: "",
    voucher_type: "br",
    clearance_status: "0",
    clear: 0,
    unclear: 0,
    // date_from: fyearObj.start_fyear,
    // date_to: fyearObj.end_fyear,
    last_entry_no: "",
    letter_no: "",
    clearance_entries: [],
    clearance_date: new Date(),
};


function validate(values) {
    let errors = {};

    function validator(value, regexp) {
        var regex = new RegExp(regexp);
        if (values.hasOwnProperty(value)) {
            if (!values[value].trim()) {
                errors[value] = "Required Field";
            } else if (!regex.test(values[value])) {
                errors[value] = "Validation Error";
            } else {
                errors[value] = "";
            }
        }
    }
    for (let group_name of groupNames) {
        for (let i = 0; i < groupInfo[group_name].length; i++) {
            console.log(groupInfo[group_name][i]);
            let field_object = groupInfo[group_name][i];
            if (field_object.toValidate) {
                validator(field_object.name, field_object.regExpValidation);
            }
        }
    }
    return errors;
}

const popupInfo = {
    "success_header": "Bank Clearance Saving Successful ",
    "error_header": "Error In Bank Clearance Module ",
    "success_title": "Bank Clearance is successfully Updated",
    // "field_label_success": "Vehicle Register No.",
    // "field_name_success": "vr_no",
    "error_title": "Error in Bank Clearance module with the following info:-",
    "field_label_error": "Error:"
}

const BankClearanceTableHeaders = [

    {
        label: "S. No.",
        className: "text-center table-header"
    },
    {
        label: "Vou. No.",
        className: "text-center table-header",
    },
    {
        label: "Amount",
        className: "text-center table-header",
    },
    {
        label: "Cheque No.",
        className: "text-center table-header",
    },
    {
        label: "Party Name",
        className: "text-center table-header",
    },
    {
        label: "Clear. Date",
        className: "text-center table-header",
    },
    {
        label: "Bank Name",
        className: "text-center table-header",
    },
    {
        label: "Date",
        className: "text-center table-header",
    },
    {
        label: "FYear",
        className: "text-center table-header",
    },
];

const BankClearanceTableItems = [
    {
        type: "text",
        name: "voucher_id",
        label: "Vou. No.",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "amount",
        label: "Amount",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "cheque_no",
        label: "Cheque No.",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "party_name",
        label: "Party Name",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "clearance_date",
        label: "Clear. Date",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "bank_name",
        label: "Bank Name",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "date",
        label: "Date",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "f_year",
        label: "FYear",
        className: "form-control-medlarge-col",
    },
];

export {
    groupInfo,
    groupNames,
    dataObject,
    validate,
    popupInfo,
    BankClearanceTableHeaders,
    BankClearanceTableItems,
    isoToDash,
};
