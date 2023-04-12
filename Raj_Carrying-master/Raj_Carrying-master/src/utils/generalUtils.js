

export function checkIfAnyError(internalValidationErrors){
    var errorExist = false;

    for (var key in internalValidationErrors){
        if (internalValidationErrors[key] != ""){
            errorExist = true;
        }  
    }
    return errorExist
}