import React, { useState, useEffect } from "react";
import DynamicTable from "./DynamicTable";
import Popup from "reactjs-popup";
import "./Form.css";
import { biltyApiConfig } from "../config/apiConfig.js";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import FormColumn from "./FormColumn.js";
import LoadingOverlay from "react-loading-overlay";
import "./FieldView.css";
import {
  groupInfo,
  validate,
  dataObject,
  popupInfo,
} from "../config/Biltyform.js";
import {
  itemTableHeader,
  itemTableItems,
  ewbTableItems,
  ewbTableHeader,
} from "../config/tableItems";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./popup.css";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "../components/ComponentToPrint";
import { useHistory, useLocation } from "react-router-dom";

const FormSignup = ({ sessionObject }) => {
    const location = useLocation();
    const [locationData, setLocationData] = useState({});
    // useEffect(() => {
    //     console.log(myForm.pageState);
    //     // console.log(myForm.pageMode);
    // })

    useEffect(() => {
        const lData = location.state ?? {};
        if("biltyNo" in lData) {
            setLocationData(lData);
            myForm.setPageState(oldState => ({
                ...oldState,
                bilty_no: lData.biltyNo,
                suffix: lData.suffix,
            }));
        }
    }, []);

    useEffect(() => {
        // console.log(locationData);
        if("biltyNo" in locationData) {
            const fakeKey = { key: "Enter" }
            myForm.getPageOnKeyEnter(fakeKey, locationData.biltyNo);
        }
    }, [locationData])

  const history = useHistory();
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    role_id: String(sessionObject.sessionVariables.role_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
    suffix: sessionObject.sessionVariables.branch_suffix,
    // "last_bilty_no": String(sessionObject.sessionVariables.last_bilty_no),
  };
  const myForm = useForm(
    "Bilty",
    validate,
    { ...dataObject, ...variablesFromSession },
    biltyApiConfig
  );
  
  
  useEffect(() => {
    myForm.setPageStateByField("consignee", myForm.pageState.consignee_id);
  }, [myForm.pageState.consignee_id])


  const getRateUnits = async () => {
        const url = SERVER_URL + "/party_rate/get_party_units?"
                + `consignor_id=${myForm.pageState.consignor_id}`
                + `&station_from=${myForm.pageState.station_from}`
                + `&station_to=${myForm.pageState.station_to}`;

        let resp = await fetch(url, {
            method: "POST",
        })

        if(resp.ok) {
            let respData = await resp.json();
            console.log({respData});

            // if super admin, don't change unit list
            if("units" in respData 
                && sessionObject.sessionVariables.role_id != "1"
            ) {
                itemTableItems[1].dropdown_items = respData.units.map((item) => {
                    return {
                        value: item,
                        label: item,
                    }
                })
            }

            if("name" in respData) {
                myForm.setPageState(oldState => ({
                    ...oldState,
                    "item_in": [
                        {
                            ...oldState.item_in[0],
                            amount: "",
                            item_id: respData.item_id,
                            item_name: respData.name,
                            rate: respData.rate,
                            unit: respData.units[0],
                            rate_info: [],
                        },
                    ]
                }))
            }
            else {
                myForm.setPageState((olState) => ({
                    ...olState,
                    item_in: [
                        {
                          amount: "",
                          item_name: "",
                          pkgs: olState.item_in[0].pkgs,
                          rate: "",
                          unit: "C",
                          weight: olState.item_in[0].weight,
                          new_row: "N",
                          packing_type: "1",
                          truck_size: "9mt",
                          rate_info: [],
                        },
                    ],
                }))
            }
        }
    }

    // useeffect to fetch rate units and item
  useEffect(() => {
    if(myForm.pageMode != "view" && myForm.pageState.pay_type == "4") {
        getRateUnits();
    }
}, [myForm.pageState.station_from ,myForm.pageState.consignor_id, myForm.pageState.station_to, myForm.pageState.pay_type])


    // useeffect to fetch unit and rate beforehand if item has only one unit and rate
    // set available units for current item as well.
   useEffect(() => {
       
       if(myForm.pageMode != "view" && myForm.pageState.pay_type == "4") {
           console.log("OOOOOOOOOOOOOOOOOOOOO");
            const changeUnitsList = (newList) => {
                if(!newList.length) {
                    return;
                }
                itemTableItems[1].dropdown_items = newList.map((item) => {
                    return {
                        value: item.toUpperCase(),
                        label: item.toUpperCase(),
                    }
                })

                myForm.setPageState(oldState => {
                    return {...oldState};
                })
            }

            let rateInfo = myForm.pageState.item_in[0].rate_info ?? [];
            if(rateInfo == "") {
                rateInfo = [];
            }

            console.log({rateInfo});
            // if only one rate unit is there, dont wait for hit of enter on unitRate dropdown
            // instead fetch rate-unit here.
            if(rateInfo.length == 1)
            {
                myForm.setPageState((oldState) => ({
                    ...oldState,
                    "item_in": [{
                        ...myForm.pageState.item_in[0],
                        rate: rateInfo[0].rate,
                        unit: rateInfo[0].unit.toUpperCase(),
                    }]
                }))
            }

            if(myForm.pageState.role_id != "1") {
                let unitList = [];
                rateInfo.forEach(obj => {
                    if(unitList.indexOf(obj.unit) == -1) {
                        unitList.push(obj.unit);
                    }
                })
                changeUnitsList(unitList);
            }
       }

   }, [myForm.pageState.item_in[0].rate_info])


   // useEffect for, if we change paytype then existing info of item should be discarded
   useEffect(() => {
    if(myForm.pageMode != "view" && myForm.pageState.pay_type != "4" && myForm.pageState.prev_pay_type == "4") {
        myForm.setPageState((olState) => ({
            ...olState,
            item_in: [
                {
                    ...myForm.pageState.item_in[0],
                    rate: "",
                  amount: "",
                //   item_name: "",
                //   pkgs: "",
                //   rate: "",
                //   unit: "C",
                //   weight: "",
                //   new_row: "N",
                //   packing_type: "1",
                //   truck_size: "9mt",
                  rate_info: [],
                },
            ],
        }))
    }
   }, [myForm.pageState.pay_type])

   useEffect(() => {    
        
        const getDDRate = async () => {
            const url = SERVER_URL + "/party_rate/get_dd_fix";

            const dataToSend = {
                station_from: myForm.pageState.station_from,
                consignor_id: myForm.pageState.consignor_id,
                consignee_id: myForm.pageState.consignee_id,
                station_to: myForm.pageState.station_to,
            }

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });
            
            if(resp.ok) {
                const respData = await resp.json();
                if("amount" in respData) {
                    myForm.setPageState((oldState) => ({
                        ...oldState,
                        door_del_charge: respData.amount,
                        delivery_dest_type: "1",
                    }))
                }
            } 
        }

        if(myForm.pageMode == "write") {
            getDDRate();
        }
   }, [myForm.pageState.consignor_id, myForm.pageState.station_from, myForm.pageState.station_to, myForm.pageState.consignee_id])

    const getAdditionalInfoForTransporterFetch = () => {
        let additionalInfoObject = {
            is_transporter: 1,
        }
        return additionalInfoObject;
    }

  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    let additionalInfoObject = {};
    if (fieldInfoObject.name == "consignor_name") {
      additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.bilty_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    if (fieldInfoObject.name == "consignee_name") {
      // additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.pay_type = myForm.pageState.pay_type;
      if(myForm.pageState.pay_type == "1" || myForm.pageState.pay_type == "4") {
          additionalInfoObject.station_from = parseInt(myForm.pageState.station_from);
          additionalInfoObject.station_to = myForm.pageState.station_to;
      }
      return additionalInfoObject;
    }
    if (fieldInfoObject.name == "consignor_gst") {
      additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.bilty_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    if (fieldInfoObject.name == "consignee_gst") {
      // additionalInfoObject.branch_id = myForm.pageState.created_from;
      additionalInfoObject.pay_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    if (fieldInfoObject.name == "station_from_name") {
      additionalInfoObject.is_branch = true;
      // additionalInfoObject.pay_type = myForm.pageState.pay_type;
      return additionalInfoObject;
    }
    return null;
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if(fieldInfo.name == "edit_button") {
        const roleId = String(sessionObject.sessionVariables.role_id);
        if((roleId != "1" && roleId != "2") &&
            (myForm.pageState.pay_type == 1 || myForm.pageState.pay_type == 4) &&
            String(myForm.pageState.booking_chalan_no) != "") {
                    return "";
        }
    }

    if (
      myForm.pageState.pay_type == "4" &&
      (fieldInfo.name == "freight" ||
        fieldInfo.name == "total_amount" ||
        fieldInfo.name == "hamali" ||
        // fieldInfo.name == "door_del_charge" ||
        fieldInfo.name == "bilty_charge") &&
      myForm.pageState.role_id != "1"
    ) {
      return false;
    } else if (
        fieldInfo.name == "delete_button" && 
        (myForm.pageState.role_id != "1" && myForm.pageState.role_id != "2")
    ) {
        return false;
    }
    else if (
      myForm.pageState.pay_type == "2" &&
      fieldInfo.name == "delete_button" &&
      myForm.pageState.role_id != "1"
    ) {
      return false;
    } else if (
      myForm.pageState.mr_no != "" &&
      fieldInfo.name == "delete_button" &&
      myForm.pageState.role_id != "1"
    ) {
      return false;
    } else if (
      myForm.pageState.pay_type == "2" &&
      fieldInfo.name == "edit_button" &&
      myForm.pageState.role_id != "1"
    ) {
      return false;
    } else if (
      myForm.pageState.mr_no != "" &&
      fieldInfo.name == "edit_button" &&
      myForm.pageState.role_id != "1"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "N" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "n" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "" &&
      fieldInfo.name == "transporter_name"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "N" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "n" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "Y" &&
      fieldInfo.name == "bilty_charge"
    ) {
      return false;
    } else if (
      myForm.pageState.is_crossing == "" &&
      fieldInfo.name == "transporter_freight"
    ) {
      return false;
    } else if (fieldInfo.name == "actual_weight") {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    //   console.log("checkDisabledCondition", fieldInfo, myForm.pageMode);
    if (myForm.pageMode == "view") {
        return "disabled";
    } else if (
      fieldInfo.name == "pay_type" &&
      myForm.pageState.pay_type == "4" &&
      myForm.pageState.item_in[0].item_name != "" &&
      myForm.pageMode != "write"
    ) {
      console.log("check", myForm.pageState.item_in[0]);
      return "disabled";
    } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
      return "";
    } else {
      return "";
    }
  };

  const fetchChargeRate = async () => {
    let packages = 0;
    let total_weight = 0;
    for (var data of myForm.pageState["item_in"]) {
      packages = packages + data.pkgs;
      total_weight = total_weight + data.weight;
    }
    // if (myForm.pageState["Bilty No"] == "" && e.key == "Enter") {
    //   myForm.makeFocusOnParticularField("delivery_on");
    //   return;
    // }
    // if (e.key == "Enter") {
    //   let flag = 0;
    //   if (
    //     myForm.pageState.bilty_type == "c" ||
    //     myForm.pageState.bilty_type == "C"
    //   ) {
    //     flag = 1;
    //   }
    //   let suffix = myForm.pageState.suffix;
    //   if (suffix == "") {
    //     suffix = "null";
    //   }
    const url = SERVER_URL + "/charge_rate/get";
    // + "?fyear=" + myForm.pageState.fYear + "&companyId=" + myForm.pageState.company_id;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bilty_type: myForm.pageState.pay_type,
        station_from: myForm.pageState.station_from,
        station_to: myForm.pageState.station_to,
        consignor_id: myForm.pageState.consignor_id,
        consignee_id: myForm.pageState.consignee_id,
      }),
    });

    console.log("Response", response);
    const temp_response = await response.json();
    if (temp_response.length == 0) {
      return;
    }

    let dummyObject = {
      bilty_charge: myForm.pageState.bilty_charge,
      hamali: myForm.pageState.hamali,
      door_del_charge: myForm.pageState.door_del_charge,
      normal_bilty_charge: "",
      normal_hamali: "",
      normal_door_del_charge: "",
    };
    // console.log("Unit :-",myForm.pageState["item_in"][myForm.pageState["item_in"].length - 1]['unit'])
    for (var info of temp_response.charge_info) {
      console.log("Info begin :-", info);
      if (info.charge_type == 1) {
        if (info.charge == 1) {
          // if(dummyObject){
            if (info.qty_from_kg == null && info.qty_to_kg == null) {
            
            } 
          else if (info.qty_from_kg != null && info.qty_to_kg == null) {
            if (total_weight >= info.qty_from_kg) {
              dummyObject.bilty_charge = info.amount;
            }
          } else if (
            total_weight >= info.qty_from_kg &&
            total_weight <= info.qty_to_kg
          ) {
            dummyObject.bilty_charge = info.amount;
          }
          if (dummyObject.bilty_charge == "") {
            if (info.qty_from_case == null && info.qty_to_case == null) {
            
            } 
            else if (info.qty_from_case != null && info.qty_to_case == null) {
              if (packages >= info.qty_from_case) {
                dummyObject.bilty_charge = info.amount;
              }
            } else if (
              packages >= info.qty_from_case &&
              packages <= info.qty_to_case
            ) {
              dummyObject.bilty_charge = info.amount;
            }
          }

          if (info.qty_from_case == null && info.qty_to_case == null && info.qty_from_kg == null && info.qty_to_kg == null) {
            dummyObject.normal_bilty_charge = info.amount;
          } 

          if (dummyObject.bilty_charge == "") {
            dummyObject.bilty_charge = 0
          }
        } else if (info.charge == 4) {
          // if(myForm.pageState["item_in"][myForm.pageState["item_in"].length - 1]['unit'] == 'W'){
          if (info.qty_from_kg == null && info.qty_to_kg == null) {
            // dummyObject.normal_hamali = info.amount;
          } else if (info.qty_from_kg != null && info.qty_to_kg == null) {
            if (total_weight >= info.qty_from_kg) {
              dummyObject.hamali = info.amount;
            }
          } else if (
            total_weight >= info.qty_from_kg &&
            total_weight <= info.qty_to_kg
          ) {
            dummyObject.hamali = info.amount;
          }
          if (dummyObject.hamali == "") {
            if (info.qty_from_case == null && info.qty_to_case == null) {
              // dummyObject.normal_hamali = info.amount;
            } else if (info.qty_from_case != null && info.qty_to_case == null) {
              if (packages >= info.qty_from_case) {
                dummyObject.hamali = info.amount;
              }
            } else if (
              packages >= info.qty_from_case &&
              packages <= info.qty_to_case
            ) {
              dummyObject.hamali = info.amount;
            }
          }
          if (info.qty_from_case == null && info.qty_to_case == null && info.qty_from_kg == null && info.qty_to_kg == null) {
            dummyObject.normal_hamali = info.amount;
          } 

          if (dummyObject.hamali == "") {
            dummyObject.hamali = 0
          }
        } else if (info.charge == 2) {
          console.log(
            "Unit :- ",
            myForm.pageState["item_in"][myForm.pageState["item_in"].length - 1][
              "unit"
            ]
          );
          // if(myForm.pageState["item_in"][myForm.pageState["item_in"].length - 1]['unit'] == 'W'){
          console.log("Info :- ", info);
          if (info.qty_from_kg == null && info.qty_to_kg == null) {
            // dummyObject.normal_door_del_charge = info.amount;
          } else if (info.qty_from_kg != null && info.qty_to_kg == null) {
            if (total_weight >= info.qty_from_kg) {
              dummyObject.door_del_charge = info.amount;
            }
          } else if (
            total_weight >= info.qty_from_kg &&
            total_weight <= info.qty_to_kg
          ) {
            dummyObject.door_del_charge = info.amount;
          }
          if (dummyObject.door_del_charge == "") {
            if (info.qty_from_case == null && info.qty_to_case == null) {
              // dummyObject.normal_door_del_charge = info.amount;
            } else if (info.qty_from_case != null && info.qty_to_case == null) {
              if (packages >= info.qty_from_case) {
                dummyObject.door_del_charge = info.amount;
              }
            } else if (
              packages >= info.qty_from_case &&
              packages <= info.qty_to_case
            ) {
              dummyObject.door_del_charge = info.amount;
            }
          }
          if (info.qty_from_case == null && info.qty_to_case == null && info.qty_from_kg == null && info.qty_to_kg == null) {
            dummyObject.normal_door_del_charge = info.amount;
          } 

          if (dummyObject.door_del_charge == "") {
            dummyObject.door_del_charge = 0
          }
        }
      } else if (info.charge_type == 3) {
        if (info.charge == 1) {
          dummyObject.bilty_charge = info.amount * packages;
        } else if (info.charge == 2) {
          dummyObject.door_del_charge = info.amount * packages;
        } else if (info.charge == 4) {
          dummyObject.hamali = info.amount * packages;
        }
      } else if (info.charge_type == 4) {
        if (info.charge == 1) {
          dummyObject.bilty_charge = info.amount * total_weight;
        } else if (info.charge == 2) {
          dummyObject.door_del_charge = info.amount * total_weight;
        } else if (info.charge == 4) {
          dummyObject.hamali = info.amount * total_weight;
        }
      }
    }
    if (dummyObject.bilty_charge == "" && dummyObject.normal_bilty_charge != "") {
      dummyObject.bilty_charge = dummyObject.normal_bilty_charge;
    }
    if (dummyObject.hamali == "" && dummyObject.normal_hamali != "") {
      dummyObject.hamali = dummyObject.normal_hamali;
    }
    console.log("Door dele charge :- ", dummyObject.normal_door_del_charge);
    if (dummyObject.door_del_charge == "" && dummyObject.normal_door_del_charge != "") {
      dummyObject.door_del_charge = dummyObject.normal_door_del_charge;
    }
    let objectToSave = {
      bilty_charge: dummyObject.bilty_charge,
      hamali: dummyObject.hamali,
      door_del_charge: dummyObject.door_del_charge,
    };

    //   if (!response.ok) {
    myForm.setPageState({
      ...myForm.pageState,
      ...objectToSave,
    });
    myForm.makeFocusOnParticularField("charge_weight");
    //     const temp_error = await response.json();
    //     if ("detail" in temp_error){
    //       myForm.setPageMode("error");
    //       myForm.setPopupError(temp_error.detail);
    //     }
    //     else{
    //       myForm.setPageMode("error");
    //       myForm.setPopupError("Invalid Bilty");
    //     }
    //     return;
    //   }
    //   const temp_response = await response.json();
    //   if (temp_response.check_fail) {
    //     myForm.setPageState({
    //       ...myForm.pageState,
    //       ["Bilty No"]: "",
    //     });
    //     myForm.setPageMode("error");
    //     myForm.setPopupError("Not possible to add this bilty");
    //     return;
    //   }
    //   if (
    //     checkIfFieldAlreadyExists(
    //       "bilty_id",
    //       temp_response.bilty_id,
    //       myForm.pageState.bilty_ids
    //     )
    //   ) {
    //     myForm.setPageState({
    //       ...myForm.pageState,
    //       ["No"]: "",
    //     });
    //     myForm.setPageMode("error");
    //     myForm.setPopupError("Already present");
    //     return;
    //   }

    //   let partyName = "";
    //   let total_amount = 0;
    //   let newState = {
    //     bilty_ids: [...myForm.pageState["bilty_ids"], temp_response],
    //     ["Bilty No"]: "",
    //   };
    //   if (myForm.pageState.bilty_ids.length == 0) {
    //     partyName = temp_response.consignee_name;
    //   }
    //   if (partyName != "") {
    //     newState.party_name = partyName;
    //   }
    //   if (temp_response.pay_type_name == "To Pay") {
    //     if (temp_response.freight != "" && temp_response.freight != null) {
    //       total_amount += parseInt(temp_response.freight);
    //     }
    //     if (temp_response.hamali != "" && temp_response.hamali != null) {
    //       total_amount += parseInt(temp_response.hamali);
    //     }
    //     if (
    //       temp_response.door_del_charge != "" &&
    //       temp_response.door_del_charge != null
    //     ) {
    //       total_amount += parseInt(temp_response.door_del_charge);
    //     }
    //     if (
    //       temp_response.bilty_charge != "" &&
    //       temp_response.bilty_charge != null
    //     ) {
    //       total_amount += parseInt(temp_response.bilty_charge);
    //     }
    //     if (
    //       temp_response.other_amount != "" &&
    //       temp_response.other_amount != null
    //     ) {
    //       total_amount += parseInt(temp_response.other_amount);
    //     }

    //     if (
    //       myForm.pageState.to_pay_amount != "" &&
    //       myForm.pageState.to_pay_amount != null
    //     ) {
    //       newState.to_pay_amount = String(
    //         total_amount + parseInt(myForm.pageState.to_pay_amount)
    //       );
    //     } else {
    //       newState.to_pay_amount = String(total_amount);
    //     }
    //   }
    //   console.log("New state", newState);
    //   myForm.setPageState({
    //     ...myForm.pageState,
    //     ...newState,
    //   });
    //   myForm.makeFocusOnParticularField("bilty_type");
    // }
  };

  const handlePaidAmount = async () => {
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

    const url =
      SERVER_URL +
      "/bilty/paid_clear?branch_id=" +
      myForm.pageState.created_from +
      "&user_id=" +
      myForm.pageState.created_by +
      "&fyear=" + myForm.pageState.fYear + "&companyId=" + myForm.pageState.company_id;

    const response = await fetch(url, { method: "POST" });
    if (!response.ok) {
      console.log("Not able to delete bilty");
      return;
    }
    const temp_response = await response.json();
    // myForm.pageState.paid_amount = 0;
    let objToSave = {
      paid_amount: 0,
    };
    myForm.setPageState({
      ...myForm.pageState,
      ...objToSave,
    });
    // myForm.setPageState({ ...dataObject});
    // if (temp_response.is_deleted) {
    //   myForm.setPageState({ ...dataObject, ...variablesFromSession });
    //   myForm.setPageMode("write");
    //   window.location.reload();
    //   return;
    // }
  };

  const handleDelete = async () => {
    let url =
      SERVER_URL + "/bilty/hard/?bilty_id=" + myForm.pageState.bilty_id;

    // url += "&fyear=" + myForm.pageState.fYear + "&companyId=" + myForm.pageState.company_id;

    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete bilty");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      myForm.setPageState({ ...dataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  const checkPrint = async () => {
    console.log("Ho");
    // throw new Error("Check");
    let response = null;
    try {
      response = await myForm.synchronousSave();
      myForm.setPageState({
        ...myForm.pageState,
        ...response.response,
      });
      myForm.setPageMode("submitted");
    } catch (e) {
      if ("save_button" in myForm.refStoreObject.current) {
        myForm.refStoreObject.current["save_button"].removeAttribute(
          "disabled"
        );
      }
      if ("print_button" in myForm.refStoreObject.current) {
        myForm.refStoreObject.current["print_button"].removeAttribute(
          "disabled"
        );
      }
      myForm.setPreviousPageMode(myForm.pageMode);
      myForm.setPageMode("error");
      myForm.setPopupError(e.message);
      // console.log("error caught", e.message);
      throw new Error("Hiiii");
    }

    console.log("response sync", response);
    return;
  };

  const transporterFieldInfo = {
    label: "Transporter",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "transporter_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getTransporterSuggestions",
    url: SERVER_URL + "/transporter/",
    suggestionKeyword: "transporter_name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "transporter_id",
    suggestionSchema: {
      transporter_name: "transporter_name",
      suffix: "suffix",
      transporter_id: "transporter_id",
    },
    apiCallRequiredOnGetValue: true,
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "bilty_no",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "transporter_id",
  };

  return (
    <div className="form-container">
      {
        USE_OVERLAY && (
          <LoadingOverlay
          active={myForm.overlay}
          spinner
          text="Loading your content..."
          styles={{
            wrapper: {
              // width: '400px',
              // height: '400px',
              overflow: true ? "hidden" : "scroll",
            },
          }}
        ></LoadingOverlay>
        )
      }

      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          // open={myForm.pageMode == "submitted" || myForm.pageMode == "error"}
          open={myForm.pageMode == "error"}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">
                {" "}
                {myForm.pageMode == "submitted" ? (
                  <div>{popupInfo.success_header}</div>
                ) : (
                  <div>{popupInfo.error_header}</div>
                )}
                <div>
                  <a className="pop-up-close btn" onClick={close}>
                    &times;
                  </a>
                </div>
              </div>
              {myForm.pageMode == "submitted" ? (
                <div className="pop-up-content">
                  {popupInfo.success_title}
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">
                        {popupInfo.field_label_success}
                      </div>
                      <div className="pop-up-field-value">
                        {myForm.pageState[popupInfo.field_name_success]}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {popupInfo.error_title}
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">
                        {popupInfo.field_label_error}
                      </div>
                      <div className="pop-up-field-value">
                        {myForm.popupError}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    if (myForm.pageMode == "submitted") {
                      // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":myForm.pageState.bilty_no})
                      myForm.setPageState({
                        ...dataObject,
                        ...variablesFromSession,
                      });
                      myForm.setPageMode("write");
                      window.location.reload();
                      close();
                    } else {
                      if (myForm.previousPageMode != "") {
                        myForm.setPageMode(myForm.previousPageMode);
                        myForm.setPreviousPageMode("");
                      } else {
                        myForm.setPageMode("write");
                      }
                      close();
                    }
                  }}
                >
                  Okay
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          open={myForm.deletePopup}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">Are you sure want to delete?</div>
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    handleDelete();
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  Yes
                </button>
                <button
                  className="pop-up-button"
                  onClick={() => {
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div className="form-parent">
        <div className="form-header-bilty">Bilty</div>
        <div className="form-side">Paid Amount:</div>
        <div className="form-al">{myForm.pageState.paid_amount}</div>
        <button class="clear-button" onClick={handlePaidAmount}>
          Clear
        </button>
      </div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Crossing?</label>
            <select
              className="form-input"
              onChange={(newValue) => {
                myForm.handleChangeForSelect(newValue, "is_crossing");
              }}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "is_crossing")}
              disabled={checkDisabledCondition({ name: "is_crossing" })}
              value={myForm.pageState["is_crossing"]}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  a.preventDefault();
                  if (
                    myForm.pageState.is_crossing == "N" ||
                    myForm.pageState.is_crossing == "n"
                  ) {
                    myForm.makeFocusOnParticularField("bilty_no");
                    return;
                  } else {
                    myForm.makeFocusOnParticularField("transporter_name");
                    return;
                  }
                }
              }}
            >
              <option value="N" key="N">
                N
              </option>
              <option value="Y" key="Y">
                Y
              </option>
            </select>
          </div>
          <div className="form-row">
            {checkVisibilityCondition(transporterFieldInfo) && (
              <label className="form-label">Transprter Name</label>
            )}
            {checkVisibilityCondition(transporterFieldInfo) && (
              <Autosuggest
                id={transporterFieldInfo["name"]}
                suggestions={myForm.suggestions}
                onSuggestionsFetchRequested={(a) =>
                  myForm.onSuggestionsFetchRequested(a, (b) =>
                    myForm.suggestionFetchApi(transporterFieldInfo, b, getAdditionalInfoForTransporterFetch())
                  )
                }
                onSuggestionsClearRequested={() =>
                  myForm.onSuggestionsClearRequested(transporterFieldInfo)
                }
                getSuggestionValue={(suggestion) =>
                  suggestion[transporterFieldInfo.suggestionKeyword]
                }
                onSuggestionSelected={(a, b) =>
                  myForm.getSuggestionValue(
                    b.suggestion,
                    transporterFieldInfo,
                    myForm.performSuggestions,
                    myForm.updatePageStateForGetSuggestion
                  )
                }
                renderSuggestion={(a) =>
                  myForm.renderSuggestion(a, transporterFieldInfo)
                }
                highlightFirstSuggestion={true}
                ref={(a) => myForm.storeInputReference(a, false)}
                inputProps={{
                  //placeholder: info["name"],
                  value: String(myForm.pageState[transporterFieldInfo["name"]]),
                  onChange: (a, b) => {
                    myForm.onChangeAutoSuggest(a, b, transporterFieldInfo);
                  },
                  onBlur: () => {
                    transporterFieldInfo["toValidate"]
                      ? myForm.onblurValidator(transporterFieldInfo)
                      : {};
                  },
                  onKeyPress: (a) => {
                    if (a.key == "Enter") {
                      myForm.makeFocusOnParticularField("bilty_no");
                    }
                  },
                  disabled: checkDisabledCondition(transporterFieldInfo),
                }}
              />
            )}
          </div>
          <div className="form-row">
            <label className="form-label">Bilty No:</label>
            <input
              className="form-input"
              type="text"
              name="bilty_no"
              placeholder=""
              value={myForm.pageState.bilty_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.bilty_no)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
              disabled={checkDisabledCondition({ name: "bilty_no" })}
            />
            <input
              className="form-input-suffix"
              type="text"
              name="suffix"
              placeholder=""
              value={myForm.pageState.suffix}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={(a) =>
                myForm.getPageOnKeyEnter(a, myForm.pageState.bilty_no)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
            //   disabled={true}
            />
            {myForm.pageMode == "view" && (
              <>
                {checkVisibilityCondition({ name: "edit_button" }) && (
                  <button
                    onClick={() => {
                      myForm.setPageMode("edit");
                    }}
                  >
                    Edit
                  </button>
                )}
                {/* <button
                  onClick={() => {
                    myForm.setPageState({
                      ...dataObject,
                      ...variablesFromSession,
                    });
                    window.location.reload();
                    myForm.setPageMode("write");
                  }}
                >
                  Clear
                </button> */}
                {/* {checkVisibilityCondition({ name: "delete_button" }) && (
                  <button onClick={handleDelete}>Delete</button>
                )} */}
              </>
            )}
          </div>
          <div>
            Bilty Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              disabled={checkDisabledCondition({ name: "input_date" })}
              onKeyPress={(a) => {
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularFieldForItem(
                    "eway_bill_no",
                    0,
                    "eway_bill_no"
                  );
                }
              }}
            />
          </div>
          <div className="form-row">
            <label className="form-last_bilty">Last Bilty No:</label>
            <label className="form-last_bilty">
              {myForm.pageState.last_suffix != ""
                ? myForm.pageState.last_bilty_no +
                  "(" +
                  myForm.pageState.last_suffix +
                  ")"
                : myForm.pageState.last_bilty_no}
              {/* {myForm.pageState.last_bilty_no +
                "(" +
                myForm.pageState.last_suffix +
                ")"} */}
            </label>
          </div>
        </div>
        <div className="form-input-content-block-0">
          <div className="form-field-left-most">
            <DynamicTable
              overlay={myForm.overlay}
              setOverlay={myForm.setOverlay}
              pageStateArray={myForm.pageState["eway_bill_no"]}
              pageMode={myForm.pageMode}
              fieldMapping="eway_bill_no"
              tableHeader={ewbTableHeader}
              tableItems={ewbTableItems}
              setPageStateByField={myForm.setPageStateByField}
              onSuggestionsFetchRequested={myForm.onSuggestionsFetchRequestedDebounced}
              onSuggestionsClearRequested={myForm.onSuggestionsClearRequested}
              onChangeAutoSuggest={myForm.onChangeAutoSuggest}
              getSuggestionValue={myForm.getSuggestionValue}
              renderSuggestion={myForm.renderSuggestion}
              performSuggestions={myForm.performSuggestions}
              suggestions={myForm.suggestions}
              suggestionFetchApi={myForm.suggestionFetchApi}
              storeInputReference={myForm.storeInputReference}
              refStoreObject={myForm.refStoreObject}
              makeFocusOnParticularField={myForm.makeFocusOnParticularField}
              makeFocusOnParticularFieldForItem={
                myForm.makeFocusOnParticularFieldForItem
              }
              apiConfig={biltyApiConfig["getEwbInfo"]}
              pageState={myForm.pageState}
              onblurValidatorForTable={myForm.onblurValidatorForTable}
              storeInputReferenceForSelectForDynamicTable={
                myForm.storeInputReferenceForSelectForDynamicTable
              }
            />
          </div>
          <div className="form-field-left">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-1"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={
                getAdditionalInfoForSuggestionFetch
              }
            />
          </div>
          <div className="form-field-right">
            <FormColumn
              groupInfo={groupInfo}
              groupName="group-2"
              checkDisabledCondition={checkDisabledCondition}
              checkVisibilityCondition={checkVisibilityCondition}
              myFormObj={myForm}
              getAdditionalInfoForSuggestionFetch={
                getAdditionalInfoForSuggestionFetch
              }
            />
          </div>
        </div>
        <div className="table-container">
          <DynamicTable
            // overlay={myForm.overlay}
            setOverlay={myForm.setOverlay}
            pageStateArray={myForm.pageState["item_in"]}
            pageMode={myForm.pageMode}
            fieldMapping="item_in"
            tableHeader={itemTableHeader}
            tableItems={itemTableItems}
            setPageStateByField={myForm.setPageStateByField}
            onSuggestionsFetchRequested={myForm.onSuggestionsFetchRequestedDebounced}
            onSuggestionsClearRequested={myForm.onSuggestionsClearRequested}
            onChangeAutoSuggest={myForm.onChangeAutoSuggest}
            getSuggestionValue={myForm.getSuggestionValue}
            renderSuggestion={myForm.renderSuggestion}
            performSuggestions={myForm.performSuggestions}
            suggestions={myForm.suggestions}
            suggestionFetchApi={myForm.suggestionFetchApi}
            storeInputReference={myForm.storeInputReference}
            refStoreObject={myForm.refStoreObject}
            makeFocusOnParticularField={myForm.makeFocusOnParticularField}
            makeFocusOnParticularFieldForItem={
              myForm.makeFocusOnParticularFieldForItem
            }
            apiConfig={biltyApiConfig["getEwbInfo"]}
            pageState={myForm.pageState}
            fetchChargeRate={fetchChargeRate}
            onblurValidatorForTable={myForm.onblurValidatorForTable}
            storeInputReferenceForSelectForDynamicTable={
              myForm.storeInputReferenceForSelectForDynamicTable
            }
          />
          {/* <StaticTable/> */}
          <div className="form-field-vertical">
            {groupInfo[myForm.pageState.is_crossing == "Y"?"group-5":"group-3"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["label"]}>
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>

                    <select
                      className={info["inputClassName"]}
                      onChange={(newValue) => {
                        myForm.handleChangeForSelect(newValue, info["name"]);
                      }}
                      disabled={checkDisabledCondition(info)}
                      value={myForm.pageState[info["name"]]}
                      ref={(a) =>
                        myForm.storeInputReferenceForSelect(a, info["name"])
                      }
                      onKeyPress={(a) => myForm.onKeyPressForKeyNav(a, info)}
                    >
                      {info["dropdown_items"].map((dropdown_item) => (
                        <option
                          value={dropdown_item.value}
                          key={dropdown_item.label}
                        >
                          {dropdown_item.label}
                        </option>
                      ))}
                    </select>
                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
              else
                return (
                  <div className={info["className"]} key={info["label"]}>
                    {checkVisibilityCondition(info) && (
                      <label className={info["labelClassName"]}>
                        {info["label"]}
                      </label>
                    )}
                    {checkVisibilityCondition(info) && (
                      <Autosuggest
                        id={info["name"]}
                        suggestions={myForm.suggestions}
                        onSuggestionsFetchRequested={(a) =>
                          myForm.onSuggestionsFetchRequested(a, (b) =>
                            myForm.suggestionFetchApi(info, b)
                          )
                        }
                        onSuggestionsClearRequested={() =>
                          myForm.onSuggestionsClearRequested(info)
                        }
                        getSuggestionValue={(a) =>
                          myForm.getSuggestionValue(
                            a,
                            info,
                            myForm.performSuggestions,
                            myForm.updatePageStateForGetSuggestion
                          )
                        }
                        renderSuggestion={(a) =>
                          myForm.renderSuggestion(a, info)
                        }
                        ref={(a) => myForm.storeInputReference(a, false)}
                        inputProps={{
                          placeholder: info["placeholder"],
                          value: String(myForm.pageState[info["name"]]),
                          onChange: (a, b) => {
                            myForm.onChangeAutoSuggest(a, b, info);
                          },
                          onBlur: () => {
                            info["toValidate"]
                              ? myForm.onblurValidator(info)
                              : {};
                          },
                          onKeyPress: (a) =>
                            myForm.onKeyPressForKeyNav(a, info),
                          disabled: checkDisabledCondition(info),
                        }}
                      />
                    )}
                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
            })}
          </div>
          <div className="field-container">
            {groupInfo["group-4"].map(function (info) {
              return (
                <div className={info["className"]} key={info["label"]}>
                  {checkVisibilityCondition(info) && (
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>
                  )}
                  {checkVisibilityCondition(info) && (
                    <input
                      className={info["className"]}
                      type={info["type"]}
                      name={info["name"]}
                      placeholder={info["placeholder"]}
                      value={myForm.pageState[info["name"]]}
                      onChange={myForm.handleChange}
                      onBlur={() => {}}
                      disabled={true}
                    />
                  )}
                  {myForm.internalValidationErrors[info["name"]] && (
                    <p>{myForm.internalValidationErrors[info["name"]]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-footer">
          <ReactToPrint
            trigger={() => (
              <button
                onClick={() => {
                  console.log("Values", myForm.pageState);
                  console.log(
                    "Value verification",
                    myForm.valueVerificationState
                  );
                  console.log("Id clearance", myForm.idClearancState);
                  console.log("Reference store", myForm.refStoreObject.current);
                  console.log("Session", sessionObject.sessionVariables);
                  console.log("Page mode", myForm.pageMode);
                }}
                ref={(a) =>
                  myForm.storeInputReferenceForSelect(a, "print_button")
                }
                type="button"
                className="btn btn-primary"
              >
                Print
              </button>
            )}
            content={(myForm) => ComponentToPrint.componentRef}
            onBeforeGetContent={checkPrint}
            onAfterPrint={() => {
              myForm.setPageState({
                ...dataObject,
                ...variablesFromSession,
              });
              myForm.setPageMode("write");
              window.location.reload();
              // close();
            }}
          />
          <button
            onClick={(e) => {
              myForm.setClearDataOnSave(true);
              myForm.handleSubmit(e);
            }}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={() => myForm.setDeletePopup(true)}>Delete</button>
          )}
          <button
            onClick={() => {
              history.push("/");
              // console.log("Values", myForm.pageState);
              //     console.log(
              //       "Value verification",
              //       myForm.valueVerificationState
              //     );
              //     console.log("Id clearance", myForm.idClearancState);
              //     console.log("Reference store", myForm.refStoreObject.current);
              //     console.log("Session", sessionObject.sessionVariables);
              //     console.log("Page mode", myForm.pageMode);
            }}
          >
            Exit
          </button>
          <button
            onClick={() => {
              myForm.setPageState({
                ...dataObject,
                ...variablesFromSession,
              });
              window.location.reload();
              myForm.setPageMode("write");
            }}
          >
            New
          </button>
          <div style={{ display: "none" }}>
            <ComponentToPrint
              fields={myForm.pageState}
              ref={(el) => (ComponentToPrint.componentRef = el)}
            />
          </div>

          {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
        </div>
      </div>
    </div>
  );
};

export default FormSignup;
