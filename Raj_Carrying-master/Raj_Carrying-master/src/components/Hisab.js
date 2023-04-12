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
import LoadingOverlay from "react-loading-overlay";

let ex_data = [];
let ex_data1 = [];

function Hisab({ sessionObject }) {
    const history = useHistory();
    const branchId = sessionObject.sessionVariables.branch_id;
    const columns = React.useMemo(
        () => [
            {
                Header: 'MR Statement No',
                accessor: 'mr_statement_no',
                canFilter: true,
                width: '80px',
                minWidth: '80px'
            },
            {
                Header: 'Mr Date',
                accessor: 'created_date',
                canFilter: true,
                width: '120px',
                minWidth: '120px',
                // Cell: ({ date }) => {
                //     date = date.split("T");
                //     return date[0];
                // },
            },
            {
                Header: 'To Pay',
                accessor: 'to_pay_amount',
                canFilter: true,
                width: '90px',
                minWidth: '90px'
            },
            {
                Header: 'Hamali',
                accessor: 'hamali',
                canFilter: true,
                width: '90px',
                minWidth: '90px'
            },
            {
                Header: 'Service Charge',
                accessor: 'service_charge',
                canFilter: true,
                width: '100px',
                minWidth: '100px'
            },
            {
                Header: 'Demarage Charge',
                accessor: 'demarage_charge',
                canFilter: true,
                width: '120px',
                minWidth: '120px'
            },
            {
                Header: 'Other Charge',
                accessor: 'other_charge',
                canFilter: true,
                width: '100px',
                minWidth: '100px'
            },
            {
                Header: 'Refund',
                accessor: 'refund',
                canFilter: true,
                width: '90px',
                minWidth: '90px'
            },
            {
                Header: 'Total Amount',
                accessor: 'total_amount',
                canFilter: true,
                width: '90px',
                minWidth: '90px'
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
    const download_ref1 = React.useRef(null);
    const sortIdRef = React.useRef(0);
    const [dateState, setDateState] = React.useState({
        date_from: new Date(),
        date_to: new Date(),
        in_stock: "Y",
        // greater_amt: "N"
    });
    const [finalInput, setFinalInput] = React.useState({});

    const [pageState, setPageState] = useState({
        total_amount: 0,
        total_rows: 0,
    })

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    let query = useQuery();

    useEffect(() => {
        const reportType = query.get("report_type");
        console.log("data is : ", { data });
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

                // let response = await fetch(SERVER_URL + "/report/mr_statement", {
                //     method: "POST",
                //     headers: {
                //         Accept: "application/json",
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify(inputData),
                // });
                // let resp = await response.json();
                // console.log("data received: ", resp);


                // if (resp["data"] && "total_rows" in resp) {
                //     // let totalAmt = 0;
                //     // resp["data"].forEach(row => {
                //     //     totalAmt += row.total_amount;
                //     // })
                //     // resp["data"].forEach((row) => {
                //     //     // console.log(row.created_date, row["created_date"].split('T')[0]);
                //     //     row.created_date = row["created_date"].split('T')[0];
                //     // })
                //     setData(resp["data"]);
                //     setPageState({
                //         total_amount: resp.total_amount,
                //         total_rows: resp.total_rows,
                //     })
                //     // setTotalAmount(totalAmt);
                //     setPageCount(Math.ceil(resp["total_rows"] / pageSize));
                // }
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
                <div className="form-header">Hisab</div>
                <LoadingOverlay
                    active={loading}
                    spinner
                    text="Loading your content..."
                    styles={{
                        wrapper: {
                            // width: '400px',
                            // height: '400px',
                            overflow: true ? "hidden" : "scroll",
                        },
                    }}
                ></LoadingOverlay>
                <div className="report-bilty-table-container" style={{ height: "400px" }}>
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
                    <div style={{ display: "none" }}>
                        <ReportTable
                            columns={columns}
                            data={data}
                            fetchData={fetchData}
                            dateObject={dateState}
                            loading={loading}
                            pageCount={pageCount}
                        />
                    </div>
                    <div className="" style={{ marginTop: "20px" }}>
                        <button style={{ display: "none" }}>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="paid_hisab_report_excel"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="Download as XLS"
                                ref={(a) => (download_ref.current = a)}
                            />
                        </button>
                        <button
                            className="download-table-xls-button"

                            style={{ marginRight: "20px" }}
                            onClick={async () => {
                                setLoading(true);
                                let dataToSend = {
                                    date_from: finalInput.date_dict.date_from,
                                    date_to: finalInput.date_dict.date_to,
                                    fyear: finalInput.filter_fields.fyear,
                                    companyId: finalInput.filter_fields.companyId,
                                    created_from: sessionObject.sessionVariables.branch_id,
                                };

                                console.log("data to send in EXCEL:", dataToSend);

                                let resp = await fetch(SERVER_URL + "/paid_statement/paid_hisab", {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(dataToSend),
                                });

                                if (resp.ok) {
                                    let response = await resp.json();
                                    ex_data = response;
                                }

                                setLoading(false);
                                download_ref.current.handleDownload();
                            }}
                        >
                            Paid Hisab
                        </button>
                        <button style={{ display: "none" }}>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button"
                                table="income_hisab_report_excel"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="Download as XLS"
                                ref={(a) => (download_ref1.current = a)}
                            />
                        </button>
                        <button
                            style={{ marginRight: "20px" }}

                            className="download-table-xls-button"
                            onClick={async () => {
                                setLoading(true);
                                
                                let dataToSend = {
                                    date_from: finalInput.date_dict.date_from,
                                    date_to: finalInput.date_dict.date_to,
                                    fyear: finalInput.filter_fields.fyear,
                                    companyId: finalInput.filter_fields.companyId,
                                    created_from: sessionObject.sessionVariables.branch_id,
                                };

                                let resp = await fetch(SERVER_URL + "/mr_statement/income_hisab", {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(dataToSend),
                                });
                                if (resp.ok) {
                                    let response = await resp.json();
                                    ex_data1 = response;
                                }

                                // if (response["data"] && "total_rows" in response) {
                                //     console.log(response["data"], "fsdfafsfds");
                                //     // setData(response["data"]);
                                //     // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                                // }
                                setLoading(false);
                                download_ref1.current.handleDownload();
                            }}
                        >
                            To Pay Hisab
                        </button>

                        <button
                            className="download-table-xls-button"
                            onClick={async () => {
                                setLoading(true);
                                // await new Promise(resolve => setTimeout(resolve, 5000));

                                let dataToSend = {
                                    date_from: finalInput.date_dict.date_from,
                                    date_to: finalInput.date_dict.date_to,
                                    fyear: finalInput.filter_fields.fyear,
                                    companyId: finalInput.filter_fields.companyId,
                                    created_from: sessionObject.sessionVariables.branch_id,
                                    user_id: sessionObject.sessionVariables.user_id,
                                };

                                let resp = await fetch(SERVER_URL + "/mr_statement/income_hisab_entry", {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(dataToSend),
                                });
                                if (resp.ok) {
                                    let response = await resp.json();
                                }

                                // if (response["data"] && "total_rows" in response) {
                                //     console.log(response["data"], "fsdfafsfds");
                                //     // setData(response["data"]);
                                //     // setPageCount(Math.ceil(response["total_rows"] / pageSize));
                                // }
                                setLoading(false);
                            }}
                        >
                            Auto Entry
                        </button>

                        {ReportExcel.excel_income_hisab_report_data(
                            { columns },
                            { ex_data1 },
                            { fetchData },
                            { dateState },
                            { loading },
                            { pageCount },
                            { dateState }
                        )}
                        {ReportExcel.excel_paid_hisab_report_data(
                            { columns },
                            { ex_data },
                            { fetchData },
                            { dateState },
                            { loading },
                            { pageCount },
                            { dateState }
                        )}
                        {/* {ReportExcel.excel_auto_entry_report_data(
                            { columns },
                            { ex_data },
                            { fetchData },
                            { dateState },
                            { loading },
                            { pageCount },
                            { dateState }
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hisab;
