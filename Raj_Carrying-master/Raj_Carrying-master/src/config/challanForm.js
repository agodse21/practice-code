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
      keyboardNavigationMap: {
        Enter: "phone_no",
      },
    },
    {
      label: "Phone No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "phone_no",
      type: "text",
      placeHolder: "",
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
  suffix_options: [],
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
  fyearList: [],
  fyear_get_bilty: "",
};

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
  // { label: "Crossing Amount", className: "text-center table-header" },
  // { label: "Consignee Gst", className: "text-center table-header" },
  { label: "No Of Package", className: "text-center table-header" },
  // { label: "Actual Weight", className: "text-center table-header" },
  { label: "Charge Weight", className: "text-center table-header" },
  { label: "Private Marka No", className: "text-center table-header" },
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

const challanBiltyOriginalTableHeader = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Bilty No.", className: "text-center table-header" },
    { label: "Bilty Date", className: "text-center table-header" },
    { label: "Station From", className: "text-center table-header" },
    // { label: "Station To", className: "text-center table-header" },
    { label: "Destination", className: "text-center table-header" },
    { label: "EWay Bills", className: "text-center table-header" },
    { label: "Pay Type", className: "text-center table-header" },
    { label: "Consignor Name", className: "text-center table-header" },
    // { label: "Consignor Gst", className: "text-center table-header" },
    { label: "Consignee Name", className: "text-center table-header" },
    // { label: "Crossing Amount", className: "text-center table-header" },
    // { label: "Consignee Gst", className: "text-center table-header" },
    { label: "No Of Package", className: "text-center table-header" },
    // { label: "Actual Weight", className: "text-center table-header" },
    { label: "Charge Weight", className: "text-center table-header" },
    { label: "Private Marka No", className: "text-center table-header" },
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
    convertFunction: (itemObject)=>{
      return formatDate(itemObject.bilty_date)
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
  // {
  //   type: "text",
  //   name: "consignee_gst",
  //   label: "Consignee Gst",
  //   className: "form-control-large-col",
  // },
  // {
  //   type: "text",
  //   name: "transporter_freight",
  //   label: "Transporter freight",
  //   className: "form-control-medium-col",
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

const challanBiltyOriginalTableItems = [
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
      convertFunction: (itemObject)=>{
        return formatDate(itemObject.bilty_date)
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
      name: "eway_bill_info",
      label: "EWay Bills",
      className: "form-control-medlarge-col",
      convertFunction: (obj) => {
          console.log(obj);
          return obj.eway_bill_info.length;
      }
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
    // {
    //   type: "text",
    //   name: "consignee_gst",
    //   label: "Consignee Gst",
    //   className: "form-control-large-col",
    // },
    // {
    //   type: "text",
    //   name: "transporter_freight",
    //   label: "Transporter freight",
    //   className: "form-control-medium-col",
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
  challanBiltyTableHeader,
  challanBiltyTableItems,
  challanBiltyOriginalTableHeader,
  challanBiltyOriginalTableItems,
  popupInfo,
  validate,
};
