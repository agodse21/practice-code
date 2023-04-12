
import React, { useState, useEffect } from "react";
import { SERVER_URL } from "../config/config";
import Popup from 'reactjs-popup';
import './ResetPassword.css'

function ResetPassword({ sessionObject }) {
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState({});
    const msgObj = {
        done: "Password changed Successfully!",
        fail: "Something went wrong! Could not update the password",
    }

    const handleSubmit = async () => {
        console.log("handle submit");

        const url = SERVER_URL + "/user/change-password"
            + `?id=${sessionObject.sessionVariables.user_id}`
            + `&new_password=${password}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            setResponse({
                flag: 0,
                message: "",
            })
        }
        else {
            const data = await response.json();
            console.log({ data });
            setResponse(data)
        }
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
                                        {response.flag ? msgObj.done : msgObj.fail}
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
            <div className='page-marfatiya-wise'>
                <div className='signup-form-container'>
                    <div className="form-header"> Change Password</div>
                    <div className="cp-wrapper">
                        <div className="form-row">
                            <label className="cp-form-label"> New Password: </label>
                            <input
                                className="form-input"
                                type="text"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(a) => {
                                    if (a.key == "Enter") {
                                        document.getElementById("password").focus();
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                id="password"
                                name="password"
                                type="submit"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword;
