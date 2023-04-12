import React from "react";
import { SERVER_URL } from "../config/config.js";
import "./challanReport.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReportTable from "./ReportTable";
import {
    challanReportGroupInfo,
    challanReporttDataObject,
} from "../config/challanReport.js";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReportExcel from "./ReportExcel.js";
import {  useHistory } from "react-router-dom";


let excelData = [];

function ChallanReport({ sessionObject }) {
    const history = useHistory();
    // let download_ref;
    const columns = React.useMemo(
        () => [
            {
                Header: "Challan No",
                accessor: "booking_chalan_no",
                width: "100px",
                minWidth: "10px",
                canFilter: true,
            },
            {
                Header: "Challan Date",
                accessor: "booking_chalan_date",
                width: "100px",
                minWidth: "10px",
                Cell: ({ value }) => {
                    value = value.split("T");
                    return value[0];
                },
                canFilter: true,
            },
            {
                Header: "Vehicle No",
                accessor: "vehicle_no",
                canFilter: true,
            },
            {
                Header: "Station From",
                accessor: "station_from_name",
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
            //   canFilter: true,
            // },
            // {
            //   Header: "Distance",
            //   accessor: "distance",
            //   canFilter: true,
            // },
            {
                Header: "No Of Pkgs",
                accessor: "no_of_pkgs",
                canFilter: true,
            },
            {
                Header: "Total Weight",
                accessor: "total_weight",
                canFilter: true,
            },
            {
                Header: "To Pay",
                accessor: "to_pay",
                canFilter: true,
            },
            {
                Header: "Paid",
                accessor: "paid",
                canFilter: true,
            },
            {
                Header: "CEWB No.",
                accessor: "cewb_no",
                canFilter: true,
            },
            {
                Header: "Inwarded",
                accessor: "inwarded",
                canFilter: true,
            },
            {
                Header: "Created By",
                accessor: "created_by_name",
                width: "140px",
                canFilter: true,
            },
            // {
            //   Header: "Deleted",
            //   accessor: "deleted",
            //   canFilter: true,
            // },
        ],
        []
    );

    // We'll start our table without any data
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
    const fetchIdRef = React.useRef(0);
    let download_ref = React.useRef(null);
    const sortIdRef = React.useRef(0);
    const [dateState, setDateState] = React.useState({
        date_from: new Date(),
        date_to: new Date(),
        pending_trip: "2"
    });
    const [finalInput, setFinalInput] = React.useState({});
    const [pageState, setPageState] = React.useState({
        total_amount: 0,
        total_weight: 0,
        total_pkgs: 0,
        total_bilties: 0,
    });

    const fetchData = React.useCallback(
        async ({ pageSize, pageIndex, sortBy, customFilters, dateObject }) => {
            // This will get called when the table needs new data
            // You could fetch your data from literally anywhere,
            // even a server. But for this example, we'll just fake it.

            // Give this fetch an ID
            const fetchId = ++fetchIdRef.current;
            console.log("12323", sortBy, customFilters, fetchId);
            // Set the loading state
            setLoading(true);

            let newObject = {}
            if (fetchId === fetchIdRef.current) {
                customFilters.created_from = String(
                    sessionObject.sessionVariables.branch_id
                );

                if (dateObject.pending_trip == "1") {
                    newObject.pending_trip = String(
                        1
                    );
                }

                newObject = { ...newObject, ...customFilters }

                let inputData = {
                    sort_fields: sortBy,
                    filter_fields: newObject,
                    date_dict: {
                        date_from: dateObject.date_from,
                        date_to: dateObject.date_to,
                    },
                };

                console.log("data to send : ", inputData);

                setFinalInput(inputData);
                let response = await fetch(SERVER_URL + "/report/challan", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inputData),
                });
                let resp = await response.json();
                console.log(resp);
                let setObj = {}
                if (fetchId == fetchIdRef.current) {
                    if (resp["data"] && "total_rows" in resp) {
                        setData(resp["data"]);
                        setPageCount(Math.ceil(resp["total_rows"] / pageSize));
                        setObj = {
                            total_weight: resp['total_weight'],
                            total_pkgs: resp['total_pkgs'],
                            total_memo: resp['total_rows']
                        }
                        setPageState({ ...pageState, ...setObj })
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

    const handleViewClick = (cell) => {
        console.log("---", cell[0].value);
          history.push("/challan", cell[0].value);
        //   history.push("/challan", 40001);
    }

    return (
        <div className="report-challan">
            <div className="form-header">Challan Report</div>

            <div className="report-challan-table-container">

                <div className="report-field-row">
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
                        <label>Pending Bhada Chitthi?</label>
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
                            value={dateState["pending_trip"]}
                            name="pending_trip"
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
                </div>

                <div className="chform-row">
                    {challanReportGroupInfo["group-1"].map(function (info) {
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
                    fetchData={fetchData}
                    dateObject={dateState}
                    loading={loading}
                    pageCount={pageCount}
                    canView={true}
                    handleViewClick={handleViewClick}
                />
            </div>
            <div className="form-footer">
                <button style={{ display: "none" }}>
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button"
                        table="challan_report_excel"
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
                        console.log("pagestate issss : ", data, dateState);
                        console.log(finalInput);

                        let inputData = {
                            sort_fields: finalInput.sort_fields,
                            filter_fields: finalInput.filter_fields,
                            date_dict: finalInput.date_dict,
                        };

                        console.log("data to send : ", inputData);

                        let response = await fetch(SERVER_URL + "/report/challan", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(inputData),
                        });

                        let resp = await response.json();
                        console.log(resp);

                        excelData = resp.data;
                        setLoading(false);
                        download_ref.current.handleDownload();
                    }}
                >
                    Download as XLS
                </button>
                {ReportExcel.challan_report_excel(excelData, dateState)}
            </div>
        </div>
    );
}

export default ChallanReport;
