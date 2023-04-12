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

const biltyStatementDataObject = {
  paid_statement_no: "",
  bilty_info_list: [],
  input_date: formatDate(new Date()),
  amount_list: [],
  removed_bilty_ids: [],
  created_from: "",
  created_by: "",
  total_amount:"",
  inwarded: "",
  id: "",
};

const biltyStatementGroupInfo = {
  "group-1": [
    {
      label: "Bilty Count",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "bilty_count",
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
      label: "No Of Articles",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "no_of_articles",
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
    {
      label: "Weight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "weight",
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
        Enter: "freight",
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
        Enter: "save_button",
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
  ],
};

function biltyStatementValidate(values) {
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
    for (let i = 0; i < biltyStatementGroupInfo[group_name].length; i++) {
      console.log(biltyStatementGroupInfo[group_name][i]);
      let field_object = biltyStatementGroupInfo[group_name][i];
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

const biltyStatementTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "User", className: "text-center table-header" },
  { label: "Amount", className: "text-center table-header" },
];

const biltyStatementTableItems = [
  {
    type: "text",
    name: "user",
    label: "User",
    className: "form-control-big-col",
  },
  {
    type: "text",
    name: "amount",
    label: "Amount",
    className: "form-control-large-col",
  },
];

const challanBiltyTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Bilty No.", className: "text-center table-header" },
  { label: "Bilty Date", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  // { label: "Station To", className: "text-center table-header" },
  { label: "Destination", className: "text-center table-header" },
  { label: "Amount", className: "text-center table-header" },
  { label: "Consignor Name", className: "text-center table-header" },
  // { label: "Consignor Gst", className: "text-center table-header" },
  { label: "Consignee Name", className: "text-center table-header" },
  // { label: "Consignee Gst", className: "text-center table-header" },
  { label: "No Of Package", className: "text-center table-header" },
  // { label: "Actual Weight", className: "text-center table-header" },
  { label: "Charge Weight", className: "text-center table-header" },
  { label: "Private Marka No", className: "text-center table-header" },
  // { label: "Goods Invoice Value", className: "text-center table-header" },
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
    // convertFunction: (itemObject)=>{
    //   return formatDate(itemObject.created_date)
    // }
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
    name: "total_amount",
    label: "Amount",
    className: "form-control-medium-col",
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
  //   name: "goods_invoice_value",
  //   label: "Goods Invoice Value",
  //   className: "form-control-small-col",
  // },
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

// const biltyValidations =  {
//   bilty_id: yup.number({"bilty_id": "Bilty should be string"}),
// }
export {
  groupNames,
  biltyStatementGroupInfo,
  biltyStatementDataObject,
  biltyStatementValidate,
  biltyStatementTableHeader,
  biltyStatementTableItems,
  challanBiltyTableItems,
  challanBiltyTableHeader,
};
