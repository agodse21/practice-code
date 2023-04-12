import { SERVER_URL } from "./config";

const groupNames = ["group-1", "group-2", "group-3"];

const groupInfo = {
  "group-1": [
    {
      label: "Station From",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "station_from_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        branch_id: "station_from",
        name: "station_from_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "station_to_name",
      },
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "station_from",
    },
    {
      label: "Station To",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "station_to_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        branch_id: "station_to",
        name: "station_to_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "destination_name",
      },
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "station_to",
    },
    {
      label: "Destination",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "destination_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        branch_id: "destination",
        name: "destination_name",
      },
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "pay_type",
      },
      valueVerificationFromSuggestionNeeded: true,
      valueVerificationCompulsionField: "destination",
    },
    {
      label: "Bilty Type",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pay_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "To Pay" },
        { value: "2", label: "Paid" },
        { value: "3", label: "FOC" },
        { value: "4", label: "To Be Billed" },
      ],
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "consignor_name",
      },
    },

    {
      label: "Consignor Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignor_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsignorSuggestions",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "consignor_name",
      suggestionKeywordExtra: "consignor_gst",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "consignor_id",
      suggestionChooseQueryKeywordCustom: (suggestion, pageState)=> {
        return String(suggestion.consignor_id)+"?bilty_type="+String(pageState.pay_type);
      },
      suggestionSchema: {
        consignor_name: "consignor_name",
        consignor_gst: "consignor_gst",
        consignor_id: "consignor_id",
        bilty_charge: "bilty_charge",
        door_delivery_charge: "door_del_charge",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "consignor_gst",
      },
      idClearanceNeeded: "consignor_id",
      inputDataNeededInSuggestions: false,
      inputDataFilter: {
        pay_type: "same",
      },
    },
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
    {
      label: "Consignee Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignee_name",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsigneeSuggestions",
      url: SERVER_URL + "/consignee/",
      suggestionKeyword: "consignee_name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "consignee_id",
      suggestionKeywordExtra: "consignee_gst",
      suggestionSchema: {
        consignee_name: "consignee_name",
        consignee_gst: "consignee_gst",
        consignee_id: "consignee_id",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "consignee_gst",
      },
      idClearanceNeeded: "consignee_id",
    },
    {
      label: "Consignee GST",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "consignee_gst",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsigneeSuggestions",
      url: SERVER_URL + "/consignee/",
      suggestionKeyword: "consignee_gst",
      suggestionKeywordForFetchApiArgs: "gst",
      suggestionChooseQueryKeyword: "consignee_id",
      suggestionSchema: {
        consignee_name: "consignee_name",
        consignee_gst: "consignee_gst",
        consignee_id: "consignee_id",
      },
      apiCallRequiredOnGetValue: true,
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        nextOnRow: "True",
        nextOnRowField: "item_name",
        nextOnRowTableName: "item_in",
        Enter: "Item Name",
      },
      idClearanceNeeded: "consignee_id",
    },
  ],
  "group-2": [
    {
      label: "No. Of Package",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "no_of_package",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
    },
    {
      label: "Actual Weight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "actual_weight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      // keyboardNavigationMap: {
      //   Enter: "charge_weight",
      // },
    },
    {
      label: "Charge Weight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "charge_weight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      // keyboardNavigationMap: {
      //   Enter: "private_marka_no",
      // },
    },
    // {
    //   label: "Type Of Packaging",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "packing_type",
    //   type: "dropdown",
    //   dropdown_items: [
    //     { value: "1", label: "Carton" },
    //     { value: "2", label: "Cargo" },
    //     { value: "3", label: "Bag" },
    //     { value: "4", label: "Bundle" },
    //     { value: "5", label: "Bucket" },
    //   ],
    //   placeHolder: "",
    //   keyboardNavigationMap:{
    //     "Enter": "private_marka_no"
    //   }
    // },
    {
      label: "Private Marka No.",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "private_marka_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "goods_invoice_value",
      },
    },
    {
      label: "Goods/Invoice Value",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "goods_invoice_value",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "^(?:[0-9]+d*|d)$",
      keyboardNavigationMap: {
        Enter: "delivery_dest_type",
      },
    },
    {
      label: "Delivery Type",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "delivery_dest_type",
      type: "dropdown",
      dropdown_items: [
        { value: "1", label: "Door" },
        { value: "2", label: "Godown" },
        { value: "3", label: "Priority" },
      ],
      placeHolder: "",
      keyboardNavigationMap: {
        Enter: "remarks",
      },
    },
    {
      label: "Remarks",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "remarks",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "hamali",
      },
    },
    {
      label: "Total Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "total_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
  ],
  "group-3": [
    {
      label: "MR No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
    {
      label: "Party Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_party_name",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]"
    },
    {
      label: " Transport Freight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "transporter_freight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "door_del_charge",
      // },
    },
    {
      label: "Crossing Outward No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_outward_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "bilty_charge",
      // },
    },
    {
      label: "Crossing Transport",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_outward_transporter",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "other_amount",
      },
    },
    {
      label: "Crossing Inward No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_inward_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bilty_charge",
      },
    },
    {
      label: "Crossing Inward Transport",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_inward_transporter",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bilty_charge",
      },
    },
    {
      label: "Final Del. Amount",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_total_amount",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "save_button",
      },
    },
    {
      label: "POD Chalan No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pod_chalan_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "pod_chalan_date",
      },
    },
    {
      label: "POD Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pod_chalan_date",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bilty_charge",
      },
    },
    {
      label: "POD Statement",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pod_statement_no",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bilty_charge",
      },
    },
    {
      label: "POD Statement Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "pod_statement_date",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "bilty_charge",
      },
    },
    // {
    //   label: "Total Amount",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "total_amount",
    //   type: "text",
    //   placeHolder: "",
    //   toValidate: false,
    //   regExpValidation: "[a-zA-z]",
    // },
  ],
  "group-6": [
    {
      label: "MR Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_date",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
    },
    {
      label: "Marfatiya",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "marfatiya",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        conditionalNav: true,
        conditionalNavFunct: (pageState) => {
          if (pageState.is_crossing == "N") {
            return "door_del_charge";
          } else {
            return "transporter_freight";
          }
        },
      },
    },
    {
      label: " Transport Freight",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "transporter_freight",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "door_del_charge",
      },
    },
    {
      label: "Crossing Outward Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_outward_date",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "bilty_charge",
      // },
    },
    {
      label: "Crossing Station",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_outward_branch",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "other_amount",
      // },
    },
    {
      label: "Crossing Inward Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_inward_date",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "bilty_charge",
      // },
    },
    {
      label: "Crossing Inward Branch",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "crossing_inward_branch",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "bilty_charge",
      // },
    },
    {
      label: "Receiver Name",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "mr_receiver_name",
      type: "text",
      placeHolder: "",
      toValidate: false,
      regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "save_button",
      // },
    },
  ],
  "group-4": [
    {
      label: "Booking Chalan No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "booking_chalan_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "MR No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "mr_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "Trip No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "trip_no",
      type: "text",
      placeHolder: "",
    },
    {
      label: "Crossing Inward No.",
      className: "form-row",
      labelClassName: "field-label",
      inputClassName: "field-value",
      name: "crossing_inward_no",
      type: "text",
      placeHolder: "",
    },
  ],
  "group-5": [
    {
      label: "Paid Statement No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "paid_statement_no",
      type: "text",
      placeHolder: "",
      // apiConfigKey: "getCitySuggestions",
      // url: SERVER_URL + "/branch/",
      // suggestionKeyword: "name",
      // suggestionKeywordForFetchApiArgs: "name",
      // suggestionChooseQueryKeyword: "branch_id",
      // apiCallRequiredOnGetValue: true,
      suggestionSchema: {
        branch_id: "station_from",
        name: "station_from_name",
      },
      // toValidate: true,
      regExpValidation: "[a-zA-z]",
      keyboardNavigationMap: {
        Enter: "station_to_name",
      },
      // valueVerificationFromSuggestionNeeded: true,
      // valueVerificationCompulsionField: "station_from",
    },
    {
      label: "Paid Statement Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "paid_statement_date",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      // suggestionSchema: {
      //   branch_id: "station_to",
      //   name: "station_to_name",
      // },
      // toValidate: true,
      // regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "destination_name",
      // },
      // valueVerificationFromSuggestionNeeded: true,
      // valueVerificationCompulsionField: "station_to",
    },
    {
      label: "TBB Bill No",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "tbb_bill_no",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getCitySuggestions",
      url: SERVER_URL + "/branch/",
      suggestionKeyword: "name",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "branch_id",
      apiCallRequiredOnGetValue: true,
      // suggestionSchema: {
      //   branch_id: "destination",
      //   name: "destination_name",
      // },
      // toValidate: true,
      // regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "pay_type",
      // },
      // valueVerificationFromSuggestionNeeded: true,
      // valueVerificationCompulsionField: "destination",
    },
    {
      label: "TBB Bill Date",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "tbb_bill_date",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsignorSuggestions",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "consignor_gst",
      suggestionKeywordForFetchApiArgs: "gst",
      suggestionChooseQueryKeyword: "consignor_id",
      // suggestionSchema: {
      //   consignor_name: "consignor_name",
      //   consignor_gst: "consignor_gst",
      //   consignor_id: "consignor_id",
      // },
      // apiCallRequiredOnGetValue: true,
      // toValidate: false,
      // regExpValidation:
      //   "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
      // keyboardNavigationMap: {
      //   Enter: "consignee_name",
      // },
      // idClearanceNeeded: "consignor_id",
    },

    {
      label: "DD Expences",
      className: "form-row",
      labelClassName: "form-label",
      inputClassName: "form-input",
      name: "door_del_charge",
      type: "text",
      placeHolder: "",
      apiConfigKey: "getConsignorSuggestions",
      url: SERVER_URL + "/consignor/",
      suggestionKeyword: "consignor_name",
      suggestionKeywordExtra: "consignor_gst",
      suggestionKeywordForFetchApiArgs: "name",
      suggestionChooseQueryKeyword: "consignor_id",
      // suggestionChooseQueryKeywordCustom: (suggestion, pageState)=> {
      //   return String(suggestion.consignor_id)+"?bilty_type="+String(pageState.pay_type);
      // },
      // suggestionSchema: {
      //   consignor_name: "consignor_name",
      //   consignor_gst: "consignor_gst",
      //   consignor_id: "consignor_id",
      //   bilty_charge: "bilty_charge",
      //   door_delivery_charge: "door_del_charge",
      // },
      // apiCallRequiredOnGetValue: true,
      // toValidate: true,
      // regExpValidation: "[a-zA-z]",
      // keyboardNavigationMap: {
      //   Enter: "consignor_gst",
      // },
      // idClearanceNeeded: "consignor_id",
      // inputDataNeededInSuggestions: false,
      // inputDataFilter: {
      //   pay_type: "same",
      // },
    },
    // {
    //   label: "Consignor GST",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "consignor_gst",
    //   type: "text",
    //   placeHolder: "",
    //   apiConfigKey: "getConsignorSuggestions",
    //   url: SERVER_URL + "/consignor/",
    //   suggestionKeyword: "consignor_gst",
    //   suggestionKeywordForFetchApiArgs: "gst",
    //   suggestionChooseQueryKeyword: "consignor_id",
    //   suggestionSchema: {
    //     consignor_name: "consignor_name",
    //     consignor_gst: "consignor_gst",
    //     consignor_id: "consignor_id",
    //   },
    //   apiCallRequiredOnGetValue: true,
    //   toValidate: false,
    //   regExpValidation:
    //     "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$",
    //   keyboardNavigationMap: {
    //     Enter: "consignee_name",
    //   },
    //   idClearanceNeeded: "consignor_id",
    // },
    // {
    //   label: "Consignee Name",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "consignee_name",
    //   type: "text",
    //   placeHolder: "",
    //   apiConfigKey: "getConsigneeSuggestions",
    //   url: SERVER_URL + "/consignee/",
    //   suggestionKeyword: "consignee_name",
    //   suggestionKeywordForFetchApiArgs: "name",
    //   suggestionChooseQueryKeyword: "consignee_id",
    //   suggestionKeywordExtra: "consignee_gst",
    //   suggestionSchema: {
    //     consignee_name: "consignee_name",
    //     consignee_gst: "consignee_gst",
    //     consignee_id: "consignee_id",
    //   },
    //   apiCallRequiredOnGetValue: true,
    //   toValidate: true,
    //   regExpValidation: "[a-zA-z]",
    //   keyboardNavigationMap: {
    //     Enter: "consignee_gst",
    //   },
    //   idClearanceNeeded: "consignee_id",
    // },
    // {
    //   label: "Consignee GST",
    //   className: "form-row",
    //   labelClassName: "form-label",
    //   inputClassName: "form-input",
    //   name: "consignee_gst",
    //   type: "text",
    //   placeHolder: "",
    //   apiConfigKey: "getConsigneeSuggestions",
    //   url: SERVER_URL + "/consignee/",
    //   suggestionKeyword: "consignee_gst",
    //   suggestionKeywordForFetchApiArgs: "gst",
    //   suggestionChooseQueryKeyword: "consignee_id",
    //   suggestionSchema: {
    //     consignee_name: "consignee_name",
    //     consignee_gst: "consignee_gst",
    //     consignee_id: "consignee_id",
    //   },
    //   apiCallRequiredOnGetValue: true,
    //   toValidate: false,
    //   regExpValidation: "^(?:[0-9]+d*|d)$",
    //   keyboardNavigationMap: {
    //     nextOnRow: "True",
    //     nextOnRowField: "item_name",
    //     nextOnRowTableName: "item_in",
    //     Enter: "Item Name",
    //   },
    //   idClearanceNeeded: "consignee_id",
    // },
  ],
};

const dataObject = {
  station_from: "",
  station_from_name: "",
  station_to: "",
  station_to_name: "",
  destination: "",
  destination_name: "",
  pay_type: "1",
  consignor_id: "",
  consignee_id: "",
  consignee_name: "",
  consignee_gst: "",
  consignor_name: "",
  consignor_gst: "",
  no_of_package: "",
  actual_weight: "",
  tbb_bill_no:"",
  tbb_bill_date:"",
  door_delivery_charge:"",
  paid_statement_no:"",
  paid_statement_date:"",
  crossing_inward_no:"",
  crossing_inward_date:"",
  crossing_outward_no:"",
  crossing_outward_date:"",
  crossing_inward_transporter:"",
  crossing_outward_transporter:"",
  crossing_outward_branch:"",
  crossing_inward_branch:"",
  mr_no:"",
  mr_date:"",
  pod_chalan_date:"",
  mr_receiver_name:"",
  mr_party_name:"",
  charge_weight: "",
  // packing_type: "1",
  private_marka_no: "",
  goods_invoice_value: "",
  delivery_dest_type: "2",
  remarks: "",
  bilty_charge: "",
  bilty_no: "",
  bilty_id: "",
  other_amount: "",
  freight: "",
  hamali: "",
  door_del_charge: "",
  total_amount: "",
  is_printed: "",
  tracking_status: "1",
  created_from: "",
  paid_statement:"",
  created_by: "",
  input_date: new Date(),
  booking_chalan_no: "",
  is_crossing: "N",
  suffix: "",
  suffix_options: [],
  transporter_name: "",
  transporter_id: "",
  transporter_freight: "",
  last_suffix: "",
  chalan_info:[],
  crossing_inward_no: "",
  pod_statement_no: "",
  pod_chalan_no: "",
  pod_statement_date: "",
  eway_bill_no: [
    {
      eway_bill_no: "",
      new_row: "N",
    },
  ],
  item_in: [
    {
      amount: "",
      item_name: "",
      pkgs: "",
      rate: "",
      unit: "C",
      weight: "",
      new_row: "N",
      packing_type: "1",
    },
  ],
  fyearList: [],
  fyear_get_bilty: "",
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
  for (let group_name of groupNames) {
    for (let i = 0; i < groupInfo[group_name].length; i++) {
      let field_object = groupInfo[group_name][i];
      if (
        field_object.name == "transporter_name" &&
        values.is_crossing == "N"
      ) {
        continue;
      }
      if (field_object.toValidate) {
        validator(field_object.name, field_object.regExpValidation);
      }
    }
  }
  // On submit consingor and consignee gst check
  if (values.consignor_gst == "" && values.consignee_gst == "") {
    errors.consignor_gst = "error";
    errors.consignee_gst = "error";
  } else {
    const regexStringForGST =
      "^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
    var regex = new RegExp(regexStringForGST);
    if (values.consignor_gst != "" && !regex.test(values.consignor_gst)) {
      errors.consignor_gst = "Invalid GST";
    }
    if (values.consignee_gst != "" && !regex.test(values.consignee_gst)) {
      errors.consignee_gst = "Invalid GST";
    }
  }
  return errors;
}

const generateBiltyDataObjectForVerificationFromSuggestions = () => {
  let myObject = {};
  for (let groupKey in groupInfo) {
    for (let index = 0; index < groupInfo[groupKey].length; index++) {
      let infoObject = groupInfo[groupKey][index];
      if ("valueVerificationFromSuggestionNeeded" in infoObject) {
        myObject[infoObject.name] =
          infoObject.valueVerificationFromSuggestionNeeded;
      }
    }
  }
  return myObject;
};

const generateBiltyDataObjectForIdClearance = () => {
  let myObject = {};
  for (let groupKey in groupInfo) {
    for (let index = 0; index < groupInfo[groupKey].length; index++) {
      let infoObject = groupInfo[groupKey][index];
      if ("idClearanceNeeded" in infoObject) {
        myObject[infoObject.name] = {
          fieldToClear: infoObject.idClearanceNeeded,
          value: "",
        };
      }
    }
  }
  return myObject;
};

const tripChallanTableHeader = [
  { label: "S. No.", className: "text-center table-header" },
  { label: "Challan No.", className: "text-center table-header" },
  { label: "Challan Date", className: "text-center table-header" },
  { label: "Vehicle No.", className: "text-center table-header" },
  { label: "Station From", className: "text-center table-header" },
  { label: "Station To", className: "text-center table-header" },
  // { label: "Destination", className: "text-center table-header" },
  { label: "Bhada Chitthi No", className: "text-center table-header" },
  //   { label: "Pay Type", className: "text-center table-header" },
  //   { label: "Consignor Name", className: "text-center table-header" },
  //   { label: "Consignor Gst", className: "text-center table-header" },
  //   { label: "Consignee Name", className: "text-center table-header" },
  //   { label: "Consignee Gst", className: "text-center table-header" },
  //   { label: "No Of Package", className: "text-center table-header" },
  //   { label: "Actual Weight", className: "text-center table-header" },
  //   { label: "Charge Weight", className: "text-center table-header" },
  //   { label: "Packing Type", className: "text-center table-header" },
  //   { label: "Private Marka No", className: "text-center table-header" },
  //   { label: "Goods Invoice Value", className: "text-center table-header" },
  //   { label: "Delivery Dest Type", className: "text-center table-header" },
  //   { label: "Remarks", className: "text-center table-header" },
  //   { label: "Bilty Charge", className: "text-center table-header" },
  //   { label: "Other Amount", className: "text-center table-header" },
  //   { label: "Freight", className: "text-center table-header" },
  //   { label: "Hamali", className: "text-center table-header" },
  //   { label: "Door Del Charge", className: "text-center table-header" },
  { label: "Created From", className: "text-center table-header" },
  { label: "Created By", className: "text-center table-header" },
];

const tripChallanTableItems = [
  {
    type: "text",
    name: "booking_chalan_no",
    label: "Bilty No",
    className: "form-control-medium-col",
  },
  {
    type: "text",
    name: "booking_chalan_date",
    label: "Bilty Date",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "vehicle_no",
    label: "Vehicle No",
    className: "form-control-medlarge-col",
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
  // {
  //   type: "text",
  //   name: "destination_name",
  //   label: "Destination",
  //   className: "form-control-large-col",
  // },
  {
    type: "text",
    name: "trip_no",
    label: "Bhada Chitthi No",
    className: "form-control-medlarge-col",
  },
  //   {
  //     type: "text",
  //     name: "pay_type",
  //     label: "Pay Type",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignor_name",
  //     label: "Consignor Name",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignor_gst",
  //     label: "Consignor Gst",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignee_name",
  //     label: "Consignee Name",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "consignee_gst",
  //     label: "Consignee Gst",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "no_of_package",
  //     label: "No Of Package",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "actual_weight",
  //     label: "Actual Weight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "charge_weight",
  //     label: "Charge Weight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "packing_type",
  //     label: "Packing Type",
  //     className: "form-control-large-col",
  //   },
  //   {
  //     type: "text",
  //     name: "private_marka_no",
  //     label: "Private Marka No",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "goods_invoice_value",
  //     label: "Goods Invoice Value",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "delivery_dest_type",
  //     label: "Delivery Dest Type",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "remarks",
  //     label: "Remarks",
  //     className: "form-control-medium-col",
  //   },
  //   {
  //     type: "text",
  //     name: "bilty_charge",
  //     label: "Bilty Charge",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "other_amount",
  //     label: "Other Amount",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "freight",
  //     label: "Freight",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "hamali",
  //     label: "Hamali",
  //     className: "form-control-small-col",
  //   },
  //   {
  //     type: "text",
  //     name: "door_del_charge",
  //     label: "Door Del Charge",
  //     className: "form-control-small-col",
  //   },
  {
    type: "text",
    name: "created_from_name",
    label: "Created From",
    className: "form-control-medlarge-col",
  },
  {
    type: "text",
    name: "created_by",
    label: "Created By",
    className: "form-control-medlarge-col",
  },
];

const popupInfo = {
  "success_header": "Bilty Saving Successful ",
  "error_header": "Error In Bilty Module ",
  "success_title": "Bilty is successfully created with the following info:-",
  "field_label_success": "Bilty No.",
  "field_name_success": "bilty_no",
  "error_title": "Error in bilty module with the following info:-",
  "field_label_error": "Error:"
}

const BiltyDataObjectForVerificationFromSuggestion =
  generateBiltyDataObjectForVerificationFromSuggestions();
const BiltyDataObjectForIdClearance = generateBiltyDataObjectForIdClearance();

// const biltyValidations =  {
//   bilty_id: yup.number({"bilty_id": "Bilty should be string"}),
// }
export {
  groupInfo,
  groupNames,
  dataObject,
  validate,
  tripChallanTableHeader,
  tripChallanTableItems,
  BiltyDataObjectForVerificationFromSuggestion,
  BiltyDataObjectForIdClearance,
  popupInfo
};
