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
      suggestionChooseQueryKeyword: "vehicle_no",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        driver_name: "driver_name",
        owner_name: "owner_name",
        license_no: "license_no",
        mobile_no: "mobile_no",
      },
      keyboardNavigationMap: {
        Enter: "station_from_name",
      },
      toValidate: true,
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "vehicle_id",
    },
    {
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
        branch_id: "station_to",
        name: "station_to_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "destination_name",
      },
    },
    {
      label: "Destination",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "destination_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        branch_id: "destination",
        name: "destination_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "owner_name",
      },
    },
  ],
  "group-2": [
    {
      label: "Owner Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "owner_name",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
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
      url: SERVER_URL + "/city/",
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
        Enter: "remarks",
      },
    },
    {
      label: "Licence No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "license_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        driver_name: "driver_name",
        owner_name: "owner_name",
      },
      // toValidate: true,
      // regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "remarks",
      },
    },
    {
      label: "Remarks",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "remarks",
      type: "text",
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "bilty_type",
      },
    },
    {
      label: "CWB No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "cewb_no",
      type: "text",
      placeHolder: "",
    },
  ],
};

const dataObject = {
  mail_type : "0",
  subject: "",
  body_start: "",
  body_end: "",
};

const jvHeaders = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Dr. Code", className: "text-center table-header" },
  { label: "Debit Account Name", className: "text-center table-header" },
  { label: "Cr. Code", className: "text-center table-header" },
  { label: "Credit Account Name", className: "text-center table-header" },
  { label: "Amount", className: "text-center table-header" },
  { label: "Remarks", className: "text-center table-header" },
];

const jvItems = [
  {
    type: "text",
    name: "consignor_id",
    label: "Dr. Code",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "consignor_name",
    label: "Debit Account Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "consignee_id",
    label: "Cr. Code",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "consignee_name",
    label: "Credit Account Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "amount",
    label: "Amount",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "remarks",
    label: "Remarks",
    className: "form-control-medium-col",
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
      let field_object = groupInfo[group_name][i];
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

const popupInfo = {
  error_header: "Error In Module ",
  success_header: "Saving Successful ",
  success_title: "Successfully created with the following info:-",
  field_label_success: "No.",
  field_name_success: "id",
  error_title: "Error in module with the following info:-",
  field_label_error: "Error:",
};

export {
  groupInfo,
  groupNames,
  dataObject,
  jvHeaders,
  jvItems,
  popupInfo,
  validate,
};
