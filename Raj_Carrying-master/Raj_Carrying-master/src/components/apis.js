import { applySchema } from "../utils/apiUtils.js";

// This is a function to "fake" an API response
// The first argument is returned after the timeout (default = 1000)
// Promise is used here so that we can use async/await in our action
function timeoutData(data, timeout = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, timeout);
  });
}

const parseError = (errorObj) => {
  console.log("Type ", typeof errorObj.detail);
  if (typeof errorObj.detail == "string") {
    return errorObj.detail;
  } else if (typeof errorObj.detail[0] == "object") {
    if ("type" in errorObj.detail[0]) {
      let locationString = "";
      console.log("Lenght", errorObj.detail[0].loc.length);
      for (let i = 0; i < errorObj.detail[0].loc.length; i++) {
        if (i == 0) {
          continue;
        }
        if (i == errorObj.detail[0].loc.length - 1) {
          locationString += String(errorObj.detail[0].loc[i]);
        } else {
          locationString += String(errorObj.detail[0].loc[i]) + "____";
        }
      }
      return "Value is not in proper type for " + locationString;
    } else {
      return "Api Failed.";
    }
  } else {
    return errorObj.detail[0].msg;
  }
};

export async function updateProfile(data) {
  const response = await timeoutData(data);

  // We only throw the error if the incoming data status is not equal to "ok"
  if (isNaN(parseFloat(response.age)) || !isFinite(response.age)) {
    throw new Error("The required value must be a number");
  }

  return { ...data, success: "ok" };
}

export async function apiWrapper(data) {
  let apiConfig = data.apiConfig;
  let response = {};
  let apiUrl = "";

  if ("apiUrlTail" in data) {
    apiUrl = apiConfig.url + String(data["apiUrlTail"]);
  } else {
    apiUrl = apiConfig.url;
  }
  console.log("Hererere", data);
  if ("apiInputData" in data) {
    var apiInputData = data.apiInputData;
    //Applying ParamSchema
    if (apiConfig.paramSchema) {
      apiInputData = applySchema(apiInputData, apiConfig.paramSchema);
    }
    // Applying additional filter on input
    if (apiConfig.additionalFilterOnInput) {
      apiInputData = apiConfig.additionalFilterOnInput(apiInputData);
    }
    console.log("Hitting api", apiInputData);
    response = await fetch(apiUrl, {
      method: apiConfig.methodType,
      headers: apiConfig.headers,
      body: JSON.stringify(apiInputData),
    });
  } else {
    response = await fetch(apiUrl);
  }
  if (!response.ok) {
    let errorMessage = parseError(await response.json());
    throw new Error(errorMessage);
  }
  // else{
  //   if(apiUrl)
  //   window.location.reload()
  // }

  let text = await response.json();

  // Additional filter on response
  if (apiConfig.additionalFilterOnResponse) {
    text = apiConfig.additionalFilterOnResponse(text);
  }

  //Applying ResponseSchema
  if (apiConfig.responseSchema) {
    text = applySchema(text, apiConfig.responseSchema);
  }

  if ("validateResponse" in apiConfig) {
    apiConfig.validateResponse(text);
  }
  return { ...data, response: text };
}
