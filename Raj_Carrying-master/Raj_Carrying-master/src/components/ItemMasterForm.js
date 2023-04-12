import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import { itemMasterApiConfig } from "../config/apiConfig.js";
import {
  itemMasterGroupInfo,
  itemMasterDataObject,
  itemMasterValidate,
} from "../config/itemMasterForm.js";
import { SERVER_URL } from "../config/config";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import "../components/ItemMasterForm.css";

const ItemMasterForm = ({ sessionObject }) => {
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  let asd = null;
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
  };

  const myForm = useForm(
    "ItemMaster",
    itemMasterValidate,
    { ...itemMasterDataObject, ...variablesFromSession },
    itemMasterApiConfig
  );
  const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    // if (fieldInfoObject.name == "vehicle_no"){
    //   return {"limit": "10"};
    // }
    return null;
  };

  return (
    <div className="item-master-form-container">
      {/* <Prompt
        when={
          JSON.stringify(myForm.pageState) !=
          JSON.stringify({ ...itemMasterDataObject, ...variablesFromSession })
        }
        message={
          (location) =>
            `There is some unsaved data are you sure you want to leave it? ${myForm.pageState["Vehicle No."]}, 2132, ${itemMasterDataObject["Vehicle No."]}`
          // `Are you sure you want to go to ${location.pathname}`
        }
      /> */}
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          open={myForm.pageMode == "submitted" || myForm.pageMode == "error"}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">
                {" "}
                {myForm.pageMode == "submitted" ? (
                  <div>Item Saving Successful </div>
                ) : (
                  <div>Error In Item Module </div>
                )}
                <div>
                  <a className="pop-up-close btn" onClick={close}>
                    &times;
                  </a>
                </div>
              </div>
              {myForm.pageMode == "submitted" ? (
                <div className="pop-up-content">
                  {" "}
                  Item is successfully saved with the following info:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Item Id</div>
                      <div className="pop-up-field-value">
                        {myForm.pageState.item_id}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in Item module with the following info:-
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-label">Error:</div>
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
                        ...itemMasterDataObject,
                        ...variablesFromSession,
                      });
                      myForm.setPageMode("write");
                      window.location.reload();
                      close();
                    } else {
                      myForm.setPageMode("write");
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
      <div className="form-header">Item Master</div>
      <div className="form" noValidate>
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Id: {myForm.pageState.item_id}</label>
            {/* {myForm.internalValidationErrors["vehicle_no"] && (
            <p>{myForm.internalValidationErrors["vehicle_no"]}</p>
          )} */}
            {/* {myForm.pageMode == "view" && (
            <button
              onClick={() => {
                myForm.setPageMode("edit");
              }}
            >
              Edit
            </button>
          )} */}
          </div>
        </div>

        <div className="form-input-content-block-0">
          <div className="form-field-left">
            {itemMasterGroupInfo["group-1"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["name"]}>
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>
                    <select
                      className={info["inputClassName"]}
                      onChange={(newValue) => {
                        myForm.handleChangeForSelect(newValue, info["name"]);
                      }}
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
                  <div className={info["className"]} key={info["name"]}>
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>
                    <Autosuggest
                      id={info["name"]}
                      suggestions={myForm.suggestions}
                      onSuggestionsFetchRequested={(a) =>
                        myForm.onSuggestionsFetchRequested(a, (b) =>
                          myForm.suggestionFetchApi(
                            info,
                            b,
                            getAdditionalInfoForSuggestionFetch(info)
                          )
                        )
                      }
                      onSuggestionsClearRequested={() =>
                        myForm.onSuggestionsClearRequested(info)
                      }
                      getSuggestionValue={suggestion => suggestion[info.suggestionKeyword]}
                      onSuggestionSelected={(a,b) =>
                        myForm.getSuggestionValue(
                          b.suggestion,
                          info,
                          myForm.performSuggestions,
                          myForm.updatePageStateForGetSuggestion
                        )
                      }
                      renderSuggestion={(a) => myForm.renderSuggestion(a, info)}
                      highlightFirstSuggestion ={true}
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
                        onKeyPress: (a) => myForm.onKeyPressForKeyNav(a, info),
                        disabled: myForm.pageMode == "view" ? "disabled" : "",
                      }}
                    />
                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
            })}
          </div>
          <div className="form-field-right">
            {itemMasterGroupInfo["group-2"].map(function (info) {
              if (info["type"] === "dropdown")
                return (
                  <div className={info["className"]} key={info["label"]}>
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>

                    <select
                      onChange={myForm.handleChange}
                      className={info["inputClassName"]}
                      onChange={(newValue) => {
                        myForm.handleChangeForSelect(newValue, info["name"]);
                      }}
                    >
                      {info["dropdown_items"].map((dropdown_item) => (
                        <option
                          value={dropdown_item.value}
                          key={dropdown_item.label}
                          onChange={myForm.handleChange}
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
                    <label className={info["labelClassName"]}>
                      {info["label"]}
                    </label>
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
                      getSuggestionValue={suggestion => suggestion[info.suggestionKeyword]}
                      onSuggestionSelected={(a,b) =>
                        myForm.getSuggestionValue(
                          b.suggestion,
                          info,
                          myForm.performSuggestions,
                          myForm.updatePageStateForGetSuggestion
                        )
                      }
                      renderSuggestion={(a) => myForm.renderSuggestion(a, info)}
                      highlightFirstSuggestion ={true}
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
                        onKeyPress: (a) => myForm.onKeyPressForKeyNav(a, info),
                        disabled: myForm.pageMode == "view" ? "disabled" : "",
                      }}
                    />

                    {myForm.internalValidationErrors[info["name"]] && (
                      <p>{myForm.internalValidationErrors[info["name"]]}</p>
                    )}
                  </div>
                );
            })}
          </div>
        </div>
        <div className="form-footer">
          <button
            onClick={() => {
              console.log("Values", myForm.pageState);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button>
          <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          <div className="status">{myForm.renderSubmitApiResponseStatus()}</div>
        </div>
      </div>
    </div>
  );
};

export default ItemMasterForm;
