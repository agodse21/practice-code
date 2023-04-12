import React from "react";
import { SERVER_URL } from "../config/config.js";
import "./biltyReport.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReportTable from "./ReportTable";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import { useLocation, useHistory } from "react-router-dom";
import {
  mrStatementGroupInfo,
  mrStatementDataObject,
  mrStatementValidate,
  mrStatementTableHeader,
  mrStatementTableItems,
} from "../config/biltyReport.js";
import { useRef, useState, useEffect , useMemo} from "react";
let ex_data = [];

function BiltyReport({ sessionObject }) {
    const history = useHistory();
  const columns = React.useMemo(
    () => [
      {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
      },
      {
        Header: "Suffix",
        accessor: "suffix",
        width: "50px",
        minWidth: "50px",
        canFilter: true,
      },
      {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
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
      // {
      //   Header: "Destination",
      //   accessor: "destination_name",
      // },
      {
        Header: "Consignor Name",
        accessor: "consignor_name",
        canFilter: true,
      },
      {
        Header: "Consignee Name",
        accessor: "consignee_name",
        canFilter: true,
      },
      {
        Header: "Private Marka",
        accessor: "private_marka_no",
        canFilter: true,
      },
      {
        Header: "Packages",
        accessor: "pkgs",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
      },
      {
        Header: "Weight",
        accessor: "charge_weight",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
      },
      {
        Header: "Pay Type",
        accessor: "pay_type_name",
        canFilter: true,
      },
      {
        Header: "DD",
        accessor: "door_del_charge",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
      },
      {
        Header: "Total Amt",
        accessor: "total_amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
      },
      {
        Header: "Challan",
        accessor: "booking_chalan_no",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
      },
      {
        Header: "MR No.",
        accessor: "mr_no",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
      },
      {
        Header: "Inward Date",
        accessor: "inward_date",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
      },
      {
        Header: "Trip No.",
        accessor: "trip_no",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
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
    in_stock: "1",
    pending_bill: "2",
    own_branch : "1",
  });

  const [pageState, setPageState] = React.useState({
    total_amount: 0,
    total_weight: 0,
    total_pkgs: 0,
    total_bilties:0,
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

//   React.useEffect(() => {
//       console.log(dateState);
//   })

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, sortBy, customFilters, dateObject }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;
      console.log("12323", sortBy, customFilters, fetchId);
      for (let key in customFilters){
        console.log("Key", key)
        if (customFilters[key]== null){
          continue
        }
        if (customFilters[key].toLowerCase() == "none"){
          customFilters[key] = null
        }
      }
      // Set the loading state
      setLoading(true);

      if (fetchId === fetchIdRef.current) {
        console.log("Date state", dateObject);


        let newObject = {}
        if (dateObject.report_type == "bilty"){         
          if (dateObject.in_stock == "1") {
            newObject.created_from = String(
                sessionObject.sessionVariables.branch_id
            );
          }
          else {
            newObject.mr_no = null
            newObject.crossing_outward = null; 
            newObject.created_from = String(
                sessionObject.sessionVariables.branch_id
            );
            newObject.owned_by = String(
              sessionObject.sessionVariables.branch_id
            );
            // newObject.crossing_outward = null;
          }
          if (dateObject.pending_bill == "1") {
            newObject.pending_bill = String(
              1
            );
          } 
        }

        if (dateObject.report_type == "inward"){
            newObject.not_created_from = String(
                sessionObject.sessionVariables.branch_id
            );
            newObject.owned_by = String(
                sessionObject.sessionVariables.branch_id
            );

          if (dateObject.own_branch == "2") {
            newObject.not_station_to = String(
              sessionObject.sessionVariables.branch_id
            );
          }

          if (dateObject.in_stock == "2") {
            newObject.mr_no = null
            newObject.crossing_outward = null; 
            newObject.currently_owned_by  = String(
                sessionObject.sessionVariables.branch_id
            );
          }
        }

        if (dateObject.report_type == "admin-inward"){
            // newObject.not_created_from = String(
            //     sessionObject.sessionVariables.branch_id
            // );
            // newObject.owned_by = String(
            //     sessionObject.sessionVariables.branch_id
            // );

          if (dateObject.own_branch == "2") {
            newObject.not_station_to = String(
              sessionObject.sessionVariables.branch_id
            );
          }

          if (dateObject.in_stock == "2") {
            newObject.mr_no = null
            newObject.crossing_outward = null; 
            newObject.currently_owned_by  = String(
                sessionObject.sessionVariables.branch_id
            );
          }
        }


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

        let url = SERVER_URL + "/report/";

        if (dateObject.report_type == "inward" || dateObject.report_type == "admin-inward") {
            url += "inward/";
        }

        let response = await fetch(url , {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        });
        let resp = await response.json();
        console.log("Response :- ",resp)
        let setObj = {}
        if (fetchId === fetchIdRef.current){
          if (resp["data"] && "total_rows" in resp) {
            setData(resp["data"]);
            setPageCount(Math.ceil(resp["total_rows"] / pageSize));
            console.log("Response Internal :- ",resp)
            setObj = {
              total_amount:resp["total_amount"],
              total_weight:resp['total_weight'],
              total_pkgs:resp['total_pkgs'],
              total_bilties:resp['total_rows']
            }
            setPageState({...pageState,...setObj})
          }
          setLoading(false);
        }

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

  const fetchDataDebounced = useMemo(
    () => _.debounce(fetchData, 500),
    []
  );

  const getTitleName = () => {
    if (dateState.report_type == "bilty") {
      return "Bilty Report";
    }
    else if (dateState.report_type == "inward") {
      return "Inward Report";
    }
    else if(dateState.report_type == "admin-inward") {
        return "Admin Inward Report";
    }
  };

  const handleViewClick = (cell) => {
      console.log("---", cell[0].value);
        history.push("/bilty", { biltyNo: cell[0].value, suffix: cell[1].value});
  }

  return (
    <div className="report-bilty">
      <div className="form-header">{getTitleName()}</div>
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
          <div>
            <label>Stock?</label>
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
              <option value="1" key="1">
                All
              </option>
              <option value="2" key="2">
                In Stock
              </option>
            </select>
          </div>
          {
            dateState["report_type"] == "bilty" && (
              <div>
                <label>Pending Bill?</label>
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
                  value={dateState["pending_bill"]}
                  name="pending_bill"
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
                  <option value="1" key="1">
                    Yes
                  </option>
                  <option value="2" key="2">
                    No
                  </option>
                </select>
              </div>
            )
          }
          {
            (dateState["report_type"] == "inward" || dateState["report_type"] == "admin-inward") && (
              <div>
                <label>Own Branch?</label>
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
                  // disabled={true}
                  value={dateState["own_branch"]}
                  name="own_branch"
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
                  <option value="1" key="1">
                    Own
                  </option>
                  <option value="2" key="2">
                    Other
                  </option>
                </select>
              </div>
            )
          }

        </div>
        
        <div className="chform-row">
          {mrStatementGroupInfo["group-1"].map(function (info) {
            return (
              <div className={info["className"]} key={info["name"]}>
                <label className={info["labelClassName"]}>
                  {info["label"]}:</label>
                  <input
                    size="8"
                    disabled={true}
                    type={info["type"]}
                    value={pageState[info["name"]]}
                  />
                {/* </label> */}
              </div>
            );
          })}
        </div>

        <ReportTable
          columns={columns}
          data={data}
          fetchData={fetchDataDebounced}
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
              let url = SERVER_URL + "/report/";

              if(dateState.report_type == "inward" || dateState["report_type"] == "admin-inward") {
                  url += "inward";
              }

              let resp = await fetch(url, {
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
          {ReportExcel.excel_data(
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

export default BiltyReport;
