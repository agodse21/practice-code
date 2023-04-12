import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { SubgroupMasterApiConfig } from "../config/apiConfig.js";
import {
    groupMasterGroupInfo,
    groupMasterDataObject,
    groupMasterValidate,
} from "../config/SubgroupMasterConfig"
import Autosuggest from "react-autosuggest";
import "./Form.css";
import "./ChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import "../components/ItemMasterForm.css";
import { SERVER_URL } from "../config/config.js";

const SubgroupMaster = ({ sessionObject }) => {

    const [groupList, setGroupList] = useState([]);

    const fetchGroupList = async() => {
        const url = SERVER_URL + "/group/group-info"
                    + "?companyId=" + myForm.pageState.company_id;
        const resp = await fetch(url);
        if(resp.ok) {
            const data = await resp.json();
            console.log(data);

            let tempData = {};
            data.forEach(obj => {
                tempData[obj.id] = obj.name;
            })
            console.log(tempData);
            setGroupList(tempData);
            myForm.setPageState({
                ...myForm.pageState,
                "belongs_to": parseInt(Object.keys(tempData)[0]) ?? "",
            })
        }
    }

    useEffect(() => {
        fetchGroupList();
    }, [])

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
        company_id: String(sessionObject.sessionVariables.company_id ?? "1"),
    };

    const myForm = useForm(
        "SubgroupMaster",
        groupMasterValidate,
        { ...groupMasterDataObject, ...variablesFromSession },
        SubgroupMasterApiConfig
    );
    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        return null;    
    };

    return (
        <div className="item-master-form-container">
            <div>
                <Popup
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
                                    <div>Saving Successful </div>
                                ) : (
                                    <div>Error In Subgroup Master Module </div>
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
                                    SubGroup is successfully saved with the following info:-
                                    <br />
                                    <div className="pop-up-fields">
                                        <div className="pop-up-field">
                                            <div className="pop-up-field-label">Subroup Name</div>
                                            <div className="pop-up-field-value">
                                                {myForm.pageState.name}
                                            </div>
                                        </div>
                                        <div className="pop-up-field">
                                            <div className="pop-up-field-label">Belongs To</div>
                                            <div className="pop-up-field-value">
                                                {groupList[myForm.pageState.belongs_to]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="pop-up-content">
                                    {" "}
                                    Error in SubGroup Master module with the following info:-
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
                                            myForm.setPageState({
                                                ...groupMasterDataObject,
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
            <div className="form-header">Subgroup Master</div>
            <div className="form" noValidate>
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Id: {myForm.pageState.item_id}</label>
                    </div>
                </div>

                <div className="form-input-content-block-0">
                    <div className="form-field-left">
                        {groupMasterGroupInfo["group-1"].map(function (info) {
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
                                            onSuggestionSelected={(a, b) => {
                                                console.log("selected");
                                                return myForm.getSuggestionValue(
                                                    b.suggestion,
                                                    info,
                                                    myForm.performSuggestions,
                                                    myForm.updatePageStateForGetSuggestion
                                                )
                                            }
                                            }
                                            renderSuggestion={(a) => myForm.renderSuggestion(a, info)}
                                            highlightFirstSuggestion={true}
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
                        <div className="form-row">
                            <label className="form-label">
                                Belongs To
                            </label>
                            <select
                                value={myForm.pageState.belongs_to}
                                name="belongs_to"
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    myForm.setPageState({
                                        ...myForm.pageState,
                                        "belongs_to": val,
                                    })
                                }}
                            >
                                {Object.keys(groupList).map(key => {
                                    key = parseInt(key);
                                    const name = groupList[key];
                                    return <option value={key}>{name}</option>
                                })}
                            </select>
                        </div>
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

export default SubgroupMaster;
