import React, { useRef, useState, useEffect } from "react";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import "./MarfatiyaWise.css";
import { dataObject, validate } from "../config/MailMasterConfig";
import useForm from "./useForm";
import { crossingOutApiConfig } from "../config/apiConfig.js";
import LoadingOverlay from "react-loading-overlay";
import { useLocation } from "react-router-dom";
import Popup from "reactjs-popup";

function MailMaster({ sessionObject }) {
    let variablesFromSession = {
        // station_from: String(sessionObject.sessionVariables.branch_id),
        // station_from_name: sessionObject.sessionVariables.branch_name,
        // created_from: String(sessionObject.sessionVariables.branch_id),
        user_id: String(sessionObject.sessionVariables.user_id),
        // branch_account_name: String(
        //   sessionObject.sessionVariables.branch_account_name
        // ),
        // branch_account_id: String(sessionObject.sessionVariables.branch_account_id),
    };

    const textAreaStyle = {
        height: "50px",
    }

    //   const [data, setData] = React.useState([]);
    //   const [loading, setLoading] = React.useState(false);
    //   const [pageCount, setPageCount] = React.useState(0);
    //   const fetchIdRef = React.useRef(0);
    //   const download_ref = React.useRef(null);
    //   const sortIdRef = React.useRef(0);
    //   const [dateState, setDateState] = React.useState({
    //     date_from: new Date(),
    //     date_to: new Date(),
    //     all_branch: "2",
    //   });
    //   const [finalInput, setFinalInput] = React.useState({});
    //   const useQuery = () => {
    //     return new URLSearchParams(useLocation().search);
    //   };
    //   let query = useQuery();


    const myForm = useForm(
        "MailMaster",
        validate,
        { ...dataObject, ...variablesFromSession },
        crossingOutApiConfig
    );

    useEffect(() => {
        console.log(myForm.pageState);
    })

    useEffect(() => {
        const getMailMaster = async () => {
            const url = SERVER_URL + "/mail_master"
                + `/${myForm.pageState.user_id}`
                + `/${myForm.pageState.mail_type}`

            const resp = await fetch(url);

            if (resp.ok) {
                const respData = await resp.json();
                if ("id" in respData) {
                    myForm.setPageState((oldState) => ({
                        ...oldState,
                        ...respData,
                    }))
                }
            }
            else {
                myForm.setPageState((oldState) => ({
                    subject: "",
                    body_start: "",
                    body_end: "",
                    mail_type: oldState.mail_type,
                    ...variablesFromSession,
                }))
            }
        }

        getMailMaster();

    }, [myForm.pageState.mail_type])

    const saveMailMaster = async () => {
        const dataToSend = {
            ...myForm.pageState,
        }

        const url = SERVER_URL + "/mail_master/";
        const resp = await fetch(url, {
            method: "id" in myForm.pageState ? "PUT" : "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })

        if (resp.ok) {
            const respData = await resp.json();
            if ("id" in respData) {
                window.location.reload();
            }
            else {
                myForm.setPageMode("error");
                myForm.setPopupError("Something went wrong, Details not saved ): ");
            }
        }
    }

    const handleChange = async (e) => {
        const { name, value } = e.target;
        // console.log("sdfasd", name, value)
        myForm.setPageState({
            ...myForm.pageState,
            [name]: value,
        });
    };

    const contentStyle = {
        maxWidth: "600px",
        width: "90%",
    };
    const popupInfo = {
        error_header: "Error In Challan Module ",
        success_header: "Opening Balance Successfullty ",
        success_title: "",
        field_label_success: "",
        field_name_success: "challan_no",
        error_title: "Error in Challan module with the following info:-",
        field_label_error: "Error:",
    };

    const handleChangeForSelect = function (e, selectName) {
        const { name, value } = e.target;
        // console.log("DSFDSFD", name, value)
        setAmountType(value);
    };


    const handlePrint = async () => {
        myForm.setOverlay(true);
        let url = SERVER_URL + "/account_trans/opening_balance/";
        let apiInputData = {
            branch_id: String(sessionObject.sessionVariables.branch_id),
            opening_balance: String(myForm.pageState.balance),
            type: String(myForm.pageState.balance_type),
        };

        if (myForm.pageState.consignor_id != "") {
            apiInputData.party_id = myForm.pageState.consignor_id;
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiInputData),
        });
        if (!response.ok) {
            myForm.setOverlay(false);
            myForm.setPreviousPageMode(myForm.pageMode);
            myForm.setPageMode("error");
            myForm.setPopupError("Opening balance already exist.");
            return;
        }
        myForm.setPageMode("submitted");
        window.location.reload();
        const resp = await response.json();
    };

    //   let stationToFieldInfo = {
    //     label: "Consignor Name",
    //     className: "form-row",
    //     labelClassName: "form-label",
    //     inputClassName: "form-input",
    //     name: "consignor_name",
    //     type: "text",
    //     placeHolder: "",
    //     apiConfigKey: "getConsignorSuggestions",
    //     url: SERVER_URL + "/consignor/",
    //     suggestionKeyword: "consignor_name",
    //     suggestionKeywordExtra: "consignor_gst",
    //     suggestionKeywordForFetchApiArgs: "name",
    //     suggestionChooseQueryKeyword: "consignor_id",
    //     suggestionSchema: {
    //       consignor_name: "consignor_name",
    //       consignor_gst: "consignor_gst",
    //       consignor_id: "consignor_id",
    //     },
    //     apiCallRequiredOnGetValue: true,
    //     toValidate: true,
    //     regExpValidation: "[a-zA-z]",
    //     keyboardNavigationMap: {
    //       Enter: "balance_type",
    //     },
    //     idClearanceNeeded: "consignor_id",
    //     inputDataNeededInSuggestions: false,
    //     inputDataFilter: {
    //       pay_type: "same",
    //     },
    //     onKeyPressEvent: async (inputObject)=>{

    //       inputObject.setOverlay(true);
    //       console.log("input object",inputObject);
    //       const url =
    //       SERVER_URL +
    //       "/account_trans/opening_balance/" + inputObject.pageState.station_from +'/'+ inputObject.pageState.consignor_id;

    //       console.log('url of opening balance',url);
    //       const response = await fetch(url);
    //       console.log("okkkkkkkkkkkk",response);
    //       if (!response.ok) {
    //         inputObject.setOverlay(false);
    //         return;
    //       }
    //       const temp_response = await response.json();
    //       console.log('temp resp',temp_response);
    //       if (Object.keys(temp_response).length >0){
    //       inputObject.setPageState(
    //         {
    //             ...inputObject.pageState,
    //             "balance": temp_response.balance,
    //             "balance_type": temp_response.balance_type,
    //         }
    //     )
    //       }
    //       else{
    //         inputObject.setPageState(
    //           {
    //               ...inputObject.pageState,
    //               "balance": 0,
    //               "balance_type": 'dr',
    //           }
    //       ) 
    //       }
    //       inputObject.setOverlay(false);
    //       return;

    //     }
    //   };

    //   const getAdditionalInfoForSuggestionFetch = (fieldInfoObject) => {
    //     let additionalInfoObject = {};
    //     if(fieldInfoObject.name == "consignor_name") {
    //         additionalInfoObject.is_active = "1";
    //         return additionalInfoObject;
    //     }
    //     return null;
    //   }

    return (
        <div className="page-marfatiya-wise">
            <div className="mr-form-container">
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
                                                // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":pageState.bilty_no})
                                                // setPageState({
                                                //   ...dataObject,
                                                //   ...variablesFromSession,
                                                // });
                                                setPageMode("write");
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
                <div className="form-header">Mail Master</div>
                <div className="form-marfatiya-wise">
                    <div className="form-row">
                        <label className="form-label">Mail Type</label>
                        <select
                            autoFocus="true"
                            className="form-input"
                            type="text"
                            name="mail_type"
                            value={myForm.pageState.mail_type}
                            onChange={myForm.handleChange}
                            // onKeyPress={(a) => {
                            //     if (a.key == "Enter") {
                            //         a.preventDefault();
                            //         myForm.makeFocusOnParticularField("subject");
                            //     }
                            // }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "mail_type")}
                        >
                            <option value="0" key="0">
                                {" "}
                                Choose
                            </option>
                            <option value="1" key="1">
                                {" "}
                                Send Bill
                            </option>
                            {/* <option value="cr" key="cr">
                CR
              </option> */}
                        </select>
                    </div>

                    <div className="form-row">
                        <label className="form-label">Subject</label>
                        <textarea
                            className="form-input"
                            type="text"
                            name="subject"
                            style={textAreaStyle}
                            value={myForm.pageState.subject}
                            onChange={handleChange}
                            // onKeyPress={(a) => {
                            //     if (a.key == "Enter") {
                            //         myForm.makeFocusOnParticularField("body_start");
                            //     }
                            // }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "subject")}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Body Start</label>
                        <textarea
                            className="form-input"
                            type="text"
                            name="body_start"
                            style={textAreaStyle}
                            value={myForm.pageState.body_start}
                            onChange={handleChange}
                            // onKeyPress={(a) => {
                            //     if (a.key == "Enter") {
                            //         myForm.makeFocusOnParticularField("body_end");
                            //     }
                            // }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "body_start")}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label">Body End</label>
                        <textarea
                            className="form-input"
                            rows="10"
                            style={textAreaStyle}
                            type="text"
                            name="body_end"
                            value={myForm.pageState.body_end}
                            onChange={handleChange}
                            // onKeyPress={(a) => {
                            //     if (a.key == "Enter") {
                            //         myForm.makeFocusOnParticularField("save_button");
                            //     }
                            // }}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "body_end")}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            onClick={saveMailMaster}
                            ref={(a) =>
                                myForm.storeInputReferenceForSelect(a, "save_button")
                            }
                        >
                            {" "}
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MailMaster;
