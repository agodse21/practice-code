
const lodash = require("lodash");

export function additionalFilterOnInputForMr(inputObject){

  let dummyObject = lodash.cloneDeep(inputObject);

  // Removing entries with blank string.
  for (let key in dummyObject){
    if (dummyObject[key] == ""){
      dummyObject[key] = null;
    }
  }
  return dummyObject;

}

export function effectForUpdatingTotalAmount(pageStateDummy){
    let needsUpdate = false;
    let hamali = pageStateDummy["hamali"];
    let service_charge = pageStateDummy["service_charge"];
    let demarage_charge = pageStateDummy["demarage_charge"];
    let other_charge = pageStateDummy["other_charge"];
    let refund = pageStateDummy["refund"];
    let total_amount = pageStateDummy["total_amount"];
    let to_pay_amount = pageStateDummy["to_pay_amount"];
    let updatedPageState = {};
  
    if(hamali == ""){
      hamali = 0;
    }
    else{
      hamali = parseInt(hamali);
    }
  
    if(service_charge == ""){
      service_charge = 0;
    }
    else{
      service_charge = parseInt(service_charge);
    }
  
    if(demarage_charge == ""){
      demarage_charge = 0;
    }
    else{
      demarage_charge = parseInt(demarage_charge);
    }
  
    if(other_charge == ""){
      other_charge = 0;
    }
    else{
      other_charge = parseInt(other_charge);
    }

    if(to_pay_amount == ""){
        to_pay_amount = 0;
    }
    else{
      to_pay_amount = parseInt(to_pay_amount);
    }

    if(total_amount == ""){
      total_amount = 0;
    }
    else{
      total_amount = parseInt(total_amount);
    }

    if(refund == ""){
        refund = 0;
      }
      else{
        refund = parseInt(refund);
      }
  
    if(total_amount != (hamali+service_charge+demarage_charge+other_charge+to_pay_amount-refund)){
      total_amount = hamali+service_charge+demarage_charge+other_charge+to_pay_amount-refund;
      needsUpdate = true;
      updatedPageState["total_amount"] = String(total_amount);
    }
    return [needsUpdate, updatedPageState]
  }

export function mrAutoUpdationEffectsDummy(pageStateDummy){
    let updatedPageState = {};
    let updatedPageStateTotal = {};
    let needsUpdate = false;
    let tempNeedsUpdate = false;

    [tempNeedsUpdate, updatedPageState] = effectForUpdatingTotalAmount({...pageStateDummy});
    pageStateDummy = {...pageStateDummy, ...updatedPageState}
    updatedPageStateTotal = {...updatedPageStateTotal, ...updatedPageState}
    if (tempNeedsUpdate){
        needsUpdate = true;
    }

    if (needsUpdate){
        return [needsUpdate, updatedPageStateTotal]
    }
    else{
        return [needsUpdate, {}]
    }
}
