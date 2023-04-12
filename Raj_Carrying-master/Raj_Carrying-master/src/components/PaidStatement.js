import React, { useState } from "react";
import { SERVER_URL } from "../config/config";
import "./MarfatiyaWise.css";
import print from "print-js";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";

let ex_data = [];
function PaidStatement({ sessionObject }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const download_ref = React.useRef(null);
  const sortIdRef = React.useRef(0);
  const [dateState, setDateState] = React.useState({
    date_from: new Date(),
    date_to: new Date(),
    in_stock: "1",
  });

  var nowDate = new Date();
  var date =
    nowDate.getFullYear() +
    "-" +
    String(nowDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    nowDate.getDate();
  const [pageState, setPageState] = useState({
    challan_no: "",
    brokerage: "",
    date_from: date,
    date_to: date,
    station_to: "",
    station_to_name: "",
  });
  const handleChange = async (e) => {
    const { name, value } = e.target;
    // console.log("sdfasd", name, value)
    setPageState({
      ...pageState,
      [name]: value,
    });
  };

  const handleChangeForSelect = function (e, selectName) {
    const { name, value } = e.target;
    // console.log("DSFDSFD", name, value)
    setAmountType(value);
  };

  const handlePrint = async () => {
    let url = SERVER_URL + "/challan/print_tripwise_challan/";
    let apiInputData = {
      branch_dict: {
        station_from: "7",
        station_to: String(pageState.station_to),
      },
      date_dict: {
        date_from: pageState.date_from,
        date_to: pageState.date_to,
      },
      brokerage: String(pageState.brokerage),
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiInputData),
    }).then((r) => r.blob());
    print({
      printable: URL.createObjectURL(response),
      type: "pdf",
      showModal: false,
    });
  };

  let stationToFieldInfo = {
    label: "Station To",
    className: "form-row",
    labelClassName: "form-label",
    inputClassName: "form-input",
    name: "station_to_name",
    type: "text",
    placeHolder: "",
    apiConfigKey: "getCitySuggestions",
    url: SERVER_URL + "/branch/",
    suggestionKeyword: "name",
    suggestionKeywordForFetchApiArgs: "name",
    suggestionChooseQueryKeyword: "branch_id",
    apiCallRequiredOnGetValue: true,
    suggestionSchema: {
      branch_id: "station_to",
      name: "station_to_name",
    },
    toValidate: true,
    regExpValidation: "[a-zA-z]",
    keyboardNavigationMap: {
      Enter: "item_name",
    },
    valueVerificationFromSuggestionNeeded: true,
    valueVerificationCompulsionField: "station_to",
  };

  return (
    <div className="page-marfatiya-wise">
      <div className="mr-form-container">
        <div className="form-header">Paid Statement</div>
        <div className="form-marfatiya-wise">
          <div className="form-row">
            <label className="form-label">Date From: </label>
            <input
              className="form-input"
              type="date"
              name="date_from"
              placeholder=""
              value={pageState.date_from}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>

          <div className="form-row">
            <label className="form-label">Date To: </label>
            <input
              className="form-input"
              type="date"
              name="date_to"
              placeholder=""
              value={pageState.date_to}
              onChange={handleChange}
              //   onKeyPress={otherLinkBilty}
              //   ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="form-actions">
            <div className="form-footer">
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
                  setLoading(true);
                  let dataToSend = {
                    date_dict: finalInput.date_dict,
                    filter_fields: finalInput.filter_fields,
                    date_from: pageState.date_from,
                    date_to: pageState.date_to,
                  };
                  let resp = await fetch(SERVER_URL + "/report/ack_pending", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                  });
                  let response = await resp.json();

                  if (response["data"] && "total_rows" in response) {
                    console.log(response["data"], "fsdfafsfds");
                    // setData(response["data"]);
                    ex_data = response["data"];
                    // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                  }
                  setLoading(false);
                  download_ref.current.handleDownload();
                }}
              >
                Download as XLS
              </button>
              {ReportExcel.paid_statement_excel_data(ex_data)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaidStatement;
