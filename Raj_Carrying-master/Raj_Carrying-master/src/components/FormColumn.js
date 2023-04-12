import React from "react";
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import "./popup.css";

const FormColumn = (props) => {
  return (
    <>
      {props.groupInfo[props.groupName].map(function (info) {
        if (info["type"] === "dropdown")
          return (
            <div className={info["className"]} key={info["name"]}>
              {props.checkVisibilityCondition(info) && <label className={info["labelClassName"]}>{info["label"]}</label>}
              {props.checkVisibilityCondition(info) &&<select
                className={info["inputClassName"]}
                onChange={(newValue) => {
                  props.myFormObj.handleChangeForSelect(newValue, info["name"]);
                }}
                disabled={props.checkDisabledCondition(info)}
                value={props.myFormObj.pageState[info["name"]]}
                ref={(a) =>
                  props.myFormObj.storeInputReferenceForSelect(a, info["name"])
                }
                onKeyPress={(a) => props.myFormObj.onKeyPressForKeyNav(a, info)}
              >
                {info["dropdown_items"].map((dropdown_item) => (
                  <option value={dropdown_item.value} key={dropdown_item.label}>
                    {dropdown_item.label}
                  </option>
                ))}
              </select>}
              {props.myFormObj.internalValidationErrors[info["name"]] && (
                <p>{props.myFormObj.internalValidationErrors[info["name"]]}</p>
              )}
            </div>
          );
        else if (info["type"] === "date")
          return (
            <div className={info["className"]} key={info["name"]}>
              <label className={info["labelClassName"]}>{info["label"]}</label>
              <input
                className={info["inputClassName"]}
                type="date"
                name={info["name"]}
                onChange={(newValue) => {
                  props.myFormObj.handleChange(newValue);
                }}
                disabled={props.checkDisabledCondition(info)}
                value={props.myFormObj.pageState[info["name"]]}
                ref={(a) =>
                  props.myFormObj.storeInputReferenceForSelect(a, info["name"])
                }
                onKeyPress={(a) => props.myFormObj.onKeyPressForKeyNav(a, info, props.myFormObj.pageState)}
              />
              {props.myFormObj.internalValidationErrors[info["name"]] && (
                <p>{props.myFormObj.internalValidationErrors[info["name"]]}</p>
              )}
            </div>
          );
        else
          return (
            <div>
              <div className={info["className"]} key={info["name"]}>
                {props.checkVisibilityCondition(info) && (
                  <label className={info["labelClassName"]}>
                    {info["label"]}
                  </label>
                )}
                {/* <input
                    className={info["inputClassName"]}
                    type={info["type"]}
                    name={info["name"]}
                    placeholder={info["placeHolder"]}
                    value={pageState[info["name"]]}
                    onChange={handleChange}
                  /> */}
                {props.checkVisibilityCondition(info) && (
                  <Autosuggest
                    id={info["name"]}
                    suggestions={props.myFormObj.suggestions}
                    onSuggestionsFetchRequested={(a) =>
                      props.myFormObj.onSuggestionsFetchRequestedDebounced(
                        a,
                        (b) =>
                          props.myFormObj.suggestionFetchApi(
                            info,
                            b,
                            props.getAdditionalInfoForSuggestionFetch(info)
                          )
                      )
                    }
                    onSuggestionsClearRequested={() =>
                      props.myFormObj.onSuggestionsClearRequested(info)
                    }
                    getSuggestionValue={(suggestion) =>
                      suggestion[info.suggestionKeyword]
                    }
                    onSuggestionSelected={(a, b) =>
                      props.myFormObj.getSuggestionValue(
                        b.suggestion,
                        info,
                        props.myFormObj.performSuggestions,
                        props.myFormObj.updatePageStateForGetSuggestion
                      )
                    }
                    renderSuggestion={(a) =>
                      props.myFormObj.renderSuggestion(a, info)
                    }
                    highlightFirstSuggestion={true}
                    ref={(a) => props.myFormObj.storeInputReference(a, false)}
                    inputProps={{
                      placeholder: info["placeholder"],
                      value: String(props.myFormObj.pageState[info["name"]]),
                      onChange: (a, b) => {
                        props.myFormObj.onChangeAutoSuggest(a, b, info);
                      },
                      onBlur: () => props.myFormObj.onblurValidator(info),
                      onKeyPress: (a) =>
                        props.myFormObj.onKeyPressForKeyNav(a, info, props.myFormObj.pageState),
                      disabled: props.checkDisabledCondition(info),
                    }}
                  />
                )}
                {props.myFormObj.internalValidationErrors[info["name"]] && (
                  <p>
                    {props.myFormObj.internalValidationErrors[info["name"]]}
                  </p>
                )}
              </div>
              {/* {(info["name"] == "consignor_name" || info["name"] == "consignee_name" ) &&(
                  <div className="form-row">
                    Id of consignor is {props.myFormObj.pageState.consignor_id}
                  </div>
                )} */}
            </div>
          );
      })}
    </>
  );
};

export default FormColumn;
