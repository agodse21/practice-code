import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const groupInfo = {
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
      label: "Add",
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
        Enter: "remarks",
      },
    },
    {
      label: "Net Amount",
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
      label: "Remarks",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "remarks",
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
        Enter: "save_button",
      },
      idClearanceNeeded: "consignor_id",
    },
  ],
};

const crossingInHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Crossing Challan No.", className: "text-center table-header" },
  { label: "Challan Date", className: "text-center table-header" },
  // { label: "Station From", className: "text-center table-header" },
  // { label: "Station To", className: "text-center table-header" },
  { label: "Our Freight", className: "text-center table-header" },
  { label: "To Pay", className: "text-center table-header" },
  { label: "Door Del. charge", className: "text-center table-header" },
  { label: "Packages", className: "text-center table-header" },
  { label: "Balance", className: "text-center table-header" },
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
  { label: "Created From", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
];

const crossingInTableItems = [
  {
    type: "text",
    name: "crossing_inward_no",
    label: "Crossing Challan No",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "crossing_inward_date",
    label: "Date",
    className: "form-control-medlarge-col",
  },
  // {
  //   type: "text",
  //   name: "station_to_name",
  //   label: "Station To",
  //   className: "form-control-large-col",
  // },
  {
    type: "text",
    name: "freight",
    label: "Our Freight",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "to_pay",
    label: "To Pay",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "door_del_charge",
    label: "Door Del. Charge",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "no_of_package",
    label: "Packages",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "balance",
    label: "Balance",
    className: "form-control-medlarge-col",
  },
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

const crossingOutHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Crossing Challan No.", className: "text-center table-header" },
  { label: "Challan Date", className: "text-center table-header" },
  // { label: "Station From", className: "text-center table-header" },
  { label: "Station To", className: "text-center table-header" },
  { label: "Our Freight", className: "text-center table-header" },
  { label: "To Pay", className: "text-center table-header" },
  { label: "Door Del. charge", className: "text-center table-header" },
  { label: "Packages", className: "text-center table-header" },
  { label: "Balance", className: "text-center table-header" },
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
  { label: "Created From", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
];

const crossingOutTableItems = [
  {
    type: "text",
    name: "crossing_outward_no",
    label: "Crossing Challan No",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "crossing_outward_date",
    label: "Date",
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
    name: "freight",
    label: "Our Freight",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "to_pay",
    label: "To Pay",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "door_del_charge",
    label: "Door Del. Charge",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "no_of_package",
    label: "Packages",
    className: "form-control-medlarge-col",
  },
    {
      type: "text",
      name: "balance",
      label: "Balance",
      className: "form-control-medlarge-col",
    },
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

const dataObject = {
  transporter_name: "",
  transporter_id: "",
  total_amount: "",
  remarks: "",
  id: "",
  add: "",
  net_amount: "",
  crossing_info: [],
  created_from: "",
  created_by: "",
  input_date: formatDate(new Date()),
  bill_no: "",
  last_consignor_bill_no: "",
  amount: "",
  type: "1",
  date_to: formatDate(new Date()),

};

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
  success_header: "Crossing Bill Saving Successful ",
  error_header: "Error In Crossing Bill Module ",
  success_title:
    "Crossing Bill is successfully created with the following info:-",
  field_label_success: "Crossing Bill",
  field_name_success: "bill_no",
  error_title: "Error in Crossing Bill module with the following info:-",
  field_label_error: "Error:",
};

export {
  groupInfo,
  groupNames,
  dataObject,
  validate,
  popupInfo,
  crossingInHeader,
  crossingInTableItems,
  crossingOutHeader,
  crossingOutTableItems,
};
