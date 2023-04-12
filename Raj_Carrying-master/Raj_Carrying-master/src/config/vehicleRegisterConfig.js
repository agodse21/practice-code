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

  return [year, month, day].join('-');
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
      suggestionSchema: {
        vehicle_id: "vehicle_id",
        vehicle_no: "vehicle_no",
        // driver_name: "driver_name",
        // owner_name: "owner_name",
      },
      suggestionChooseQueryKeyword: "vehicle_no",
      apiCallRequiredOnGetValue: true,
      keyboardNavigationMap: {
        Enter: "memo_no",
      },
      toValidate: true,
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "vehicle_id",
    },
    {
      label: "Memo No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "memo_no",
      type: "text",
      placeHolder: "",
    //   apiConfigKey: "getCitySuggestions",
    //   url: SERVER_URL + "/branch/",
    //   suggestionKeyword: "name",
    //   suggestionKeywordForFetchApiArgs: "name",
    //   suggestionSchema: {
    //     branch_id: "station_from",
    //     name: "station_from_name",
    //   },
    //   toValidate: true,
    //   regExpValidation: "[a-zA-z]",
    //   apiCallRequiredOnGetValue: true,
    //   suggestionChooseQueryKeyword: "branch_id",
      keyboardNavigationMap: {
        Enter: "pass_status",
      },
    },
    {
        label: "Paid(Yes/No)",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "pass_status",
        type: "dropdown",
        dropdown_items: [
          { value: "YES", label: "YES" },
          { value: "NO", label: "NO" },
        ],
        placeHolder: "",
      //   apiConfigKey: "getCitySuggestions",
      //   url: SERVER_URL + "/branch/",
      //   suggestionKeyword: "name",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionSchema: {
      //     branch_id: "station_from",
      //     name: "station_from_name",
      //   },
      //   toValidate: true,
      //   regExpValidation: "[a-zA-z]",
      //   apiCallRequiredOnGetValue: true,
      //   suggestionChooseQueryKeyword: "branch_id",
        keyboardNavigationMap: {
          Enter: "register_date",
        },
    },
    {
        label: "Register Date",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "register_date",
        type: "date",
        placeHolder: "",
      //   apiConfigKey: "getCitySuggestions",
      //   url: SERVER_URL + "/branch/",
      //   suggestionKeyword: "name",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionSchema: {
      //     branch_id: "station_from",
      //     name: "station_from_name",
      //   },
      //   toValidate: true,
      //   regExpValidation: "[a-zA-z]",
      //   apiCallRequiredOnGetValue: true,
      //   suggestionChooseQueryKeyword: "branch_id",
        keyboardNavigationMap: {
          Enter: "freight",
        },
    },
    // {
    //     label: "Lorry No",
    //     className: "form-row",
    //     labelClassName: "form-label",
    //     inputClassName: "form-input",
    //     name: "lorry_no",
    //     type: "text",
    //     placeHolder: "",
    //   //   apiConfigKey: "getCitySuggestions",
    //   //   url: SERVER_URL + "/branch/",
    //   //   suggestionKeyword: "name",
    //   //   suggestionKeywordForFetchApiArgs: "name",
    //   //   suggestionSchema: {
    //   //     branch_id: "station_from",
    //   //     name: "station_from_name",
    //   //   },
    //   //   toValidate: true,
    //   //   regExpValidation: "[a-zA-z]",
    //   //   apiCallRequiredOnGetValue: true,
    //   //   suggestionChooseQueryKeyword: "branch_id",
    //     keyboardNavigationMap: {
    //       Enter: "freight",
    //     },
    //   },
      {
        label: "Freight",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "freight",
        type: "text",
        placeHolder: "",
      //   apiConfigKey: "getCitySuggestions",
      //   url: SERVER_URL + "/branch/",
      //   suggestionKeyword: "name",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionSchema: {
      //     branch_id: "station_from",
      //     name: "station_from_name",
      //   },
      //   toValidate: true,
      //   regExpValidation: "[a-zA-z]",
      //   apiCallRequiredOnGetValue: true,
      //   suggestionChooseQueryKeyword: "branch_id",
        keyboardNavigationMap: {
          Enter: "transport_name",
        },
      },
      {
        label: "Transport Name",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "transport_name",
        type: "text",
        placeHolder: "",
      //   apiConfigKey: "getCitySuggestions",
      //   url: SERVER_URL + "/branch/",
      //   suggestionKeyword: "name",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionSchema: {
      //     branch_id: "station_from",
      //     name: "station_from_name",
      //   },
      //   toValidate: true,
      //   regExpValidation: "[a-zA-z]",
      //   apiCallRequiredOnGetValue: true,
      //   suggestionChooseQueryKeyword: "branch_id",
        keyboardNavigationMap: {
          Enter: "station_name",
        },
      },
  ],
  "group-2": [
  {
      label: "Station",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "station_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionSchema: {
        branch_id: "station",
        name: "station_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      apiCallRequiredOnGetValue: true,
      suggestionChooseQueryKeyword: "branch_id",
      keyboardNavigationMap: {
        Enter: "received_date",
      },
    },
    {
      label: "Letter Received Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "received_date",
      type: "date",
      placeHolder: "",
    //   url: SERVER_URL + "/branch/",
    //   suggestionKeyword: "name",
    //   suggestionSchema: {
    //     vehicle_id: "vehicle_id",
    //     vehicle_no: "vehicle_no",
    //     driver_name: "driver_name",
    //     owner_name: "owner_name",
    //   },
    //   toValidate: true,
    //   regExpValidation: "[a-zA-z]",
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
        Enter: "received_amount",
      },
    },
    {
      label: "Received Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "received_amount",
      type: "text",
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "payment_method",
      },
    },
    {
      label: "Payment Method",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "payment_method",
      type: "dropdown",
      dropdown_items: [
        { value: "CHEQUE", label: "CHEQUE" },
        { value: "CASH", label: "CASH" },
        { value: "RTGS", label: "RTGS" },
        { value: "None", label: "" },
      ],
      placeHolder: "",
    //   apiConfigKey: "getCitySuggestions",
    //   url: SERVER_URL + "/branch/",
    //   suggestionKeyword: "name",
    //   suggestionKeywordForFetchApiArgs: "name",
    //   suggestionSchema: {
    //     branch_id: "payable_branch",
    //     name: "payable_branch_name",
    //   },
    //   toValidate: true,
    //   regExpValidation: "[a-zA-z]",
    //   apiCallRequiredOnGetValue: true,
    //   suggestionChooseQueryKeyword: "branch_id",
      keyboardNavigationMap: {
        Enter: "cheque_details",
      },
    },
    {
        label: "Cheque Details",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "cheque_details",
        type: "text",
        placeHolder: "",
        keyboardNavigationMap: {
          Enter: "receiver_detail",
        },
      },
      {
        label: "Receiver Details",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "receiver_detail",
        type: "text",
        placeHolder: "",
        keyboardNavigationMap: {
          Enter: "x_date",
        },
      },
      {
        label: "Received Date",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "x_date",
        type: "date",
        placeHolder: "",
        keyboardNavigationMap: {
          Enter: "save_button",
        },
      },
  ],
};

const dataObject = {
  vehicle_register_id:"",
  vr_no:"",
  station: "",
  vehicle_id: "",
  vehicle_no: "",
  pass_status: "NO",
  memo_no: "",
  register_date: "",
  station_name:"",
  lorry_no: "",
  freight: "",
  transport_name: "",
  remarks: "",
  received_date: formatDate(new Date()),
  received_amount: "",
  payment_method: "None",
  register_date: formatDate(new Date()),
  cheque_details: "",
  receiver_detail: "",
  x_date: formatDate(new Date()),
  input_date: new Date(),
  last_entry_no: "",
  letter_no: "",
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
  "success_header": "Vehicle Register Saving Successful ",
  "error_header": "Error In Vehicle Register Module ",
  "success_title": "Vehicle Register is successfully created with the following info:-",
  "field_label_success": "Vehicle Register No.",
  "field_name_success": "vr_no",
  "error_title": "Error in Vehicle Register module with the following info:-",
  "field_label_error": "Error:"
}

export {
  groupInfo,
  groupNames,
  dataObject,
  validate,
  popupInfo
};
