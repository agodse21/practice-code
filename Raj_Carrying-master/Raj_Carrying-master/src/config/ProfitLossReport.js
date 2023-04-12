
import { SERVER_URL } from "./config";

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

// const groupNames = ["group-1", "group-2", "group-3"];

// const groupInfo = {
//   "group-1": [
//     {
//       label: "Party Name",
//       className: "form-row",
//       labelClassName: "form-label",
//       inputClassName: "form-input",
//       name: "consignor_name",
//       type: "text",
//       placeHolder: "",
//       apiConfigKey: "getConsignorSuggestions",
//       url: SERVER_URL + "/consignor/",
//       suggestionKeyword: "consignor_name",
//       suggestionKeywordExtra: "consignor_gst",
//       suggestionKeywordForFetchApiArgs: "name",
//       suggestionChooseQueryKeyword: "consignor_id",
//       suggestionSchema: {
//         consignor_name: "consignor_name",
//         consignor_gst: "consignor_gst",
//         consignor_id: "consignor_id",
//       },
//       apiCallRequiredOnGetValue: true,
//       toValidate: true,
//       regExpValidation: "[a-zA-z]",
//       keyboardNavigationMap: {
//         Enter: "consignor_gst",
//       },
//       idClearanceNeeded: "consignor_id",
//       inputDataNeededInSuggestions: false,
//       inputDataFilter: {
//         pay_type: "same",
//       },
//     },
//   ],
//   "group-2": [
//     {
//       label: "Party GST",
//       className: "form-row",
//       labelClassName: "form-label",
//       inputClassName: "form-input",
//       name: "consignor_gst",
//       type: "text",
//       placeHolder: "",
//       apiConfigKey: "getConsignorSuggestions",
//       url: SERVER_URL + "/consignor/",
//       suggestionKeyword: "consignor_gst",
//       suggestionKeywordForFetchApiArgs: "gst",
//       suggestionChooseQueryKeyword: "consignor_id",
//       suggestionSchema: {
//         consignor_name: "consignor_name",
//         consignor_gst: "consignor_gst",
//         consignor_id: "consignor_id",
//       },
//       apiCallRequiredOnGetValue: true,
//       toValidate: false,
//       regExpValidation:
//         "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
//       keyboardNavigationMap: {
//         Enter: "station_from_name",
//       },
//       idClearanceNeeded: "consignor_id",
//     },
//   ],
// };

const groupInfo = {
    "branches": [
        { key: 1, branch_name: "Ahmedabad" },
        { key: 2, branch_name: "Narol" },
        { key: 3, branch_name: "Sarkhej" },
        { key: 4, branch_name: "Bhavnagar" },
        { key: 5, branch_name: "Mehsana" },
        { key: 6, branch_name: "Junagadh" },
        { key: 7, branch_name: "Aslali" },
        { key: 8, branch_name: "Bardoli" },
        { key: 9, branch_name: "Rajkot" },
        { key: 10, branch_name: "Morbi" },
        { key: 11, branch_name: "Ankleshwar" },
        { key: 12, branch_name: "Bilimora" },
        { key: 13, branch_name: "Kamrej" },
        { key: 14, branch_name: "Himmatnagar" },
        { key: 15, branch_name: "Palanpur" },
        { key: 16, branch_name: "Vadodara" },
        { key: 17, branch_name: "Patan" },
        { key: 18, branch_name: "Dasrath" },
        { key: 19, branch_name: "Gandhidham" },
        { key: 20, branch_name: "Surat" },
        { key: 21, branch_name: "Vapi" },
        { key: 22, branch_name: "Navsari" },
        { key: 23, branch_name: "Anand" },
        { key: 24, branch_name: "Bharuch" },
        { key: 25, branch_name: "Nadiad" },
        { key: 26, branch_name: "Unjha" },
        { key: 39, branch_name: "Bhuj" },
        { key: 28, branch_name: "Valsad" },
        { key: 29, branch_name: "Gondal" },
        { key: 30, branch_name: "Deesa" },
        { key: 31, branch_name: "Surendranagar" },
        { key: 32, branch_name: "Bhivandi" },
        { key: 33, branch_name: "Jamnagar" },
        { key: 34, branch_name: "Navagam" },
        { key: 168, branch_name: "Daman" },
        { key: 579, branch_name: "Silvasa" },
        { key: 628, branch_name: "Umergaon" },
    ],
}

const comp = (a, b) => {
    return a.branch_name.localeCompare(b.branch_name);
}

let tmp = groupInfo["branches"];
tmp.sort(comp);

// const fyearObj = getLoggedinFyear();

const dataObject = {
  consignor_name: "",
  consignor_gst: "",
  consignor_id: "",
  station_from: "",
  station_from_name: "",
  station_to: "",
  station_to_name: "",
  item_name: "",
  item_id: "",
  rate: "",
//   date_from: new Date("2021-04-01"),
//   date_from: fyearObj.start_fyear,
//   date_to: new Date("2022-03-31"),
//   date_to: fyearObj.end_fyear,
  report: [],
  report_type: "pl",
  party_name: "",
  party_id: "",
  transporter_id: "",
  unit: "c",
  rate_info: [],
  bilty_ids: [],
  created_from: "",
  created_by: "",
  input_date: new Date(),
  opening_balance: false,
};

function validate(values) {
  let errors = {};

  // function validator(value, regexp) {
  //   var regex = new RegExp(regexp);
  //   if (values.hasOwnProperty(value)) {
  //     if (!values[value].trim()) {
  //       errors[value] = "Required Field";
  //     } else if (!regex.test(values[value])) {
  //       errors[value] = "Validation Error";
  //     } else {
  //       errors[value] = "";
  //     }
  //   }
  // }
  // for (let group_name of groupNames) {
  //   for (let i = 0; i < groupInfo[group_name].length; i++) {
  //     console.log(groupInfo[group_name][i]);
  //     let field_object = groupInfo[group_name][i];
  //     if (field_object.toValidate) {
  //       validator(field_object.name, field_object.regExpValidation);
  //     }
  //   }
  // }
  return errors;
}

const partyRateTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Date", className: "text-center table-header" },
  { label: "Vou. No", className: "text-center table-header" },
  { label: "Vou. Type", className: "text-center table-header" },
  { label: "Account Name", className: "text-center table-header" },
  { label: "Description", className: "text-center table-header" },
  { label: "Cheque No.", className: "text-center table-header" },
  { label: "Debit", className: "text-center table-header" },
  { label: "Credit", className: "text-center table-header" },
  { label: "Balance", className: "text-center table-header" },
  { label: "Balance Type", className: "text-center table-header" },
  // { label: "Created From", className: "text-center table-header" },
];


const partyRateTableHeaderExcel = [
  { label: "Vou. No", className: "text-center table-header" },
  { label: "Vou. Type", className: "text-center table-header" },
  { label: "Description", className: "text-center table-header" },
  { label: "Cheque No.", className: "text-center table-header" },
  { label: "Debit", className: "text-center table-header" },
  { label: "Credit", className: "text-center table-header" },
  { label: "Balance", className: "text-center table-header" },
  { label: "Balance Type", className: "text-center table-header" },
  // { label: "Created From", className: "text-center table-header" },
];

const partyRateTableItems = [
  {
    type: "text",
    name: "date",
    label: "Date",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "voucher_id",
    label: "Vou. No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "voucher_type",
    label: "Vou. Type",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "party_name",
    label: "Account Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "remarks",
    label: "Description",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "cheque_no",
    label: "Cheque No.",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "debit",
    label: "Debit",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "credit",
    label: "Credit",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "balance",
    label: "Balance",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "balance_type",
    label: "Balance Type",
    className: "form-control-small-col",
  },

  // {
  //   type: "text",
  //   name: "created_from",
  //   label: "Created From",
  //   className: "form-control-large-col",
  // },
];

const partyRateTableItemsExcel = [
  {
    type: "text",
    name: "voucher_id",
    label: "Vou. No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "voucher_type",
    label: "Vou. Type",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "remarks",
    label: "Description",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "cheque_no",
    label: "Cheque No.",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "debit",
    label: "Debit",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "credit",
    label: "Credit",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "balance",
    label: "Balance",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "balance_type",
    label: "Balance Type",
    className: "form-control-small-col",
  },

  // {
  //   type: "text",
  //   name: "created_from",
  //   label: "Created From",
  //   className: "form-control-large-col",
  // },
];

const popupInfo = {
  error_header: "Error In Party Rate Module ",
  success_header: "Party Rate Saving Successful ",
  success_title: "Party Rate is successfully created",
  field_label_success: "",
  field_name_success: "",
  error_title: "Error in Party Rate module with the following info:-",
  field_label_error: "Error:",
};

export {
  //   groupInfo,
  partyRateTableHeaderExcel,
  partyRateTableHeader,
  partyRateTableItems,
  partyRateTableItemsExcel,
  //   groupNames,
  dataObject,
  validate,
  popupInfo,
  groupInfo,
};
