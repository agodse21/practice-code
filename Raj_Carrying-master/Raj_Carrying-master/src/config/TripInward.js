import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const dataObject = {
    "trip_no": "",
    "trip_info": [
    ],
    input_date: new Date(),
    "trip_ids": [],
    "removed_bilty_ids":[],
    created_from: "",
    created_by: "",
}

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

  return errors;
}

const tripTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Trip No.", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  { label: "Vehicle No", className: "text-center table-header" },
];

const tripTableItems = [
  {
    type: "text",
    name: "trip_no",
    label: "Trip No",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-large-col",
  },
  {
    type: "text",
    name: "vehicle_no",
    label: "Vehicle No",
    className: "form-control-large-col",
  },
];

export {
  groupNames,
  dataObject,
  validate,
  tripTableHeader,
  tripTableItems
};
