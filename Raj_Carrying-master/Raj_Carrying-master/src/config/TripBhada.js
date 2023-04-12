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
      label: "Vehicle No.",
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
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        driver_name: "driver_name",
        owner_name: "owner_name",
      },
      suggestionChooseQueryKeyword: "vehicle_no",
      apiCallRequiredOnGetValue: true,
      keyboardNavigationMap: {
        Enter: "receiver_name",
      },
      toValidate: true,
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "vehicle_id",
    },
    {
      label: "Owner Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "owner_name",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        driver_name: "driver_name",
        owner_name: "owner_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "driver_name",
      },
    },
    {
      label: "Driver Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "driver_name",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        driver_name: "driver_name",
        owner_name: "owner_name",
      },
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bhada_remarks",
      },
    },
    {
      label: "Receiver Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "receiver_name",
      type: "text",
      placeHolder: "",
      // url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "payment_type",
      },
    },
  ],
  "group-2": [
    {
      label: "Amount To Pay",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "net_balance",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "payment_type",
      },
    },
    {
      label: "Payment Mode",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "payment_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "Cash" },
        { value: "2", label: "Cheque" },
      ],
      placeHolder: "",
      backendOnClickName: "packing_type",
      keyboardNavigationMap: {
        Enter: "bhada_remarks",
      },
    },
    {
      label: "Remarks",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "bhada_remarks",
      type: "text",
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "payable_declaration",
      },
    },
    {
      label: "Paid At",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "bhada_paid_branch_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionSchema: {
        branch_id: "payable_branch",
        name: "payable_branch_name",
      },
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      apiCallRequiredOnGetValue: true,
      suggestionChooseQueryKeyword: "branch_id",
      keyboardNavigationMap: {
        Enter: "payable_declaration",
      },
    },
    {
        label: "Declaration",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "payable_declaration",
        type: "dropdown",
        dropdown_items: [
          { value: "0", label: "No" },
          { value: "1", label: "Yes" },
        ],
        placeHolder: "",
        backendOnClickName: "packing_type",
        keyboardNavigationMap: {
          Enter: "save_button",
        },
      },
  ],
};

const dataObject = {
  station_from: "",
  station_to: "",
  destination: "",
  station_from_name: "",
  station_to_name: "",
  destination_name: "",
  vehicle_id: "",
  vehicle_no: "",
  created_from: "",
  remarks: "",
  created_by: "",
  challan_ids: [],
  driver_name: "",
  owner_name: "",
  trip_no: "",
  status: "",
  amount: "",
  advance_bhada: "",
  balance_bhada: "",
  No: "",
  input_date: new Date(),
  last_trip_no: "",
  payable_branch: "",
  payable_branch_name: "",
  trip_info: [],
  receiver_name: "",
  bhada_remarks: "",
  payment_type: "",
  is_bhada_paid: false,
  module_trip_bhada: true,
  bhada_paid_date: formatDate(new Date()),
  balance_bhada: "",
  bhada_paid_branch_name: "",
  net_balance: "",
  payable_declaration: "0",
};

const tripBhadaTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Trip No.", className: "text-center table-header" },
  { label: "Trip Date", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  { label: "Station To", className: "text-center table-header" },
  { label: "Remaining Amount", className: "text-center table-header" },
  { label: "Created From", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
];

const tripBhadaTableItems = [
  {
    type: "text",
    name: "trip_no",
    label: "Trip No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "trip_date",
    label: "Trip Date",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "station_to_name",
    label: "Station To",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "balance_bhada",
    label: "Remaining Amount",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "created_from",
    label: "Created From",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "created_by",
    label: "Created By",
    className: "form-control-medlarge-col",
  },
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
  success_header: "Trip Bhada Saving Successful ",
  error_header: "Error In Trip Bhada Module ",
  success_title: "Trip Bhada is successfully created with the following info:-",
  field_label_success: "Trip Bhada No.",
  field_name_success: "trip_bhada_no",
  error_title: "Error in Trip Bhada module with the following info:-",
  field_label_error: "Error:",
};

export {
  groupInfo,
  groupNames,
  dataObject,
  tripBhadaTableHeader,
  tripBhadaTableItems,
  validate,
  popupInfo,
};
