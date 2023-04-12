import { forEach } from "lodash";
import { SERVER_URL } from "../config/config.js";
import {
  additionalFilterOnInputForBilty,
  additionalFilterOnResponseForGetEwb,
} from "../utils/biltyUtils.js";
import { additionalFilterOnInputForMr } from "../utils/mrUtils.js";

const lodash = require("lodash");

const biltyApiConfig = {
  getBilty: {
    responseSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      bilty_id: "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_info: "item_in",
      eway_bill_info: "eway_bill_no",
      is_deleted: "same",
      bilty_date: "input_date",
      booking_chalan_no: "same",
      mr_no: "same",
      trip_no: "same",
      total_amount: "same", // what for same ?
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      crossing_inward_no: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input object", inputObject);
      if (inputObject.eway_bill_info.length == 0) {
        inputObject.eway_bill_info = [
          {
            eway_bill_no: "",
            new_row: "N",
          },
        ];
      }
      return inputObject;
    },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      private_marka_no: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveBilty: {
    paramSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyBilty: {
    paramSchema: {
      bilty_id:"same",
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
    paramSchema: {
      pay_type: "same",
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/id",
    methodType: "POST",
    respoonseSchema: {},
    tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const biltyInquiryApiConfig = {
  getBiltyInquiry: {
    responseSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      tbb_bill_no:"same",
      tbb_bill_date:"same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      bilty_id: "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_info: "item_in",
      eway_bill_info: "eway_bill_no",
      is_deleted: "same",
      marfatiya: "same",
      mr_party_name: "same",
      mr_date: "same",
      mr_total_amount: "same",
      mr_receiver_name: "same",
      pod_chalan_date: "same",
      bilty_date: "input_date",
      paid_statement_no: "same",
      paid_statement_date: "same",
      crossing_inward_no: "same",
      crossing_inward_date: "same",
      crossing_outward_no: "same",
      crossing_outward_date: "same",
      crossing_outward_transporter: "same",
      crossing_outward_branch: "same",
      crossing_inward_branch: "same",
      booking_chalan_no: "same",
      mr_no: "same",
      trip_no: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      chalan_info: "same",
      suffix: "same",
      transporter_freight: "same",
      crossing_inward_no: "same",
      owned_by_name: "same",
      pod_statement_no: "same",
      pod_statement_date: "same",
      fyear: "fYear_get",
      flag: "flag",
      pod_chalan_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input object", inputObject);
      if (inputObject.eway_bill_info?.length == 0) {
        inputObject.eway_bill_info = [
          {
            eway_bill_no: "",
            new_row: "N",
          },
        ];
      }
      return inputObject;
    },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      private_marka_no: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveBilty: {
    paramSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyBilty: {
    paramSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
    paramSchema: {
      pay_type: "same",
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/id",
    methodType: "POST",
    respoonseSchema: {},
    tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const biltyAcknowledgementApiConfig = {
  getBiltyInquiry: {
    responseSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      bilty_id: "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_info: "item_in",
      eway_bill_info: "eway_bill_no",
      is_deleted: "same",
      marfatiya: "same",
      mr_party_name: "same",
      mr_date: "same",
      mr_total_amount: "same",
      mr_receiver_name: "same",
      pod_chalan_date: "same",
      bilty_date: "input_date",
      paid_statement_no: "same",
      paid_statement_date: "same",
      crossing_inward_no: "same",
      crossing_inward_date: "same",
      crossing_outward_no: "same",
      crossing_outward_date: "same",
      crossing_outward_transporter: "same",
      crossing_outward_branch: "same",
      crossing_inward_branch: "same",
      booking_chalan_no: "same",
      mr_no: "same",
      trip_no: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      chalan_info: "same",
      suffix: "same",
      transporter_freight: "same",
      crossing_inward_no: "same",
      owned_by_name: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input object", inputObject);
      if (inputObject.eway_bill_info.length == 0) {
        inputObject.eway_bill_info = [
          {
            eway_bill_no: "",
            new_row: "N",
          },
        ];
      }
      return inputObject;
    },
  },

};
const challanApiConfig = {
  getChallan: {
    responseSchema: {
      booking_chalan_no: "challan_no",
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      license_no: "same",
      remarks: "same",
      created_by: "same",
      bilty_info: "bilty_ids",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      is_deleted: "same",
      phone_no:"same",
      bilty_no: "",
      No: "",
      booking_chalan_date: "input_date",
      cewb_no: "same",
      is_inwarded: "same",
      manual_no: "same",
      trip_no: "same",
      fyear: "fYear_get",
      transaction_id: "same",
    },
    url: SERVER_URL + "/challan/",
    methodType: "GET",
  },
  getManualChallan: {
    responseSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      license_no: "same",
      remarks: "same",
      created_by: "same",
      bilty_info: "bilty_ids",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      is_deleted: "same",
      phone_no:"same",
      bilty_no: "",
      booking_chalan_no: "challan_no",
      booking_chalan_date: "input_date",
      cewb_no: "same",
      is_inwarded: "same",
      multiple_manual_chalan: "same",
    },
    url: SERVER_URL + "/challan/manual/",
    methodType: "GET",
  },
  generateCwb: {
    responseSchema: {
      status: "same",
      cewb_no: "same",
    },
    url: SERVER_URL + "/ewb/consolidated/",
    methodType: "GET",
  },
  saveChallan: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      license_no: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "bilty_nos",
      driver_name: "same",
      owner_name: "same",
      input_date: "booking_chalan_date",
      cewb_no: "same",
      phone_no: "same",
      created_by_name:"same",
      manual_no: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/challan/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.challan_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      if (inputObject.cewb_no == "") {
        inputObject.cewb_no = null;
      }
      if (inputObject.manual_no == "") {
        inputObject.manual_no = null;
      }
      return inputObject;
    },
  },
  modifyChallan: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "bilty_nos",
      driver_name: "same",
      created_by_name:"same",
      owner_name: "same",
      challan_no: "booking_chalan_no",
      input_date: "booking_chalan_date",
      cewb_no: "same",
      phone_no: "same",
      manual_no: "same",
      company_id: "companyId",
      fYear_get: "fyear",
      transaction_id: "same",
      role_id: "same",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/challan/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.challan_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
    
      console.log(inputObject);
      if(inputObject.transaction_id == "") {
          inputObject.transaction_id = null;
      }
      if (inputObject.cewb_no == "") {
        inputObject.cewb_no = null;
      }
      if (inputObject.manual_no == "") {
        inputObject.manual_no = null;
      }
      return inputObject;
    },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};
const fleetApiConfig = {
  getFleet: {
    responseSchema: {
        total_final_amount: "same",
        trip_info: "same",
        vehicle_no: "same",
        vehicle_id: "same",
        driver_name: "same",
        start_km: "same",
        end_km: "same",
        depart_date: "same",
        arrive_date: "same",
        journey_avg: "same",
        journey_diesel: "same",
        journey_km: "same",
        fleet_date: "same",
    },
    url: SERVER_URL + "/fleet_master/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObj) => {
        inputObj.total_final_amount = parseFloat(inputObj.total.total_amount);

        if(inputObj.total.balance_type == "dr") {
            inputObj.total_final_amount *= -1;
        }

        return inputObj;
    }
  },
  saveFleet: {
    paramSchema: {
        trip_info: "same",
        fleet_no: "same",
        vehicle_no: "same",
        vehicle_id: "same",
        driver_name: "same",
        start_km: "same",
        end_km: "same",
        depart_date: "same",
        arrive_date: "same",
        journey_avg: "same",
        journey_diesel: "same",
        journey_km: "same",
        fleet_date: "same",
        fleet_date: "same",
    },
    responseSchema: {
      fleet_no: "fleet_no",
    },
    url: SERVER_URL + "/fleet_master/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
        console.log(text);
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.fleet_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      if (inputObject.fleet_no == "") {
        inputObject.fleet_no = null;
      }

      let tripInfo = inputObject.trip_info;

      tripInfo = tripInfo.map((entry) => {
          for(let key in entry) {
              if(entry[key] == "") {
                  entry[key] = null;
              }
          }
          return entry;
      })

      inputObject.trip_info = tripInfo;

      console.log(inputObject);

      return inputObject;
    },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};
const stockOutwardApiConfig = {
  getStockOutward: {
    responseSchema: {
        "type": "same",
        "outward_type": "same",
        "outward_date": "same",
        "station_from": "same",
        "station_from_name": "same",
        "station_to": "same",
        "station_to_name": "same",
        "inwarded": "same",
        "remark": "same",
        "fyear": "same",
        "receive_user": "same",
        "item_info": "same",
        "id": "same",
    },
    url: SERVER_URL + "/stock_register/",
    methodType: "GET",
    // additionalFilterOnResponse: (inputObj) => {
    //     inputObj.total_final_amount = parseFloat(inputObj.total.total_amount);

    //     if(inputObj.total.balance_type == "dr") {
    //         inputObj.total_final_amount *= -1;
    //     }

    //     return inputObj;
    // }
  },
  saveStockOutward: {
    paramSchema: {
        "type": "same",
        "outward_type": "same",
        "outward_date": "same",
        "station_from": "same",
        "station_to": "same",
        "inwarded": "same",
        "remark": "same",
        "receive_user": "same",
        "item_info": "same",
        fYear: "fyear",
        company_id: "companyId",
    },
    responseSchema: {
      register_no: "register_no",
    },
    url: SERVER_URL + "/stock_register/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    additionalFilterOnInput: (inputObject) => {
        
        let tmp = ["companyId", "inwarded", "outward_type", "station_from", "station_to", "type"];

        for(let key in inputObject) {
            if(tmp.indexOf(key) > -1) {
                inputObject[key] = parseInt(inputObject[key]);
            }
        }
  
        return inputObject;
    },
    validateResponse: (text) => {
        console.log(text);
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.register_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
  },
  editStockOutward: {
    paramSchema: {
        id: "same",
    },
    url: SERVER_URL + "/stock_register/inward",
    methodType: "POST",
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
};
const stockInwardApiConfig = {
  getStockInward: {
    responseSchema: {
        "type": "same",
        "inward_date": "same",
        "station_to": "same",
        "station_to_name": "same",
        "remark": "same",
        "bill_no": "same",
        "vendor": "same",
        "payment_status": "same",
        "item_info": "same",
        "fyear": "same",
        "id": "same",
    },
    url: SERVER_URL + "/stock_register/",
    methodType: "GET",
  },
  saveStockInward: {
    paramSchema: {
        "type": "same",
        "inward_date": "same",
        "station_to": "same",
        "remark": "same",
        "fyear": "same",
        "companyId": "same",
        "bill_no": "same",
        "vendor": "same",
        "payment_status": "same",
        "item_info": "same",
        fYear: "fyear",
        company_id: "companyId",
    },
    responseSchema: {
      register_no: "register_no",
    },
    url: SERVER_URL + "/stock_register/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    additionalFilterOnInput: (inputObject) => {
        
        let tmp = ["station_to", "bill_no", "payment_Status", "type"];

        for(let key in inputObject) {
            if(tmp.indexOf(key) > -1) {
                inputObject[key] = parseInt(inputObject[key]);
            }
        }
  
        return inputObject;
    },
    validateResponse: (text) => {
        console.log(text);
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.register_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
  },
  editStockOutward: {
    paramSchema: {
        id: "same",
    },
    url: SERVER_URL + "/stock_register/inward",
    methodType: "POST",
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
};

const separateEwbApiConfig = {
    getChallan: {
      responseSchema: {
        booking_chalan_no: "challan_no",
        station_from: "same",
        station_to: "same",
        destination: "same",
        station_from_name: "same",
        station_to_name: "same",
        destination_name: "same",
        vehicle_id: "same",
        vehicle_no: "same",
        created_from: "same",
        license_no: "same",
        remarks: "same",
        created_by: "same",
        bilty_info: "bilty_ids",
        driver_name: "same",
        owner_name: "same",
        status: "same",
        is_deleted: "same",
        phone_no:"same",
        bilty_no: "",
        No: "",
        booking_chalan_date: "input_date",
        cewb_no: "same",
        is_inwarded: "same",
        manual_no: "same",
        trip_no: "same",
      },
      url: SERVER_URL + "/separate-ewb/",
      methodType: "GET",
    },
    getManualChallan: {
      responseSchema: {
        station_from: "same",
        station_to: "same",
        destination: "same",
        station_from_name: "same",
        station_to_name: "same",
        destination_name: "same",
        vehicle_id: "same",
        vehicle_no: "same",
        created_from: "same",
        license_no: "same",
        remarks: "same",
        created_by: "same",
        bilty_info: "bilty_ids",
        driver_name: "same",
        owner_name: "same",
        status: "same",
        is_deleted: "same",
        phone_no:"same",
        bilty_no: "",
        booking_chalan_no: "challan_no",
        booking_chalan_date: "input_date",
        cewb_no: "same",
        is_inwarded: "same",
        multiple_manual_chalan: "same",
      },
      url: SERVER_URL + "/challan/manual/",
      methodType: "GET",
    },
    generateCwb: {
      responseSchema: {
        status: "same",
        cewb_no: "same",
      },
      url: SERVER_URL + "/ewb/consolidated/separate/",
      methodType: "GET",
    },
    saveChallan: {
      paramSchema: {
        challan_no: "booking_chalan_no",
        station_from: "station_from",
        station_to: "station_to",
        vehicle_no: "vehicle_no",
        created_from: "created_from",
        driver_name: "driver_name",
        phone_no: "phone_no",
        remarks: "remarks",
        cewb_no: "cewb_no",
        is_inwarded: "is_inwarded",
        input_date: "booking_chalan_date",
        created_by: "created_by",
        status: "status", 
        bilty_ids: "bilty_nos",        
      },
      responseSchema: {
        booking_chalan_no: "challan_no",
        status: "same",
      },
      url: SERVER_URL + "/separate-ewb/",
      methodType: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        if (!text.challan_no) {
          console.log("In fff");
          throw new Error("The required value must be a number fff");
        }
      },
      additionalFilterOnInput: (inputObject) => {
            // console.log("III", inputObject.booking_chalan_no);
        if (inputObject.booking_chalan_no == "") {
            inputObject.booking_chalan_no = null;
        }  
        if (inputObject.cewb_no == "") {
            inputObject.cewb_no = null;
        }   
        if (inputObject.is_inwarded == "") {
            inputObject.is_inwarded = "0";
        }   
        if (inputObject.status == "") {
            inputObject.status = "1";
        }   
        return inputObject;
        },
    },
    modifyChallan: {
      paramSchema: {
        challan_no: "booking_chalan_no",
        station_from: "station_from",
        station_to: "station_to",
        vehicle_no: "vehicle_no",
        created_from: "created_from",
        driver_name: "driver_name",
        phone_no: "phone_no",
        remarks: "remarks",
        cewb_no: "cewb_no",
        is_inwarded: "is_inwarded",
        input_date: "booking_chalan_date",
        created_by: "created_by",
        status: "status", 
        bilty_ids: "bilty_nos", 
      },
      responseSchema: {
        booking_chalan_no: "challan_no",
        status: "same",
      },
      url: SERVER_URL + "/separate-ewb/",
      methodType: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        if (!text.challan_no) {
          console.log("In fff");
          throw new Error("The required value must be a number fff");
        }
      },
      additionalFilterOnInput: (inputObject) => {
        // console.log("III", inputObject.booking_chalan_no);
        if (inputObject.booking_chalan_no == "") {
            inputObject.booking_chalan_no = null;
        }  
        if (inputObject.cewb_no == "") {
            inputObject.cewb_no = null;
        }   
        if (inputObject.is_inwarded == "") {
            inputObject.is_inwarded = "0";
        }   
        if (inputObject.status == "") {
            inputObject.status = "1";
        }   
        return inputObject;
        },
    },
    getCitySuggestions: {
      paramSchema: {},
      url: SERVER_URL + "/branch/",
      methodType: "GET",
      respoonseSchema: {},
    },
    getVehicleSuggestions: {
      paramSchema: {},
      url: SERVER_URL + "/vehicle/",
      methodType: "GET",
      respoonseSchema: {},
    },
  };

const accountTransactionApiConfig = {
  getPage: {
    responseSchema: {
      account_transaction_info: "same",
      input_date: "same",
      total_amount: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/account_trans/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      let newList = [];
      let dummyObject = {};
      let outputObj = {};
      // inputObject.reverse()
      for (let i = 0; i < inputObject.length; i++) {
        if (i % 2 == 0) {
          dummyObject = {};
          console.log("Input o", inputObject[i]);
          console.log("input i", inputObject[i + 1]);
          dummyObject.voucher_type = inputObject[i].voucher_type;
          (dummyObject.consignor_id = inputObject[i].party_id),
            (dummyObject.consignor_name = inputObject[i].party_name);
          dummyObject.amount = inputObject[i].debit;
          dummyObject.consignee_id = inputObject[i + 1].party_id;
          dummyObject.consignee_name = inputObject[i + 1].party_name;
          dummyObject.remarks = inputObject[i].remarks;
          dummyObject.cheque_no = inputObject[i].cheque_no;
          dummyObject.bank_name = inputObject[i].bank_name;
          dummyObject.unique_id = inputObject[i].unique_id;
          dummyObject.voucher_id = inputObject[i].voucher_id;
          dummyObject.created_from = inputObject[i].created_from;
          dummyObject.created_by = inputObject[i].created_by;
          dummyObject.account_id = inputObject[i].account_id;
          dummyObject.date = inputObject[i].date;
          dummyObject.clearance_status = inputObject[i].clearance_status ?? inputObject[i + 1].clearance_status;
          dummyObject.clearance_date = inputObject[i].clearance_date ?? inputObject[i + 1].clearance_date;
          newList.push(dummyObject);
        }
      }
      outputObj.account_transaction_info = newList;
      outputObj.input_date = outputObj.account_transaction_info[0].date
      let total_amount = 0;
      for (let i=0; i < outputObj.account_transaction_info.length; i++){
        total_amount += outputObj.account_transaction_info[i].amount
      }
      outputObj.total_amount = total_amount
      console.log("Out onbjk", outputObj);
      return outputObj;
    },
  },
  savePage: {
    paramSchema: {
      account_transaction_info: "same",
      input_date : "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      status: "same",
      voucher_id: "id",
    },
    url: SERVER_URL + "/account_trans/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.challan_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    reverseArr: (input) => {
      var ret = new Array;
      for(var i = input.length-1; i >= 0; i--) {
          ret.push(input[i]);
      }
      return ret;
    },
    additionalFilterOnInput: (inputObject) => {
        console.log("!!!!!!!!!!!!!!!!1" , inputObject);
      let listToSend = [];
      let newObj = {};
      let objToProcess = {};
      let outputObj = {};
      // inputObject = reverseArr(inputObject)
      var ret = new Array;
      for(let i = 0; i < inputObject.account_transaction_info.length; i++) {
        inputObject.account_transaction_info[i].date = new Date(inputObject.input_date).toISOString()
        ret.push(inputObject.account_transaction_info[i]);
      }
      inputObject.account_transaction_info = ret
      for (let i = 0; i < inputObject.account_transaction_info.length; i++) {
        objToProcess = inputObject.account_transaction_info[i];
        console.log("ob 2 pr", objToProcess);
        newObj = {};
        newObj.voucher_type = objToProcess.voucher_type;
        (newObj.cheque_no = objToProcess.cheque_no),
        (newObj.bank_name = objToProcess.bank_name), 
          (newObj.remarks = objToProcess.remarks),
          (newObj.created_from = objToProcess.created_from),
          (newObj.created_by = objToProcess.created_by),
          (newObj.date = objToProcess.date);
        newObj.credit = 0;
        newObj.debit = objToProcess.amount;
        newObj.party_id = objToProcess.consignor_id;
        newObj.voucher_id = objToProcess.voucher_id;
        newObj.unique_id = objToProcess.unique_id;
        newObj.created_from = objToProcess.created_from;
        newObj.created_by = objToProcess.created_by;
        newObj.other_party_id = objToProcess.consignee_id;
        newObj.account_id = objToProcess.account_id;
        newObj.date = objToProcess.date;
        newObj.companyId = inputObject.companyId;
        newObj.fyear = inputObject.fyear;
        
        if(objToProcess.voucher_type == "br") {
            newObj.clearance_status = objToProcess.clearance_status;
            newObj.clearance_date = objToProcess.clearance_date;
        }

        listToSend.push(newObj);

        newObj = {};
        newObj.voucher_type = objToProcess.voucher_type;
        (newObj.cheque_no = objToProcess.cheque_no),
        (newObj.bank_name = objToProcess.bank_name),
          (newObj.remarks = objToProcess.remarks),
          (newObj.created_from = objToProcess.created_from),
          (newObj.created_by = objToProcess.created_by),
          (newObj.date = objToProcess.date);
        newObj.debit = 0;
        newObj.credit = objToProcess.amount;
        newObj.party_id = objToProcess.consignee_id;
        newObj.voucher_id = objToProcess.voucher_id;
        newObj.unique_id = objToProcess.unique_id;
        newObj.created_from = objToProcess.created_from;
        newObj.created_by = objToProcess.created_by;
        newObj.other_party_id = objToProcess.consignor_id;
        newObj.account_id = objToProcess.account_id;
        newObj.date = objToProcess.date;
        newObj.companyId = inputObject.companyId;
        newObj.fyear = inputObject.fyear;
        if(objToProcess.voucher_type == "bp") {
            newObj.clearance_status = objToProcess.clearance_status;
            newObj.clearance_date = objToProcess.clearance_date;
        }
        console.log("Inner", newObj);
        listToSend.push(newObj);
        console.log("Inner List", listToSend);
      }
      console.log("laslds", listToSend);
      outputObj.account_transaction_info = listToSend;
      console.log("!!!!!!!!!!!!!!!!", inputObject);
      return outputObj;
    },
  },
  modifyPage: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "bilty_nos",
      driver_name: "same",
      owner_name: "same",
      challan_no: "booking_chalan_no",
      input_date: "booking_chalan_date",
      cewb_no: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/challan/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.challan_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      if (inputObject.cewb_no == "") {
        inputObject.cewb_no = null;
      }
      return inputObject;
    },
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getNarrationSuggestions: {
    url: SERVER_URL + "/narration/filter/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const BrokerageSummaryApiConfig = {
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const podChallanApiConfig = {
  getChallan: {
    responseSchema: {
      id:"same",
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "same",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      is_deleted: "same",
      pod_date: "input_date",
      is_inwarded: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/pod/",
    methodType: "GET",
  },
  generateCwb: {
    responseSchema: {
      status: "same",
      cewb_no: "same",
    },
    url: SERVER_URL + "/ewb/consolidated/",
    methodType: "GET",
  },
  saveChallan: {
    paramSchema: {
      // pod_challan_date: "same",
      created_from: "same",
      station_to: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "same",
      input_date: "pod_date",
      company_id: "companyId",
      fYear: "fyear",
      // pod_date: "booking_chalan_date",
    },
    responseSchema: {
      pod_no: "pod_challan_no",
      status: "same",
    },
    url: SERVER_URL + "/pod/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.pod_challan_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  modifyChallan: {
    paramSchema: {
      id:"same",
      created_from: "same",
      station_to: "same",
      remarks: "same",
      created_by: "same",
      bilty_ids: "same",
      input_date: "pod_date",
      pod_challan_no: "pod_no",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      booking_chalan_no: "pod_challan_no",
      status: "same",
    },
    url: SERVER_URL + "/pod/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const mrInquiryApiConfig = {
  getMrInquiry: {
    responseSchema: {
      hamali: "same",
      delivery_on: "same",
      service_charge: "same",
      demarage_charge: "same",
      other_charge: "same",
      payment_type: "same",
      cheque_no: "same",
      total_amount: "same",
      marfatiya: "same",
      party_name: "same",
      receiver_name: "same",
      lorry_rate: "same",
      bilty_info: "bilty_ids",
      created_from: "same",
      remarks: "same",
      refund: "same",
      mr_date: "input_date",
      created_by: "same",
      is_deleted: "same",
      to_pay_amount: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/money_receipt/",
    methodType: "GET",
  },
};

const mrApiConfig = {
  getMr: {
    responseSchema: {
      hamali: "same",
      delivery_on: "same",
      service_charge: "same",
      demarage_charge: "same",
      other_charge: "same",
      payment_type: "same",
      cheque_no: "same",
      total_amount: "same",
      marfatiya: "same",
      party_name: "same",
      receiver_name: "same",
      lorry_rate: "same",
      bilty_info: "bilty_ids",
      created_from: "same",
      remarks: "same",
      refund: "same",
      created_by: "same",
      is_deleted: "same",
      to_pay_amount: "same",
      mr_date: "input_date",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/money_receipt/",
    methodType: "GET",
  },
  saveMr: {
    paramSchema: {
      hamali: "same",
      delivery_on: "same",
      service_charge: "same",
      demarage_charge: "same",
      other_charge: "same",
      payment_type: "same",
      cheque_no: "same",
      total_amount: "same",
      marfatiya: "same",
      party_name: "same",
      receiver_name: "same",
      lorry_rate: "same",
      bilty_ids: "bilty_nos",
      created_from: "same",
      remarks: "same",
      refund: "same",
      created_by: "same",
      to_pay_amount: "same",
      input_date: "mr_date",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      mr_no: "same",
    },
    url: SERVER_URL + "/money_receipt/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.mr_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForMr,
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  modifyMr: {
    paramSchema: {
      mr_no: "same",
      hamali: "same",
      delivery_on: "same",
      service_charge: "same",
      demarage_charge: "same",
      other_charge: "same",
      payment_type: "same",
      cheque_no: "same",
      total_amount: "same",
      marfatiya: "same",
      party_name: "same",
      receiver_name: "same",
      lorry_rate: "same",
      bilty_ids: "bilty_nos",
      created_from: "same",
      remarks: "same",
      refund: "same",
      created_by: "same",
      to_pay_amount: "same",
      input_date: "mr_date",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      mr_no: "same",
    },
    url: SERVER_URL + "/money_receipt/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.mr_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForMr,
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
};

const tripApiConfig = {
  getTrip: {
    responseSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      booking_chalan_info: "challan_ids",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      amount: "same",
      is_deleted: "same",
      trip_date: "input_date",
      advance_bhada: "same",
      balance_bhada: "balance_bhada",
      payable_branch: "same",
      payable_branch_name: "same",
      receiver_name: "same",
      bhada_remarks: "same",
      payment_type: "same",
      is_bhada_paid: "same",
      module_trip_bhada: "same",
      bhada_paid_date: "same",
      id: "same",
      bhada_paid_branch_name: "same",
      fyear: "fYear_get",
      bhada_paid_branch: "same",
      tds_amount: "same",
      net_balance: "same",
      tds_rate: "same",
      payable_declaration: "same",
    },
    additionalFilterOnResponse: (inputObject) => {
      try{
        if ("bhada_paid_date" in inputObject && inputObject.bhada_paid_date == null){
          console.log("In adfsd");
        //   inputObject.bhada_paid_date = new Date()
      }
      console.log("Hewrereref", inputObject);
      return inputObject;
      }
      catch{
        console.log("Herer");
        return inputObject;
      }

    },
    url: SERVER_URL + "/trip/",
    methodType: "GET",
  },
  generateCwb: {
    responseSchema: {
      status: "same",
      cewb_no: "same",
    },
    url: SERVER_URL + "/ewb/consolidated/",
    methodType: "GET",
  },
  saveTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      input_date: "trip_date",
      advance_bhada: "same",
      balance_bhada: "same",
      payable_branch: "same",
      receiver_name: "same",
      bhada_remarks: "same",
      payment_type: "same",
      is_bhada_paid: "same",
      module_trip_bhada: "same",
      bhada_paid_date: "same",
      login_user_id: "modified_by",
      company_id: "companyId",
      fYear: "fyear",
      tds_amount: "same",
      net_balance: "same",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      console.log("12345678",inputObject);
      if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
          inputObject.is_bhada_paid = true
      }
      return inputObject;
    },
  },
  modifyTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      trip_no: "same",
      input_date: "trip_date",
      advance_bhada: "same",
      balance_bhada: "same",
      payable_branch: "same",
      receiver_name: "same",
      bhada_remarks: "same",
      payment_type: "same",
      is_bhada_paid: "same",
      module_trip_bhada: "same",
      bhada_paid_date: "same",
      id:"same",
      login_user_id : "modified_by",
      // bhada_paid_branch:"created_from"
    //   bhada_paid_branch:"paid_branch",
      company_id: "companyId",
      fYear_get: "fyear",
      bhada_paid_branch:"same",
      tds_amount: "same",
      net_balance: "same",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      console.log("12345678 modify trip",inputObject);
      if("bhada_paid_date" in inputObject && inputObject.bhada_paid_date == "") {
          inputObject.bhada_paid_date = null;
      }
      if("bhada_paid_branch" in inputObject && inputObject.bhada_paid_branch == "") {
        inputObject.bhada_paid_branch = null;
    }
      if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
          inputObject.is_bhada_paid = true
          inputObject.bhada_paid_branch = JSON.parse(sessionStorage.branch_id).branch_id
      }
      return inputObject;
    },
  },
  modifyTripBhada: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      trip_no: "same",
      input_date: "trip_date",
      advance_bhada: "same",
      balance_bhada: "same",
      payable_branch: "same",
      receiver_name: "same",
      bhada_remarks: "same",
      payment_type: "same",
      is_bhada_paid: "same",
      module_trip_bhada: "same",
      bhada_paid_date: "same",
      id:"same",
      login_user_id : "modified_by",
      // bhada_paid_branch:"created_from"
    //   bhada_paid_branch:"paid_branch",
      company_id: "companyId",
      fYear_get: "fyear",
      bhada_paid_branch:"same",
      tds_amount: "same",
      net_balance: "same",
      payable_declaration: "same",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/payable_save",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      console.log("12345678 modify trip",inputObject);
      inputObject.payable_declaration = parseInt(inputObject.payable_declaration);
      if(inputObject.modified_by != "1" && inputObject.modified_by != "220") {
        inputObject.payable_declaration = parseInt("-1");
      }
      if("bhada_paid_date" in inputObject && inputObject.bhada_paid_date == "") {
          inputObject.bhada_paid_date = null;
      }
      if("bhada_paid_branch" in inputObject && inputObject.bhada_paid_branch == "") {
        inputObject.bhada_paid_branch = null;
    }
      if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
          inputObject.is_bhada_paid = true
          inputObject.bhada_paid_branch = JSON.parse(sessionStorage.branch_id).branch_id
      }
      return inputObject;
    },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/trip/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const vehicleRegisterApiConfig = {
  getVehicleRegister: {
    responseSchema: {
      station: "same",
      vehicle_id: "same",
      vehicle_register_id:"same",
      vr_no:"same",
      vehicle_no: "same",
      pass_status: "same",
      memo_no: "same",
      register_date: "same",
      station_name:"same",
      lorry_no: "same",
      freight: "same",
      transport_name: "same",
      remarks: "same",
      received_date: "same",
      received_amount: "same",
      payment_method: "same",
      register_date:"same",
      cheque_details: "same",
      receiver_detail: "same",
      x_date: "same",
      letter_no: "same",
      fyear: "fYear_get",
    },
    // additionalFilterOnResponse: (inputObject) => {
    //   try{
    //     if ("bhada_paid_date" in inputObject && inputObject.bhada_paid_date == null){
    //       console.log("In adfsd");
    //       inputObject.bhada_paid_date = new Date()
    //   }
    //   console.log("Hewrereref", inputObject);
    //   return inputObject;
    //   }
    //   catch{
    //     console.log("Herer");
    //     return inputObject;
    //   }

    // },
    url: SERVER_URL + "/vehicleregister/",
    methodType: "GET",
  },
  saveVehicleRegister: {
    paramSchema: {
      station: "same",
      vehicle_id: "same",
      vr_no:"same",
      vehicle_no: "same",
      pass_status: "same",
      memo_no: "same",
      register_date: "same",
      station_name:"same",
      lorry_no: "same",
      freight: "same",
      transport_name: "same",
      remarks: "same",
      received_date: "same",
      received_amount: "same",
      payment_method: "same",
      register_date:"same",
      cheque_details: "same",
      receiver_detail: "same",
      x_date: "same",
      letter_no: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      vr_no: "same",
      // status: "same",
    },
    url: SERVER_URL + "/vehicleregister/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.vr_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //   console.log("12345678",inputObject);
    //   if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
    //       inputObject.is_bhada_paid = true
    //   }
    //   return inputObject;
    // },
  },
  modifyVehicleRegister: {
    paramSchema: {
      vehicle_register_id:"same",
      station: "same",
      vehicle_id: "same",
      vr_no:"same",
      vehicle_no: "same",
      pass_status: "same",
      memo_no: "same",
      register_date: "same",
      station_name:"same",
      lorry_no: "same",
      freight: "same",
      transport_name: "same",
      remarks: "same",
      received_date: "same",
      received_amount: "same",
      payment_method: "same",
      register_date:"same",
      cheque_details: "same",
      receiver_detail: "same",
      x_date: "same",
      letter_no: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      vr_no: "same",
      // status: "same",
    },
    url: SERVER_URL + "/vehicleregister/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.vr_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      console.log("12345678",inputObject);
      if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
          inputObject.is_bhada_paid = true
      }
      return inputObject;
    },
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const mrPendingAmountApiConfig = {
  getMrPending: {
    responseSchema: {
      sr_no: "same",
      created_from: "same",
      branch: "branch_name",
      party_name: "same",
      debit_amount: "same",
      remarks:"same",
      mr_list: "mr_entries",
      credit_list: "table_entries",
      date: "input_date",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/pending_mr_payment/",
    methodType: "GET",
  },
  saveMrPending: {
    paramSchema: {
      created_from: "same",
      branch_name: "branch",
      party_name: "same",
      debit_amount: "same",
      remarks:"same",
      mr_entries: "mr_list",
      table_entries: "credit_list",
      input_date: "date",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      register_no: "sr_no",
      // status: "same",
    },
    url: SERVER_URL + "/pending_mr_payment/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.vr_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    },
    additionalFilterOnInput: (inputObject) => {
        console.log("12345678",inputObject);
        inputObject.created_from = parseInt(inputObject.created_from);
        inputObject.debit_amount = parseFloat(inputObject.debit_amount);

        let mrList = [];
        inputObject.mr_list.forEach((obj) => {
            mrList.push((obj.mr_no));
        })
        inputObject.mr_list = mrList;

        inputObject.credit_list.forEach((obj) => {
            obj.credit_date = new Date(obj.credit_date).toISOString();
        })

        inputObject.date = new Date(inputObject.date).toISOString();

        return inputObject;
    },
  },
  modifyMrPending: {
    paramSchema: {
        sr_no: "register_no",
        created_from: "same",
        branch_name: "branch",
        party_name: "same",
        debit_amount: "same",
        remarks:"same",
        mr_entries: "mr_list",
        table_entries: "credit_list",
        input_date: "date",
        fYear_get: "fyear",
        company_id: "companyId",
    },
    responseSchema: {
      sr_no: "same",
      // status: "same",
    },
    url: SERVER_URL + "/pending_mr_payment",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.vr_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    },
    additionalFilterOnInput: (inputObject) => {
        console.log("12345678",inputObject);
        inputObject.created_from = parseInt(inputObject.created_from);
        inputObject.debit_amount = parseFloat(inputObject.debit_amount);

        let mrList = [];
        inputObject.mr_list.forEach((obj) => {
            mrList.push((obj.mr_no));
        })
        inputObject.mr_list = mrList;

        inputObject.credit_list.forEach((obj) => {
            obj.credit_date = new Date(obj.credit_date).toISOString();
        })

        inputObject.date = new Date(inputObject.date).toISOString();

        return inputObject;
    },
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
};



const BankClearanceApiConfig = {
  modifyBankClearance: {
    paramSchema: {
      clearance_entries: "same",
      consignor_id: "bank_id",
      date_from: "same",
      date_to: "same",
      voucher_type: "same",
      clearance_status: "same",
      created_from: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    // responseSchema: {
    // //   vr_no: "same",
    //   // status: "same",
    // },
    url: SERVER_URL + "/account_trans/bank_clearance",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    additionalFilterOnInput: (inputObject) => {
      console.log("12345678",inputObject);
      inputObject["clearance_entries"].forEach(row => {
          if(row.date != null) {
            const tmp = row.date.split('-').reverse().join('-');
            row.date = new Date(tmp).toISOString();
          }
          if(row.clearance_date != null) {
            const tmp = row.clearance_date.split('-').reverse().join('-');
            row.clearance_date = new Date(tmp).toISOString();
          }
          row.clearance_status = parseInt(row.clearance_status)
      })
      console.log("12345678",inputObject);
      
      const firstObj = {
          bank_id: inputObject.bank_id,
          clearance_status: parseInt(inputObject.clearance_status),
          created_from: inputObject.created_from,
          date_from: new Date(inputObject.date_from).toISOString(),
          date_to: new Date(inputObject.date_to).toISOString(),
          voucher_type: inputObject.voucher_type,
          transaction_id: "1",
      }
      let finalData = [
          firstObj,
          ...inputObject["clearance_entries"]
      ];

      console.log("final data: ", finalData);
      return finalData;
    },
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const challanInwardApiConfig = {
  getTrip: {
    responseSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      booking_chalan_info: "challan_ids",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      amount: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/trip/",
    methodType: "GET",
  },
  generateCwb: {
    responseSchema: {
      status: "same",
      cewb_no: "same",
    },
    url: SERVER_URL + "/ewb/consolidated/",
    methodType: "GET",
  },
  saveTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      company_id: "companyId",
      fyear: "fYear",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
        if ("module_trip_bhada" in inputObject && inputObject.module_trip_bhada){
            inputObject.is_bhada_paid = true
        }
        return inputObject;
    },
  },
  modifyTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      trip_no: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const accountMasterApiConfig = {
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
    additionalFilterOnResponse: (inputObject) => {
        console.log("inside getTransporterSuggestions", inputObject);
      if ("branch_info" in inputObject) {
        let newArray = [];
        for (let i = 0; i < inputObject.branch_info.length; i++) {
          newArray.push(String(inputObject.branch_info[i]));
        }
        inputObject.branch_info = newArray;
      }
      return inputObject;
    },
  },
  getGroupSuggestions: {
    url: SERVER_URL + "/group/",
    methodType: "POST",
    respoonseSchema: {},
  },
  getSubGroupSuggestions: {
    url: SERVER_URL + "/subgroup/",
    methodType: "POST",
    respoonseSchema: {},
  },
  getGroupNameSuggestions: {
    url: SERVER_URL + "/company_group/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getAccountMaster: {
    responseSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
  },
  saveAccountMaster: {
    paramSchema: {
      id: "same",
      name: "same",
      gst: "same",
      address: "same",
      is_door_delivery: "same",
      collection_charge: "same",
      collection_charge_unit: "same",
      contact_person: "same",
      suffix: "same",
      bilty_charge: "same",
      hamali_charge: "same",
      door_delivery_charge: "same",
      commission_rate: "same",
      acknowledgement: "same",
      city: "same",
      is_active: "same",
      pincode: "same",
      delivery_address: "same",
      phone_office: "same",
      phone_residence: "same",
      mobile: "same",
      email: "same",
      tin_no: "same",
      cst_no: "same",
      pan_no: "same",
      limit_amt: "same",
      group_id: "same",
      subgroup_id: "same",
      group_name: "same",
      created_by: "same",
      modified_by: "same",
      branch_info: "same",
      branch_list: "same",
      automatic_billing: "same",
      only_pod_bill: "same",
      company_info: "same",
      secondary_email: "same",
      is_account_related: "same",
      is_daily_mail: "same",
      company_id: "companyId",
    //   fyear: "fYear",
      is_transporter: "same",
      bill_name: "same", 
      bill_gst: "same", 
      auto_pod_statement: "same", 
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/transporter/add/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.challan_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyVehicle: {
    paramSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      created_from: "same",
      created_by: "same",
      company_id: "companyId",
    //   fYear: "fyear",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.challan_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
};

const biltyStatementApiConfig = {
  saveBiltyStatement: {
    paramSchema: {
      created_from: "same",
      created_by: "same",
      paid_statement_no:"same",
      created_by_name:"same",
      bilty_info_list: "bilty_info",
      input_date: "paid_statement_date",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      paid_statement_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/paid_statement/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
    modifyBiltyStatement: {
      paramSchema: {
        created_from: "same",
        created_by: "same",
        paid_statement_no:"same",
        created_by_name:"same",
        bilty_info_list: "bilty_info",
        input_date: "paid_statement_date",
        company_id: "companyId",
        fYear: "fyear",
      },
      responseSchema: {
        paid_statement_no: "same",
        status: "same",
      },
      url: SERVER_URL + "/paid_statement/",
      methodType: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
  //   validateResponse: (text) => {
  //     // We only throw the error if the incoming data status is not equal to "ok"
  //     // if (!text.trip_no) {
  //     //   console.log("In fff");
  //     //   throw new Error("The required value must be a number fff");
  //     // }
  //   },
  //   // additionalFilterOnInput: (inputObject) => {
  //   //     if (inputObject.eway_bill_info &&
  //   //         inputObject.eway_bill_info.length==1 &&
  //   //         inputObject.eway_bill_info[0].eway_bill_no == ""){
  //   //         delete inputObject.eway_bill_info
  //   //     }
  //   //     return inputObject;
  //   // },
  },
};

const mrStatementApiConfig = {
  saveMrStatement: {
    paramSchema: {
      mr_statement_no:"same",
      input_date:"created_date",
      created_from: "same",
      created_by: "same",
      mr_info_list: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      mr_statement_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/mr_statement/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.trip_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  modifyTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      trip_no: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const podChallanInwardApiConfig = {
  getTrip: {
    responseSchema: {
      station_from: "same",
      station_to: "same",
      destination: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      vehicle_id: "same",
      vehicle_no: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      booking_chalan_info: "pod_info_list",
      driver_name: "same",
      owner_name: "same",
      status: "same",
      amount: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/trip/",
    methodType: "GET",
  },
  generateCwb: {
    responseSchema: {
      status: "same",
      cewb_no: "same",
    },
    url: SERVER_URL + "/ewb/consolidated/",
    methodType: "GET",
  },
  saveTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  modifyTrip: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      challan_ids: "booking_challan_info",
      amount: "same",
      trip_no: "same",
      fYear_get: "fyear",
    },
    responseSchema: {
      trip_no: "same",
      status: "same",
    },
    url: SERVER_URL + "/trip/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const itemMasterApiConfig = {
  getItemMaster: {
    responseSchema: {
      name: "same",
      description: "same",
      id: "item_id",
    },
    url: SERVER_URL + "/itemx/",
    methodType: "GET",
  },
  saveItemMaster: {
    paramSchema: {
      name: "same",
      description: "desc",
      item_id: "item_id",
    },
    url: SERVER_URL + "/item/create/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      //   if (!text.challan_no) {
      //     console.log("In fff");
      //     throw new Error("The required value must be a number fff");
      //   }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyItemMaster: {
    paramSchema: {
      name: "same",
      description: "desc",
      item_id: "same",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/item/update/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      //   if (!text.challan_no) {
      //     console.log("In fff");
      //     throw new Error("The required value must be a number fff");
      //   }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
};

const GroupMasterApiConfig = {
    saveGroupMaster: {
      paramSchema: {
        name: "same",
        belongs_to: "same",
        item_id: "id",
        company_id: "companyId",
      },
      url: SERVER_URL + "/group/update",
      methodType: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        //   if (!text.challan_no) {
        //     console.log("In fff");
        //     throw new Error("The required value must be a number fff");
        //   }
      },
      additionalFilterOnInput: (inputObject) => {
        let dummyObject = lodash.cloneDeep(inputObject);
        for (let key in dummyObject) {
          if (dummyObject[key] == "") {
            dummyObject[key] = null;
          }
        }
        return dummyObject;
      },
    },
    modifyItemMaster: {
      paramSchema: {
        name: "same",
        description: "desc",
        item_id: "same",
      },
      responseSchema: {
        booking_chalan_no: "challan_no",
        status: "same",
      },
      url: SERVER_URL + "/item/update/",
      methodType: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        //   if (!text.challan_no) {
        //     console.log("In fff");
        //     throw new Error("The required value must be a number fff");
        //   }
      },
      additionalFilterOnInput: (inputObject) => {
        let dummyObject = lodash.cloneDeep(inputObject);
        for (let key in dummyObject) {
          if (dummyObject[key] == "") {
            dummyObject[key] = null;
          }
        }
        return dummyObject;
      },
    },
    getGroupSuggestions: {
      url: SERVER_URL + "/group/",
      methodType: "POST",
      respoonseSchema: {},
      // tailTruncate: true,
    },
  };

  const SubgroupMasterApiConfig = {
    saveSubgroupMaster: {
      paramSchema: {
        name: "same",
        belongs_to: "group_id",
        item_id: "id",
        company_id: "companyId",
      },
      url: SERVER_URL + "/subgroup/update",
      methodType: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        //   if (!text.challan_no) {
        //     console.log("In fff");
        //     throw new Error("The required value must be a number fff");
        //   }
      },
      additionalFilterOnInput: (inputObject) => {
        let dummyObject = lodash.cloneDeep(inputObject);
        for (let key in dummyObject) {
          if (dummyObject[key] == "") {
            dummyObject[key] = null;
          }
        }
        return dummyObject;
      },
    },
    modifyItemMaster: {
      paramSchema: {
        name: "same",
        description: "desc",
        item_id: "same",
      },
      responseSchema: {
        booking_chalan_no: "challan_no",
        status: "same",
      },
      url: SERVER_URL + "/item/update/",
      methodType: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      validateResponse: (text) => {
        // We only throw the error if the incoming data status is not equal to "ok"
        //   if (!text.challan_no) {
        //     console.log("In fff");
        //     throw new Error("The required value must be a number fff");
        //   }
      },
      additionalFilterOnInput: (inputObject) => {
        let dummyObject = lodash.cloneDeep(inputObject);
        for (let key in dummyObject) {
          if (dummyObject[key] == "") {
            dummyObject[key] = null;
          }
        }
        return dummyObject;
      },
    },
    getSubgroupSuggestions: {
      url: SERVER_URL + "/subgroup/",
      methodType: "POST",
      respoonseSchema: {},
      // tailTruncate: true,
    },
  };

const vehicleApiConfig = {
  getVehicle: {
    responseSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      vehocle_ownership: "same",
      second_owner_name:"same",
      second_owner_address:"same",
      second_owner_pan_no:"same",
      second_owner_entry_date:"same",
      third_owner_name:"same",
      third_owner_address:"same",
      third_owner_pan_no:"same",
      third_owner_entry_date:"same",
    //   verified_by: "same",
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
  },
  saveVehicle: {
    paramSchema: {
      vehicle_id: "same",
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      vehicle_ownership: "same",
      second_owner_name:"same",
      second_owner_address:"same",
      second_owner_pan_no:"same",
      second_owner_entry_date:"same",
      third_owner_name:"same",
      third_owner_address:"same",
      third_owner_pan_no:"same",
      third_owner_entry_date:"same",
      entry_date: "same",
      created_from:"same",
      created_by:"same",
      verified_by: "same",
      tds_rate: "same",
    },
    responseSchema: {
      vehicle_no: "vehicle_no",
      status: "same",
    },
    url: SERVER_URL + "/vehicle/add/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.vehicle_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      if (dummyObject.permit_validity != "") {
        let dummyArray = dummyObject.permit_validity.split("-");
        dummyObject.permit_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      if (dummyObject.policy_validity != "") {
        let dummyArray = dummyObject.policy_validity.split("-");
        dummyObject.policy_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      if (dummyObject.license_validity != "") {
        let dummyArray = dummyObject.license_validity.split("-");
        dummyObject.license_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyVehicle: {
    paramSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      created_from: "same",
      created_by: "same",
      verified_by: "same",
      tds_rate: "same",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.challan_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
    additionalFilterOnResponse: (dummyObject) => {
      console.log("Herer", dummyObject);
      if (
        dummyObject.permit_validity != "" &&
        dummyObject.permit_validity != null
      ) {
        let dummyArray = dummyObject.permit_validity.split("-");
        dummyObject.permit_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      if (
        dummyObject.policy_validity != "" &&
        dummyObject.policy_validity != null
      ) {
        let dummyArray = dummyObject.policy_validity.split("-");
        dummyObject.policy_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      if (
        dummyObject.license_validity != "" &&
        dummyObject.license_validity != null
      ) {
        let dummyArray = dummyObject.license_validity.split("-");
        dummyObject.license_validity =
          dummyArray[2] + "-" + dummyArray[1] + "-" + dummyArray[0];
      }
      console.log("return obj", dummyObject);
      return dummyObject;
    },
  },
};

const stationMasterApiConfig = {
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getStationMaster: {
    responseSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
  },
  saveStationMaster: {
    paramSchema: {
      name: "same",
      address: "same",
      branch_id: "same",
      is_branch: "same",
      city: "same",
      pin_code: "same",
      mobile: "same",
      consignor_id: "party_bill_account",
      freight_lock: "same",
      to_pay_account_name: "same",
      to_pay_account_id: "to_pay_account",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/branch/add/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      //   if (!text.challan_no) {
      //     console.log("In fff");
      //     throw new Error("The required value must be a number fff");
      //   }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyStatoinMaster: {
    paramSchema: {
      vehicle_no: "same",
      pan_no: "same",
      owner_name: "same",
      owner_address: "same",
      body_type: "same",
      engine_no: "same",
      chasis_no: "same",
      permit_no: "same",
      permit_validity: "same",
      insurance_company: "same",
      policy_validity: "same",
      policy_no: "same",
      driver_name: "same",
      driver_address: "same",
      license_no: "same",
      license_validity: "same",
      created_from: "same",
      created_by: "same",
      freight_lock: "same",
      to_pay_account_name: "same",
      to_pay_account_id: "to_pay_account",
    },
    responseSchema: {
      booking_chalan_no: "challan_no",
      status: "same",
    },
    url: SERVER_URL + "/vehicle/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      //   if (!text.challan_no) {
      //     console.log("In fff");
      //     throw new Error("The required value must be a number fff");
      //   }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const crossingInApiConfig = {
  getCrossingIn: {
    responseSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      freight: "our_freight",
      total_pkgs: "pkgs",
      balance: "same",
      bilty_info: "bilty_ids",
      created_from: "same",
      created_by: "same",
      to_pay: "same",
      memo_no:"same",
      crossing_inward_date: "input_date",
      // last_mr_no: "",
      crossing_bill_no: "same",
      id: "same",
      paid: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/crossing_inward/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input objecy", inputObject);
      let tran_freight = 0;
      let our_freight = 0;
      let to_pay = 0;
      let paid = 0;
      let pkgs = 0;
      let biltyObj = {};
      for (let i = 0; i < inputObject.bilty_info.length; i++) {
        biltyObj = inputObject.bilty_info[i];
        tran_freight += parseInt(biltyObj.transporter_freight) || 0;
        our_freight += parseInt(biltyObj.total_amount) || 0;
        if (biltyObj.pay_type == "1") {
          to_pay += parseInt(biltyObj.transporter_freight) || 0;
        } else {
          paid += parseInt(biltyObj.transporter_freight) || 0;
        }
        pkgs += parseInt(biltyObj.no_of_package) || 0;
      }
      inputObject.transporter_freight = String(tran_freight);
      inputObject.freight = String(our_freight);
      inputObject.total_pkgs = String(pkgs);
      inputObject.to_pay = String(to_pay);
      inputObject.paid = String(paid);
      inputObject.balance = String(our_freight - to_pay);
      console.log("Output object", inputObject, our_freight);
      return inputObject;
    },
  },
  saveCrossingIn: {
    paramSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      our_freight: "freight",
      pkgs: "total_pkgs",
      balance: "same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      to_pay: "same",
      input_date: "crossing_inward_date",
      // last_mr_no: "",
      memo_no:"same",
      crossing_bill_no: "same",
      paid: "same",
      company_id: "companyId",
      fYear: "fyear",
      // crossing
    },
    responseSchema: {
      crossing_inward_no: "crossing_in_no",
      status: "same",
    },
    url: SERVER_URL + "/crossing_inward/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      console.log("text", text);
      if (!text.crossing_in_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyCrossingIn: {
    paramSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      our_freight: "freight",
      pkgs: "total_pkgs",
      balance: "same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      to_pay: "same",
      memo_no:"same",
      input_date: "crossing_inward_date",
      // last_mr_no: "",
      crossing_bill_no: "same",
      id: "id",
      paid: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      crossing_inward_no: "crossing_in_no",
      status: "same",
    },
    url: SERVER_URL + "/crossing_inward/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.crossing_in_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const crossingOutApiConfig = {
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getCrossingOut: {
    responseSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      freight: "our_freight",
      total_pkgs: "pkgs",
      balance: "same",
      bilty_info: "bilty_ids",
      created_from: "same",
      created_by: "same",
      id:"same",
      to_pay: "same",
      station_to:"same",
      crossing_out_no:"crossing_outward_no",
      station_to_name: "same",
      crossing_outward_date: "input_date",
      // last_mr_no: "",
      crossing_bill_no: "same",
      paid: "same",
      our_freight: "same",
      cewb_no: "same",
      vehicle_no: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/crossing_outward/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input objecy", inputObject);
      try{
        let tran_freight = parseFloat(inputObject.transporter_freight) || 0;
        let our_freight = 0;
        let to_pay = 0;
        let paid = 0;
        let pkgs = 0;
        let biltyObj = {};
        for (let i = 0; i < inputObject.bilty_info.length; i++) {
          console.log("x");
          biltyObj = inputObject.bilty_info[i];
          console.log("Bilty obj", biltyObj);
          // tran_freight += parseInt(biltyObj.transporter_freight) || 0;

          /**
           * This condition is when bilty is taken into crossing inward
           * and given to crossing outward
           */
          if (biltyObj.transporter_id != null){
            our_freight += parseInt(biltyObj.transporter_freight) || 0;
          }
          else{
            if (biltyObj.pay_type != "4"){
              our_freight += parseInt(biltyObj.total_amount) || 0;
            }
          }
          if (biltyObj.pay_type == "1") {
           /**
           * This condition is when bilty is taken into crossing inward
           * and given to crossing outward
           */
            if (biltyObj.transporter_id != null){
              to_pay += parseInt(biltyObj.transporter_freight) || 0;
            }
            else{
              to_pay += parseInt(biltyObj.total_amount) || 0;
            }
          } else if(biltyObj.pay_type != "4"){
            paid += parseInt(biltyObj.total_amount) || 0;
          }
          pkgs += parseInt(biltyObj.no_of_package) || 0;
        }
        // inputObject.transporter_freight = String(tran_freight);
        inputObject.our_freight = String(our_freight);
        inputObject.total_pkgs = String(pkgs);
        inputObject.to_pay = String(to_pay);
        inputObject.paid = String(paid);
        inputObject.balance = String(to_pay - tran_freight);
        console.log("Output object", inputObject, our_freight);
      }
      catch(e){
        console.log("Error", e);
      }

      return inputObject;
    },
  },
  saveCrossingOut: {
    paramSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      our_freight: "freight",
      pkgs: "total_pkgs",
      balance: "same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      to_pay: "same",
      station_to:"same",
      input_date: "crossing_outward_date",
      // last_mr_no: "",
      crossing_bill_no: "same",
      // crossing_out_no: "id",
      paid: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      crossing_outward_no: "crossing_out_no",
      status: "same",
    },
    url: SERVER_URL + "/crossing_outward/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      console.log("text", text);
      if (!text.crossing_out_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  modifyCrossingOut: {
    paramSchema: {
      transporter_name: "same",
      transporter_id: "same",
      transporter_freight: "same",
      our_freight: "freight",
      pkgs: "total_pkgs",
      balance: "same",
      station_to_name:"same",
      station_to:"same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      to_pay: "same",
      input_date: "crossing_outward_date",
      // last_mr_no: "",
      crossing_bill_no: "same",
      id: "id",
      crossing_out_no:"crossing_outward_no",
      paid: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      crossing_outward_no: "crossing_out_no",
      status: "same",
    },
    url: SERVER_URL + "/crossing_outward/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.crossing_out_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: (inputObject) => {
      let dummyObject = lodash.cloneDeep(inputObject);
      for (let key in dummyObject) {
        if (dummyObject[key] == "") {
          dummyObject[key] = null;
        }
      }
      return dummyObject;
    },
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  generateCewb: {
      url: SERVER_URL + "/crossing_outward/generate-cewb/",
      methodType: "POST",
      respoonseSchema: {},
  }
};

const consignorBillingApiConfig = {
  getCrossingBill: {
    responseSchema: {
      id:"same",
      consignor_name: "same",
      consignor_id: "same",
      total_amount: "same",
      add: "same",
      net_amount: "same",
      description1: "same",
      amt1: "same",
      description2: "same",
      bill_no:"same",
      amt2: "same",
      bilty_charge: "same",
      door_del_charge: "same",
      extra_hamali: "same",
      extra_percentage: "same",
      extra_percentage_amount: "same",
      bilty_info: "bilty_ids",
      created_from: "same",
      created_by: "same",
      date_to: "input_date",
      bill_date: "same",
      amount: "gross_amount",
      edit_bill: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/tbb_billing_statement/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("input object", inputObject);
      for (let i=0; i< inputObject.bilty_info.length; i++){
        inputObject.bilty_info[i].checked = "1"
      }
      return inputObject;
    },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveCrossingBill: {
    paramSchema: {
      id: "same",
      bill_no:"same",
      consignor_id: "same",
      total_amount: "same",
      add: "same",
      description1: "same",
      amt1: "same",
      description2: "same",
      amt2: "same",
      bilty_charge: "same",
      door_del_charge: "same",
      extra_hamali: "same",
      extra_percentage: "same",
      extra_percentage_amount: "same",
      net_amount: "same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      input_date:"date_to",
      bill_date:"same",
      // input_date: "same",
      gross_amount: "amount",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bill_no: "id",
    },
    url: SERVER_URL + "/tbb_billing_statement/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    additionalFilterOnInput: (inputObject)=>{
      if (inputObject.id == ""){
        inputObject.id = null
      }
      if (inputObject.bill_no == ""){
        inputObject.bill_no = null
      }
      let dummyArray = []
      for (let i=0; i<inputObject.bilty_info.length; i++){
        if(inputObject.bilty_info[i].checked == "1"){
          dummyArray.push(inputObject.bilty_info[i]);
        }
      }
      inputObject.bilty_info = dummyArray
      return inputObject
    },
  },
  modifyCrossingBill: {
    paramSchema: {
      id: "same",
      bill_no:"same",
      consignor_id: "same",
      total_amount: "same",
      add: "same",
      bill_no:"same",
      description1: "same",
      amt1: "same",
      description2: "same",
      amt2: "same",
      bilty_charge: "same",
      door_del_charge: "same",
      extra_hamali: "same",
      extra_percentage: "same",
      extra_percentage_amount: "same",
      net_amount: "same",
      bilty_ids: "bilty_info",
      created_from: "same",
      created_by: "same",
      input_date:"date_to",
      bill_date:"same",
      // input_date: "same",
      gross_amount: "amount",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      bill_no: "id",
    },
    url: SERVER_URL + "/tbb_billing_statement/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    additionalFilterOnInput: (inputObject)=>{
      if (inputObject.id == ""){
        inputObject.id = null
      }
      let dummyArray = []
      for (let i=0; i<inputObject.bilty_info.length; i++){
        if(inputObject.bilty_info[i].checked == "1"){
          dummyArray.push(inputObject.bilty_info[i]);
        }
      }
      inputObject.bilty_info = dummyArray
      return inputObject
    },
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/id",
    methodType: "POST",
    respoonseSchema: {},
    tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const podStatementApiConfig = {
  getPage: {
    responseSchema: {
      consignor_id: "same",
      // total_amount: "same",
      // add: "same",
      // net_amount: "same",
      id:"same",
      consignor_name: "same",
      consignor_gst: "same",
      pod_list: "pod_info_list",
      created_from: "same",
      created_by: "same",
      created_date: "input_date",
      // amount: "same",
      fyear: "fYear_get",
      pod_receive_date: "same",
      pod_receive_date_selected: "same",
    },
    url: SERVER_URL + "/pod_statement/",
    methodType: "GET",
    // additionalFilterOnResponse: (inputObject) => {
    //   console.log("Input object", inputObject);
    // //   if(typeof inputObject.pod_receive_date != "date") {
    // //         inputObject.pod_receive_date_selected = "false";   
    // //   }
    // //   else
    //   return inputObject;
    // },
  },
  savePage: {
    paramSchema: {
      consignor_id: "same",
      // total_amount: "same",
    //   add: "same",
      // net_amount: "same",
      pod_info_list: "same",
      created_from: "same",
      created_by: "same",
      input_date: "same",
      // amount: "same",
      company_id: "companyId",
      fYear: "fyear",
      pod_receive_date: "same",
      pod_receive_date_selected: "pod_receive_date_selected",
      id: "same",
    },
    responseSchema: {
      pod_statement_no: "same",
    },
    url: SERVER_URL + "/pod_statement/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    additionalFilterOnInput: (inpObj) => {
        console.log(inpObj);

        if(inpObj.pod_receive_date_selected == "true") {
            console.log("inside");

            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(new Date(inpObj.pod_receive_date).getTime() - tzoffset)).toISOString().slice(0, -1);
            console.log({ localISOTime });
    
            inpObj.pod_receive_date = localISOTime;
        }
        else {
            inpObj.pod_receive_date = null;
        }
        
        return inpObj;
    }
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    // additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyPage: {
    paramSchema: {
      consignor_id: "same",
      // total_amount: "same",
      // add: "same",
      // net_amount: "same",
      pod_info_list: "same",
      created_from: "same",
      created_by: "same",
      input_date: "same",
      id: "same",
      // amount: "same",
      company_id: "companyId",
      fYear_get: "fyear",
      pod_receive_date: "same",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/pod_statement/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/id",
    methodType: "POST",
    respoonseSchema: {},
    tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const crossingBillingApiConfig = {
  getCrossingBill: {
    responseSchema: {
      transporter_id: "same",
      transporter_name: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      bill_date: "input_date",
      net_amount: "same",
      type: "same",
      id: "same",
      add: "same",
      remarks: "same",
      date_to: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/crossing_bill_in/",
    methodType: "GET",
    // additionalFilterOnResponse: (inputObject) => {
    //   console.log("Input object", inputObject);
    //   if (inputObject.eway_bill_info.length == 0) {
    //     inputObject.eway_bill_info = [
    //       {
    //         eway_bill_no: "",
    //         new_row: "N",
    //       },
    //     ];
    //   }
    //   return inputObject;
    // },
  },
  getCrossingBillOut: {
    responseSchema: {
      transporter_id: "same",
      transporter_name: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      bill_date: "input_date",
      net_amount: "same",
      type: "same",
      id: "same",
      add: "same",
      remarks: "same",
      date_to: "same",
      fyear: "fYear_get",
    },
    url: SERVER_URL + "/crossing_bill_out/",
    methodType: "GET",
    // additionalFilterOnResponse: (inputObject) => {
    //   console.log("Input object", inputObject);
    //   if (inputObject.eway_bill_info.length == 0) {
    //     inputObject.eway_bill_info = [
    //       {
    //         eway_bill_no: "",
    //         new_row: "N",
    //       },
    //     ];
    //   }
    //   return inputObject;
    // },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveCrossingBillIn: {
    paramSchema: {
      transporter_id: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      date_to: "same",
      crossing_inward_date: "same",
      net_amount: "same",
      // type: "same",
      input_date: "bill_date",
      add: "same",
      remarks: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bill_no: "same",
    },
    url: SERVER_URL + "/crossing_bill_in/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    // additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  saveCrossingBillOut: {
    paramSchema: {
      transporter_id: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      date_to: "same",
      crossing_outward_date: "same",
      net_amount: "same",
      // type: "same",
      input_date: "bill_date",
      add: "same",
      remarks: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bill_no: "same",
    },
    url: SERVER_URL + "/crossing_bill_out/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    // additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyCrossingBillIn: {
    paramSchema: {
      transporter_id: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      date_to: "same",
      crossing_inward_date: "same",
      net_amount: "same",
      // type: "same",
      input_date: "bill_date",
      id: "same",
      add: "same",
      remarks: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      bill_no: "same",
    },
    url: SERVER_URL + "/crossing_bill_in/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bill) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyCrossingBillOut: {
    paramSchema: {
      transporter_id: "same",
      total_amount: "same",
      // add: "same",
      net_amount: "same",
      crossing_info: "same",
      created_from: "same",
      created_by: "same",
      date_to: "same",
      crossing_outward_date: "same",
      net_amount: "same",
      // type: "same",
      input_date: "bill_date",
      id: "same",
      add: "same",
      remarks: "same",
      company_id: "companyId",
      fYear_get: "fyear",
    },
    responseSchema: {
      bill_no: "same",
    },
    url: SERVER_URL + "/crossing_bill_out/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   if (!text.bilty_no) {
    //     console.log("In fff");
    //     throw new Error("The required value must be a number fff");
    //   }
    // },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/id",
    methodType: "POST",
    respoonseSchema: {},
    tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const tripBhadaApiConfig = {
  getTripBhada: {
    responseSchema: {
      vehicle_id: "same",
      vehicle_no: "same",
      owner_name: "same",
      driver_name: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      trip_info: "same",
      amount: "same",
      input_date: "trip_bhada_date",
      receiver_name: "same",
      id: "trip_bhada_no",
    },
    url: SERVER_URL + "/trip_bhada/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      let amount = 0;
      let temp_amount = 0;
      for (let i = 0; i < inputObject.trip_info.length; i++) {
        temp_amount = parseInt(inputObject.trip_info[i].balance_bhada) || 0;
        amount += temp_amount;
      }
      inputObject.amount = amount;
      return inputObject;
    },
  },
  saveTripBhada: {
    paramSchema: {
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      trip_info: "same",
      amount: "same",
      input_date: "trip_bhada_date",
      receiver_name: "same",
    },
    responseSchema: {
      id: "trip_bhada_no",
      status: "same",
    },
    url: SERVER_URL + "/trip_bhada/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_bhada_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  modifyTripBhada: {
    paramSchema: {
      vehicle_id: "same",
      created_from: "same",
      remarks: "same",
      created_by: "same",
      trip_info: "same",
      amount: "same",
      input_date: "trip_bhada_date",
      receiver_name: "same",
      trip_bhada_no: "id",
    },
    responseSchema: {
      id: "trip_bhada_no",
      status: "same",
    },
    url: SERVER_URL + "/trip_bhada/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.trip_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    // additionalFilterOnInput: (inputObject) => {
    //     if (inputObject.eway_bill_info &&
    //         inputObject.eway_bill_info.length==1 &&
    //         inputObject.eway_bill_info[0].eway_bill_no == ""){
    //         delete inputObject.eway_bill_info
    //     }
    //     return inputObject;
    // },
  },
  getVehicleSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/vehicle/",
    methodType: "GET",
    respoonseSchema: {},
  },
};

const partyRateMasterApiConfig = {
  savePartyRateMaster: {
    paramSchema: {
      rate_info: "same",
      charge_info: "same",
      consignor_id: "same",
    },
    // responseSchema: {
    //   bilty_no: "same",
    // },
    url: SERVER_URL + "/party_rate/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // validateResponse: (text) => {
    //   // We only throw the error if the incoming data status is not equal to "ok"
    //   // if (!text.bilty_no) {
    //   //   console.log("In fff");
    //   //   throw new Error("The required value must be a number fff");
    //   // }
    // },
    additionalFilterOnInput: (inputObject) => {
      for (let i = 0; i < inputObject.rate_info.length; i++) {
        for (let key in inputObject.rate_info[i]) {
          if (inputObject.rate_info[i][key] == "") {
            inputObject.rate_info[i][key] = null;
          }
        }
      }
      return inputObject;
    },
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const generalRateMasterApiConfig = {
  getBilty: {
    responseSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      bilty_id: "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_info: "item_in",
      eway_bill_info: "eway_bill_no",
      is_deleted: "same",
      bilty_date: "input_date",
      booking_chalan_no: "same",
      mr_no: "same",
      trip_no: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      crossing_inward_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input object", inputObject);
      if (inputObject.eway_bill_info.length == 0) {
        inputObject.eway_bill_info = [
          {
            eway_bill_no: "",
            new_row: "N",
          },
        ];
      }
      return inputObject;
    },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveGeneralRateMaster: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      rate_info: "same",
      consignee_id: "consignee",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/general_rate/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.bilty_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    // additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyBilty: {
    paramSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

const accountReportApiConfig = {
  getBilty: {
    responseSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      bilty_id: "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_info: "item_in",
      eway_bill_info: "eway_bill_no",
      is_deleted: "same",
      bilty_date: "input_date",
      booking_chalan_no: "same",
      mr_no: "same",
      trip_no: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      crossing_inward_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "GET",
    additionalFilterOnResponse: (inputObject) => {
      console.log("Input object", inputObject);
      if (inputObject.eway_bill_info.length == 0) {
        inputObject.eway_bill_info = [
          {
            eway_bill_no: "",
            new_row: "N",
          },
        ];
      }
      return inputObject;
    },
  },
  getEwbInfo: {
    responseSchema: {
      consignor_id: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      consignee_id: "same",
      goods_invoice_value: "same",
    },
    url: SERVER_URL + "/ewb/",
    methodType: "POST",
    additionalFilterOnResponse: additionalFilterOnResponseForGetEwb,
  },
  saveGeneralRateMaster: {
    paramSchema: {
      station_from: "same",
      station_to: "same",
      rate_info: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/general_rate/",
    methodType: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      // if (!text.bilty_no) {
      //   console.log("In fff");
      //   throw new Error("The required value must be a number fff");
      // }
    },
    // additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  modifyBilty: {
    paramSchema: {
      no_of_package: "same",
      bilty_no: "same",
      other_amount: "same",
      actual_weight: "same",
      freight: "same",
      station_from: "same",
      charge_weight: "same",
      station_to: "same",
      hamali: "same",
      packing_type: "same",
      destination: "same",
      door_del_charge: "same",
      private_marka_no: "same",
      pay_type: "same",
      goods_invoice_value: "same",
      consignor_id: "same",
      delivery_dest_type: "same",
      // "bilty_id": "same",
      consignee_id: "same",
      remarks: "same",
      bilty_charge: "same",
      consignor_name: "same",
      consignee_name: "same",
      consignor_gst: "same",
      consignee_gst: "same",
      station_from_name: "same",
      station_to_name: "same",
      destination_name: "same",
      item_in: "same",
      created_by: "same",
      created_from: "same",
      delivery_dest_type: "same",
      pay_type: "same",
      packing_type: "same",
      // "is_printed": "same",
      eway_bill_no: "eway_bill_info",
      input_date: "bilty_date",
      total_amount: "same",
      total_amount: "same",
      transporter_id: "same",
      transporter_name: "same",
      suffix: "same",
      transporter_freight: "same",
      is_crossing: "same",
      company_id: "companyId",
      fYear: "fyear",
    },
    responseSchema: {
      bilty_no: "same",
    },
    url: SERVER_URL + "/bilty/",
    methodType: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    validateResponse: (text) => {
      // We only throw the error if the incoming data status is not equal to "ok"
      if (!text.bilty_no) {
        console.log("In fff");
        throw new Error("The required value must be a number fff");
      }
    },
    additionalFilterOnInput: additionalFilterOnInputForBilty,
  },
  getCitySuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/branch/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsignorSuggestions: {
    url: SERVER_URL + "/consignor/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getConsigneeSuggestions: {
    paramSchema: {},
    url: SERVER_URL + "/consignee/",
    methodType: "GET",
    respoonseSchema: {},
  },
  getItemSuggestions: {
    url: SERVER_URL + "/item/",
    methodType: "POST",
    respoonseSchema: {},
    // tailTruncate: true,
  },
  getTransporterSuggestions: {
    url: SERVER_URL + "/transporter/",
    methodType: "POST",
    respoonseSchema: {},
  },
};

export {
  biltyApiConfig,
  challanApiConfig,
  podChallanApiConfig,
  mrInquiryApiConfig,
  vehicleRegisterApiConfig,
  mrApiConfig,
  tripApiConfig,
  tripBhadaApiConfig,
  challanInwardApiConfig,
  biltyStatementApiConfig,
  mrStatementApiConfig,
  podChallanInwardApiConfig,
  vehicleApiConfig,
  crossingInApiConfig,
  accountMasterApiConfig,
  crossingOutApiConfig,
  itemMasterApiConfig,
  stationMasterApiConfig,
  consignorBillingApiConfig,
  crossingBillingApiConfig,
  partyRateMasterApiConfig,
  generalRateMasterApiConfig,
  accountReportApiConfig,
  podStatementApiConfig,
  biltyInquiryApiConfig,
  accountTransactionApiConfig,
  BrokerageSummaryApiConfig,
  BankClearanceApiConfig,
  GroupMasterApiConfig,
  SubgroupMasterApiConfig,
  separateEwbApiConfig,
  mrPendingAmountApiConfig,
  fleetApiConfig,
  stockOutwardApiConfig,
  stockInwardApiConfig,
};
