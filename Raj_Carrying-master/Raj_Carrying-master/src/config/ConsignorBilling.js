import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];
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
  "group-0": [
    {
      label: "Gross Amt",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "gross_amount",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "add",
      },
    }
  ],
  "group-1": [
    {
      label: "Total Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "total_amount",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "add",
      },
    },
    {
      label: "Add(+)",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "add",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "save_button",
      },
    },
    {
      label: "Grand Total",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "net_amount",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "save_button",
      },
    },
  ],
  "group-2": [
    {
        label: "Consignor GST",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "consignor_gst",
        type: "text",
        placeHolder: "",
        apiConfigKey: "getConsignorSuggestions",
        url: SERVER_URL + "/consignor/",
        suggestionKeyword: "consignor_gst",
        suggestionKeywordForFetchApiArgs: "gst",
        suggestionChooseQueryKeyword: "consignor_id",
        suggestionSchema: {
          consignor_name: "consignor_name",
          consignor_gst: "consignor_gst",
          consignor_id: "consignor_id",
        },
        apiCallRequiredOnGetValue: true,
        toValidate: false,
        regExpValidation:
          "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
        keyboardNavigationMap: {
          Enter: "consignee_name",
        },
        idClearanceNeeded: "consignor_id",
      },
      {
        label: "Extra(%)",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input-small",
        name: "extra_percentage",
        type: "text",
        placeHolder: "",
        url: SERVER_URL + "/city/",
        suggestionKeyword: "name",
        backendOnClickName: "station_from",
        suggestionBackendResponseMap: {
          id: "station_from",
        },
        toValidate: false,
        keyboardNavigationMap: {
          Enter: "add",
        },
      },
      {
        label: "Extra Hamali",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input-small",
        name: "extra_hamali",
        type: "text",
        placeHolder: "",
        url: SERVER_URL + "/city/",
        suggestionKeyword: "name",
        backendOnClickName: "station_from",
        toValidate: false,
        keyboardNavigationMap: {
          Enter: "save_button",
        },
      },
      {
        label: "DD Charge",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "door_del_charge",
        type: "text",
        placeHolder: "",
        url: SERVER_URL + "/city/",
        suggestionKeyword: "name",
        backendOnClickName: "station_from",
        toValidate: false,
        keyboardNavigationMap: {
          Enter: "save_button",
        },
      },
      {
        label: "Bilty Charge",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "bilty_charge",
        type: "text",
        placeHolder: "",
        url: SERVER_URL + "/city/",
        suggestionKeyword: "name",
        backendOnClickName: "station_from",
        toValidate: false,
        keyboardNavigationMap: {
          Enter: "save_button",
        },
      },
  ],
};

const dataObject = {
  id:"",
  // bill_no:"",
  consignor_name: "",
  consignor_id: "",
  consignor_gst: "",
  extra_hamali:"",
  extra_percentage:"",
  door_del_charge:"",
  bilty_charge:"",
  gross_amount:"",
  total_amount: "",
  remarks:"",
  bill_no:"",
  description1:"",
  description2:"",
  amt1:"",
  amt2:"",
  id:"",
  add: "",
  net_amount: "",
  bilty_ids: [],
  created_from: "",
  created_by: "",
  input_date: formatDate(new Date()),
  update_date_from: formatDate(new Date()),
  update_date_to: formatDate(new Date()),
  bill_date: formatDate(new Date()),
  consignor_bill_no: "",
  last_consignor_bill_no: "",
  amount: "",
  edit_bill: "",
  send_email: false,
  subject: "",
  email: "",
  cc_email: "",
  cc_emails: "",
  body_start: "",
  body_end: "",
};

const consignorBillingTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Bilty No.", className: "text-center table-header" },
  { label: "Bilty Date", className: "text-center table-header" },
  { label: "Consignor", className: "text-center table-header" },
  { label: "Station", className: "text-center table-header" },
  { label: "Invoice", className: "text-center table-header" },
  { label: "Delivery Type", className: "text-center table-header" },
  { label: "Description", className: "text-center table-header" },
  { label: "D.D.", className: "text-center table-header" },
  { label: "Pkgs", className: "text-center table-header" },
  { label: "Weight in Kgs", className: "text-center table-header" },
  { label: "Rate C/B/Kg", className: "text-center table-header" },
  { label: "Amount Rs.", className: "text-center table-header" },
  // { label: "Actual Weight", className: "text-center table-header" },
  // { label: "Charge Weight", className: "text-center table-header" },
  // { label: "Private Marka No", className: "text-center table-header" },
  // { label: "Goods Invoice Value", className: "text-center table-header" },
  // { label: "Delivery Dest Type", className: "text-center table-header" },
  // { label: "Remarks", className: "text-center table-header" },
  // { label: "Bilty Charge", className: "text-center table-header" },
  // { label: "Other Amount", className: "text-center table-header" },
  // { label: "Freight", className: "text-center table-header" },
  // { label: "Hamali", className: "text-center table-header" },
  // { label: "Door Del Charge", className: "text-center table-header" },
];

const consignorBillingTableItems = [
  {
    type: "text",
    name: "bilty_no_suffix",
    label: "Bilty No",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "bilty_date",
    label: "Bilty Date",
    className: "form-control-medlarge-col",
  //   convertFunction: (itemObject)=>{
  //     return formatDate(itemObject.created_date)
  //   }
  },
  {
    type: "text",
    name: "consignor_name",
    label: "Consignor",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "station_to_name",
    label: "Station",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "private_marka_no",
    label: "Invoice",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "delivery_dest_type",
    label: "Delivery Type",
    className: "form-control-medlargemed-col",
  },
  {
    type: "text",
    name: "item_name",
    label: "Description",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "door_del_charge",
    label: "D.D.",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "pkgs",
    label: "Pkgs",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "weight",
    label: "Weight in Kgs",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "rate",
    label: "Rate C/B/Kg",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "item_amount",
    label: "Amount Rs.",
    className: "form-control-medium-col",
  },
];

function validate(values) {
  let errors = {};

//   function validator(value, regexp) {
//     var regex = new RegExp(regexp);
//     if (values.hasOwnProperty(value)) {
//       if (!values[value].trim()) {
//         errors[value] = "Required Field";
//       } else if (!regex.test(values[value])) {
//         errors[value] = "Validation Error";
//       } else {
//         errors[value] = "";
//       }
//     }
//   }
//   for (let group_name of groupNames) {
//     for (let i = 0; i < groupInfo[group_name].length; i++) {
//       console.log(groupInfo[group_name][i]);
//       let field_object = groupInfo[group_name][i];
//       if (field_object.toValidate) {
//         validator(field_object.name, field_object.regExpValidation);
//       }
//     }
//   }
  return errors;
}

const popupInfo = {
  success_header: "Consignor Bill Saving Successful ",
  error_header: "Error In Consignor Bill Module ",
  success_title: "Consignor Bill is successfully created with the following info:-",
  field_label_success: "Consignor Bill",
  field_name_success: "id",
  error_title: "Error in Consignor Bill module with the following info:-",
  field_label_error: "Error:",
};

export { groupInfo, groupNames, dataObject, validate, popupInfo, consignorBillingTableItems,consignorBillingTableHeader };
