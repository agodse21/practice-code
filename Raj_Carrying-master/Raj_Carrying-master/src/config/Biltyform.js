import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const groupInfo = {
  "group-1": [
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
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "station_from",
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
        required: (pageState) => {
            return pageState.station_to != "";
        },
        Enter: "destination_name",
      },
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "station_to",
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
        required: (pageState) => {
            return pageState.destination != "";
        },
        Enter: "pay_type",
      },
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "destination",
    },
    {
      label: "Bilty Type",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pay_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "To Pay" },
        { value: "2", label: "Paid" },
        { value: "3", label: "FOC" },
        { value: "4", label: "To Be Billed" },
      ],
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "consignor_name",
      },
    },

    {
      label: "Consignor Name",
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
      suggestionChooseQueryKeywordCustom: (suggestion, pageState)=> {
        return String(suggestion.consignor_id)+"?bilty_type="+String(pageState.pay_type);
      },
      suggestionSchema: {
        consignor_name: "consignor_name",
        consignor_gst: "consignor_gst",
        consignor_id: "consignor_id",
        bilty_charge: "bilty_charge",
        door_delivery_charge: "door_del_charge",
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
      conditionalTurnOffSuggestions: (value)=> {
        if (value.indexOf(".") != -1){
          return true
        }
        else {
          return false
        }
      },
      idClearanceNeeded: "consignor_id",
    },
    {
      label: "Consignee Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignee_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsigneeSuggestions",
      url: SERVER_URL + "/consignee/",
      suggestionKeyword: "consignee_name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "consignee_id",
      suggestionKeywordExtra: "consignee_gst",
      suggestionSchema: {
        consignee_name: "consignee_name",
        consignee_gst: "consignee_gst",
        consignee_id: "consignee_id",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "consignee_gst",
      },
      idClearanceNeeded: "consignee_id",
    },
    {
      label: "Consignee GST",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignee_gst",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsigneeSuggestions",
      url: SERVER_URL + "/consignee/",
      suggestionKeyword: "consignee_gst",
      suggestionKeywordForFetchApiArgs: "gst",
      suggestionChooseQueryKeyword: "consignee_id",
      suggestionSchema: {
        consignee_name: "consignee_name",
        consignee_gst: "consignee_gst",
        consignee_id: "consignee_id",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        nextOnRow: "True",
        nextOnRowField: "item_name",
        nextOnRowTableName: "item_in",
        Enter: "Item Name",
      },
      conditionalTurnOffSuggestions: (value)=> {
        if (value.indexOf(".") != -1){
          return true
        }
        else {
          return false
        }
      },
      idClearanceNeeded: "consignee_id",
    },
  ],
  "group-2": [
    {
      label: "No. Of Package",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "no_of_package",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
    },
    {
      label: "Actual Weight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "actual_weight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "charge_weight",
      },
    },
    {
      label: "Charge Weight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "charge_weight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "private_marka_no",
      },
    },
    // {
    //   label: "Type Of Packaging",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "packing_type",
    //   type: "dropdown",
    //   dropdown_items: [
    //     { value: "1", label: "Carton" },
    //     { value: "2", label: "Cargo" },
    //     { value: "3", label: "Bag" },
    //     { value: "4", label: "Bundle" },
    //     { value: "5", label: "Bucket" },
    //   ],
    //   placeHolder: "",
    //   keyboardNavigationMap:{
    //     "Enter": "private_marka_no"
    //   }
    // },
    {
      label: "Private Marka No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "private_marka_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "goods_invoice_value",
      },
    },
    {
      label: "Goods/Invoice Value",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "goods_invoice_value",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "delivery_dest_type",
      },
    },
    {
      label: "Delivery Type",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "delivery_dest_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "Door" },
        { value: "2", label: "Godown" },
        { value: "3", label: "Priority" },
      ],
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
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        conditionalNav: true,
        conditionalNavFunct: (pageState) => {
          if (pageState.pay_type == "4") {
            return "other_amount";
          } else {
            if (pageState.is_crossing == "Y"){
              return "transporter_freight"
            }
            else{
              return "bilty_charge";
            }
          }
        },
      },
      onKeyPressEvent: async (inputObject)=>{
        if (inputObject.pageState.delivery_dest_type != "1"){
          inputObject.setPageStateByField("door_del_charge", "");
        }
        return;

      }
    },
  ],
  "group-3": [
    {
      label: "Freight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "freight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
    {
      label: "Bilty Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "bilty_charge",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "hamali",
      },
    },
    {
      label: "Hamali",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "hamali",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        conditionalNav: true,
        conditionalNavFunct: (pageState) => {
          if (pageState.is_crossing == "N") {
            return "door_del_charge";
          } else {
            return "transporter_freight";
          }
        },
      },
    },
    {
      label: " Transport Freight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "transporter_freight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "door_del_charge",
      },
    },
    {
      label: "DD/Collection Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "door_del_charge",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "other_amount",
      },
    },
    {
      label: "Other Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "other_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "print_button",
      },
    },
    {
      label: "Total Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "total_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
  ],
  "group-4": [
    {
      label: "Booking Chalan No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "booking_chalan_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "MR No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "mr_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "Trip No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "trip_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "Crossing In No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "crossing_inward_no",
      type: "text",
      placeHolder: "",
    },
  ],
  "group-5": [
    {
      label: "To Pay",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "transporter_freight",
      type: "text",
      placeHolder: "",
      toValidate: true,
      regExpValidation: "[1-9][0-9]*",
      keyboardNavigationMap: {
        Enter: "hamali",
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
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "hamali",
      },
    },
    {
      label: "Hamali",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "hamali",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "door_del_charge",
      },
    },
    {
      label: "Crossing Hire",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "freight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
    {
      label: "DD/Collection Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "door_del_charge",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "other_amount",
      },
    },
    {
      label: "Other Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "other_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "print_button",
      },
    },
    {
      label: "Total Crossing Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "total_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
  ],
};

const dataObject = {
  station_from: "",
  station_from_name: "",
  station_to: "",
  station_to_name: "",
  destination: "",
  destination_name: "",
  pay_type: "1",
  consignor_id: "",
  paid_amount: "",
  consignee_id: "",
  consignee_name: "",
  consignee_gst: "",
  consignor_name: "",
  consignor_gst: "",
  no_of_package: "",
  actual_weight: "",
  charge_weight: "",
  // packing_type: "1",
  private_marka_no: "",
  goods_invoice_value: "",
  delivery_dest_type: "2",
  remarks: "",
  bilty_charge: "",
  bilty_no: "",
  bilty_id: "",
  other_amount: "",
  freight: "",
  hamali: "",
  door_del_charge: "",
  total_amount: "",
  is_printed: "",
  tracking_status: "1",
  created_from: "",
  created_by: "",
  input_date: new Date(),
  booking_chalan_no: "",
  is_crossing: "N",
  suffix: "",
  suffix_options: [],
  transporter_name: "",
  transporter_id: "",
  transporter_freight: "",
  last_suffix: "",
  crossing_inward_no: "",
  eway_bill_no: [
    {
      eway_bill_no: "",
      new_row: "N",
    },
  ],
  item_in: [
    {
      amount: "",
      item_name: "",
      pkgs: "",
      rate: "",
      unit: "C",
      weight: "",
      new_row: "N",
      packing_type: "1",
      truck_size: "9mt",
      rate_info: [],
    },
  ],
  prev_pay_type: ""
};

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
      if (
        field_object.name == "transporter_name" &&
        values.is_crossing == "N"
      ) {
        continue;
      }
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  // On submit consingor and consignee gst check
  if (values.consignor_gst == "" && values.consignee_gst == "") {
    errors.consignor_gst = "error";
    errors.consignee_gst = "error";
  } else {
    const regexStringForGST =
      "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
    var regex = new RegExp(regexStringForGST);
    if (values.consignor_gst != "" && !regex.test(values.consignor_gst) && values.consignor_gst != "N.A" && values.consignor_gst != "n.a") {
      errors.consignor_gst = "Invalid GST";
    }
    if (values.consignee_gst != "" && !regex.test(values.consignee_gst) && values.consignee_gst != "N.A" && values.consignee_gst != "n.a") {
      errors.consignee_gst = "Invalid GST";
    }
  }
  return errors;
}

const generateBiltyDataObjectForVerificationFromSuggestions = () => {
  let myObject = {};
  for (let groupKey in groupInfo) {
    for (let index = 0; index < groupInfo[groupKey].length; index++) {
      let infoObject = groupInfo[groupKey][index];
      if ("valueVerificationFromSuggestionNeeded" in infoObject) {
        myObject[infoObject.name] =
          infoObject.valueVerificationFromSuggestionNeeded;
      }
    }
  }
  return myObject;
};

const generateBiltyDataObjectForIdClearance = () => {
  let myObject = {};
  for (let groupKey in groupInfo) {
    for (let index = 0; index < groupInfo[groupKey].length; index++) {
      let infoObject = groupInfo[groupKey][index];
      if ("idClearanceNeeded" in infoObject) {
        myObject[infoObject.name] = {
          fieldToClear: infoObject.idClearanceNeeded,
          value: "",
        };
      }
    }
  }
  return myObject;
};

const popupInfo = {
  "success_header": "Bilty Saving Successful ",
  "error_header": "Error In Bilty Module ",
  "success_title": "Bilty is successfully created with the following info:-",
  "field_label_success": "Bilty No.",
  "field_name_success": "bilty_no",
  "error_title": "Error in bilty module with the following info:-",
  "field_label_error": "Error:"
}

const BiltyDataObjectForVerificationFromSuggestion =
  generateBiltyDataObjectForVerificationFromSuggestions();
const BiltyDataObjectForIdClearance = generateBiltyDataObjectForIdClearance();

// const biltyValidations =  {
//   bilty_id: yup.number({"bilty_id": "Bilty should be string"}),
// }
export {
  groupInfo,
  groupNames,
  dataObject,
  validate,
  BiltyDataObjectForVerificationFromSuggestion,
  BiltyDataObjectForIdClearance,
  popupInfo
};
