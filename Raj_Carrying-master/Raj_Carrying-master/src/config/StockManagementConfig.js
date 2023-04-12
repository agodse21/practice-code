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
        Enter: "trip_no",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_from",
};


const groupInfo = {
    "group-1": [
        {
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
            // toValidate: true,
            regExpValidation: "[a-zA-z]",
            keyboardNavigationMap: {
                Enter: "inwarded",
            },
            valueVerificationFromSuggestionNeeded: true,
            valueVerificationCompulsionField: "station_to",
        },
        {
            label: "Inwarded",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "inwarded",
            type: "dropdown",
            dropdown_items: [
                { value: "1", label: "YES" },
                { value: "0", label: "NO" },
            ],
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "remark",
            },
        },
        {
            label: "Remarks",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "remark",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                conditionalNav: true,
                conditionalNavFunct: (pageState) => {
                    if (pageState.outward_type == "1" || pageState.outward_type == "2") {
                        return "name";
                    } else {
                        return "vendor";
                    }
                },
            },

        },
        {
            label: "Vendor",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "vendor",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "name",
            },
        },
    ],
    "group-2": [
        {
            label: "Item Name",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "name",
            type: "text",
            placeHolder: "1234",
            apiConfigKey: "getItemSuggestions",
            suggestionKeywordForFetchApiArgs: "name",
            suggestionChooseQueryKeyword: "item_id",
            suggestionKeywordExtra: "description",
            url: SERVER_URL + "/stock_register/item",
            suggestionKeyword: "name",
            backendOnClickName: "vehicle_no",
            keyboardNavigationMap: {
                Enter: "qty",
            },
            // toValidate: "true",
            apiCallRequiredOnGetValue: false,
            suggestionSchema: {
                name: "name",
                //   desc: "description",
                item_id: "item_id",
            },
            idClearanceNeeded: "item_id",
            onChangeIgnoreClearance: ["description"],
        },
        {
            label: "Quantity",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "qty",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "price",
            },
        },
        {
            label: "Price",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "price",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "remark1",
            },
        },
        {
            label: "Station From Remark",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "remark1",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "remark2",
            },
        },
        {
            label: "Station To Remarks",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "remark2",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "station_to_name",
            },
            onKeyPressEvent: async (inputObject) => {

                console.log({ inputObject }, "!!!!!!!!!!!!!!!!!!!");

                // if (inputObject.pageState.item_id == "") {
                //     return;
                // }

                inputObject.setOverlay(true);

                const newEntry = {
                    name: inputObject.pageState.name,
                    item_id: inputObject.pageState.item_id,
                    remark1: inputObject.pageState.remark1,
                    remark2: inputObject.pageState.remark2,
                    qty: inputObject.pageState.qty,
                    price: inputObject.pageState.price,
                }


                inputObject.setPageState(oldState => ({
                    ...oldState,
                    item_info: [...oldState.item_info, newEntry],
                    name: "",
                    item_id: "",
                    remark1: "",
                    remark2: "",
                    qty: "",
                    price: "",
                }));
                
                inputObject.setOverlay(false);
                return;
            },
        },
    ],
    "group-3": [
        {
            label: "Advance",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "advance",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "balance",
            },
        },
        {
            label: "Balance",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "balance",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "truck_freight",
            },
        },
        {
            label: "Truck Freight REC",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "truck_freight",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "silak",
            },
        },
        {
            label: "Silak from R.C.C.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "silak",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "cash",
            },
        },
        {
            label: "Cash",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "cash",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "bank",
            },
        },
        {
            label: "Bank",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "bank",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "diesel",
            },
        },
        {
            label: "Total Credit(Income)",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "total_credit",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "diesel",
            },
        },
    ],
    "group-4": [
        {
            label: "Truck Diesel Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "diesel",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "rassa",
            },
        },
        {
            label: "Truck Rassa Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "rassa",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "hamali",
            },
        },
        {
            label: "Truck Hamali Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "hamali",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "toll",
            },
        },
        {
            label: "Truck Tollnaka Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "toll",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "bhattha",
            },
        },
        {
            label: "Truck Driver Bhattha",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "bhattha",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "salary",
            },
        },
        {
            label: "Truck Driver Salary",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "salary",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "rto",
            },
        },
        {
            label: "Truck R.T.O Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "rto",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "miscellaneous",
            },
        },
        {
            label: "Truck MIS. Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "miscellaneous",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "insurance",
            },
        },
        {
            label: "Truck Insurance",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "insurance",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "telephone",
            },
        },
        {
            label: "Telephone Exp",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "telephone",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "repair_tyre",
            },
        },
        {
            label: "Tyre Repairing",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "repair_tyre",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "repair_body",
            },
        },
        {
            label: "Body Repairing",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "repair_body",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "repair_gen",
            },
        },
        {
            label: "General Repairing",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "repair_gen",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "cash_driver",
            },
        },


        {
            label: "Cash Received by driver",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "cash_driver",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "commission",
            },
        },
        {
            label: "Commission",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "commission",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "balance_freight",
            },
        },

        {
            label: "Balance Freight",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "balance_freight",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "station_from_name",
            },
            onKeyPressEvent: async (inputObject) => {
                // if (inputObject.pageState.trip_id == "") {
                //     return;
                // }

                console.log({ inputObject }, "!!!!!!!!!!!!!!!!!!!");
                inputObject.setOverlay(true);


                let finalAmount = parseFloat(inputObject.pageState.total_final_amount) || 0;

                if (inputObject.pageState.balance_type == "cr") {
                    finalAmount += inputObject.pageState.total_amount;
                }
                else {
                    finalAmount -= inputObject.pageState.total_amount;
                }

                const newEntry = {
                    fyear: inputObject.pageState.fYear,
                    companyId: inputObject.pageState.company_id,
                    trip_id: inputObject.pageState.trip_id,
                    trip_no: inputObject.pageState.trip_no,
                    created_from: inputObject.pageState.created_from,
                    // vehicle_no: inputObject.pageState.vehicle_no,
                    // vehicle_id: inputObject.pageState.vehicle_id,
                    // driver_name: inputObject.pageState.driver_name,
                    // start_km: inputObject.pageState.start_km,
                    // end_km: inputObject.pageState.end_km,
                    // depart_date: inputObject.pageState.depart_date,
                    // arrive_date: inputObject.pageState.arrive_date,
                    // journey_avg: inputObject.pageState.journey_avg,
                    // journey_diesel: inputObject.pageState.journey_diesel,
                    // journey_km: inputObject.pageState.journey_km,
                    advance: inputObject.pageState.advance,
                    balance: inputObject.pageState.balance,
                    truck_freight: inputObject.pageState.truck_freight,
                    silak: inputObject.pageState.silak,
                    cash: inputObject.pageState.cash,
                    bank: inputObject.pageState.bank,
                    diesel: inputObject.pageState.diesel,
                    rassa: inputObject.pageState.rassa,
                    hamali: inputObject.pageState.hamali,
                    toll: inputObject.pageState.toll,
                    bhattha: inputObject.pageState.bhattha,
                    salary: inputObject.pageState.salary,
                    rto: inputObject.pageState.rto,
                    miscellaneous: inputObject.pageState.miscellaneous,
                    insurance: inputObject.pageState.insurance,
                    telephone: inputObject.pageState.telephone,
                    repair_tyre: inputObject.pageState.repair_tyre,
                    repair_body: inputObject.pageState.repair_body,
                    repair_gen: inputObject.pageState.repair_gen,
                    total_amount: inputObject.pageState.total_amount,
                    balance_type: inputObject.pageState.balance_type,
                    created_by: inputObject.pageState.created_by,
                    created_date: inputObject.pageState.created_date,
                    modified_date: inputObject.pageState.modified_date,
                    total_credit: inputObject.pageState.total_credit,
                    total_debit: inputObject.pageState.total_debit,
                    balance_freight: inputObject.pageState.balance_freight,
                    station_from_name: inputObject.pageState.station_from_name,
                    trip_date: inputObject.pageState.trip_date,
                    station_to_name: inputObject.pageState.station_to_name,
                    station_to: inputObject.pageState.station_to_id,
                    cash_driver: inputObject.pageState.cash_driver,
                    commission: inputObject.pageState.commission,
                }


                inputObject.setPageState(oldState => ({
                    ...oldState,
                    total_final_amount: finalAmount,
                    trip_info: [...oldState.trip_info, newEntry],
                    trip_id: "",
                    trip_no: "",
                    // vehicle_no: "",
                    // vehicle_id: "",
                    // driver_name: "",
                    // created_from: "",
                    // start_km: "",
                    // end_km: "",
                    // depart_date: formatDate(new Date()),
                    // arrive_date: formatDate(new Date()),
                    station_to_name: "",
                    station_to_id: "",
                    cash_driver: "",
                    commission: "",
                    advance: "",
                    balance: "",
                    truck_freight: "",
                    silak: "",
                    cash: "",
                    bank: "",
                    diesel: "",
                    rassa: "",
                    hamali: "",
                    toll: "",
                    bhattha: "",
                    salary: "",
                    rto: "",
                    miscellaneous: "",
                    insurance: "",
                    telephone: "",
                    repair_tyre: "",
                    repair_body: "",
                    repair_gen: "",
                    total_amount: "",
                    balance_type: "",
                    created_by: "",
                    created_date: formatDate(new Date()),
                    modified_date: formatDate(new Date()),
                    total_credit: "",
                    total_debit: "",
                    // journey_avg: "",
                    // journey_diesel: "",
                    // journey_km: "",
                    balance_freight: "",
                    trip_date: formatDate(new Date()),
                    station_to_name: "",
                    // station_from_name: "",
                }));
                inputObject.setOverlay(false);
                return;
            },
        },
        {
            label: "Total Debit(Expense)",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "total_debit",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "diesel",
            },
        },
    ],
};

const itemHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Item Name", className: "text-center table-header" },
    { label: "Quantity", className: "text-center table-header" },
    { label: "Price", className: "text-center table-header" },
    { label: "Station From Remarks", className: "text-center table-header" },
    { label: "Station To Remarks", className: "text-center table-header" },
    // { label: "Amount", className: "text-center table-header" },
    // { label: "Cheque No", className: "text-center table-header" },
    // { label: "Bank Name", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
];


const items = [
    {
        type: "text",
        name: "name",
        label: "Item Name",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "qty",
        label: "qty",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "price",
        label: "Price",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "remark1",
        label: "remark1",
        className: "form-control-large-col",
    },
    {
        type: "text",
        name: "remark2",
        label: "remark2",
        className: "form-control-large-col",
    },
    // {
    //     type: "text",
    //     name: "amount",
    //     label: "Amount",
    //     className: "form-control-small-col",
    // },
    // {
    //     type: "text",
    //     name: "cheque_no",
    //     label: "Cheque No",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "bank_name",
    //     label: "Bank Name",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "remarks",
    //     label: "Remarks",
    //     className: "form-control-large-col",
    // },
];

const stockItemHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Item Name", className: "text-center table-header" },
    { label: "Quantity", className: "text-center table-header" },
    // { label: "Price", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
    // { label: "Amount", className: "text-center table-header" },
    // { label: "Cheque No", className: "text-center table-header" },
    // { label: "Bank Name", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
];


const stockItems = [
    {
        type: "text",
        name: "item_name",
        label: "Item Name",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "qty",
        label: "qty",
        className: "form-control-medium-col",
    },
    // {
    //     type: "text",
    //     name: "price",
    //     label: "Price",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "remark2",
    //     label: "remark2",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "amount",
    //     label: "Amount",
    //     className: "form-control-small-col",
    // },
    // {
    //     type: "text",
    //     name: "cheque_no",
    //     label: "Cheque No",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "bank_name",
    //     label: "Bank Name",
    //     className: "form-control-medium-col",
    // },
    // {
    //     type: "text",
    //     name: "remarks",
    //     label: "Remarks",
    //     className: "form-control-large-col",
    // },
];

const dataObject = {
    type: "2",
    outward_type: "1",
    register_no: "",
    outward_date: formatDate(new Date()),
    station_from_name: "",
    station_from: "",
    last_register_no: "",
    station_to_name: "",
    station_to: "",
    inwarded: "0",
    remark: "",
    receive_user: "",
    item_info: [],
    stock_info: [],
    remark2: "", // vendor
    remark1: "",
    item_id: "",
    name: "",
    qty: "",
    price: "",
    vendor: "",
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
    error_header: "Error In Stock Outward Management Module ",
    success_header: "Stock Outward Saving Successful ",
    success_title: "Stock Outward is successfully created with the following info:-",
    field_label_success: "Stock Outward No.",
    field_name_success: "register_no",
    error_title: "Error in Stock Outward module with the following info:-",
    field_label_error: "Error:",
};

export {
    groupInfo,
    groupNames,
    dataObject,
    popupInfo,
    validate,
    stationFromFieldInfo,
    itemHeaders,
    items,
    stockItemHeaders,
    stockItems,
    formatDate,
};
