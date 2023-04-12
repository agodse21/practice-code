import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];


const ChallanInwardDataObject = {
  "challan_no": "",
  "chalan_info": [
  ],
  input_date: new Date(),
  "challan_ids": [],
  "removed_bilty_ids":[],
  created_from: "",
  created_by: "",
  inwarded: "",
  manual_no: "",
  multiple_popup: "",
  multiple_popup_data: [],
  total_bilty: "0",
  total_pkgs: "0",
  total_weight: "0",
};

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

const challanBiltyTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Bilty No.", className: "text-center table-header" },
  { label: "Bilty Date", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  // { label: "Station To", className: "text-center table-header" },
  { label: "Destination", className: "text-center table-header" },
  { label: "Pay Type", className: "text-center table-header" },
  { label: "Consignor Name", className: "text-center table-header" },
  { label: "Consignor Gst", className: "text-center table-header" },
  { label: "Consignee Name", className: "text-center table-header" },
  { label: "Consignee Gst", className: "text-center table-header" },
  { label: "No Of Package", className: "text-center table-header" },
  { label: "Actual Weight", className: "text-center table-header" },
  { label: "Charge Weight", className: "text-center table-header" },
  { label: "Private Marka No", className: "text-center table-header" },
  { label: "Goods Invoice Value", className: "text-center table-header" },
  { label: "Delivery Dest Type", className: "text-center table-header" },
  // { label: "Remarks", className: "text-center table-header" },
  // { label: "Bilty Charge", className: "text-center table-header" },
  // { label: "Other Amount", className: "text-center table-header" },
  // { label: "Freight", className: "text-center table-header" },
  // { label: "Hamali", className: "text-center table-header" },
  // { label: "Door Del Charge", className: "text-center table-header" },
  { label: "Created From", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
];

const challanBiltyTableItems = [
  {
    type: "text",
    name: "bilty_no",
    label: "Bilty No",
    className: "form-control-medlargemed-col",
  },
  {
    type: "text",
    name: "created_date",
    label: "Bilty Date",
    className: "form-control-medlargemed-col",
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
  {
    type: "text",
    name: "consignor_gst",
    label: "Consignor Gst",
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
    name: "consignee_gst",
    label: "Consignee Gst",
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
    name: "actual_weight",
    label: "Actual Weight",
    className: "form-control-small-col",
  },
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
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "goods_invoice_value",
    label: "Goods Invoice Value",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "delivery_dest_type",
    label: "Delivery Dest Type",
    className: "form-control-medium-col",
  },
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
  {
    type: "text",
    name: "created_from",
    label: "Created From",
    className: "form-control-medlarge-col ",
  },
  {
    type: "text",
    name: "created_by",
    label: "Created By",
    className: "form-control-medlarge-col ",
  },
];


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
  for (let group_name of groupNames){
    for (let i=0; i<biltyGroupInfo[group_name].length; i++){
      console.log(biltyGroupInfo[group_name][i])
      let field_object = biltyGroupInfo[group_name][i]
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

const challanTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Challan No.", className: "text-center table-header" },
  { label: "Challan Date", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  { label: "Vehicle No", className: "text-center table-header" },
];

const challanTableItems = [
  {
    type: "text",
    name: "chalan_no",
    label: "Trip No",
    className: "form-control-small-col",
  },
  {
    type: "text",
    name: "booking_chalan_date",
    label: "Bilty Date",
    className: "form-control-medlargemed-col",
    // convertFunction: (itemObject)=>{
    //   return formatDate(itemObject.booking_chalan_date)
    // }
  },
  {
    type: "text",
    name: "station_from_name",
    label: "Station From",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "vehicle_no",
    label: "Vehicle No",
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
  challanBiltyTableItems,
  challanBiltyTableHeader,
};
