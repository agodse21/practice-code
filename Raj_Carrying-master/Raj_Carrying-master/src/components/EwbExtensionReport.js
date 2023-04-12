import React, { useEffect } from "react";
import { SERVER_URL } from "../config/config.js";
import "./biltyReport.css";
import ReportTable from "./ReportTable";
import Popup from 'reactjs-popup';


function EwbExtensionReport({ sessionObject }) {

    
    const [checkedList, setCheckedList] = React.useState([]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Eway Bill No",
        accessor: "eway_bill_no",
        width: "130px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Eway Bill Date",
        accessor: "date",
        width: "100px",
        minWidth: "50px",
        canFilter: true,
      },
      {
        Header: "Error",
        accessor: "error",
        width: "120px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Eway Bill Amount",
        accessor: "amount",
        width: "120px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Extended Times",
        accessor: "extended_times",
        width: "50px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: " Bilty No",
        accessor: "bilty_no",
        width: "100px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "120px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "From Station",
        accessor: "from_station",
        width: "125px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "To Station",
        accessor: "to_station",
        width: "125px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Consignor Party",
        accessor: "consignor_name",
        width: "150px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Consignee Party",
        accessor: "consignee_name",
        width: "150px",
        minWidth: "10px",
        canFilter: true,
      },
      {
        Header: "Truck No",
        accessor: "vehicle_no",
        width: "120px",
        minWidth: "10px",
        canFilter: true,
      },
      // {
      //   Header: "Cewb No",
      //   accessor: "cewb_no",
      //   canFilter: true,
      // },
    ],
    []
  );

  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [isStop, setIsStop] = React.useState(false);
  const [popupPassword, setPopupPassword] = React.useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [responseFromServer, setResponseFromServer] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const fetchIdRef = React.useRef(0);
  const sortIdRef = React.useRef(0);

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, sortBy, customFilters }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;
      console.log("12323", sortBy, customFilters, fetchId);
      // Set the loading state
      setLoading(true);

      if (fetchId === fetchIdRef.current) {
        // customFilters.created_from = String(
        //   sessionObject.sessionVariables.branch_id
        // );
        let response = await fetch(SERVER_URL + "/report/eway_bill_extension", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paginate: { number_of_rows: pageSize, page_number: pageIndex + 1 },
            sort_fields: sortBy,
            filter_fields: customFilters,
          }),
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

  const handleCheckboxChange = (row) => {
    const val = row[0].value;
    const ind = checkedList.indexOf(val);
    let tempChecked = [...checkedList];
    if(ind > -1) {
        tempChecked.splice(ind, 1);
    }
    else {
        tempChecked.push(val);
    }
    setCheckedList(tempChecked);
  }

  const handleSelectAll = () => {
      let tempChecked = [];
      data.forEach((row) => {
          tempChecked.push(row.eway_bill_no);
      })
      setCheckedList(tempChecked);
  }

  const handleDeselectAll = () => {
      setCheckedList([]);
  }

  const getSelectAllValue = () => {
      const isAllSelected = checkedList.length == data.length;
      return isAllSelected;
  }

  const isChecked = (row) => {
      const val = row[0].value;
      return (checkedList.indexOf(val) > -1);
  }

  const handleStopClick = async () => {
      const url = SERVER_URL + "/ewb/remove_godown_entry"

      const dataToSend = checkedList;

      const resp = await fetch(url, {
          method: "POST",
          headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      
      if(!resp.ok) {
        setResponseFromServer({
            flag: 0,
            details: "Something went wrong",
        })
        return;
      }

      const respDetails = await resp.json();
    //   console.log(respDetails);
      setSubmitted(true);
      setResponseFromServer(respDetails);
  }

  useEffect(() => {
      console.log(responseFromServer);
  })

  return (
    <div className="report-bilty">
      <div className="form-header">Ewb Extension Report</div>
      <div>
            <Popup
                open={isStop}
                modal
                closeOnDocumentClick={false}
            >
                 {(close) => (
              <div className="pop-up-container">
                <div className="pop-up-header">Are you sure want to delete?</div>
                <div className='pop-up-fields'>
                    <div className='pop-up-field'>
                        <div className="pop-up-field-value">({checkedList.length} entries will be affected) </div>
                    </div>
                    <br/>
                    <div className='pop-up-field'>
                        <div className="pop-up-field-label">Password: </div>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={popupPassword}
                            onChange={(e) => {
                                setPopupPassword(e.target.value)
                            }}
                            onKeyPress={(e) => {
                                if(e.key == "Enter") {
                                    if(popupPassword.toLowerCase() === "stop5661") {
                                        setIsPasswordCorrect(true);
                                    }
                                }
                                // if(e.key == "Enter") {
                                //     const url = SERVER_URL + "/login/access-token";
                                //     const dataToSend = {
                                //         username: sessionObject.sessionVariables.user_name,
                                //         password: popupPassword,
                                //     }

                                //     const resp = await fetch(url, {
                                //         method: "POST",
                                //         headers: {
                                //             Accept: "application/json",
                                //             "Content-Type": "application/x-www-form-urlencoded",
                                //         },
                                //         body: new URLSearchParams(dataToSend),
                                //         // body: JSON.stringify(dataToSend),
                                //     })

                                //     if(resp.ok) {
                                //         const loginData = await resp.json();
                                //         if("access_token" in loginData) {
                                //             setIsPasswordCorrect(true);
                                //             document.getElementById("yes_button").focus();
                                //         }
                                //     }
                                // }
                            }}
                        />
                    </div>
                </div>
                <div className="pop-up-actions">
                  <button
                    className="pop-up-button"
                    id="yes_button"
                    onClick={() => {
                        handleStopClick();
                        setIsStop(false);
                        setIsPasswordCorrect(false);
                        setPopupPassword("");
                        close();
                    }}
                    disabled={!isPasswordCorrect}
                  >
                    Yes
                  </button>
                  <button
                    className="pop-up-button"
                    // autoFocus={true}
                    id="no_button"
                    onClick={() => {
                      setIsStop(false);
                      setIsPasswordCorrect(false);
                      setPopupPassword("");
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

      <div>
                <Popup
                    open={submitted}
                    modal
                    closeOnDocumentClick={false}
                >
                    {(close) => (
                        <div className="pop-up-container">
                            <div className="pop-up-header">
                                {responseFromServer.flag == 1 ?
                                    <div> Success :) </div>
                                    : <div> Failed ): </div>
                                }
                                <div>
                                    <a className="pop-up-close btn" onClick={() => {
                                        close();
                                        window.location.reload();
                                    }}>
                                        &times;
                                    </a>
                                </div>
                            </div>
                            <div className='pop-up-fields'>
                                {
                                    Object.keys(responseFromServer).map(key => {
                                        return (
                                            key == "flag" ? <div /> :
                                            <div className='pop-up-field'>
                                                <div className="pop-up-field-label">{key} : </div>
                                                <div className="pop-up-field-value">
                                                    {responseFromServer[key]}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            
                            <div className="pop-up-actions">
                                <button
                                    className="pop-up-button"
                                    onClick={() => {
                                        // setSubmitted(false);
                                        // setResponseFromServer({});
                                        close();
                                        window.location.reload();
                                    }}
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>

      <div className="report-bilty-table-container">
        <ReportTable
          checkbox={true}
          handleCheckboxChange={handleCheckboxChange}
          checkedList={checkedList}
          columns={columns}
          data={data}
          fetchData={fetchData}
          loading={loading}
          pageCount={pageCount}
          isChecked={isChecked}
          getSelectAllValue={getSelectAllValue}
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
        />
        <div className="form-footer">
            <button onClick={() => setIsStop(true)}>
                Stop
            </button>
        </div> 
      </div> 
    </div>
  );
}

export default EwbExtensionReport;
