import React, { useState, useRef } from "react";
import { SERVER_URL } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import "./popup.css";
import Popup from "reactjs-popup";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function MarfatiyaWise({ sessionObject }) {
  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };
  const popupInfo = {
    error_header: "Error In Challan Module ",
    success_header: "POD Inwarded Successfullty ",
    success_title: "",
    field_label_success: "",
    field_name_success: "challan_no",
    error_title: "Error in Challan module with the following info:-",
    field_label_error: "Error:",
  };
  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "-" +
    String(nowDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    nowDate.getDate();
  //   console.log(date, "dsfsfadfsdfa")
  const [pageState, setPageState] = useState({
    bilty_no: "",
    suffix: "",
    consignor_name: "",
    consignee_name: "",
    station_to_name: "",
    no_of_package: "",
    item_name: "",
    total_freight: "",
    input_date: "",
    rebook_remarks: "",
    bilty_date: date,
    received_date: date,
    created_from: sessionObject.sessionVariables.branch_id,
    bilty_id: "",
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
  });
  let refStoreObject = useRef({});

  const [previousPageMode, setPreviousPageMode] = useState("");
  const [pageMode, setPageMode] = useState("");
  const [popupError, setPopupError] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    // console.log("sdfasd", name, value)
    setPageState({
      ...pageState,
      [name]: value,
    });
  };

  const makeFocusOnParticularField = (fieldName) => {
    refStoreObject.current[fieldName].focus();
  };

  const storeInputReferenceForSelect = (refObject, fieldName) => {
    if (refObject == null) {
      return;
    }
    refStoreObject.current[fieldName] = refObject;
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    // console.log("DSFDSFD", name, value)
    setAmountType(value);
  };

  const linkBilty = async (e) => {
    if (pageState.bilty_no == "" && e.key == "Enter") {
      makeFocusOnParticularField("save_button");
      return;
    }
    if (e.key == "Enter") {
      let flag = 0;
      if (pageState.bilty_type == "c" || pageState.bilty_type == "C") {
        flag = 1;
      }
      let suffix = pageState.suffix;
      if (suffix == "") {
        suffix = "null";
      }
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      const url =
        SERVER_URL +
        "/bilty/lr_pod_in/" +
        pageState.bilty_no +
        "?branch_id=" +
        pageState.created_from +
        "&suffix=" +
        suffix +
        "&flag=" +
        flag + 
        "&companyId=" + pageState.company_id + 
        "&fyear=" + fYear_fetch;

        
      const response = await fetch(url);

      console.log("Response", response);
      if (!response.ok) {
        const temp_error = await response.json();
        if ("detail" in temp_error) {
          if (temp_error.detail == "Bilty not found") {
            makeFocusOnParticularField("bilty_no");
            return;
          }
          setPreviousPageMode(pageMode);
          setPageMode("error");
          setPopupError(temp_error.detail);
        } else {
          setPreviousPageMode(pageMode);
          setPageMode("error");
          setPopupError("Invalid Bilty");
        }
        setPageState({
          ...pageState,
          ["bilty_no"]: "",
          ["suffix"]: "",
        });
        return;
      }
      const temp_response = await response.json();
        
    //   if("flag" in temp_response) {
    //     myForm.makeFocusOnParticularField("suffix");
    //     return;
    //   }   
    
      if (temp_response.check_fail) {
        setPageState({
          ...pageState,
          ["bilty_no"]: "",
          ["suffix"]: "",
        });

        setPreviousPageMode(pageMode);
        setPageMode("error");
        setPopupError("Not possible to add this bilty");
        return;
      }
      if ("bilty_date" in temp_response) {
        temp_response.bilty_date = formatDate(temp_response.bilty_date);
      }
      console.log("page state", temp_response);
      setPageState({
        ...pageState,
        ...temp_response,
      });
      makeFocusOnParticularField("received_date");
    }
  };

  const handlePrint = async () => {
    let url = SERVER_URL + "/bilty/lr_pod";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bilty_id: pageState.bilty_id,
        pod_receive_date: pageState.received_date,
        pod_remarks: pageState.rebook_remarks,
        pod_owned_by: pageState.created_from,
        // companyId: pageState.company_id,
        // fyear: pageState.fYear,
      }),
    });
    if (!response.ok){
      return;
    }
    setPageMode("submitted");
    const resp = await response.json();
  };

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
        <div>
          <Popup
            // trigger={<button className="button"> Open Modal </button>}
            open={pageMode == "submitted" || pageMode == "error"}
            modal
            contentStyle={contentStyle}
            closeOnDocumentClick={false}
          >
            {(close) => (
              <div className="pop-up-container">
                <div className="pop-up-header">
                  {" "}
                  {pageMode == "submitted" ? (
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
                {pageMode == "submitted" ? (
                  <div className="pop-up-content">
                    {popupInfo.success_title}
                    <br />
                    <div className="pop-up-fields">
                      <div className="pop-up-field">
                        <div className="pop-up-field-label">
                          {popupInfo.field_label_success}
                        </div>
                        <div className="pop-up-field-value">
                          {pageState[popupInfo.field_name_success]}
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
                          {popupError}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="pop-up-actions">
                  <button
                    className="pop-up-button"
                    onClick={() => {
                      if (pageMode == "submitted") {
                        // sessionObject.saveSessionVariableByField("last_bilty_no", {"last_bilty_no":pageState.bilty_no})
                        // setPageState({
                        //   ...dataObject,
                        //   ...variablesFromSession,
                        // });
                        setPageMode("write");
                        window.location.reload();
                        close();
                      } else {
                        if (previousPageMode != "") {
                          setPageMode(previousPageMode);
                          setPreviousPageMode("");
                        } else {
                          setPageMode("write");
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
        <div className="form-header">Bilty POD Inward</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Bilty No: </label>
            <div style={{width: "50%"}}>
            <input
                className="form-input"
                type="input"
                name="bilty_no"
                placeholder=""
                value={pageState.bilty_no}
                onChange={handleChange}
                autoFocus={true}
                ref={(a) => storeInputReferenceForSelect(a, "bilty_no")}
                style={{width: "80%", marginRight: "10px"}}
                // onKeyPress={linkBilty}
                onKeyPress={(a) => {
                if (a.key == "Enter") {
                    a.preventDefault();
                    makeFocusOnParticularField("suffix");
                }
                }
            }
            />
            <input
              className="form-input-suffix"
              type="input"
              name="suffix"
              placeholder=""
              value={pageState.suffix}
              onChange={handleChange}
              onKeyPress={linkBilty}
              ref={(a) => storeInputReferenceForSelect(a, "suffix")}
            />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Bilty Date: </label>
            <input
              className="form-input"
              type="date"
              name="bilty_date"
              placeholder=""
              value={pageState.bilty_date}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => storeInputReferenceForSelect(a, "input_date")}
              // disabled={pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Consignor Name </label>
            <input
              className="form-input"
              type="input"
              name="consignor_name"
              placeholder=""
              value={pageState.consignor_name}
              // onChange={handleChange}
              disabled="disabled"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Consignee Name </label>
            <input
              className="form-input"
              type="input"
              name="consignee_name"
              placeholder=""
              value={pageState.consignee_name}
              // onChange={handleChange}
              disabled="disabled"
            />
          </div>
          <div className="form-row">
            <label className="form-label">To Station Name </label>
            <input
              className="form-input"
              type="input"
              name="station_to_name"
              placeholder=""
              value={pageState.station_to_name}
              // onChange={handleChange}
              disabled="disabled"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Pkgs </label>
            <input
              className="form-input"
              type="input"
              name="no_of_package"
              placeholder=""
              value={pageState.no_of_package}
              // onChange={handleChange}
              disabled="disabled"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Freight </label>
            <input
              className="form-input"
              type="input"
              name="total_amount"
              placeholder=""
              value={pageState.total_amount}
              // onChange={handleChange}
              disabled="disabled"
            />
          </div>

          <div className="form-row">
            <label className="form-label">Received Date: </label>
            <input
              className="form-input"
              type="date"
              name="received_date"
              placeholder=""
              value={pageState.received_date}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              ref={(a) => storeInputReferenceForSelect(a, "received_date")}
              onKeyPress={(a) => {
              if (a.key == "Enter") {
                a.preventDefault();
                makeFocusOnParticularField("rebook_remarks");
              }
            }}
              // disabled={pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Rebook Remarks </label>
            <input
              className="form-input"
              //   type="date"
              name="rebook_remarks"
              placeholder=""
              value={pageState.rebook_remarks}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              ref={(a) => storeInputReferenceForSelect(a, "rebook_remarks")}
              // disabled={pageMode == "view" ? "disabled" : ""}
              onKeyPress={(a) => {
              if (a.key == "Enter") {
                a.preventDefault();
                makeFocusOnParticularField("save_button");
              }
            }}
            />
          </div>

          <div className="form-actions">
            <button onClick={handlePrint}
            ref={(a) => storeInputReferenceForSelect(a, "save_button")}
            > Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarfatiyaWise;
