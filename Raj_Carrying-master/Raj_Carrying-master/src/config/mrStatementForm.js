import { SERVER_URL } from "./config";

const groupNames = ["group-1"];

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

const mrStatementDataObject = {
  mr_statement_no: "",
  mr_info_list: [],
  input_date: formatDate(new Date()),
  amount_list: [],
  removed_mr_ids: [],
  created_from: "",
  created_by: "",
  inwarded: "",
};

const mrStatementGroupInfo = {
  "group-1": [
    {
      label: "Mr Count",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_count",
      type: "text",
      placeHolder: "1234",
      apiConfigKey: "getItemSuggestions",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "item_id",
      suggestionKeywordExtra: "description",
      url: SERVER_URL + "/item/",
      suggestionKeyword: "name",
      backendOnClickName: "vehicle_no",
      keyboardNavigationMap: {
        Enter: "no_of_articles",
      },
      toValidate: false,
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        name: "name",
        desc: "description",
        item_id: "item_id",
      },
      idClearanceNeeded: "item_id",
      onChangeIgnoreClearance: ["description"],
    },
    {
      label: "Total Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "total_amount",
      type: "text",
      placeHolder: "1234",
      apiConfigKey: "getItemSuggestions",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "item_id",
      suggestionKeywordExtra: "description",
      url: SERVER_URL + "/item/",
      suggestionKeyword: "name",
      backendOnClickName: "vehicle_no",
      keyboardNavigationMap: {
        Enter: "weight",
      },
      toValidate: false,
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        name: "name",
        desc: "description",
        item_id: "item_id",
      },
      idClearanceNeeded: "item_id",
      onChangeIgnoreClearance: ["description"],
    },
    // {
    //   label: "Weight",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "weight",
    //   type: "text",
    //   placeHolder: "1234",
    //   apiConfigKey: "getItemSuggestions",
    //   suggestionKeywordForFetchApiArgs: "name",
    //   suggestionChooseQueryKeyword: "item_id",
    //   suggestionKeywordExtra: "description",
    //   url: SERVER_URL + "/item/",
    //   suggestionKeyword: "name",
    //   backendOnClickName: "vehicle_no",
    //   keyboardNavigationMap: {
    //     Enter: "freight",
    //   },
    //   toValidate: false,
    //   apiCallRequiredOnGetValue: true,
    //   suggestionSchema: {
    //     name: "name",
    //     desc: "description",
    //     item_id: "item_id",
    //   },
    //   idClearanceNeeded: "item_id",
    //   onChangeIgnoreClearance: ["description"],
    // },
    // {
    //   label: "Freight",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "freight",
    //   type: "text",
    //   placeHolder: "1234",
    //   apiConfigKey: "getItemSuggestions",
    //   suggestionKeywordForFetchApiArgs: "name",
    //   suggestionChooseQueryKeyword: "item_id",
    //   suggestionKeywordExtra: "description",
    //   url: SERVER_URL + "/item/",
    //   suggestionKeyword: "name",
    //   backendOnClickName: "vehicle_no",
    //   keyboardNavigationMap: {
    //     Enter: "save_button",
    //   },
    //   toValidate: false,
    //   apiCallRequiredOnGetValue: true,
    //   suggestionSchema: {
    //     name: "name",
    //     desc: "description",
    //     item_id: "item_id",
    //   },
    //   idClearanceNeeded: "item_id",
    //   onChangeIgnoreClearance: ["description"],
    // },
  ],
};

function mrStatementValidate(values) {
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
    for (let i = 0; i < mrStatementGroupInfo[group_name].length; i++) {
      console.log(mrStatementGroupInfo[group_name][i]);
      let field_object = mrStatementGroupInfo[group_name][i];
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

// const mrStatementTableHeader = [
//   { label: "S. No.", className: "text-center table-header" },
//   { label: "User", className: "text-center table-header" },
//   { label: "Amount", className: "text-center table-header" },
// ];

// const mrStatementTableItems = [
//   {
//     type: "text",
//     name: "user",
//     label: "User",
//     className: "form-control-big-col",
//   },
//   {
//     type: "text",
//     name: "amount",
//     label: "Amount",
//     className: "form-control-large-col",
//   },
// ];

const mrStatementTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "MR No", className: "text-center table-header" },
  { label: "Mr Date", className: "text-center table-header" },
  { label: "To Pay Amount", className: "text-center table-header" },
  { label: "Hamali", className: "text-center table-header" },
  { label: "Service Charge", className: "text-center table-header" },
  { label: "Demarage Charge", className: "text-center table-header" },
  { label: "Other Charge", className: "text-center table-header" },
  { label: "Refund", className: "text-center table-header" },
  { label: "Total Amount", className: "text-center table-header" },
  { label: "Party Name", className: "text-center table-header" },
  { label: "Receiver Name", className: "text-center table-header" },
  { label: "Delivery On", className: "text-center table-header" },
  
  { label: "Cheque No", className: "text-center table-header" },
  { label: "Lorry Rate", className: "text-center table-header" },
  { label: "Marfatiya", className: "text-center table-header" },
  { label: "Remarks", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
  { label: "Created From", className: "text-center table-header" },
];

const mrStatementTableItems = [
  {
    type: "text",
    name: "mr_no",
    label: "Bilty No",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "mr_date",
    label: "MR Date",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "to_pay_amount",
    label: "To Pay Amount",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "hamali",
    label: "Hamali",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "service_charge",
    label: "Service Charge",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "demerage_charge",
    label: "Consignor Gst",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "other_charge",
    label: "Consignee Gst",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "refund",
    label: "Refund",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "total_amount",
    label: "Remarks",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "party_name",
    label: "Bilty Date",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "receiver_name",
    label: "Station From",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "delivery_on",
    label: "Consignor Name",
    className: "form-control-large-col",
  },

  {
    type: "text",
    name: "cheque_no",
    label: "Station To",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "lorry_rate",
    label: "No Of Package",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "marfatiya",
    label: "Actual Weight",
    className: "form-control-medium-col",
  },


  {
    type: "text",
    name: "remarks",
    label: "Goods Invoice Value",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "created_by_name",
    label: "Destination",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "created_from_name",
    label: "Pay Type",
    className: "form-control-medium-col",
  },
];

// const mrValidations =  {
//   mr_id: yup.number({"mr_id": "Bilty should be string"}),
// }
export {
  groupNames,
  mrStatementGroupInfo,
  mrStatementDataObject,
  mrStatementValidate,
  mrStatementTableHeader,
  mrStatementTableItems,
};
