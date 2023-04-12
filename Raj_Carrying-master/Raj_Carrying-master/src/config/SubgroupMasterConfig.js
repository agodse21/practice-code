import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2"];

const groupMasterGroupInfo = {
  "group-1": [
    {
      label: "Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "name",
      type: "text",
      placeHolder: "1234",
      apiConfigKey: "getSubgroupSuggestions",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "id",
      suggestionKeywordExtra: "description",
      url: SERVER_URL + "/subgroup/filter/",
      suggestionKeyword: "name",
      backendOnClickName: "vehicle_no",
      keyboardNavigationMap: {
        Enter: "belongs_to",
      },
      toValidate: "true",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        name: "name",
        group_id: "belongs_to",
        id: "item_id",
      },
      idClearanceNeeded: "item_id",
      onChangeIgnoreClearance: ["description"],
    },
  ],
  "group-2": [
    {
      description: "",
      label: "Belongs To",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "belongs_to",
      type: "text",
      placeHolder: "",
    //   url: SERVER_URL + "/item/",
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

const groupMasterDataObject = {
  // id: "",
  name: "",
  belongs_to: "",
};

function groupMasterValidate(values) {
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
//     for (let i = 0; i < groupMasterGroupInfo[group_name].length; i++) {
//       console.log(groupMasterGroupInfo[group_name][i]);
//       let field_object = groupMasterGroupInfo[group_name][i];
//       if (field_object.toValidate) {
//         validator(field_object.name, field_object.regExpValidation);
//       }
//     }
//   }
  return errors;
}

export { groupMasterGroupInfo, groupMasterDataObject, groupMasterValidate };
