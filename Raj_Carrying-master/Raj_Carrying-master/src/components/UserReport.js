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

function UserReport({ sessionObject }) {
    const history = useHistory();
    const branchId = sessionObject.sessionVariables.branch_id;
    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                canFilter: true,
                width: '120px',
                minWidth: '120px'
            },
            {
                Header: 'Password',
                accessor: 'password',
                canFilter: true,
                width: '150px',
                minWidth: '150px'
            },
            {
                Header: 'Role',
                accessor: 'role',
                canFilter: true,
                width: '200px',
                minWidth: '200px'
            },
            {
                Header: 'Mail',
                accessor: 'mail',
                canFilter: true,
                width: '150px',
                minWidth: '150px'
            },
            {
                Header: 'Mail Password',
                accessor: 'mail_password',
                canFilter: true,
                width: '120px',
                minWidth: '120px'
            },
            {
                Header: 'Branch',
                accessor: 'branch_info',
                canFilter: false,
                width: '220px',
                minWidth: '220px'
            },
            {
                Header: 'Admin',
                accessor: 'is_admin',
                canFilter: true,
                width: '60px',
                minWidth: '60px'
            },
            {
                Header: 'Active',
                accessor: 'is_active',
                canFilter: true,
                width: '60px',
                minWidth: '60px'
            },
            {
                Header: 'Mobile No',
                accessor: 'mobile_no',
                canFilter: true,
                width: '120px',
                minWidth: '120px'
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
        in_stock: "Y",
        // greater_amt: "N"
    });
    const [finalInput, setFinalInput] = React.useState({});
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
                // newObject.created_from = String(branchId);
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
                    // date_dict: {
                    //     date_from: dateObject.date_from,
                    //     date_to: dateObject.date_to,
                    // },
                };

                setFinalInput(inputData);
                // console.log("Data to send: ", inputData);

                let response = await fetch(SERVER_URL + "/report/user", {
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
                    resp["data"].forEach((row) => {
                        row.is_active = row.is_active ? 1 : 0;
                        row.is_admin = row.is_admin ? 1 : 0;
                    })

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
          history.push("/mr", cell[0].value);
    }

    return (
        <div className="page-marfatiya-wise">
            <div className="report-bilty">
                <div className="form-header">User Report</div>
                <div className="report-bilty-table-container">
                    <ReportTable
                        columns={columns}
                        data={data}
                        fetchData={fetchData}
                        dateObject={dateState}
                        loading={loading}
                        pageCount={pageCount}
                    />
                    {/* <div className="form-footer">
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

                                console.log("data to send in EXCEL:", dataToSend);

                                let resp = await fetch(SERVER_URL + "/report/user", {
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
                        {ReportExcel.excel_mr_data(
                            { columns },
                            { ex_data },
                            { fetchData },
                            { dateState },
                            { loading },
                            { pageCount },
                            { dateState }
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default UserReport;
