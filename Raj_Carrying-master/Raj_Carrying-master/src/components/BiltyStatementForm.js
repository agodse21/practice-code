import React from "react";
// import DynamicTable from "./DynamicTable";
import Popup from "reactjs-popup";
import DynamicViewTable from "./DynamicViewTable";
import "./Form.css";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { biltyStatementApiConfig } from "../config/apiConfig.js";
import {
  biltyStatementGroupInfo,
  biltyStatementDataObject,
  biltyStatementValidate,
  biltyStatementTableHeader,
  biltyStatementTableItems,
} from "../config/biltyStatementForm.js";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/biltyStatementForm.js";
import { SERVER_URL } from "../config/config";
import DatePicker from "react-datepicker";

import "./ChallanInwardForm.css";


const lodash = require("lodash");

const BiltyStatementForm = ({ sessionObject }) => {
  // TODO: can merge in pageState
  // const [startDate, setStartDate] = useState(new Date());

  const contentStyle = {
    maxWidth: "600px",
    width: "90%",
  };
  let variablesFromSession = {
    station_from: String(sessionObject.sessionVariables.branch_id),
    station_from_name: sessionObject.sessionVariables.branch_name,
    created_from: String(sessionObject.sessionVariables.branch_id),
    created_by: String(sessionObject.sessionVariables.user_id),
    created_by_name: String(sessionObject.sessionVariables.user_name),
    role_id: String(sessionObject.sessionVariables.role_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "BiltyStatement",
    biltyStatementValidate,
    { ...biltyStatementDataObject, ...variablesFromSession },
    biltyStatementApiConfig
  );

  const linkBilty = async (e) => {
    if (e.key == "Enter") {
      // TODO: hit api here, changes for bilty_info
      if (myForm.pageState.paid_statement_no == "") {
        myForm.makeFocusOnParticularField("input_date");
        return;
      }
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      let url =
        SERVER_URL + "/paid_statement/" + +myForm.pageState.paid_statement_no+"?branch_id="+myForm.pageState.created_from;
      url += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

      const response = await fetch(url);

      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["paid_statement_no"]: "Invalid Statement No",
        });
        return;
      }
      const temp_response = await response.json();
      console.log("Temp response", temp_response);
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["paid_statement_no"]: "Not possible to add this bilty",
        });
        return;
      }

      let bilty_count = 0
      let no_of_articles = 0
      let weight = 0
      let total_amount = 0
      for (let i=0; i < temp_response["bilty_list"].length; i++){
        total_amount += parseInt(temp_response["bilty_list"][i].total_amount) || 0
        weight += parseInt(temp_response["bilty_list"][i].charge_weight) || 0
        no_of_articles += parseInt(temp_response["bilty_list"][i].no_of_package) || 0
        bilty_count += 1
      }
      console.log("asdsd", temp_response)
      let newState = {
        amount_list: temp_response["amount_list"],
        bilty_info_list: temp_response["bilty_list"],
        input_date: temp_response["paid_statement_date"],
        bilty_count: bilty_count,
        no_of_articles:  no_of_articles,
        weight: weight,
        total_amount: total_amount,
        id: temp_response["id"]
      };

      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.setPageMode("view");
      
      // myForm.setPageState({
      //   ...myForm.pageState,
      //   ...temp_response,
      // });
    }
  };

  const otherLinkBilty = async (e) => {

    if (e.key == "Enter") {
      const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
      const url =
        SERVER_URL + "/bilty/paid_statement/" + myForm.pageState.created_from + "?date="+myForm.pageState.input_date 
        +"&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;
      const response = await fetch(url);

      if (!response.ok) {
      } else {
        var resp = await response.json();

        let total_biltys = 0;
        let total_packages = 0;
        let total_weight = 0;
        let total_freight = 0;

        for (let biltys in resp["bilty_info_list"]) {
          total_biltys += 1;

          if (
            resp["bilty_info_list"][biltys].no_of_package != "" &&
            resp["bilty_info_list"][biltys].no_of_package != null
          ) {
            total_packages += parseInt(
              resp["bilty_info_list"][biltys].no_of_package
            );
          }
          console.log("weight", resp["bilty_info_list"][biltys].charge_weight);
          if (
            resp["bilty_info_list"][biltys].charge_weight != "" &&
            resp["bilty_info_list"][biltys].charge_weight != null
          ) {
            console.log("in");
            total_weight += parseInt(
              resp["bilty_info_list"][biltys].charge_weight
            );
          }

          if (
            resp["bilty_info_list"][biltys].freight != "" &&
            resp["bilty_info_list"][biltys].freight != null
          ) {
            total_freight += parseInt(resp["bilty_info_list"][biltys].total_amount);
          }
        }
        let newState = {
          bilty_count : total_biltys,
          no_of_articles : total_packages,
          weight : total_weight,
          total_amount : total_freight,
          amount_list : resp["amount_list"],
          bilty_info_list : resp["bilty_info_list"],
          paid_statement_no: "",
        }
        myForm.setPageState({
          ...myForm.pageState,
          ...newState,
        });
        myForm.makeFocusOnParticularField("save_button");
      }
    }
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return false;
    } else if (fieldInfo.name == "delete_button" &&
    myForm.pageState.role_id != "1") {
      return false;
    } else if (
      fieldInfo.name == "inward_button" &&
      myForm.pageState.inwarded == "1"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkDisabledCondition = (fieldInfo) => {
    if (fieldInfo.name == "transporter_freight") {
      return "disabled";
    }
    if (fieldInfo.name == "to_pay") {
      return "disabled";
    }
    if (fieldInfo.name == "paid") {
      return "disabled";
    }
    if (fieldInfo.name == "our_freight") {
      return "disabled";
    }
    if (fieldInfo.name == "balance") {
      return "disabled";
    }
    if (fieldInfo.name == "pkgs") {
      return "disabled";
    }
    if (fieldInfo.name == "crossing_bill_no") {
      return "disabled";
    } else if (myForm.pageMode == "view") {
      return "disabled";
    } else if (
      myForm.pageMode == "edit" &&
      fieldInfo.name == "transporter_name"
    ) {
      return "disabled";
    } else {
      return "";
    }
  };

  const handleDelete = async () => {
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    const url =
      SERVER_URL + "/paid_statement/?paid_statement_id=" + myForm.pageState.id
      +"&fyear=" + fYear_fetch;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      // myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    // console.log("Info objecyt", infoObject);
    // let biltyObj = myForm.pageState.bilty_info_list[infoObject.idx];
    // let biltyId = biltyObj.bilty_id;
    // console.log("Bilty objecy", biltyObj);
    // let newState = {};
    // newState.bilty_info_list = infoObject.rows;
    // newState.removed_bilty_ids = [
    //   ...myForm.pageState.removed_bilty_ids,
    //   biltyId,
    // ];
    // // console.log("New state", newState);
    // myForm.setPageState({
    //   ...myForm.pageState,
    //   ...newState,
    // });
  };

  return (
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
                  <div>Paid Statement Saving Successful </div>
                ) : (
                  <div>Error In Paid Statement Module </div>
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
                  Paid Statement is successfully created
                  <br />
                  {/* <div className="pop-up-fields">
                      <div className="pop-up-field">
                      <div className="pop-up-field-label">Crossing Inward No.</div>
                      <div className="pop-up-field-value">{myForm.pageState.crossing_in_no}</div>
                      </div>
                    </div> */}
                </div>
              ) : (
                <div className="pop-up-content">
                  {" "}
                  Error in Paid Statement module with the following info:-
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
                        ...biltyStatementDataObject,
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
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          open={myForm.deletePopup}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">Are you sure want to delete?</div>
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    handleDelete();
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  Yes
                </button>
                <button
                  className="pop-up-button"
                  onClick={() => {
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div className="form-header">Paid Statement</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Paid Statement No:</label>
            <input
              className="form-input"
              type="text"
              name="paid_statement_no"
              placeholder=""
              value={myForm.pageState.paid_statement_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "paid_statement_no")}
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="chform-row">
            {/* <label className="chform-label">Station To</label>
          <input
            className="chform-input"
            type="text"
            name="Bilty No"
            placeholder=""
            value={myForm.pageState["Bilty No"]}
            onChange={myForm.handleChange}
            onKeyPress={linkBilty}
            ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_no")}
          /> */}
          </div>

          <div>
            <label className="form-label">Bilty Date:</label>
            {/* <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              disabled={true}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "bilty_date")}
              onKeyPress={(a) => {
                console.log("Here");
                if (a.key == "Enter") {
                  myForm.makeFocusOnParticularFieldForItem(
                    "eway_bill_no",
                    0,
                    "eway_bill_no"
                  );
                }
              }}
            /> */}
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              onKeyPress={otherLinkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-last_bilty">Last Paid Statement No:</label>
            <label className="form-last_statement">
              {myForm.pageState.last_bilty_statement_no}
            </label>
          </div>
        </div>

        <div className="multi-table-container">
          <div className="small-table-container">
            {/* {console.log("***********", myForm.pageState["bilty_info_list"])} */}
            <DynamicViewTable
              tableHeader={biltyStatementTableHeader}
              tableItems={biltyStatementTableItems}
              tableValues={myForm.pageState["amount_list"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["amount_list"]}
              // deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="amount_list"
            />
          </div>
          <div className="table-container">
            <DynamicViewTable
              tableHeader={challanBiltyTableHeader}
              tableItems={challanBiltyTableItems}
              tableValues={myForm.pageState["bilty_info_list"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["bilty_info_list"]}
              deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="bilty_info_list"
            />
          </div>
        </div>

        <div className="chform-row">
          {biltyStatementGroupInfo["group-1"].map(function (info) {
            return (
              <div className={info["className"]} key={info["name"]}>
                <label className={info["labelClassName"]}>
                  {info["label"]}:
                  <input
                    disabled={true}
                    type={info["type"]}
                    value={myForm.pageState[info["name"]]}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="form-footer">
          <button
            onClick={myForm.handleSubmit}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
          >
            Save
          </button>
          {checkVisibilityCondition({ name: "print_button" }) && (
            <button
            onClick={(e) => {
              console.log("Values", myForm.pageState);
              console.log("Values", myForm.pageState);
              myForm.setServerPrintNeeded(true);
              myForm.handleSubmit(e);
            }}
            type="button"
            className="btn btn-primary"
            ref={(a) => myForm.storeInputReferenceForSelect(a, "print_button")}
          >
            Print
          </button>
          )}
          <button
            onClick={() => {
              myForm.setPageState({
                ...biltyStatementDataObject,
                ...variablesFromSession,
              });
              window.location.reload();
              myForm.setPageMode("write");
            }}
          >
            New
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={()=>myForm.setDeletePopup(true)}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};



export default BiltyStatementForm;
