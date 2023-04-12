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

  return [day, month, year].join('-');
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
        // license_no: "license_no",
        phone_no: "phone_no",
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
        Enter: "bilty_no",
      },
    },
  ],
  "group-2": [
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
  bilty_ids: [],
  driver_name: "",
  license_no: "",
  phone_no:"",
  owner_name: "",
  challan_no: "",
  input_date: new Date(),
  status: "",
  No: "",
  suffix: "",
  bilty_type: "D",
  cewb_no: "",
  last_challan_no: "",
  is_inwarded: "",
  manual_no: "",
  multiple_popup: "0",
  multiple_popup_data: [],
  total_bilty: "0",
  total_pkgs: "0",
  total_weight: "0",
  total_eway: "0",
  trip_no: "",
  eway_no: "",
  eway_nos: [],
};

const separateEwbTableHeaders = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Eway Bill No.", className: "text-center table-header" },
    { label: "Bilty No.", className: "text-center table-header" },
    { label: "Bilty Date", className: "text-center table-header" },
    { label: "Mr No.", className: "text-center table-header" },
    // { label: "Mr No.", className: "text-center table-header" },
    { label: "Consignor Name", className: "text-center table-header" },
    { label: "Consignee Name", className: "text-center table-header" },
    // { label: "No Of Package", className: "text-center table-header" },
    // { label: "Total Amount", className: "text-center table-header" },
    { label: "Invoice No.", className: "text-center table-header" },
    { label: "Invoice Value", className: "text-center table-header" },
    { label: "Total Amount", className: "text-center table-header" },
];


const separateEwbTableItems = [
  {
    type: "text",
    name: "eway_bill_no",
    label: "Eway Bill No",
    className: "form-control-medium-col",
    convertFunction: (itemObject)=>{
        return (itemObject.eway_bill_info[0].eway_bill_no);
    }
  },
  {
    type: "text",
    name: "bilty_no",
    label: "Bilty No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "bilty_date",
    label: "Bilty Date",
    className: "form-control-medium-col",
    convertFunction: (itemObject)=>{
      return formatDate(itemObject.bilty_date)
    }
  },
  {
    type: "text",
    name: "mr_no",
    label: "Mr No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "consignor_name",
    label: "Consignor Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "consignee_name",
    label: "Consignee Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "invoice_no",
    label: "Invoice No",
    className: "form-control-medium-col",
    convertFunction: (itemObject)=>{
        return (itemObject.eway_bill_info[0].invoice_no);
    }
  },
  {
    type: "text",
    name: "invoice_value",
    label: "Invoice Value",
    className: "form-control-medium-col",
    convertFunction: (itemObject)=>{
        return (itemObject.eway_bill_info[0].invoice_value);
    }
  },
  {
    type: "text",
    name: "total_amount",
    label: "Total Amount",
    className: "form-control-small-col",
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
  error_header: "Error In Challan Module ",
  success_header: "Challan Saving Successful ",
  success_title: "Challan is successfully created with the following info:-",
  field_label_success: "Challan No.",
  field_name_success: "challan_no",
  error_title: "Error in Challan module with the following info:-",
  field_label_error: "Error:",
};

export {
  groupInfo,
  groupNames,
  dataObject,
  separateEwbTableHeaders,
  separateEwbTableItems,
  popupInfo,
  validate,
};
