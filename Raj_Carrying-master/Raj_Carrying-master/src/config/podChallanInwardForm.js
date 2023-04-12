import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const ChallanInwardDataObject = {
  pod_challan_no: "",
  pod_info: [],
  input_date: new Date(),
  pod_info_list: [],
  removed_bilty_ids: [],
  created_from: "",
  created_by: "",
  inward_date:"",
  inwarded: "",
};

function challanInwardValidate(values) {
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
    for (let i = 0; i < biltyGroupInfo[group_name].length; i++) {
      console.log(biltyGroupInfo[group_name][i]);
      let field_object = biltyGroupInfo[group_name][i];
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

const challanTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Pod Challan No.", className: "text-center table-header" },
  { label: "Pod Challan Date", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
];

const challanTableItems = [
  {
    type: "text",
    name: "pod_challan_no",
    label: "Trip No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "pod_date",
    label: "Trip No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-medlarge-col",
  },
];

// const biltyValidations =  {
//   bilty_id: yup.number({"bilty_id": "Bilty should be string"}),
// }
export {
  groupNames,
  ChallanInwardDataObject,
  challanInwardValidate,
  challanTableHeader,
  challanTableItems,
};
