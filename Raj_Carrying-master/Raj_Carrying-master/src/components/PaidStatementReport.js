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

function MrStatementReport({ sessionObject }) {
    const history = useHistory();
    const branchId = sessionObject.sessionVariables.branch_id;
    const columns = React.useMemo(
        () => [
            {
                Header: "Paid Statement No",
                accessor: "paid_statement_no",
                width: "200px",
                minWidth: "200px",
                canFilter: true,
            },
            {
                Header: "Paid Statement Date",
                accessor: "paid_statement_date",
                width: "200px",
                minWidth: "200px",
                canFilter: true,
            },
            {
                Header: "Total Amount",
                accessor: "total_amount",
                width: "200px",
                canFilter: true,
            },
            {
                Header: "Created By",
                accessor: "created_by_name",
                width: "200px",
                canFilter: true,
            },
        ],
        []
    );

    // We'll start our table without any data
    const [data, setData] = React.useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);
    const download_ref = React.useRef(null);
    const sortIdRef = React.useRef(0);
    const [dateState, setDateState] = React.useState({
        date_from: new Date(),
        date_to: new Date(),
        // in_stock: "Y",
        // greater_amt: "N"
    });
    const [finalInput, setFinalInput] = React.useState({});

    const [pageState, setPageState] = useState({
        total_amount: 0,
        total_rows: 0,
    })
    
    // const useQuery = () => {
    //     return new URLSearchParams(useLocation().search);
    // };
    // let query = useQuery();

    useEffect(() => {
        // const reportType = query.get("report_type");
        console.log("data is : ", { data });
        // myForm.setPageStateByField("voucher_type", voucher);
        // setDateState({
        //     ...dateState,
        //     ["report_type"]: reportType,
        // })
    }, []);

    const fetchData = React.useCallback(
        async ({ pageSize, pageIndex, sortBy, customFilters, dateObject }) => {
            // This will get called when the table needs new data
            // You could fetch your data from literally anywhere,
            // even a server. But for this example, we'll just fake it.

            // Give this fetch an ID
            const fetchId = ++fetchIdRef.current;
            // console.log("12323", sortBy, customFilters, fetchId);
            for (let key in customFilters) {
                console.log("Key", customFilters[key].toLowerCase(), key)
                if (customFilters[key].toLowerCase() == "none") {
                    customFilters[key] = null
                }
            }
            // Set the loading state
            setLoading(true);

            if (fetchId === fetchIdRef.current) {
                // console.log("Date state", dateObject);
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
                newObject.created_from = String(branchId);
                // if (dateObject.greater_amt == "Y") {
                //     newObject.greater_amt = String(
                //         1
                //     );
                // }
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


                newObject = { ...newObject, ...customFilters }

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
                // console.log("Data to send: ", inputData);

                let response = await fetch(SERVER_URL + "/report/get_paid_statement", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputData),
                });
                let resp = await response.json();
                console.log("data received: ", resp);


                if (resp["data"] && "total_rows" in resp) {
                    // let totalAmt = 0;
                    // resp["data"].forEach(row => {
                    //     totalAmt += row.total_amount;
                    // })
                    // resp["data"].forEach((row) => {
                    //     // console.log(row.created_date, row["created_date"].split('T')[0]);
                    //     row.created_date = row["created_date"].split('T')[0];
                    // })
                    setData(resp["data"]);
                    setPageState({
                        total_amount: resp.total_amount,
                        total_rows: resp.total_rows,
                    })
                    // setTotalAmount(totalAmt);
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
          history.push("/mr", cell[0].value);
    }

    return (
        <div className="page-marfatiya-wise">
            <div className="report-bilty">
                <div className="form-header">Paid Statement Report</div>
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
                    <div className="chform-row">
                        <div className="form-row-m">
                            <label className="form-label-w">Total Paid Statement: </label>
                            <input disabled={true} value={pageState.total_rows} />
                        </div>
                        <div className="form-row-m">
                            <label className="form-label-w">Total Amount: </label>
                            <input disabled={true} value={pageState.total_amount} />
                        </div>
                    </div>
                    <ReportTable
                        columns={columns}
                        data={data}
                        fetchData={fetchData}
                        dateObject={dateState}
                        loading={loading}
                        pageCount={pageCount}
                    />
                    <div className="form-footer">
                        <button style={{ display: "none" }}>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="paid_statement_report_excel"
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
                                    sort_fields: finalInput.sort_fields,
                                };

                                console.log("data to send in EXCEL:", dataToSend);

                                let resp = await fetch(SERVER_URL + "/report/get_paid_statement", {
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
                        {ReportExcel.excel_paid_statement_report_data(
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
        </div>
    );
}

export default MrStatementReport;
