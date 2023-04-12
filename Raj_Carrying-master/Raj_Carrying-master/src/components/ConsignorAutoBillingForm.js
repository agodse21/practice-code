
import React, { useState, useEffect } from "react";
import { SERVER_URL } from "../config/config";
import Popup from 'reactjs-popup';
import './ResetPassword.css'
import DatePicker from "react-datepicker";
import './Signup.css'
import LoadingOverlay from "react-loading-overlay";

const dataObj = {
    date_from: new Date(),
    date_to: new Date(),
}

function ConsignorAutoBillingForm({ sessionObject }) {

    const [formData, setFormData] = useState(dataObj);
    const [response, setResponse] = useState({});
    const company_id = sessionObject.sessionVariables.company_id ?? "1";
    const fYear = sessionObject.sessionVariables.financial_year;
    const [overlay, setOverlay] = useState(false);
    // const msgObj = {
    //     done: "Password changed Successfully!",
    //     fail: "Something went wrong! Could not update the password",
    // }


    const handleSubmit = async () => {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

        setOverlay(true);
        console.log("handle submit");

        // console.log(formData.date_from, typeof formData.date_from);

        let billDate = (formData.date_from).toISOString().split('T')[0];
        let dateTo = (formData.date_to).toISOString().split('T')[0];

        // console.log({billDate});

        const dataToSend = {
            branch_id: sessionObject.sessionVariables.branch_id,
            user_id: sessionObject.sessionVariables.user_id,
            bill_date: billDate,
            date_to: dateTo,
            companyId: company_id,
            fyear: fYear,
        }

        const url = SERVER_URL + "/bilty/auto_billing";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            setResponse({
                flag: 0,
                message: "Something Went Wrong",
            })
        }
        else {
            const data = await response.json();
            console.log({ data });
            setResponse({
                flag: 1,
                message: "Billing Done"
            })
        }
        setOverlay(false);
    }

    const handleAutoPODSubmit = async () => {

        setOverlay(true);
        console.log("handle submit");

        // console.log(formData.date_from, typeof formData.date_from);

        let billDate = (formData.date_from).toISOString().split('T')[0];
        let dateTo = (formData.date_to).toISOString().split('T')[0];

        // console.log({billDate});

        const dataToSend = {
            branch_id: sessionObject.sessionVariables.branch_id,
            user_id: sessionObject.sessionVariables.user_id,
            bill_date: billDate,
            date_to: dateTo,
            companyId: company_id,
            fyear: fYear,
        }

        const url = SERVER_URL + "/bilty/auto_pod_billing";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            setResponse({
                flag: 0,
                message: "Something Went Wrong",
            })
        }
        else {
            const data = await response.json();
            console.log({ data });
            setResponse({
                flag: 1,
                message: "POD Billing Done"
            })
        }
        setOverlay(false);
    }

    // useEffect(() => {
    //     console.log(response, password);
    // }, []);


    return (
        <div>
            <div>
                <Popup
                    open={Object.keys(response).length > 0}
                    modal
                    closeOnDocumentClick={false}
                >
                    {(close) => (
                        <div className="pop-up-container">
                            <div className="pop-up-header">
                                {response.flag == 1 ?
                                    <div> Success </div>
                                    : <div> Something went wrong ):</div>
                                }
                                <div>
                                    <a className="pop-up-close btn" onClick={close}>
                                        &times;
                                    </a>
                                </div>
                            </div>
                            <div className='pop-up-fields'>
                                <div className='pop-up-field'>
                                    <div className="pop-up-field-value">
                                        {/* {response.flag ? msgObj.done : msgObj.fail} */}
                                        {response.message}
                                    </div>
                                </div>
                            </div>
                            <div className="pop-up-actions">
                                <button
                                    className="pop-up-button"
                                    onClick={() => {
                                        window.location.reload();
                                        close();
                                    }}
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
            <LoadingOverlay
                active={overlay}
                spinner
                text="Loading your content....."
                styles={{
                    wrapper: {
                        overflow: true ? "hidden" : "scroll",
                    },
                }}
            >
            </LoadingOverlay>
            <div className='page-marfatiya-wise'>
                <div className='signup-form-container'>
                    <div className="form-header"> Auto Billing </div>
                    <div className="autobilling-wrapper">
                        <div className="form-row">
                            <label className="cp-form-label"> Bill Date : </label>
                            <DatePicker
                                dateFormat="dd-MM-yyy"
                                selected={formData.date_from}
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        "date_from": date,
                                    })
                                }
                            />
                        </div>
                        <div className="form-row">
                            <label className="cp-form-label"> Bilty Date To : </label>
                            <DatePicker
                                dateFormat="dd-MM-yyy"
                                selected={formData.date_to}
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        "date_to": date,
                                    })
                                }
                            />
                        </div>

                        <div className="signup-button">
                            <button
                                className="signup-button"
                                onClick={handleSubmit}
                            >
                                Auto Billing
                            </button>
                            <button
                                className="signup-button"
                                onClick={handleAutoPODSubmit}
                            >
                                Auto POD Billing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsignorAutoBillingForm;

// auto_pod_billing