import { SERVER_URL } from "./config";

const itemTableHeader = [
  {
    label: "#",
    className: "text-center table-header",
  },
  {
    label: "Item Name",
    className: "text-center table-header",
  },
  {
    label: "Unit",
    className: "text-center table-header",
  },
  {
    label: "Truck Size",
    className: "text-center table-header",
  },
  {
    label: "Packaging Type",
    className: "text-center table-header",
  },
  {
    label: "Pkgs",
    className: "text-center table-header",
  },
  {
    label: "Weight",
    className: "text-center table-header",
  },
  {
    label: "Rate",
    className: "text-center table-header",
  },
  {
    label: "Amount",
    className: "text-center table-header",
  },
  {
    label: "New",
    className: "text-center table-header",
  },
];

const tableItemsDisabilityChecker = (data) => {
    // console.log(data);
    const pageState = data.pageState;
    const pageMode = data.pageMode;
    const idx = data.idx;
    const ans = (pageMode == "edit" && pageState.pay_type == "4" && !("rate_info" in pageState.item_in[idx] && pageState.item_in[idx].rate_info.length > 0));
    
    // console.log(ans);   
    return ans;
}

let itemTableItems = [
  {
    type: "text",
    name: "item_name",
    label: "Item Name",
    className: "form-control-large-col",
    apiConfigKey: "getItemSuggestions",
    url: SERVER_URL + "/item/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "item_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      name: "item_name",
      item_id: "item_id", 
      rate_info: "rate_info",
    },
    newRowFocus: true,
    keyboardNavigationMap:{
      "Enter":{
        nextField: "unit"
      }
    },
    isTable: true,
    parentName: "item_in",
    toValidate: true,
    idClearanceNeeded: "item_id",
    inputDataNeededInSuggestions: true,
    inputDataFilter: {
      "station_from": "same",
      "station_to": "same",
      "consignor_id": "same",
      "consignee_id": "consignee_id",
      "consignee": "consignee",
      "item_id": "same"
    },
    apiCallRequiredOnGetValue: true,
    
  },
  {
    type: "dropdown",
    name: "unit",
    label: "Unit",
    className: "form-control-small-col",
    dropdown_items: [
      { value: "W", label: "W" },
      { value: "C", label: "C" },
      { value: "T", label: "T" },
      { value: "F", label: "F" },
    ],
    keyboardNavigationMap:{
      "Enter":{
        nextField: "packing_type"
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
},
  {
    label: "Truck Size",
    className: "form-control-small-col",
    labelClassName: "form-label",
    inputClassName: "form-control-medium-col",
    name: "truck_size",
    type: "dropdown",
    dropdown_items: [
      { value: "9mt", label: "9MT" },
      { value: "16mt", label: "16MT" },
      { value: "20mt", label: "20MT" },
      { value: "21mt", label: "21MT" },
      { value: "25mt", label: "25MT" },
      { value: "30mt", label: "30MT" },
    ],
    placeHolder: "",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "packing_type"
      }
    },
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    label: "Type Of Packaging",
    className: "form-control-small-col",
    labelClassName: "form-label",
    inputClassName: "form-control-medium-col",
    name: "packing_type",
    type: "dropdown",
    dropdown_items: [
      { value: "1", label: "Carton" },
      { value: "2", label: "Cargo" },
      { value: "3", label: "Bag" },
      { value: "4", label: "Bundle" },
      { value: "5", label: "Bucket" },
      { value: "6", label: "Case" },
      { value: "7", label: "Barrel" },
      { value: "8", label: "Drum" },
      { value: "9", label: "Loose" },
    ],
    placeHolder: "",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "pkgs"
      }
    },
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    type: "text",
    name: "pkgs",
    label: "Pkgs",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "weight"
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    type: "text",
    name: "weight",
    label: "Weight",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "rate"
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    type: "text",
    name: "rate",
    label: "Rate",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "new_row"
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    type: "text",
    name: "amount",
    label: "Amount",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        nextField: "new_row"
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
  },
  {
    type: "text",
    name: "new_row",
    label: "New",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        conditionalNav: true,
        nextFieldOnPage: "actual_weight",
        nextField: "item_name",
      }
    },
    suggestionsOff: true,
    isDisabled: tableItemsDisabilityChecker,
  },
];

const ewbTableHeader = [
  {
    label: "",
    className: "text-center table-header",
  },
  {
    label: "eWay Bill No.",
    className: "text-center table-header",
  },
  {
    label: "New",
    className: "text-center table-header",
  },
];
const ewbTableItems = [
  {
    type: "text",
    name: "eway_bill_no",
    label: "e-Way Bill Number",
    className: "form-control-medium-col",
    newRowFocus: true,
    keyboardNavigationMap:{
      "Enter":{
        nextField: "new_row"
      }
    },
    suggestionsOff: true,
  },
  {
    type: "text",
    name: "new_row",
    label: "New",
    className: "form-control-small-col",
    keyboardNavigationMap:{
      "Enter":{
        conditionalNav: true,
        nextFieldOnPage: "station_from_name",
        nextField: "item_name",
      }
    },
    suggestionsOff: true,
  },
];
export { itemTableHeader, itemTableItems, ewbTableHeader, ewbTableItems };
