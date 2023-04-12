import { SERVER_URL } from "./config";

const groupNames = ["group-1"];

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

const mrStatementDataObject = {
    total_amount: "",
    total_pkgs: "",
    total_weight: "",
    total_bilties:""
  };
  
  const mrStatementGroupInfo = {
    "group-1": [
        {
            label: "Total Bilties",
            className: "form-row-m",
            labelClassName: "form-label-w",
            inputClassName: "form-input",
            name: "total_bilties",
            type: "text",
            placeHolder: "1234",
            idClearanceNeeded: "item_id",
            onChangeIgnoreClearance: ["description"],
        },
      {
        label: "Total Pkgs",
        className: "form-row-m",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "total_pkgs",
        type: "text",
        placeHolder: "1234",
        idClearanceNeeded: "item_id",
        onChangeIgnoreClearance: ["description"],
      },
      {
        label: "Total Weight",
        className: "form-row-m",
        labelClassName: "form-label-w",
        inputClassName: "form-input",
        name: "total_weight",
        type: "text",
        placeHolder: "1234",
        idClearanceNeeded: "item_id",
        onChangeIgnoreClearance: ["description"],
      },
      {
        label: "Total Amount",
        className: "form-row-m",
        labelClassName: "form-label-w",
        inputClassName: "form-input",
        name: "total_amount",
        type: "text",
        placeHolder: "1234",
        idClearanceNeeded: "item_id",
        onChangeIgnoreClearance: ["description"],
      },
      // {
      //   label: "Weight",
      //   className: "form-row",
      //   labelClassName: "form-label",
      //   inputClassName: "form-input",
      //   name: "weight",
      //   type: "text",
      //   placeHolder: "1234",
      //   apiConfigKey: "getItemSuggestions",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionChooseQueryKeyword: "item_id",
      //   suggestionKeywordExtra: "description",
      //   url: SERVER_URL + "/item/",
      //   suggestionKeyword: "name",
      //   backendOnClickName: "vehicle_no",
      //   keyboardNavigationMap: {
      //     Enter: "freight",
      //   },
      //   toValidate: false,
      //   apiCallRequiredOnGetValue: true,
      //   suggestionSchema: {
      //     name: "name",
      //     desc: "description",
      //     item_id: "item_id",
      //   },
      //   idClearanceNeeded: "item_id",
      //   onChangeIgnoreClearance: ["description"],
      // },
      // {
      //   label: "Freight",
      //   className: "form-row",
      //   labelClassName: "form-label",
      //   inputClassName: "form-input",
      //   name: "freight",
      //   type: "text",
      //   placeHolder: "1234",
      //   apiConfigKey: "getItemSuggestions",
      //   suggestionKeywordForFetchApiArgs: "name",
      //   suggestionChooseQueryKeyword: "item_id",
      //   suggestionKeywordExtra: "description",
      //   url: SERVER_URL + "/item/",
      //   suggestionKeyword: "name",
      //   backendOnClickName: "vehicle_no",
      //   keyboardNavigationMap: {
      //     Enter: "save_button",
      //   },
      //   toValidate: false,
      //   apiCallRequiredOnGetValue: true,
      //   suggestionSchema: {
      //     name: "name",
      //     desc: "description",
      //     item_id: "item_id",
      //   },
      //   idClearanceNeeded: "item_id",
      //   onChangeIgnoreClearance: ["description"],
      // },
    ],
  };

  export {
    groupNames,
    mrStatementGroupInfo,
    mrStatementDataObject,
    // mrStatementValidate,
    // mrStatementTableHeader,
    // mrStatementTableItems,
  };