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
      suggestionChooseQueryKeyword: "vehicle_no",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        vehicle_no: "vehicle_no",
        vehicle_id: "vehicle_id",
        pan_no: "pan_no",
        owner_name: "owner_name",
        owner_address: "owner_address",
        body_type: "body_type",
        engine_no: "engine_no",
        chasis_no: "chasis_no",
        permit_no: "permit_no",
        permit_validity: "permit_validity",
        insurance_company: "insurance_company",
        policy_validity: "polciy_validity",
        policy_no: "policy_no",
        driver_name: "driver_name",
        driver_address: "driver_address",
        license_no: "license_no",
        license_validity: "license_validity",
        vehicle_ownership: "vehicle_ownership",
        second_owner_name:"second_owner_name",
        second_owner_address:"second_owner_address",
        second_owner_pan_no:"second_owner_pan_no",
        second_owner_entry_date:"second_owner_entry_date",
        third_owner_name:"third_owner_name",
        third_owner_address:"third_owner_address",
        third_owner_pan_no:"third_owner_pan_no",
        third_owner_entry_date:"third_owner_entry_date",
        modified_date: "entry_date",
        verified_by: "verified_by",
        tds_rate: "tds_rate",
      },
      keyboardNavigationMap: {
        Enter: "pan_no",
      },
      toValidate: true,
      // idClearanceNeeded: "vehicle_id",
    },
    {
      label: "PAN No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pan_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "pan_no",
      keyboardNavigationMap:{
        "Enter": "owner_name"
      },
      onKeyPressEvent: async (inputObject)=>{

        inputObject.setOverlay(true);

        const url =
        SERVER_URL +
        "/vehicle/pan_count/" +
        inputObject.pageState.pan_no;
        const response = await fetch(url);
        if (!response.ok) {
          inputObject.setPageStateByField("pan_no", "error");
          inputObject.setOverlay(false);
          return;
        }
        const temp_response = await response.json();
        inputObject.setOverlay(false);
        if (temp_response.truck_limit_exceed == 0){
          console.log("Aashashashs");
          return;
        }
        let newObj = {
          pan_popup : "1",
          truck_limit_exceed: "1"
        }
        // inputObject.setPageStateByField("pan_popup","1");
        inputObject.setPageState(
          {
            ...inputObject.pageState,
            ...newObj
          }
        )
        return;

      }
    },
    {
      label: "Owner Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "owner_name",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "owner_name",
      keyboardNavigationMap:{
        "Enter": "owner_address"
      },
    },
    {
      label: "Owner Address",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "owner_address",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "owner_address",
      keyboardNavigationMap:{
        "Enter": "body_type"
      },
    },
    {
      label: "Body Type",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "body_type",
      type: "text",
      placeHolder: "1234",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "body_type",
      keyboardNavigationMap:{
        "Enter": "engine_no"
      },
    },
    {
      label: "Engine No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "engine_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "engine_no",
      keyboardNavigationMap:{
        "Enter": "chasis_no"
      },
    },
    {
      label: "Chasis No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "chasis_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "chasis_no",
      keyboardNavigationMap:{
        "Enter": "permit_no"
      },
    },
    {
      label: "Permit No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "permit_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "permit_no",
      keyboardNavigationMap:{
        "Enter": "permit_validity"
      },
    },
    {
      label: "Permit Validity",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "permit_validity",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "permit_validity",
      keyboardNavigationMap:{
        "Enter": "insurance_company"
      },
    },
    {
      label: "Insurance Co.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "insurance_company",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "insurance_company",
      keyboardNavigationMap:{
        "Enter": "policy_no"
      },
    },
    {
      label: "Declaration",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "policy_no",
      type: "dropdown",
      placeHolder: "",
      dropdown_items: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "policy_no",
      keyboardNavigationMap:{
        "Enter": "tds_rate"
      },
    },
    {
        label: "TDS Rate",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "tds_rate",
        type: "dropdown",
        placeHolder: "",
        dropdown_items: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
        ],
        url: SERVER_URL + "/city/",
        suggestionKeyword: "name",
        backendOnClickName: "policy_validity",
        keyboardNavigationMap:{
          "Enter": "policy_validity"
        },
    },
    {
      label: "Policy Validity",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "policy_validity",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "insurance_validity",
      keyboardNavigationMap:{
        "Enter": "driver_name"
      },
    },
  ],
  "group-2": [
    {
      label: "Driver Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "driver_name",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "driver_name",
      keyboardNavigationMap:{
        "Enter": "driver_address"
      },
    },
    {
      label: "Driver Address",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "driver_address",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "driver_address",
      keyboardNavigationMap:{
        "Enter": "license_no"
      },
    },
    {
      label: "License No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "license_no",
      type: "text",
      placeHolder: "",
      backendOnClickName: "license_no",
      keyboardNavigationMap:{
        "Enter": "license_validity"
      },
    },
    {
      label: "License Validity",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "license_validity",
      type: "text",
      placeHolder: "",
      backendOnClickName: "license_validity",
      keyboardNavigationMap:{
        "Enter": "vehicle_ownership"
      },
    },
    {
      label: "Vehicle Ownership",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "vehicle_ownership",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "Other" },
        { value: "2", label: "Self" },
      ],
      placeHolder: "",
      backendOnClickName: "license_validity",
      keyboardNavigationMap:{
        "Enter": "second_owner_name"
      },
    },
    {
      label: "Second Owner Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "second_owner_name",
      type: "text",
      placeHolder: "",
      // url: SERVER_URL + "/city/",
      // suggestionKeyword: "name",
      backendOnClickName: "second_owner_name",
      keyboardNavigationMap:{
        "Enter": "second_owner_address"
      },
    },
    {
      label: "Second Owner Address",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "second_owner_address",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "second_owner_address",
      keyboardNavigationMap:{
        "Enter": "second_owner_pan_no"
      },
    },
    {
      label: "Second Owner Pan No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "second_owner_pan_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "second_owner_pan_no",
      keyboardNavigationMap:{
        "Enter": "second_owner_entry_date"
      },
    },
    {
      label: "Second Owner Entry Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "second_owner_entry_date",
      type: "date",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "second_owner_entry_date",
      keyboardNavigationMap:{
        "Enter": "third_owner_name"
      },
    },
    {
      label: "Third Owner Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "third_owner_name",
      type: "text",
      placeHolder: "",
      // url: SERVER_URL + "/city/",
      // suggestionKeyword: "name",
      backendOnClickName: "third_owner_name",
      keyboardNavigationMap:{
        "Enter": "third_owner_address"
      },
    },
    {
      label: "Third Owner Address",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "third_owner_address",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "third_owner_address",
      keyboardNavigationMap:{
        "Enter": "third_owner_pan_no"
      },
    },
    {
      label: "Third Owner Pan No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "third_owner_pan_no",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "third_owner_pan_no",
      keyboardNavigationMap:{
        "Enter": "third_owner_entry_date"
      },
    },
    {
      label: "Third Owner Entry Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "third_owner_entry_date",
      type: "date",
      placeHolder: "",
      url: SERVER_URL + "/city/",
      suggestionKeyword: "name",
      backendOnClickName: "third_owner_entry_date",
      keyboardNavigationMap:{
        "Enter": "save_button"
      },
    },
  ],
};

const dataObject = {
  vehicle_id: "",
  vehicle_no: "",
  pan_no: "",
  owner_name: "",
  owner_address: "",
  second_owner_name:"",
  second_owner_address:"",
  second_owner_pan_no:"",
  second_owner_entry_date: formatDate(new Date()),
  third_owner_name:"",
  third_owner_address:"",
  third_owner_pan_no:"",
  third_owner_entry_date: formatDate(new Date()),
  entry_date: formatDate(new Date()),
  body_type: "",
  engine_no: "",
  chasis_no: "",
  permit_no: "",
  permit_validity: "",
  insurance_company: "",
  policy_validity: "",
  policy_no: "No",
  driver_name: "",
  driver_address: "",
  license_no: "",
  license_validity: "",
  created_from: "",
  created_by: "",
  vehicle_ownership: "1",
  pan_popup: "0",
  ingore_pan_limit: "0",
  truck_limit_exceed: "0",
  save_clicked: false,
  otp: "",
  otp_attempts: "3",
  otp_success: false,
  verified_by: "",
  tds_rate: "1",
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
  for (let group_name of groupNames){
    for (let i=0; i<groupInfo[group_name].length; i++){
      console.log(groupInfo[group_name][i])
      let field_object = groupInfo[group_name][i]
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

export {
  groupInfo,
  dataObject,
  validate,
};
