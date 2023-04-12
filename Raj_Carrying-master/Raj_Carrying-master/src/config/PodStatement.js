import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const groupInfo = {
  "group-1": [
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
        idClearanceNeeded: "consignor_id",
      },
  ],
};

const dataObject = {
  consignor_name: "",
  consignor_id: "",
  consignor_gst: "",
  total_amount: "",
  id:"",
  add: "",
  net_amount: "",
  pod_info_list: [],
  created_from: "",
  created_by: "",
  input_date: new Date(),
  pod_statement_no: "",
  last_pod_statement_no: "",
  amount: "",
  pod_receive_date: new Date(),
  pod_receive_date_selected: "false",
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

const podStatementTableHeader = [
    { label: "S. No.", className: "text-center table-header" },
    { label: "Bilty No.", className: "text-center table-header" },
    { label: "Bilty Date", className: "text-center table-header" },
    { label: "Consignor Name", className: "text-center table-header" },
    { label: "Consignee Name", className: "text-center table-header" },
    { label: "Pkgs", className: "text-center table-header" },
    { label: "Station From", className: "text-center table-header" },
    { label: "Station To", className: "text-center table-header" },
    { label: "Remarks", className: "text-center table-header" },
    // { label: "Remarks", className: "text-center table-header" },
    // { label: "Bilty Charge", className: "text-center table-header" },
    // { label: "Other Amount", className: "text-center table-header" },
    // { label: "Freight", className: "text-center table-header" },
    // { label: "Hamali", className: "text-center table-header" },
    // { label: "Door Del Charge", className: "text-center table-header" },
  ];
  
  const podStatementTableItems = [
    {
      type: "text",
      name: "bilty_no",
      label: "Bilty No",
      className: "form-control-medlarge-col",
    },
    {
      type: "text",
      name: "bilty_date",
      label: "Bilty Date",
      className: "form-control-medium-col",
    },
    {
      type: "text",
      name: "consignor_name",
      label: "Consignor Name",
      className: "form-control-large-col",
    },
    {
      type: "text",
      name: "consignee_name",
      label: "Consignee Name",
      className: "form-control-large-col",
    },
    {
      type: "text",
      name: "no_of_package",
      label: "No Of Package",
      className: "form-control-small-col",
    },
    {
      type: "text",
      name: "station_from_name",
      label: "Station From",
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
      name: "remarks",
      label: "Destination",
      className: "form-control-large-col",
    },
  ];

const popupInfo = {
  success_header: "POD Statement Saving Successful ",
  error_header: "Error In POD Statement Module ",
  success_title: "POD Statement is successfully created with the following info:-",
  field_label_success: "POD Statement no",
  field_name_success: "pod_statement_no",
  error_title: "Error in POD Statement module with the following info:-",
  field_label_error: "Error:",
};

export { groupInfo, groupNames, dataObject, validate, popupInfo,podStatementTableHeader,podStatementTableItems };
