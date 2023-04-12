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
  "group-1": [
    {
      label: "Transporter Freight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "transporter_freight",
      type: "text",
      dropdown_items: [
        { value: "0", label: " " },
        { value: "1", label: "Without LR" },
        { value: "2", label: "Due" },
        { value: "3", label: "On letter pad" },
        { value: "4", label: "Not applicable" },
        { value: "5", label: "ccr" },
      ],
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "to_pay",
      },
    },
    {
      label: "To Pay",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "to_pay",
      type: "text",
      dropdown_items: [
        { value: "0", label: " " },
        { value: "1", label: "Without LR" },
        { value: "2", label: "Due" },
        { value: "3", label: "On letter pad" },
        { value: "4", label: "Not applicable" },
        { value: "5", label: "ccr" },
      ],
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "paid",
      },
    },
    {
      label: "Paid",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "paid",
      type: "text",
      dropdown_items: [
        { value: "0", label: " " },
        { value: "1", label: "Without LR" },
        { value: "2", label: "Due" },
        { value: "3", label: "On letter pad" },
        { value: "4", label: "Not applicable" },
        { value: "5", label: "ccr" },
      ],
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "our_freight",
      },
    },
    {
      label: "RCC Crossing",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "our_freight",
      type: "text",
      dropdown_items: [
        { value: "0", label: " " },
        { value: "1", label: "Without LR" },
        { value: "2", label: "Due" },
        { value: "3", label: "On letter pad" },
        { value: "4", label: "Not applicable" },
        { value: "5", label: "ccr" },
      ],
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
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
      dropdown_items: [
        { value: "0", label: " " },
        { value: "1", label: "Without LR" },
        { value: "2", label: "Due" },
        { value: "3", label: "On letter pad" },
        { value: "4", label: "Not applicable" },
        { value: "5", label: "ccr" },
      ],
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_from",
      suggestionBackendResponseMap: {
        id: "station_from",
      },
      toValidate: false,
      keyboardNavigationMap: {
        Enter: "pkgs",
      },
    },

  ],
  "group-2": [
    {
      label: "Total Pkgs",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pkgs",
      type: "text",
      placeHolder: "",
      backendOnClickName: "no_of_package",
      toValidate: false,
      regExpValidation: "^(?:[1-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "crossing_bill_no",
      },
    },
    {
      label: "Crossing Bill No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_bill_no",
      type: "text",
      dropdown_items: [
        { value: "1", label: "Cash" },
        { value: "2", label: "Cheque" },
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
    "crossing_in_no": "",
    "transporter_name": "",
    "transporter_id": "0",
    "transporter_freight": "",
    "our_freight": "",
    "pkgs": "",
    "balance": "",
    "bilty_ids": [
    ],
    "created_from": "",
    "created_by": "",
    "round_off": "",
    "to_pay": "",
    "paid": "",
    input_date: formatDate(new Date()),
    last_mr_no: "",
    crossing_bill_no: "",
    last_crossing_no: "",
    id: "",
}


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
  { label: "Item Name", className: "text-center table-header" },
  // { label: "Consignee Gst", className: "text-center table-header" },
  { label: "RCC Crossing", className: "text-center table-header" },
  { label: "Transporter Freight", className: "text-center table-header" },
  { label: "No Of Package", className: "text-center table-header" },
  
  { label: "Charge Weight", className: "text-center table-header" },
  // { label: "Private Marka No", className: "text-center table-header" },
  
  // { label: "Delivery Dest Type", className: "text-center table-header" },
  
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
    name: "created_date",
    label: "Bilty Date",
    className: "form-control-medium-col",
    convertFunction: (itemObject)=>{
      return formatDate(itemObject.created_date)
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
    convertFunction: (itemObject)=>{
      console.log("Item object pay type", itemObject.pay_type_name)
      if (itemObject.pay_type_name == "To Be Billed"){
        return "TBB"
      }
      else{
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
  {
    type: "text",
    name: "item_name",
    label: "Item Name",
    className: "form-control-medium-col",
  },
  // {
  //   type: "text",
  //   name: "consignee_gst",
  //   label: "Consignee Gst",
  //   className: "form-control-large-col",
  // },
  {
    type: "text",
    name: "total_amount",
    label: "RCC Crossing",
    className: "form-control-small-col",
    convertFunction: (itemObject)=>{
      console.log("Item object pay type", itemObject.pay_type_name)
      // if (itemObject.pay_type == "1"){
      //   return itemObject.total_amount
      // }
      // else{
      //   return "0"
      // }
      return itemObject.total_amount
    }
  },
  {
    type: "text",
    name: "transporter_freight",
    label: "Transporter Freight",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "no_of_package",
    label: "No Of Package",
    className: "form-control-small-col",
  },

  {
    type: "text",
    name: "charge_weight",
    label: "Charge Weight",
    className: "form-control-small-col",
  },
  // {
  //   type: "text",
  //   name: "private_marka_no",
  //   label: "Private Marka No",
  //   className: "form-control-large-col",
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

export {
  groupInfo,
  groupNames,
  dataObject,
  validate,
  challanBiltyTableHeader,
  challanBiltyTableItems,
};
