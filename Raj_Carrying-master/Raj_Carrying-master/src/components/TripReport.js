import React from "react";
import { SERVER_URL } from "../config/config.js";
import "./biltyReport.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReportTable from "./ReportTable";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation, useHistory } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
let ex_data = [];

function TripReport({ sessionObject }) {
    const history = useHistory();
  const columns = React.useMemo(
    () => [
      {
        Header: "Trip No",
        accessor: "trip_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
      },
      {
        Header: "Trip Date",
        accessor: "trip_date",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
      },
      {
        Header: "Truck",
        accessor: "vehicle_no",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
      },
      {
        Header: "Owner",
        accessor: "vehicle_ownership",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   if (value == "1"){
        //     return "Other"
        //   }
        //   else{
        //     return "Self"
        //   }
        // },
        canFilter: true,
      },
      {
        Header: "Station From",
        accessor: "station_from_name",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
      },
      {
        Header: "Station To",
        accessor: "station_to_name",
        canFilter: true,
      },
      {
        Header: "Total Amt",
        accessor: "amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
      },
      {
        Header: "Advance",
        accessor: "advance_bhada",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
      },
      {
        Header: "Balance",
        accessor: "balance_bhada",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
      },
      {
        Header: "Bhada Paid Date",
        accessor: "bhada_paid_date",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
      },
      {
        Header: "Bhada Paid Branch",
        accessor: "bhada_paid_branch_name",
        width: "150px",
        minWidth: "150px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
      },
      {
        Header: "Pan No",
        accessor: "pan_no",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
      },
      {
        Header: "User",
        accessor: "created_by",
        canFilter: true,
      },
    ],
    []
  );

  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const download_ref = React.useRef(null);
  const sortIdRef = React.useRef(0);
  const [dateState, setDateState] = React.useState({
    date_from: new Date(),
    date_to: new Date(),
    in_stock: "Y",
    greater_amt: "N"
  });
  const [finalInput, setFinalInput] = React.useState({});
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  let query = useQuery();

  useEffect(() => {
    const reportType = query.get("report_type");
    // myForm.setPageStateByField("voucher_type", voucher);
    setDateState({
      ...dateState,
      ["report_type"]: reportType,
    })
  }, []);

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, sortBy, customFilters, dateObject }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;
      console.log("12323", sortBy, customFilters, fetchId);
      for (let key in customFilters){
        console.log("Key", customFilters[key].toLowerCase(), key)
        if (customFilters[key].toLowerCase() == "none"){
          customFilters[key] = null
        }
      }
      // Set the loading state
      setLoading(true);

      if (fetchId === fetchIdRef.current) {
        console.log("Date state", dateObject);


        let newObject = {}
        // if (dateObject.report_type == "bilty"){
        //   newObject.created_from = String(
        //     sessionObject.sessionVariables.branch_id
        //   );
        //   // if (dateObject.in_stock == "N") {
        //   //   newObject.created_from = String(
        //   //     sessionObject.sessionVariables.branch_id
        //   //   );
        //   // } else {
        //   //   newObject.owned_by = String(
        //   //     sessionObject.sessionVariables.branch_id
        //   //   );
        //   // }

        // }
        if (dateObject.in_stock == "Y") {
          newObject.created_from = String(
            1
          );
        }
        if (dateObject.greater_amt == "Y") {
          newObject.greater_amt = String(
            1
          );
        }
        // if (dateObject.report_type == "inward"){
        //   newObject.owned_by = String(
        //     sessionObject.sessionVariables.branch_id
        //   );
        //   // if (dateObject.in_stock == "N") {
        //   //   newObject.created_from = String(
        //   //     sessionObject.sessionVariables.branch_id
        //   //   );
        //   // } else {
        //   //   newObject.owned_by = String(
        //   //     sessionObject.sessionVariables.branch_id
        //   //   );
        //   // }
        // }


        newObject = {...newObject,...customFilters}

        let inputData = {
          paginate: { number_of_rows: pageSize, page_number: pageIndex + 1 },
          sort_fields: sortBy,
          filter_fields: newObject,
          date_dict: {
            date_from: dateObject.date_from,
            date_to: dateObject.date_to,
          },
        };

        setFinalInput(inputData);
        let response = await fetch(SERVER_URL + "/report/trip/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        });
        let resp = await response.json();
        if (resp["data"] && "total_rows" in resp) {
          setData(resp["data"]);
          setPageCount(Math.ceil(resp["total_rows"] / pageSize));
        }
        setLoading(false);
      }
      // We'll even set a delay to simulate a server here
      //   setTimeout(() => {
      //     // Only update the data if this is the latest fetch
      //     if (fetchId === fetchIdRef.current) {
      //       const startRow = pageSize * pageIndex;
      //       const endRow = startRow + pageSize;
      //     //   setData(serverData.slice(startRow, endRow));
      //       console.log("data", data);
      //       // Your server could send back total page count.
      //       // For now we'll just fake it, too
      //       setPageCount(Math.ceil(serverData.length / pageSize));

      //       setLoading(false);
      //     }
      //   }, 1000);
    },
    []
  );

  const handleViewClick = (cell) => {
    console.log("---", cell[0].value);
      history.push("/trip", cell[0].value);
    //   history.push("/trip", 6417);
    }

  const getTitleName = () => {
    if (dateState.report_type == "bilty") {
      return "Bilty Report";
    }
    else if (dateState.report_type == "inward") {
      return "Inward Report";
    }
  };

  return (
    <div className="report-bilty">
      <div className="form-header">Trip Report</div>
      <div className="report-bilty-table-container">
        <div className="report-field-row ">
          <div>
            From Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={dateState.date_from}
              onChange={(date) =>
                setDateState({
                  ...dateState,
                  ["date_from"]: date,
                })
              }
              // ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={checkDisabledCondition({ name: "input_date" })}
              // onKeyPress={(a) => {
              //   if (a.key == "Enter") {
              //     myForm.makeFocusOnParticularFieldForItem(
              //       "eway_bill_no",
              //       0,
              //       "eway_bill_no"
              //     );
              //   }
              // }}
            />
          </div>
          <div>
            To Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={dateState.date_to}
              onChange={(date) =>
                setDateState({
                  ...dateState,
                  ["date_to"]: date,
                })
              }
              // ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={checkDisabledCondition({ name: "input_date" })}
              // onKeyPress={(a) => {
              //   if (a.key == "Enter") {
              //     myForm.makeFocusOnParticularFieldForItem(
              //       "eway_bill_no",
              //       0,
              //       "eway_bill_no"
              //     );
              //   }
              // }}
            />
          </div>
        </div>
        <div className="report-field-row-second ">
          <div className="report-field-row-second ">
              <label>Only Ahmedabad?</label>
              <select
                onChange={(e) => {
                  const { name, value } = e.target;
                  setDateState({
                    ...dateState,
                    [name]: value,
                  });
                }}
                // ref={(a) => myForm.storeInputReferenceForSelect(a, "is_crossing")}
                // disabled={checkDisabledCondition({ name: "is_crossing" })}
                value={dateState["in_stock"]}
                name="in_stock"
                // onKeyPress={(a) => {
                //   if (a.key == "Enter") {
                //     a.preventDefault();
                //     if (
                //       myForm.pageState.is_crossing == "N" ||
                //       myForm.pageState.is_crossing == "n"
                //     ) {
                //       myForm.makeFocusOnParticularField("bilty_no");
                //       return;
                //     } else {
                //       myForm.makeFocusOnParticularField("transporter_name");
                //       return;
                //     }
                //   }
                // }}
              >
                <option value="N" key="N">
                  N
                </option>
                <option value="Y" key="Y">
                  Y
                </option>
              </select>
            </div>
            <div className="report-field-row-second ">
              <label>{" >=75000"}</label>
              <select
                onChange={(e) => {
                  const { name, value } = e.target;
                  setDateState({
                    ...dateState,
                    [name]: value,
                  });
                }}
                // ref={(a) => myForm.storeInputReferenceForSelect(a, "is_crossing")}
                // disabled={checkDisabledCondition({ name: "is_crossing" })}
                value={dateState["greater_amt"]}
                name="greater_amt"
                // onKeyPress={(a) => {
                //   if (a.key == "Enter") {
                //     a.preventDefault();
                //     if (
                //       myForm.pageState.is_crossing == "N" ||
                //       myForm.pageState.is_crossing == "n"
                //     ) {
                //       myForm.makeFocusOnParticularField("bilty_no");
                //       return;
                //     } else {
                //       myForm.makeFocusOnParticularField("transporter_name");
                //       return;
                //     }
                //   }
                // }}
              >
                <option value="N" key="N">
                  N
                </option>
                <option value="Y" key="Y">
                  Y
                </option>
              </select>
            </div>
          </div>
        <ReportTable
          columns={columns}
          data={data}
          fetchData={fetchData}
          dateObject={dateState}
          loading={loading}
          pageCount={pageCount}
          canView={true}
          handleViewClick={handleViewClick}
        />
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
              };
              let resp = await fetch(SERVER_URL + "/report/trip/", {
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
          {ReportExcel.excel_trip_data(
            { columns },
            { ex_data },
            { fetchData },
            { dateState },
            { loading },
            { pageCount },
            { dateState }
          )}
        </div>
      </div>
    </div>
  );
}

export default TripReport;
