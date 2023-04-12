import useSessionVariables from "../components/useSessionVariables.js";
export function applySchema(inputDataObject, schemaObject) {
    console.log({inputDataObject});
  let outputObject = {};
  let newKey = "";
  for (var schemaKey in schemaObject) {
    /**
     * If schema key not present in object skip the same
     */
    if (!(schemaKey in inputDataObject)) {
      continue;
    }
    /**
     * Changing key of output object if needed
     */
    if (schemaObject[schemaKey] == "same") {
      newKey = schemaKey;
    } else {
      newKey = schemaObject[schemaKey];
    }
    /**
     * Converting value of output object to string
     */
    if (typeof inputDataObject[schemaKey] == "object") {
      if (inputDataObject[schemaKey] === null) {
        if (newKey == "input_date" || newKey == "bill_date") {
          outputObject[newKey] = new Date();
        } else {
          outputObject[newKey] = "";
        }
      } else {
        outputObject[newKey] = inputDataObject[schemaKey];
      }
    } else {
      outputObject[newKey] = inputDataObject[schemaKey];
    }
  }
  console.log({outputObject});
  return outputObject;
}

export function checkAccess(module){
  let sessionObject = useSessionVariables();
 
  if(sessionObject.sessionVariables["modules"].includes(module)){
    return true;
  }
  return false;
}
