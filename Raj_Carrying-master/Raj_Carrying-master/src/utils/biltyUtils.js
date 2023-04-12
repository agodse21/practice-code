
const lodash = require("lodash");

export function effectForUpdatingRestFieldsBasedOnItems(pageStateDummy) {
  let needsUpdate = false;
  let total_weight = 0;
  let total_amount = 0;
  let total_pkgs = 0;
  let updatedPageState = {};
  pageStateDummy["item_in"].forEach((item) => {
    let weight = parseFloat(item.weight);
    let pkgs = parseFloat(item.pkgs);
    let amount = parseFloat(item.amount);
    if (!isNaN(amount)) {
      total_amount += amount;
    }
    if (!isNaN(weight) && !isNaN(pkgs)) {
      total_weight += weight;
    }
    if (!isNaN(pkgs)) {
      total_pkgs += pkgs;
    }
  });
  if (total_weight != parseFloat(pageStateDummy["charge_weight"])) {
    updatedPageState["charge_weight"] = String(total_weight);
    needsUpdate = true;
  }
  if (total_amount != parseFloat(pageStateDummy["freight"])) {
    updatedPageState["freight"] = String(total_amount);
    needsUpdate = true;
  }
  if (total_pkgs != parseFloat(pageStateDummy["no_of_package"])) {
    updatedPageState["no_of_package"] = String(total_pkgs);
    needsUpdate = true;
  }
  return [needsUpdate, updatedPageState];
}

export function effectForUpdatingTotalAmount(pageStateDummy) {
  let needsUpdate = false;
  let freight = pageStateDummy["freight"];
  let hamali = pageStateDummy["hamali"];
  let door_del_charge = pageStateDummy["door_del_charge"];
  let bilty_charge = pageStateDummy["bilty_charge"];
  let other_amount = pageStateDummy["other_amount"];
  let total_amount = pageStateDummy["total_amount"];
  let updatedPageState = {};

  if (freight == "") {
    freight = 0;
  } else {
    freight = parseFloat(freight);
  }

  if (hamali == "") {
    hamali = 0;
  } else {
    hamali = parseFloat(hamali);
  }

  if (door_del_charge == "") {
    door_del_charge = 0;
  } else {
    door_del_charge = parseFloat(door_del_charge);
  }

  if (bilty_charge == "") {
    bilty_charge = 0;
  } else {
    bilty_charge = parseFloat(bilty_charge);
  }

  if (other_amount == "") {
    other_amount = 0;
  } else {
    other_amount = parseFloat(other_amount);
  }

  if (total_amount == "") {
    total_amount = 0;
  } else {
    total_amount = parseFloat(total_amount);
  }

  if (
    total_amount !=
    freight + hamali + door_del_charge + bilty_charge + other_amount
  ) {
    total_amount =
      freight + hamali + door_del_charge + bilty_charge + other_amount;
    needsUpdate = true;
    updatedPageState["total_amount"] = String(total_amount);
  }
  return [needsUpdate, updatedPageState];
}

export function effectForRowWiseAmount(pageStateDummy) {
  let newItems = [];
  let needsUpdate = false;
  let updatedPageState = {};
  pageStateDummy.item_in.forEach((item) => {
    let newItem = {};
    if (item.unit == "") {
      newItems.push(item);
      return;
    } else if (item.unit == "w" || item.unit == "W") {
      if (item.weight == "" || item.rate == "" || item.pkgs == "") {
        newItems.push(item);
        return;
      }
      let pkgs = parseFloat(item.pkgs);
      let weight = parseFloat(item.weight);
      let rate = parseFloat(item.rate);
      let amount = parseFloat(item.amount);
      if (isNaN(amount)) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(weight * rate);
        newItems.push(newItem);
      } else if (amount != weight * rate) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(weight * rate);
        newItems.push(newItem);
      } else {
        newItems.push(item);
      }
    } else if (item.unit == "c" || item.unit == "C") {
      if (item.pkgs == "" || item.rate == "") {
        newItems.push(item);
        return;
      }
      let pkgs = parseFloat(item.pkgs);
      let rate = parseFloat(item.rate);
      let amount = parseFloat(item.amount);
      if (isNaN(amount)) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(pkgs * rate);
        newItems.push(newItem);
      } else if (amount != pkgs * rate) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(pkgs * rate);
        newItems.push(newItem);
      } else {
        newItems.push(item);
      }
    } else if (
      item.unit == "f" ||
      item.unit == "F" ||
      item.unit == "t" ||
      item.unit == "T"
    ) {
      if (item.rate == "") {
        newItems.push(item);
        return;
      }
      let rate = parseFloat(item.rate);
      let amount = parseFloat(item.amount);
      if (isNaN(amount)) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(rate);
        newItems.push(newItem);
      } else if (amount != rate) {
        needsUpdate = true;
        newItem = item;
        newItem.amount = String(rate);
        newItems.push(newItem);
      } else {
        newItems.push(item);
      }
    }
  });
  if (needsUpdate) {
    updatedPageState = { item_in: newItems };
    return [needsUpdate, updatedPageState];
  } else {
    return [needsUpdate, {}];
  }
}

export function biltyAutoUpdationEffectsDummy(pageStateDummy) {
  let updatedPageState = {};
  let updatedPageStateTotal = {};
  let needsUpdate = false;
  let tempNeedsUpdate = false;
  [tempNeedsUpdate, updatedPageState] = effectForRowWiseAmount(pageStateDummy);
  pageStateDummy = { ...pageStateDummy, ...updatedPageState };
  updatedPageStateTotal = { ...updatedPageStateTotal, ...updatedPageState };
  if (tempNeedsUpdate) {
    needsUpdate = true;
  }
  [tempNeedsUpdate, updatedPageState] = effectForUpdatingRestFieldsBasedOnItems(
    { ...pageStateDummy }
  );
  pageStateDummy = { ...pageStateDummy, ...updatedPageState };
  updatedPageStateTotal = { ...updatedPageStateTotal, ...updatedPageState };
  if (tempNeedsUpdate) {
    needsUpdate = true;
  }

  [tempNeedsUpdate, updatedPageState] = effectForUpdatingTotalAmount({
    ...pageStateDummy,
  });
  pageStateDummy = { ...pageStateDummy, ...updatedPageState };
  updatedPageStateTotal = { ...updatedPageStateTotal, ...updatedPageState };
  if (tempNeedsUpdate) {
    needsUpdate = true;
  }

  if (needsUpdate) {
    return [needsUpdate, updatedPageStateTotal];
  } else {
    return [needsUpdate, {}];
  }
}

export function additionalFilterOnInputForBilty(inputObject) {
    // console.log("inn"); 

    // console.log(inputObject.bilty_date);
    // let biltyDate = new Date(inputObject.bilty_date);
    // console.log(inputObject, biltyDate);


    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(new Date(inputObject.bilty_date ?? new Date()).getTime() - tzoffset)).toISOString().slice(0, -1);
    console.log({ localISOTime });

    inputObject.bilty_date = localISOTime;

    // let tmpDate = new Date(biltyDate).toLocaleString('sv');
    // console.log(tmpDate);

  if (
    inputObject.eway_bill_info &&
    inputObject.eway_bill_info.length == 1 &&
    inputObject.eway_bill_info[0].eway_bill_no == ""
  ) {
    delete inputObject.eway_bill_info;
  }

  if (inputObject.actual_weight == "" || inputObject.actual_weight == null) {
    inputObject.actual_weight = "0";
  }

  if (
    inputObject.consignor_gst == "N.A" ||
    inputObject.consignor_gst == "n.a"
  ) {
    inputObject.consignor_gst = null;
  }
  if (
    inputObject.consignee_gst == "N.A" ||
    inputObject.consignee_gst == "n.a"
  ) {
    inputObject.consignee_gst = null;
  }

  let dummyObject = lodash.cloneDeep(inputObject);

  if (dummyObject.is_crossing == "N" || dummyObject.is_crossing == "n") {
    dummyObject.transporter_id = null;
    dummyObject.transporter_name = null;
    // dummyObject.suffix = null;
  }
  delete dummyObject.is_crossing;

  // Removing entries with blank string.
  for (let key in dummyObject) {
    if (dummyObject[key] == "") {
      dummyObject[key] = null;
    }
  }

  // Removing new row from tables
  if ("item_in" in dummyObject) {
    for (let i = 0; i < dummyObject.item_in.length; i++) {
      delete dummyObject.item_in[i].new_row;
    }
  }
  if ("eway_bill_info" in dummyObject && dummyObject.eway_bill_info != null) {
    for (let i = 0; i < dummyObject.eway_bill_info.length; i++) {
      delete dummyObject.eway_bill_info[i].new_row;
    }
  }
  if(!dummyObject.suffix) {
      dummyObject.suffix = "null";
  }
//   console.log(dummyObject.suffix);
//   if(dummyObject.suffix)
  return dummyObject;
}

export function additionalFilterOnResponseForGetEwb(inputObject) {
  return inputObject.eway_bill_info[0];
}
