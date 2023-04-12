import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2"];

const groupInfo = {
    "group-1": [
        {
            label: "Station Name",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "name",
            type: "text",
            placeHolder: "",
            url: SERVER_URL + "/branch/",
            suggestionKeyword: "name",
            apiConfigKey: "getCitySuggestions",
            suggestionKeywordForFetchApiArgs: "name",
            suggestionChooseQueryKeyword: "branch_id",
            suggestionKeywordExtra: "pin_code",
            backendOnClickName: "pan_no",
            keyboardNavigationMap: {
                Enter: "city",
            },
            toValidate: true,
            apiCallRequiredOnGetValue: true,
            suggestionSchema: {
                name: "name",
                address: "address",
                branch_id: "branch_id",
                is_branch: "is_branch",
                city: "city",
                pin_code: "pin_code",
                mobile: "mobile",
                party_bill_account: "consignor_id",
                party_bill_account_name: "consignor_name",
                freight_lock: "freight_lock",
                to_pay_account_name: "to_pay_account_name",
                to_pay_account: "to_pay_account_id",
            },
            // idClearanceNeeded: "branch_id",
            onChangeIgnoreClearance: ["address"],
        },
        {
            label: "City",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "city",
            type: "text",
            placeHolder: "",
            url: SERVER_URL + "/city/",
            suggestionKeyword: "name",
            backendOnClickName: "owner_name",
            keyboardNavigationMap: {
                Enter: "address",
            },
        },
        {
            label: "Address",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "address",
            type: "text",
            placeHolder: "",
            url: SERVER_URL + "/city/",
            suggestionKeyword: "name",
            backendOnClickName: "owner_name",
            keyboardNavigationMap: {
                Enter: "to_pay_account_name",
            },
        },
        // {
        //   label: "To Pay Account",
        //   className: "form-row",
        //   labelClassName: "form-label",
        //   inputClassName: "form-input",
        //   name: "to_pay_account",
        //   type: "text",
        //   placeHolder: "",
        //   url: SERVER_URL + "/city/",
        //   suggestionKeyword: "name",
        //   backendOnClickName: "owner_name",
        //   keyboardNavigationMap: {
        //     Enter: "pin_code",
        //   },
        // },
        {
            label: "To Pay Account",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "to_pay_account_name",
            type: "text",
            placeHolder: "",
            url: SERVER_URL + "/consignor/",
            suggestionKeyword: "consignor_name",
            apiConfigKey: "getConsignorSuggestions",
            suggestionKeywordForFetchApiArgs: "name",
            suggestionChooseQueryKeyword: "consignor_id",
            suggestionKeywordExtra: "consignor_gst",
            backendOnClickName: "pan_no",
            keyboardNavigationMap: {
                Enter: "pin_code",
            },
            toValidate: true,
            apiCallRequiredOnGetValue: true,
            regExpValidation: "[a-zA-z]",
            suggestionSchema: {
                consignor_name: "to_pay_account_name",
                //   consignor_gst: "consignor_gst",
                consignor_id: "to_pay_account_id",
                // to_pay_account_name: "consignor_name",
                // to_pay_account_id: "consignor_id",
            },
            idClearanceNeeded: "consignor_id",
            inputDataNeededInSuggestions: false,
            inputDataFilter: {
                pay_type: "same",
            },
            // onChangeIgnoreClearance: ["address"],
        },
    ],
    "group-2": [
        {
            label: "Pincode",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "pin_code",
            type: "text",
            placeHolder: "",
            url: SERVER_URL + "/city/",
            suggestionKeyword: "name",
            backendOnClickName: "owner_name",
            keyboardNavigationMap: {
                Enter: "mobile",
            },
        },
        {
            label: "Mobile No.",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "mobile",
            type: "text",
            placeHolder: "",
            backendOnClickName: "license_validity",
            // toValidate: true,
            keyboardNavigationMap: {
                Enter: "freight_lock",
            },
        },
        {
            label: "Freight Bill Lock",
            className: "form-row",
            labelClassName: "form-label",
            inputClassName: "form-input",
            name: "freight_lock",
            type: "dropdown",
            dropdown_items: [
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
            ],
            placeHolder: "",
            backendOnClickName: "license_validity",
            // toValidate: true,
            keyboardNavigationMap: {
                Enter: "consignor_name",
            },
        },
        // {
        //   label: "New Field",
        //   className: "form-row",
        //   labelClassName: "form-label",
        //   inputClassName: "form-input",
        //   name: "mobile",
        //   type: "text",
        //   placeHolder: "",
        //   backendOnClickName: "license_validity",
        //   // toValidate: true,
        //   keyboardNavigationMap: {
        //     Enter: "save_button",
        //   },
        // },
    ],
};

const dataObject = {
    branch_id: "",
    name: "",
    address: "",
    is_branch: "",
    city: "",
    pin_code: "",
    mobile: "",
    consignor_name: "",
    consignor_id: "",
    freight_lock: "0",
    to_pay_account_name: "",
    to_pay_account_id: "",

};

function validate(values) {
    let errors = {};

    // function validator(value, regexp) {
    //   var regex = new RegExp(regexp);
    //   if (values.hasOwnProperty(value)) {
    //     if (!values[value].trim()) {
    //       errors[value] = "Required Field";
    //     } else if (!regex.test(values[value])) {
    //       errors[value] = "Validation Error";
    //     } else {
    //       errors[value] = "";
    //     }
    //   }
    // }
    // for (let group_name of groupNames) {
    //   for (let i = 0; i < groupInfo[group_name].length; i++) {
    //     console.log(groupInfo[group_name][i]);
    //     let field_object = groupInfo[group_name][i];
    //     if (field_object.toValidate) {
    //       validator(field_object.name, field_object.regExpValidation);
    //     }
    //   }
    // }
    return errors;
}

export {
    groupInfo,
    dataObject,
    validate,
};
