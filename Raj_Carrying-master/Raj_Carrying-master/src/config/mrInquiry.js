import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const groupInfo = {
  "group-1": [
    {
      label: "Delivery On",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "delivery_on",
      type: "dropdown",
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
        Enter: "hamali",
      },
    },
    {
      label: "To Pay Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "to_pay_amount",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_to",
      suggestionBackendResponseMap: {
        id: "station_to",
      },
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
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
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "station_to",
      suggestionBackendResponseMap: {
        id: "station_to",
      },
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "service_charge",
      },
    },
    {
      label: "Service Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "service_charge",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "Service Charge",
      suggestionBackendResponseMap: {
        id: "Service Charge",
      },
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "demarage_charge",
      },
    },
    {
      label: "Demarage Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "demarage_charge",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "name",
      suggestionFrontendResponseMap: {
        name: "Demurrage Charge",
        gst_no: "Other Charge",
      },
      suggestionBackendResponseMap: {
        id: "consignor_id",
      },
      backendOnClickName: "consignor_name",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "other_charge",
      },
    },
    {
      label: "Other Charge",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "other_charge",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "gst_no",
      suggestionFrontendResponseMap: {
        name: "Demurrage Charge",
        gst_no: "Other Charge",
      },
      suggestionBackendResponseMap: {
        id: "consignor_id",
      },
      backendOnClickName: "consignor_gst",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "refund",
      },
    },
    {
      label: "Refund",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "refund",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/consignee/",
      suggestionKeyword: "name",
      suggestionFrontendResponseMap: {
        name: "Refund",
        gst_no: "Consignee GST",
      },
      suggestionBackendResponseMap: {
        id: "consignee_id",
      },
      backendOnClickName: "consignee_name",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "round_off",
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
      backendOnClickName: "goods_invoice_value",
      toValidate: true,
      regExpValidation: "^(?:[0-9]+d*|d)$",
    },
  ],
  "group-2": [
    {
      label: "Round Off",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "round_off",
      type: "text",
      placeHolder: "",
      backendOnClickName: "no_of_package",
      toValidate: false,
      regExpValidation: "^(?:[1-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "payment_type",
      },
    },
    {
      label: "Payment Mode",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "payment_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "Cash" },
        { value: "2", label: "Cheque" },
      ],
      placeHolder: "",
      backendOnClickName: "packing_type",
      keyboardNavigationMap: {
        conditionalNav: true,
        conditionalNavFunct: (pageState) => {
          if (pageState.payment_type == "1") {
            return "marfatiya";
          } else {
            return "cheque_no";
          }
        },
      },
    },
    {
      label: "Cheque No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "cheque_no",
      type: "text",
      placeHolder: "",
      backendOnClickName: "private_marka_no",
      //toValidate: true,
      regExpValidation: "^(?:[1-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "marfatiya",
      },
    },
  ],
  "group-3": [
    {
      label: "Marfatiya",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "marfatiya",
      type: "text",
      placeHolder: "",
      backendOnClickName: "Marfatiya",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "lorry_rate",
      },
    },
    {
      label: "Lorry Rate",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "lorry_rate",
      type: "text",
      placeHolder: "",
      backendOnClickName: "Lorry Rate",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "party_name",
      },
    },
    {
      label: "Party Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "party_name",
      type: "text",
      placeHolder: "",
      backendOnClickName: "door_del_charge",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "receiver_name",
      },
    },
    {
      label: "Receiver Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "receiver_name",
      type: "text",
      placeHolder: "",
      backendOnClickName: "bilty_charge",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
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
      backendOnClickName: "other_amount",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "save_button",
      },
    },
  ],
};

const dataObject = {
  mr_no: "",
  hamali: "",
  delivery_on: "0",
  service_charge: "",
  demarage_charge: "",
  other_charge: "",
  payment_type: "1",
  cheque_no: "",
  total_amount: "",
  marfatiya: "",
  party_name: "",
  receiver_name: "",
  lorry_rate: "",
  bilty_ids: [],
  created_from: "",
  remarks: "",
  refund: "",
  created_by: "",
  round_off: "",
  to_pay_amount: "",
  suffix: "",
  bilty_type: "D",
  input_date: new Date(),
  last_mr_no: "",
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
  success_header: "MR Saving Successful ",
  error_header: "Error In MR Module ",
  success_title: "MR is successfully created with the following info:-",
  field_label_success: "MR No.",
  field_name_success: "mr_no",
  error_title: "Error in MR module with the following info:-",
  field_label_error: "Error:",
};

export { groupInfo, groupNames, dataObject, validate, popupInfo };
