import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import PropTypes from "prop-types";
import {SERVER_URL} from "../config/config"
import Popup from "reactjs-popup";

async function loginUser(credentials) {
  
  // https://run.mocky.io/v3/702e0d64-e1eb-4c63-b071-e4ad3e15acfc
  return fetch(SERVER_URL + "/login/access-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(credentials),
  }).then((data) => data.json());
}

export default function Login({ sessionObject }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [pageMode, setPageMode] = useState("");
  const [popupError, setPopupError] = useState("");
  let refStoreObject = useRef({});

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username == null || password == null){
      return;
    }
    let resp = await loginUser({
      username,
      password: password.toLowerCase(),
    });

    if ("detail" in resp && resp.detail == "Exeption in login api"){
      setPageMode("error");
      setPopupError("Invalid credentials");
    }


    // let response = await fetch("localhost:5000/user_validation");
    // let val_resp = await response.json();

    // Response manipulation
    resp.branch_id = null;
    resp.branch_name = null;

    console.log("responsecvbn", resp);

    sessionObject.saveSessionVariableByObject(resp);
    console.log("SESSION OBJ",sessionObject)

  };

  useEffect(
    // Effect for clearing out client side validation
    () => {
      refStoreObject.current["username"].focus();
    },
    []
  );

  return (
    <div className="login-wrapper">
        <Popup
          open={pageMode == "error"}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">
                {" "}
                {
                  <div>Error Logging In</div>
                }
                <div>
                  <a className="pop-up-close btn" onClick={close}>
                    &times;
                  </a>
                </div>
              </div>
              {
                <div className="pop-up-content">
                  <br />
                  <div className="pop-up-fields">
                    <div className="pop-up-field">
                      <div className="pop-up-field-value">
                        {popupError}
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    close();
                    setPageMode("");
                  }}
                >
                  Okay
                </button>
              </div>
            </div>
          )}
      </Popup>
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input 
            type="text" 
            onChange={(e) => setUserName(e.target.value)} 
            ref={(a) => refStoreObject.current.username = a}
            onKeyPress={(a) =>{
              if (a.key == "Enter"){
                a.preventDefault();
                refStoreObject.current.password.focus();
              }
            }}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            ref={(a) => refStoreObject.current.password = a}
            onKeyPress={(a) =>{
              if (a.key == "Enter"){
                a.preventDefault();
                refStoreObject.current.save_button.focus();
              }
            }}
          />
        </label>
        <div>
          <button type="submit"
          ref={(a) => refStoreObject.current.save_button = a}>Submit</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
