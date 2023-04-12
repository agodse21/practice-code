import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const groupInfo = {
  "group-1": [
    {
      label: "Party Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignor_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsignorSuggestions",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "consignor_name",
      suggestionKeywordExtra: "consignor_gst",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "consignor_id",
      suggestionSchema: {
        consignor_name: "consignor_name",
        consignor_gst: "consignor_gst",
        consignor_id: "consignor_id",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "consignor_gst",
      },
      idClearanceNeeded: "consignor_id",
      inputDataNeededInSuggestions: false,
      inputDataFilter: {
        pay_type: "same",
      },
    },
  ],
  "group-2": [
    {
      label: "Party GST",
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
        Enter: "station_from_name",
      },
      idClearanceNeeded: "consignor_id",
    },
  ],
};

const dataObject = {
  consignor_name: "",
  consignor_gst: "",
  consignor_id: "",
  consignee_name: "",
  consignee_gst: "",
  consignee_id: "",
  station_from: "",
  station_from_name: "",
  station_to: "",
  station_to_name: "",
  other_station_from: "",
  other_station_from_name: "",
  other_station_to: "",
  other_station_to_name: "",
  item_name: "",
  item_id: "",
  other_item_name: "",
  other_item_id: "",
  rate: "",
  unit: "c",
  rate_info: [],
  charge_info: [],
  bilty_ids: [],
  created_from: "",
  created_by: "",
  commission: "",
  refund: "",
  input_date: new Date(),
  charge: "1",
  charge_type: "1",
  from_w: "",
  // qty_from_kg:"",
  from_c: "",
  to_w: "",
  to_c: "",
  amount: "",
  truck_size: "9mt",
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
  { label: "Station From", className: "text-center table-header" },
  { label: "Station To", className: "text-center table-header" },
  { label: "Item Name", className: "text-center table-header" },
  { label: "Unit", className: "text-center table-header" },
  { label: "Truck Size", className: "text-center table-header" },
  { label: "Rate", className: "text-center table-header" },
  { label: "Commission", className: "text-center table-header" },
  // { label: "Refund", className: "text-center table-header" },
  // { label: "Station To", className: "text-center table-header" },
  // { label: "Destination", className: "text-center table-header" },
  //   { label: "Pay Type", className: "text-center table-header" },
  //   { label: "Consignor Name", className: "text-center table-header" },
  //   { label: "Consignor Gst", className: "text-center table-header" },
  //   { label: "Consignee Name", className: "text-center table-header" },
  //   { label: "Consignee Gst", className: "text-center table-header" },
  //   { label: "No Of Package", className: "text-center table-header" },
  //   { label: "Actual Weight", className: "text-center table-header" },
  //   { label: "Charge Weight", className: "text-center table-header" },
  //   { label: "Packing Type", className: "text-center table-header" },
  //   { label: "Private Marka No", className: "text-center table-header" },
  //   { label: "Goods Invoice Value", className: "text-center table-header" },
  //   { label: "Delivery Dest Type", className: "text-center table-header" },
  //   { label: "Remarks", className: "text-center table-header" },
  //   { label: "Bilty Charge", className: "text-center table-header" },
  //   { label: "Other Amount", className: "text-center table-header" },
  //   { label: "Freight", className: "text-center table-header" },
  //   { label: "Hamali", className: "text-center table-header" },
  //   { label: "Door Del Charge", className: "text-center table-header" },
  // { label: "Created From", className: "text-center table-header" },
  // { label: "Created By", className: "text-center table-header" },
];

const partyRateTableItems = [
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "station_to_name",
    label: "Station To",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "item_name",
    label: "Item Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "unit",
    label: "Unit",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "truck_size",
    label: "Truck Size",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "rate",
    label: "Rate",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "commission",
    label: "Commission",
    className: "form-control-medium-col",
  },
  // {
  //   type: "text",
  //   name: "refund",
  //   label: "Refund",
  //   className: "form-control-large-col",
  // },
  // {
  //   type: "text",
  //   name: "station_to_name",
  //   label: "Station To",
  //   className: "form-control-large-col",
  // },
  // {
  //   type: "text",
  //   name: "destination_name",
  //   label: "Destination",
  //   className: "form-control-large-col",
  // },
  //   {
  //     type: "text",
  //     name: "pay_type",
  //     label: "Pay Type",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignor_name",
  //     label: "Consignor Name",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignor_gst",
  //     label: "Consignor Gst",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignee_name",
  //     label: "Consignee Name",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignee_gst",
  //     label: "Consignee Gst",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "no_of_package",
  //     label: "No Of Package",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "actual_weight",
  //     label: "Actual Weight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "charge_weight",
  //     label: "Charge Weight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "packing_type",
  //     label: "Packing Type",
  //     className: "form-control-large-col",
  //   },
  //   {
  //     type: "text",
  //     name: "private_marka_no",
  //     label: "Private Marka No",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "goods_invoice_value",
  //     label: "Goods Invoice Value",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "delivery_dest_type",
  //     label: "Delivery Dest Type",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "remarks",
  //     label: "Remarks",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "bilty_charge",
  //     label: "Bilty Charge",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "other_amount",
  //     label: "Other Amount",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "freight",
  //     label: "Freight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "hamali",
  //     label: "Hamali",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "door_del_charge",
  //     label: "Door Del Charge",
  //     className: "form-control-small-col",
  //   },
  // {
  //   type: "text",
  //   name: "created_from",
  //   label: "Created From",
  //   className: "form-control-medium-col",
  // },
  // {
  //   type: "text",
  //   name: "created_by",
  //   label: "Created By",
  //   className: "form-control-medium-col",
  // },
];

const otherRateTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  { label: "Station To", className: "text-center table-header" },
  { label: "Consignee Name", className: "text-center table-header" },
  { label: "Item Name", className: "text-center table-header" },
  { label: "Charge Type", className: "text-center table-header" },
  { label: "Apply Type", className: "text-center table-header" },
  { label: "From(Carton)", className: "text-center table-header" },
  { label: "To(Carton)", className: "text-center table-header" },
  { label: "From(Weight)", className: "text-center table-header" },
  { label: "To(Weight)", className: "text-center table-header" },
  { label: "Amount", className: "text-center table-header" },  
];

const otherRateTableItems = [
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "station_to_name",
    label: "Station To",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "consignee_name",
    label: "Station To",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "item_name",
    label: "Item Name",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "charge_name",
    label: "Charge",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "charge_type_name",
    label: "Charge Type",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "qty_from_case",
    label: "From(c)",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "qty_to_case",
    label: "To(c)",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "qty_from_kg",
    label: "From(w)",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "qty_to_kg",
    label: "To(w)",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "amount",
    label: "Amount",
    className: "form-control-small-col",
  },
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
  groupInfo,
  partyRateTableHeader,
  partyRateTableItems,
  otherRateTableHeader,
  otherRateTableItems,
  groupNames,
  dataObject,
  validate,
  popupInfo,
};
