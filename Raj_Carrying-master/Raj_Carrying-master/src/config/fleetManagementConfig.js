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
        branch_id: "created_from",
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
            label: "Lorry No.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "vehicle_no",
            type: "text",
            placeHolder: "1234",
            apiConfigKey: "getVehicleSuggestions",
            url: SERVER_URL + "/vehicle/",
            suggestionKeyword: "vehicle_no",
            suggestionKeywordForFetchApiArgs: "vehicle_no",
            suggestionChooseQueryKeyword: "vehicle_no",
            apiCallRequiredOnGetValue: true,
            suggestionSchema: {
                vehicle_id: "vehicle_id",
                vehicle_no: "vehicle_no",
                driver_name: "driver_name",
                // owner_name: "owner_name",
                // license_no: "license_no",
                // phone_no: "phone_no",
            },
            keyboardNavigationMap: {
                Enter: "driver_name",
            },
            // toValidate: true,
            valueVerificationFromSuggestionNeeded: true,
            valueVerificationCompulsionField: "vehicle_id",
        },
        {
            label: "Driver Name",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "driver_name",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "depart_date",
            },
        },
        {
            label: "Dep. Date",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "depart_date",
            type: "date",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "arrive_date",
            },
        },
        {
            label: "Arrival Date",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "arrive_date",
            type: "date",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "station_to_name",
            },
        },
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
              branch_id: "station_to_id",
              name: "station_to_name",
            },
            // toValidate: true,
            regExpValidation: "[a-zA-z]",
            keyboardNavigationMap: {
              Enter: "trip_date",
            },
            valueVerificationFromSuggestionNeeded: true,
            valueVerificationCompulsionField: "station_to",
        },
        {
            label: "Trip Date",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "trip_date",
            type: "date",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "start_km",
            },
        },
    ],
    "group-2": [
        {
            label: "Opening K.M.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "start_km",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "end_km",
            },
        },
        {
            label: "Closing K.M.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "end_km",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "journey_km",
            },
        },
        {
            label: "K.M. Difference",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "journey_km",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "journey_diesel",
            },
        },
        {
            label: "Diesel",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "journey_diesel",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "journey_avg",
            },
        },
        {
            label: "Average KM",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "journey_avg",
            type: "text",
            placeHolder: "",
            keyboardNavigationMap: {
                Enter: "advance",
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

const tripItemHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Trip No", className: "text-center table-header" },
    { label: "Branch", className: "text-center table-header" },
    { label: "Balance", className: "text-center table-header" },
    { label: "Balance_type", className: "text-center table-header" },
    // { label: "Amount", className: "text-center table-header" },
    // { label: "Cheque No", className: "text-center table-header" },
    // { label: "Bank Name", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
];


const tripItems = [
    {
        type: "text",
        name: "trip_no",
        label: "Trip No",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "station_from_name",
        label: "Branch",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "total_amount",
        label: "Balance",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "balance_type",
        label: "Balance Type",
        className: "form-control-medium-col",
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

const dataObject = {

    // fleet_no: "",
    // station_from: "",
    // station_from_name: "",
    // trip_date: formatDate(new Date()),
    // last_fleet_no: "",
    // vehicle_id: "",
    // vehicle_no: "",
    // driver_name: "",
    // opening_km: "",
    // closing_km: "",
    // dept_date: formatDate(new Date()),
    // arrival_date: formatDate(new Date()),

    id: "",
    fleet_no: "",
    trip_id: "",
    trip_no: "",
    vehicle_no: "",
    vehicle_id: "",
    driver_name: "",
    created_from: "",
    last_fleet_no: "",
    start_km: "",
    end_km: "",
    depart_date: formatDate(new Date()),
    arrive_date: formatDate(new Date()),
    trip_date: formatDate(new Date()),
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
    fyear: "",
    companyId: "",
    total_credit: "",
    total_debit: "",
    final_credit: "",
    final_debit: "",
    journey_avg: "",
    journey_diesel: "",
    journey_km: "",
    balance_freight: "",
    trip_info: [],
    final_balance_type: "",
    total_final_amount: "",
    station_to: "",
    station_to_name: "",
    fleet_date: formatDate(new Date()),
    cash_driver: "",
    commission: "",
};

const challanBiltyTableHeader = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Bilty No.", className: "text-center table-header" },
    { label: "Bilty Date", className: "text-center table-header" },
    { label: "Station From", className: "text-center table-header" },
    // { label: "Station To", className: "text-center table-header" },
    { label: "Destination", className: "text-center table-header" },
    { label: "Pay Type", className: "text-center table-header" },
    { label: "Consignor Name", className: "text-center table-header" },
    // { label: "Consignor Gst", className: "text-center table-header" },
    { label: "Consignee Name", className: "text-center table-header" },
    // { label: "Crossing Amount", className: "text-center table-header" },
    // { label: "Consignee Gst", className: "text-center table-header" },
    { label: "No Of Package", className: "text-center table-header" },
    // { label: "Actual Weight", className: "text-center table-header" },
    { label: "Charge Weight", className: "text-center table-header" },
    { label: "Private Marka No", className: "text-center table-header" },
    // { label: "Delivery Dest Type", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
    // { label: "Bilty Charge", className: "text-center table-header" },
    // { label: "Other Amount", className: "text-center table-header" },
    // { label: "Freight", className: "text-center table-header" },
    // { label: "Hamali", className: "text-center table-header" },
    // { label: "Door Del Charge", className: "text-center table-header" },
    // { label: "Created From", className: "text-center table-header" },
    // { label: "Created By", className: "text-center table-header" },
];

const challanBiltyOriginalTableHeader = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Bilty No.", className: "text-center table-header" },
    { label: "Bilty Date", className: "text-center table-header" },
    { label: "Station From", className: "text-center table-header" },
    // { label: "Station To", className: "text-center table-header" },
    { label: "Destination", className: "text-center table-header" },
    { label: "EWay Bills", className: "text-center table-header" },
    { label: "Pay Type", className: "text-center table-header" },
    { label: "Consignor Name", className: "text-center table-header" },
    // { label: "Consignor Gst", className: "text-center table-header" },
    { label: "Consignee Name", className: "text-center table-header" },
    // { label: "Crossing Amount", className: "text-center table-header" },
    // { label: "Consignee Gst", className: "text-center table-header" },
    { label: "No Of Package", className: "text-center table-header" },
    // { label: "Actual Weight", className: "text-center table-header" },
    { label: "Charge Weight", className: "text-center table-header" },
    { label: "Private Marka No", className: "text-center table-header" },
    // { label: "Delivery Dest Type", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
    // { label: "Bilty Charge", className: "text-center table-header" },
    // { label: "Other Amount", className: "text-center table-header" },
    // { label: "Freight", className: "text-center table-header" },
    // { label: "Hamali", className: "text-center table-header" },
    // { label: "Door Del Charge", className: "text-center table-header" },
    // { label: "Created From", className: "text-center table-header" },
    // { label: "Created By", className: "text-center table-header" },
];


const challanBiltyTableItems = [
    {
        type: "text",
        name: "bilty_no_suffix",
        label: "Bilty No",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "bilty_date",
        label: "Bilty Date",
        className: "form-control-medium-col",
        convertFunction: (itemObject) => {
            return formatDate(itemObject.bilty_date)
        }
    },
    {
        type: "text",
        name: "station_from_name",
        label: "Station From",
        className: "form-control-medlarge-col",
    },
    // {
    //   type: "text",
    //   name: "station_to_name",
    //   label: "Station To",
    //   className: "form-control-medlarge-col",
    // },
    {
        type: "text",
        name: "destination_name",
        label: "Destination",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "pay_type_name",
        label: "Pay Type",
        className: "form-control-medium-col",
        convertFunction: (itemObject) => {
            console.log("Item object pay type", itemObject.pay_type_name)
            if (itemObject.pay_type_name == "To Be Billed") {
                return "TBB"
            }
            else {
                return itemObject.pay_type_name
            }
        }
    },
    {
        type: "text",
        name: "consignor_name",
        label: "Consignor Name",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "consignor_gst",
    //   label: "Consignor Gst",
    //   className: "form-control-large-col",
    // },
    {
        type: "text",
        name: "consignee_name",
        label: "Consignee Name",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "consignee_gst",
    //   label: "Consignee Gst",
    //   className: "form-control-large-col",
    // },
    // {
    //   type: "text",
    //   name: "transporter_freight",
    //   label: "Transporter freight",
    //   className: "form-control-medium-col",
    // },
    {
        type: "text",
        name: "no_of_package",
        label: "No Of Package",
        className: "form-control-small-col",
    },
    // {
    //   type: "text",
    //   name: "actual_weight",
    //   label: "Actual Weight",
    //   className: "form-control-small-col",
    // },
    {
        type: "text",
        name: "charge_weight",
        label: "Charge Weight",
        className: "form-control-small-col",
    },
    {
        type: "text",
        name: "private_marka_no",
        label: "Private Marka No",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "delivery_dest_type",
    //   label: "Delivery Dest Type",
    //   className: "form-control-medium-col",
    // },
    // {
    //   type: "text",
    //   name: "remarks",
    //   label: "Remarks",
    //   className: "form-control-medium-col",
    // },
    // {
    //   type: "text",
    //   name: "bilty_charge",
    //   label: "Bilty Charge",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "other_amount",
    //   label: "Other Amount",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "freight",
    //   label: "Freight",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "hamali",
    //   label: "Hamali",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "door_del_charge",
    //   label: "Door Del Charge",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "created_from",
    //   label: "Created From",
    //   className: "form-control-medlarge-col ",
    // },
    // {
    //   type: "text",
    //   name: "created_by",
    //   label: "Created By",
    //   className: "form-control-medlarge-col ",
    // },
];

const challanBiltyOriginalTableItems = [
    {
        type: "text",
        name: "bilty_no_suffix",
        label: "Bilty No",
        className: "form-control-medium-col",
    },
    {
        type: "text",
        name: "bilty_date",
        label: "Bilty Date",
        className: "form-control-medium-col",
        convertFunction: (itemObject) => {
            return formatDate(itemObject.bilty_date)
        }
    },
    {
        type: "text",
        name: "station_from_name",
        label: "Station From",
        className: "form-control-medlarge-col",
    },
    // {
    //   type: "text",
    //   name: "station_to_name",
    //   label: "Station To",
    //   className: "form-control-medlarge-col",
    // },
    {
        type: "text",
        name: "destination_name",
        label: "Destination",
        className: "form-control-medlarge-col",
    },
    {
        type: "text",
        name: "eway_bill_info",
        label: "EWay Bills",
        className: "form-control-medlarge-col",
        convertFunction: (obj) => {
            console.log(obj);
            return obj.eway_bill_info.length;
        }
    },
    {
        type: "text",
        name: "pay_type_name",
        label: "Pay Type",
        className: "form-control-medium-col",
        convertFunction: (itemObject) => {
            console.log("Item object pay type", itemObject.pay_type_name)
            if (itemObject.pay_type_name == "To Be Billed") {
                return "TBB"
            }
            else {
                return itemObject.pay_type_name
            }
        }
    },
    {
        type: "text",
        name: "consignor_name",
        label: "Consignor Name",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "consignor_gst",
    //   label: "Consignor Gst",
    //   className: "form-control-large-col",
    // },
    {
        type: "text",
        name: "consignee_name",
        label: "Consignee Name",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "consignee_gst",
    //   label: "Consignee Gst",
    //   className: "form-control-large-col",
    // },
    // {
    //   type: "text",
    //   name: "transporter_freight",
    //   label: "Transporter freight",
    //   className: "form-control-medium-col",
    // },
    {
        type: "text",
        name: "no_of_package",
        label: "No Of Package",
        className: "form-control-small-col",
    },
    // {
    //   type: "text",
    //   name: "actual_weight",
    //   label: "Actual Weight",
    //   className: "form-control-small-col",
    // },
    {
        type: "text",
        name: "charge_weight",
        label: "Charge Weight",
        className: "form-control-small-col",
    },
    {
        type: "text",
        name: "private_marka_no",
        label: "Private Marka No",
        className: "form-control-large-col",
    },
    // {
    //   type: "text",
    //   name: "delivery_dest_type",
    //   label: "Delivery Dest Type",
    //   className: "form-control-medium-col",
    // },
    // {
    //   type: "text",
    //   name: "remarks",
    //   label: "Remarks",
    //   className: "form-control-medium-col",
    // },
    // {
    //   type: "text",
    //   name: "bilty_charge",
    //   label: "Bilty Charge",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "other_amount",
    //   label: "Other Amount",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "freight",
    //   label: "Freight",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "hamali",
    //   label: "Hamali",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "door_del_charge",
    //   label: "Door Del Charge",
    //   className: "form-control-small-col",
    // },
    // {
    //   type: "text",
    //   name: "created_from",
    //   label: "Created From",
    //   className: "form-control-medlarge-col ",
    // },
    // {
    //   type: "text",
    //   name: "created_by",
    //   label: "Created By",
    //   className: "form-control-medlarge-col ",
    // },
];

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
    error_header: "Error In Fleet Management Module ",
    success_header: "Fleet Saving Successful ",
    success_title: "Fleet is successfully created with the following info:-",
    field_label_success: "Fleet No.",
    field_name_success: "fleet_no",
    error_title: "Error in Fleet module with the following info:-",
    field_label_error: "Error:",
};

export {
    groupInfo,
    groupNames,
    dataObject,
    challanBiltyTableHeader,
    challanBiltyTableItems,
    challanBiltyOriginalTableHeader,
    challanBiltyOriginalTableItems,
    popupInfo,
    validate,
    stationFromFieldInfo,
    tripItemHeaders,
    tripItems,
    formatDate,
};
