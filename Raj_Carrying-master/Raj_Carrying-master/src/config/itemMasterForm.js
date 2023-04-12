import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2"];

const itemMasterGroupInfo = {
  "group-1": [
    {
      label: "Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "name",
      type: "text",
      placeHolder: "1234",
      apiConfigKey: "getItemSuggestions",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "item_id",
      suggestionKeywordExtra: "description",
      url: SERVER_URL + "/item/",
      suggestionKeyword: "name",
      backendOnClickName: "vehicle_no",
      keyboardNavigationMap: {
        Enter: "description",
      },
      toValidate: "true",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        name: "name",
        desc: "description",
        item_id: "item_id",
      },
      idClearanceNeeded: "item_id",
      onChangeIgnoreClearance: ["description"],
    },
  ],
  "group-2": [
    {
      description: "",
      label: "Description",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "description",
      type: "text",
      placeHolder: "",
      url: SERVER_URL + "/item/",
      // apiConfigKey: "getItemSuggestions",
      // suggestionKeywordForFetchApiArgs: "name",
      suggestionKeyword: "name",
      backendOnClickName: "description",
      keyboardNavigationMap: {
        Enter: "save_button",
      },
      toValidate: "true",
    },
  ],
};

const itemMasterDataObject = {
  // id: "",
  name: "",
  description: "",
};

function itemMasterValidate(values) {
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
    for (let i = 0; i < itemMasterGroupInfo[group_name].length; i++) {
      console.log(itemMasterGroupInfo[group_name][i]);
      let field_object = itemMasterGroupInfo[group_name][i];
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  return errors;
}

export { itemMasterGroupInfo, itemMasterDataObject, itemMasterValidate };
