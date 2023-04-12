import { date } from "yup/lib/locale";
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

    return [year, month, day].join('-');
}

const groupInfo = {
    "group-1": [
        {
            label: "MR No.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "mr_no",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                conditionalNav: true,
                conditionalNavFunct: (pageState) => {
                    if (pageState.mr_no == "") {
                        return "credit_date";
                    }
                    return "mr_no";
                },
            },
            onKeyPressEvent: async (inputObject) => {
                inputObject.setOverlay(true);
                console.log(inputObject, inputObject.pageState.mr_no);

                if (inputObject.pageState.mr_no == "") {
                    return;
                }

                console.log({inputObject});

                const newEntry = {
                    mr_no: inputObject.pageState.mr_no,
                }

                inputObject.setPageState(
                    {
                        ...inputObject.pageState,
                        "mr_entries": [...inputObject.pageState.mr_entries, newEntry],
                        "mr_no": "",
                    }
                )
                inputObject.setOverlay(false);
                return;
            },
        },
    ],
    "group-2": [
        {
            label: "Credit Date",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "credit_date",
            type: "date",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "credit_amount",
            },
        },
        {
            label: "Credit Amount",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "credit_amount",
            type: "number",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "credit_type",
            },
        },
        {
            label: "Credit Type",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "credit_type",
            type: "dropdown",
            dropdown_items: [
                { value: "1", label: "CASH" },
                { value: "2", label: "RTGS" },
                { value: "3", label: "CHEQUE" },
            ],
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "cheque_no",
            },
        },
        {
            label: "Cheque No",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "cheque_no",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                conditionalNav: true,
                conditionalNavFunct: (pageState) => {
                    if (pageState.cheque_no != "") {
                        return "credit_date";
                    }
                    return "remarks";
                },
            },
            onKeyPressEvent: async (inputObject) => {
                console.log({ inputObject }, "!!!!!!!!!!!!!!!!!!!");
                inputObject.setOverlay(true);

                // if (inputObject.pageState.cheque_no == "") {
                //     return;
                // }

                const newEntry = {
                    credit_date: inputObject.pageState.credit_date,
                    credit_amount: inputObject.pageState.credit_amount,
                    credit_type: inputObject.pageState.credit_type,
                    cheque_no: inputObject.pageState.cheque_no,
                }


                inputObject.setPageState(
                    {
                        ...inputObject.pageState,
                        "table_entries": [...inputObject.pageState.table_entries, newEntry],
                        "credit_amount": "",
                        "credit_type": "1",
                        "cheque_no": "",
                        "credit_date": formatDate(new Date()),
                    }
                )
                inputObject.setOverlay(false);
                return;
            },
        },
    ],
};

const dataObject = {
    sr_no: "",
    remarks: "",
    last_entry_no: "",
    branch_name: "",
    branch_id: "",
    mr_no: "",
    credit_amount: "",
    credit_type: "1",
    cheque_no: "",
    table_entries: [],
    input_date: formatDate(new Date()),
    credit_date: formatDate(new Date()),
    party_name: "",
    mr_entries: [],
    debit_amount: "",
};


function validate(values) {
    let errors = {};

    // function validator(value, regexp) {
    //     var regex = new RegExp(regexp);
    //     if (values.hasOwnProperty(value)) {
    //         if (!values[value].trim()) {
    //             errors[value] = "Required Field";
    //         } else if (!regex.test(values[value])) {
    //             errors[value] = "Validation Error";
    //         } else {
    //             errors[value] = "";
    //         }
    //     }
    // }
    // for (let group_name of groupNames) {
    //     for (let i = 0; i < groupInfo[group_name].length; i++) {
    //         console.log(groupInfo[group_name][i]);
    //         let field_object = groupInfo[group_name][i];
    //         if (field_object.toValidate) {
    //             validator(field_object.name, field_object.regExpValidation);
    //         }
    //     }
    // }
    return errors;
}



const popupInfo = {
    "success_header": "MR Pending Payement Saving Successful ",
    "error_header": "Error In MR Pending Payement Module ",
    "success_title": "MR Pending Payement is successfully created with the following info:-",
    "field_label_success": "SR No.",
    "field_name_success": "sr_no",
    "error_title": "Error in MR Pending Payement module with the following info:-",
    "field_label_error": "Error:"
}

const mrPendingTableHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Credit Date", className: "text-center table-header" },
    { label: "Credit Amount", className: "text-center table-header" },
    { label: "Credit Type", className: "text-center table-header" },
    { label: "Cheque No.", className: "text-center table-header" },
    // { label: "Credit Account Name", className: "text-center table-header" }
];
const mrPendingMrTableHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Mr No", className: "text-center table-header" },
];

const mrPendingTableItems = [
    {
        type: "date",
        name: "credit_date",
        label: "Credit Date",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "credit_amount",
        label: "Credit Amount",
        className: "form-control-small-col",
    },
    {
        type: "text",
        name: "credit_type",
        label: "Credit Type",
        className: "form-control-small-col",
    },
    {
        type: "text",
        name: "cheque_no",
        label: "Cheque No",
        className: "form-control-large-col",
    },
];

const mrPendingMrTableItems = [
    {
        type: "text",
        name: "mr_no",
        label: "Mr No",
        className: "form-control-large-col",
    },
];

export {
    groupInfo,
    groupNames,
    dataObject,
    validate,
    popupInfo,
    mrPendingTableHeaders,
    mrPendingTableItems,
    mrPendingMrTableHeaders,
    mrPendingMrTableItems,
};
