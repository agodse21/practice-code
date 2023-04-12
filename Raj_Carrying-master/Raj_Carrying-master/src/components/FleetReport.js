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
import Autosuggest from "react-autosuggest";
import {
    groupInfo,
    dataObject,
    challanBiltyOriginalTableHeader,
    challanBiltyOriginalTableItems,
    validate,
    popupInfo,
    stationFromFieldInfo,
    tripItemHeaders,
    tripItems,
    formatDate,
} from "../config/fleetManagementConfig.js";
import { fleetApiConfig } from "../config/apiConfig.js";
import useForm from "./useForm";



let ex_data = [];

function FleetReport({ sessionObject }) {
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

    const myForm = useForm(
        "FleetManagementReport",
        () => { },
        {
            vehicle_no: "",
            vehicle_id: "",
            date_from: formatDate(new Date()),
            date_to: formatDate(new Date()),
            company_id: sessionObject.sessionVariables.company_id ?? "1",
        },
        fleetApiConfig
    );

    useEffect(() => {
        console.log(myForm.pageState);
    })

    const vehicleFieldInfo = {
        label: "Vehicle No.",
        className: "form-row",
        labelClassName: "form-label",
        inputClassName: "form-input",
        name: "vehicle_no",
        type: "text",
        placeHolder: "1234",
        apiConfigKey: "getVehicleSuggestions",
        url: SERVER_URL + "/vehicle/",
        suggestionKeyword: "vehicle_no",
        suggestionKeywordForFetchApiArgs: "vehicle_no",
        suggestionChooseQueryKeyword: "vehicle_no",
        apiCallRequiredOnGetValue: true,
        suggestionSchema: {
            vehicle_no: "vehicle_no",
            vehicle_id: "vehicle_id",
            owner_name: "driver_name",
        },
        keyboardNavigationMap: {
            Enter: "date_from",
        },
        // toValidate: true,
        // idClearanceNeeded: "vehicle_id",
    };

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
        // vehicle_no: "",
        // vehicle_id: "",
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
            for (let key in customFilters) {
                console.log("Key", customFilters[key].toLowerCase(), key)
                if (customFilters[key].toLowerCase() == "none") {
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
            <div className="form-header">Fleet Report</div>
            <div className="report-bilty-table-container">
                <div className="report-field-row ">
                    <div className="form-row">
                        <label className="form-label">Vehicle No: </label>
                        <Autosuggest
                            id={vehicleFieldInfo["name"]}
                            suggestions={myForm.suggestions}
                            // onSuggestionsFetchRequested={(a) =>
                            //   myForm.onSuggestionsFetchRequested(a, (b) =>
                            //     myForm.suggestionFetchApi(vehicleFieldInfo, b)
                            //   )
                            // }
                            onSuggestionsFetchRequested={(a) =>
                                myForm.onSuggestionsFetchRequestedDebounced(
                                    a,
                                    (b) =>
                                        myForm.suggestionFetchApi(
                                            vehicleFieldInfo,
                                            b,
                                            // getAdditionalInfoForSuggestionFetch(vehicleFieldInfo)
                                        )
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                myForm.onSuggestionsClearRequested(vehicleFieldInfo)
                            }
                            getSuggestionValue={(suggestion) =>
                                suggestion[vehicleFieldInfo.suggestionKeyword]
                            }
                            onSuggestionSelected={(a, b) =>
                                myForm.getSuggestionValue(
                                    b.suggestion,
                                    vehicleFieldInfo,
                                    myForm.performSuggestions,
                                    myForm.updatePageStateForGetSuggestion
                                )
                            }
                            renderSuggestion={(a) =>
                                myForm.renderSuggestion(a, vehicleFieldInfo)
                            }
                            highlightFirstSuggestion={true}
                            ref={(a) => myForm.storeInputReference(a, false)}
                            inputProps={{
                                autoFocus: "true",
                                //placeholder: partyGstFieldInfo["name"],
                                value: String(myForm.pageState[vehicleFieldInfo["name"]]),
                                onChange: (a, b) => {
                                    myForm.onChangeAutoSuggest(a, b, vehicleFieldInfo);
                                },
                                onBlur: () => {
                                    vehicleFieldInfo["toValidate"]
                                        ? myForm.onblurValidator(vehicleFieldInfo)
                                        : {};
                                },
                                onKeyPress: (a) =>
                                    myForm.onKeyPressForKeyNav(a, vehicleFieldInfo),
                                // disabled: checkDisabledCondition(vehicleFieldInfo),
                            }}
                        />
                    </div>
                    <div>
                        <label className="form-label">From Date: </label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="date_from"
                            placeholder=""
                            value={myForm.pageState.date_from}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "date_from")}
                            // disabled={checkDisabledCondition({ name: "date_from" })}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    myForm.makeFocusOnParticularField("date_to");
                                }
                            }}
                        />
                    </div>

                    <div>
                    <label className="form-label">To Date: </label>
                        <input
                            className="form-input-mr-statement-date"
                            type="date"
                            name="date_to"
                            placeholder=""
                            value={myForm.pageState.date_to}
                            onChange={myForm.handleChange}
                            ref={(a) => myForm.storeInputReferenceForSelect(a, "date_to")}
                            onKeyPress={(e) => {
                                if (e.key == "Enter") {
                                    myForm.makeFocusOnParticularField("save_button");
                                }
                            }}
                        />
                    </div>
                </div>
                {/* <ReportTable
                    columns={columns}
                    data={data}
                    fetchData={fetchData}
                    dateObject={dateState}
                    loading={loading}
                    pageCount={pageCount}
                    canView={true}
                    handleViewClick={handleViewClick}
                /> */}
                <div className="form-footer" style={{marginTop: "20px"}}>
                    <button style={{ display: "none" }}>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="vehicle_fleet_report_excel"
                            filename="tablexls"
                            sheet="tablexls"
                            buttonText="Download as XLS"
                            ref={(a) => (download_ref.current = a)}
                        />
                    </button>
                    <button
                        className="download-table-xls-button"
                        ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
                        onClick={async () => {
                            setLoading(true);
                            const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
                            let dataToSend = {
                                date_from: myForm.pageState.date_from,
                                date_to: myForm.pageState.date_to,
                                vehicle_id: myForm.pageState.vehicle_id,
                                fyear: fYear_fetch,
                                companyId: myForm.pageState.company_id,
                            };
                            let resp = await fetch(SERVER_URL + "/fleet_master/vehicle_report", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(dataToSend),
                            });
                            let response = await resp.json();

                            console.log({response});
                            ex_data = response;

                            setLoading(false);
                            download_ref.current.handleDownload();
                        }}
                    >
                        Download as XLS
                    </button>
                    {ReportExcel.fleet_vehicle_trip_data(
                        { columns },
                        { ex_data },
                        { fetchData },
                        { dateState },
                        { loading },
                        { pageCount },
                        { dateState },
                        { pageState: myForm.pageState}
                    )}
                </div>
            </div>
        </div>
    );
}

export default FleetReport;
