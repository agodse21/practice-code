import React from "react";
import DynamicViewTable from "./DynamicViewTable";
import Popup from "reactjs-popup";
import FormColumn from "./FormColumn.js";
import { podChallanApiConfig } from "../config/apiConfig.js";
import {
    groupInfo,
    dataObject,
    podChallanBiltyTableItems,
    podChallanBiltyTableHeader,
    validate,
    popupInfo,
} from "../config/podChallanForm.js";
import DatePicker from "react-datepicker";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import { Prompt } from "react-router-dom";
import "./Form.css";
import "./PodChallanForm.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import "./popup.css";
import ReportExcel from "./ReportExcel.js";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import LoadingOverlay from "react-loading-overlay";

const PodChallanForm = ({ sessionObject }) => {
    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };
    const download_ref = React.useRef(null);

    let variablesFromSession = {
        station_from: String(sessionObject.sessionVariables.branch_id),
        station_from_name: sessionObject.sessionVariables.branch_name,
        created_from: String(sessionObject.sessionVariables.branch_id),
        created_by: String(sessionObject.sessionVariables.user_id),
        company_id: sessionObject.sessionVariables.company_id ?? "1",
        fYear: sessionObject.sessionVariables.financial_year,
    };

    const myForm = useForm(
        "PodChallan",
        validate,
        { ...dataObject, ...variablesFromSession },
        podChallanApiConfig
    );

    const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
        return null;
    };

    const checkIfFieldAlreadyExists = (fieldKey, fieldValue, arrayToCheck) => {
        let dummyObject = {};
        for (let i = 0; i < arrayToCheck.length; i++) {
            dummyObject = arrayToCheck[i];
            if (fieldKey in dummyObject && dummyObject[fieldKey] == fieldValue) {
                return true;
            }
        }
        return false;
    };

    const getFyearsOnKeyEnter = async (e, myFormName, page_id) => {
        if (e.key == "Enter") {
            e.persist();
            myForm.setOverlay(true);
            myForm.setPageStateByField("enterEvent", { ...e });

            // console.log(refStoreObject.current[e.target.name]);
            // console.log(e.target.name);
            // refStoreObject.current[e.target.name].blur();

            const company_id = myForm.pageState.company_id;
            let url = SERVER_URL;
            let dataToSend = {};
            let finalFyearList = [];

            if (myFormName == "Bilty Inquiry") {
                myForm.refStoreObject.current["bilty_no"].blur();
                // if (page_id == "") {
                //     setOverlay(false);
                //     makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                //     return;
                // }
                url += "/bilty/option";

                let flag = 0;
                if (
                    myForm.pageState.bilty_type == "c" ||
                    myForm.pageState.bilty_type == "C"
                ) {
                    flag = 1;
                }

                dataToSend = {
                    companyId: company_id,
                    bilty_no: page_id,
                    suffix: null,
                    flag,
                    branch_id: myForm.pageState.created_from,
                    module: "pod_chalan",
                };
            }

            const resp = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })

            const respData = await resp.json();
            console.log(respData);

            if (Array.isArray(respData)) {
                const fYearList = respData;
                console.log(fYearList);

                fYearList.forEach(obj => {
                    if ("fyear" in obj) {
                        finalFyearList.push(obj.fyear);
                    }
                })

                if (finalFyearList.length == 1) {
                    myForm.getSuffixesOfBilty(page_id, finalFyearList[0]);
                }
                else {
                    myForm.setPageStateByField("fyearList", finalFyearList);
                }
            }
            else {
                // got whole bilty
                if (!resp.ok) {
                    myForm.setPageState({
                        ...myForm.pageState,
                        ["No"]: "Invalid Bilty",
                    });
                    myForm.setOverlay(false);
                    return;
                }
                linkBilty({}, respData);
            }
            myForm.setOverlay(false);
        }
    }

    const linkBilty = async (e, argResponse) => {
        console.log(argResponse);
        let temp_response;
        if (argResponse) {
            temp_response = argResponse;
        }
        else {
            if (myForm.pageState.No == "" && e.key == "Enter") {
                myForm.makeFocusOnParticularField("save_button");
                return;
            }
            if (e.key == "Enter") {
                const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
                let flag = 0;
                if (
                    myForm.pageState.bilty_type == "c" ||
                    myForm.pageState.bilty_type == "C"
                ) {
                    flag = 1;
                }
                let suffix = myForm.pageState.suffix;
                if (suffix == "") {
                    suffix = "null";
                }
                const url =
                    SERVER_URL +
                    "/bilty/pod_in/" +
                    myForm.pageState.No +
                    "?branch_id=" +
                    myForm.pageState.created_from +
                    "&suffix=" +
                    suffix +
                    "&flag=" +
                    flag + "&fyear=" + myForm.pageState.fyear_get_bilty + "&companyId=" + myForm.pageState.company_id;
                const response = await fetch(url);

                console.log("Response", response);
                if (!response.ok) {
                    myForm.setPageState({
                        ...myForm.pageState,
                        ["No"]: "Invalid Bilty",
                    });
                    return;
                }
                temp_response = await response.json();
            }
        }
        if (temp_response.check_fail) {
            myForm.setPageState({
                ...myForm.pageState,
                ["No"]: "Not possible to add this bilty",
            });
            return;
        }
        if (
            checkIfFieldAlreadyExists(
                "bilty_id",
                temp_response.bilty_id,
                myForm.pageState.bilty_ids
            )
        ) {
            myForm.setPageState({
                ...myForm.pageState,
                ["No"]: "Already Present",
            });
            return;
        }
        const newState = {
            bilty_ids: [...myForm.pageState["bilty_ids"], temp_response],
            ["No"]: "",
        };
        myForm.setPageState({
            ...myForm.pageState,
            ...newState,
        });
        myForm.makeFocusOnParticularField("bilty_type");
    };

    const handleDelete = async () => {
        const url =
            SERVER_URL + "/pod/?pod_chalan_id=" + myForm.pageState.pod_challan_no
            + "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;
        const response = await fetch(url, { method: "DELETE" });
        if (!response.ok) {
            console.log("Not able to delete podChallan");
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

    const checkDisabledCondition = (fieldInfo) => {
        if (myForm.pageMode == "view") {
            return "disabled";
        } else if (fieldInfo.name == "cewb_no") {
            return "disabled";
        } else if (myForm.pageMode == "edit" && fieldInfo.name == "input_date") {
            return "disabled";
        } else {
            return "";
        }
    };

    const checkVisibilityCondition = (fieldInfo) => {
        return true
    };

    return (
        <div className="challan-form-container">
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
                <div>
                    <Popup
                        open={myForm.pageState.fyearList.length > 0}
                        modal
                        closeOnDocumentClick={false}
                    >
                        {(close) => myForm.displayFyearPopup(close)}
                    </Popup>
                </div>
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
            </div>

            <div className="form-header">Pod Challan</div>
            <div onSubmit={myForm.handleSubmit} className="form" noValidate>
                <div className="form-title">
                    <div className="form-row">
                        <label className="form-label">Pod Challan No:</label>
                        <input
                            className="form-input"
                            type="text"
                            name="pod_challan_no"
                            placeholder=""
                            value={myForm.pageState.pod_challan_no}
                            onChange={myForm.handleChange}
                            onBlur={() => { }}
                            onKeyPress={(a) =>
                                myForm.getPageOnKeyEnter(a, myForm.pageState.pod_challan_no)
                            }
                            ref={(a) =>
                                myForm.storeInputReferenceForSelect(a, "pod_challan_no")
                            }
                            disabled={checkDisabledCondition({ name: "pod_challan_no" })}
                        />
                        {myForm.internalValidationErrors["pod_challan_no"] && (
                            <p>{myForm.internalValidationErrors["pod_challan_no"]}</p>
                        )}
                        {myForm.pageMode == "view" && (
                            <>
                                <button
                                    onClick={() => {
                                        myForm.setPageMode("edit");
                                    }}
                                >
                                    Edit
                                </button>
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
                            </>
                        )}
                    </div>
                    <div>
                        <label className="form-label"> Pod Challan Date: </label>
                        <DatePicker
                            dateFormat="dd-MM-yyy"
                            selected={myForm.pageState.input_date}
                            onChange={(date) =>
                                myForm.setPageStateByField("input_date", date)
                            }
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
                            disabled={checkDisabledCondition({ name: "input_date" })}
                            onKeyPress={(a) => {
                                console.log("Here");
                                // if (a.key == "Enter"){
                                //   myForm.makeFocusOnParticularFieldForItem("eway_bill_no", 0, "eway_bill_no");
                                // }
                            }}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Last Pod Challan No:</label>
                        <label className="form-last_bilty">
                            {myForm.pageState.last_challan_no}
                        </label>
                    </div>
                </div>
                <div className="form-input-content-block-0">
                    <div className="form-field-left">
                        <FormColumn
                            groupInfo={groupInfo}
                            groupName="group-1"
                            checkDisabledCondition={checkDisabledCondition}
                            checkVisibilityCondition={checkVisibilityCondition}
                            myFormObj={myForm}
                            getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
                        />
                    </div>
                    <div className="form-field-right">
                        <FormColumn
                            groupInfo={groupInfo}
                            groupName="group-2"
                            checkDisabledCondition={checkDisabledCondition}
                            checkVisibilityCondition={checkVisibilityCondition}
                            myFormObj={myForm}
                            getAdditionalInfoForSuggestionFetch={getAdditionalInfoForSuggestionFetch}
                        />
                    </div>
                </div>
                <div className="chform-row">
                    <label className="chform-label">Type</label>
                    <select
                        className="chform-input-suffix"
                        onChange={(newValue) => {
                            myForm.handleChangeForSelect(newValue, "bilty_type");
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_type")}
                        disabled={checkDisabledCondition({ name: "bilty_type" })}
                        value={myForm.pageState["bilty_type"]}
                        onKeyPress={(a) => {
                            if (a.key == "Enter") {
                                a.preventDefault();
                                myForm.makeFocusOnParticularField("bilty_no");
                            }
                        }}
                    >
                        <option value="D" key="D">
                            D
                        </option>
                        <option value="C" key="C">
                            C
                        </option>
                    </select>
                    <label className="chform-label">Bilty No:</label>
                    <input
                        className="chform-input"
                        type="text"
                        name="No"
                        placeholder=""
                        value={myForm.pageState["No"]}
                        onChange={myForm.handleChange}
                        // onKeyPress={(a) => {
                        //   if (a.key == "Enter") {
                        //     myForm.makeFocusOnParticularField("suffix");
                        //   }
                        // }}
                        onKeyPress={(e) => {
                            if (e.key == "Enter") {
                                if (myForm.pageState["No"]) {
                                    getFyearsOnKeyEnter(e, "Bilty Inquiry", myForm.pageState["No"])
                                }
                                else {
                                    myForm.makeFocusOnParticularField("save_button");
                                }
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
                    />
                    <select
                        className="chform-input"
                        name="suffix"
                        value={myForm.pageState.suffix}
                        onChange={(e) => myForm.handleChangeForSelect(e, "suffix")}
                        onKeyPress={(e) => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                linkBilty(e);
                            }
                        }}
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
                    >
                        {myForm.pageState.suffix_options.map((suff) => {
                            return <option value={suff}> {suff} </option>
                        })}
                    </select>
                    {/* <input
            className="chform-input-suffix "
            type="text"
            name="suffix"
            placeholder=""
            value={myForm.pageState["suffix"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "suffix")}
          /> */}
                </div>

                <div className="table-container">
                    <DynamicViewTable
                        tableHeader={podChallanBiltyTableHeader}
                        tableItems={podChallanBiltyTableItems}
                        tableValues={myForm.pageState["bilty_ids"]}
                        setPageStateByField={myForm.setPageStateByField}
                        pageStateArray={myForm.pageState["bilty_ids"]}
                        fieldMapping="bilty_ids"
                    />
                </div>
                <div className="form-footer">
                    {/* <button
            onClick={() => {
              console.log("Values", myForm.pageState);
              console.log("Values", myForm.pageState);
            }}
            type="button"
            className="btn btn-primary"
          >
            Log
          </button> */}
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="bilty_report_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        onClick={async () => {
                            // setLoading(true);
                            // let dataToSend = {
                            //   date_dict: finalInput.date_dict,
                            //   filter_fields: finalInput.filter_fields,
                            // };
                            // let resp = await fetch(SERVER_URL + "/report/", {
                            //   method: "POST",
                            //   headers: {
                            //     Accept: "application/json",
                            //     "Content-Type": "application/json",
                            //   },
                            //   body: JSON.stringify(dataToSend),
                            // });
                            // let response = await resp.json();

                            // if (response["data"] && "total_rows" in response) {
                            //   console.log(response["data"], "fsdfafsfds");
                            //   // setData(response["data"]);
                            //   ex_data = response["data"];
                            //   // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                            // }
                            // setLoading(false);
                            download_ref.current.handleDownload();
                        }}
                    >
                        Download as XLS
                    </button>
                    {ReportExcel.excel_pod_challan_data(
                        myForm.pageState
                    )}
                    <button
                        onClick={myForm.handleSubmit}
                        type="button"
                        className="btn btn-primary"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
                    >
                        Save
                    </button>
                    <button onClick={handleDelete}>Delete</button>
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
                    {myForm.pageState.status == "1" && (
                        <button
                            onClick={() => {
                                let data = {
                                    apiUrlTail: myForm.pageState.pod_challan_no,
                                    apiType: "generateCwb",
                                    apiConfig: podChallanApiConfig["generateCwb"],
                                };
                                myForm.performSuggestions(data);
                            }}
                        >
                            Genrate CWB
                        </button>
                    )}
                    {/* <div className="status">{myForm.renderSubmitApiResponseStatus()}</div> */}
                </div>
            </div>
        </div>
    );
};

export default PodChallanForm;
