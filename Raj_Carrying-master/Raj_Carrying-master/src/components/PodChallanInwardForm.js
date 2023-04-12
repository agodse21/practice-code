import React from "react";
// import DynamicTable from "./DynamicTable";
import Popup from "reactjs-popup";
import DynamicViewTable from "./DynamicViewTable";
import "./Form.css";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { podChallanInwardApiConfig } from "../config/apiConfig.js";
import {
  ChallanInwardDataObject,
  challanInwardValidate,
  challanTableHeader,
  challanTableItems,
} from "../config/podChallanInwardForm.js";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanInwardForm.js";
import { SERVER_URL, USE_OVERLAY } from "../config/config";
import DatePicker from "react-datepicker";
import LoadingOverlay from "react-loading-overlay";

import "./PodChallanInwardForm.css";

import {
  useTable,
  usePagination,
  useGlobalFilter,
  useFilters,
} from "react-table";
// import "react-table/react-table.css";

import { matchSorter } from "match-sorter";

import makeData from "../config/makeData";
import { date } from "yup/lib/locale";

const lodash = require("lodash");

const PodChallanInwardForm = ({ sessionObject }) => {
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
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
  };

  const myForm = useForm(
    "PodChallanInward",
    challanInwardValidate,
    { ...ChallanInwardDataObject, ...variablesFromSession },
    podChallanInwardApiConfig
  );

  const linkBilty = async (e) => {
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    if (!myForm.pageState.pod_challan_no) {
      return;
    }
    if (e.key == "Enter") {
      myForm.refStoreObject.current.pod_challan_no.blur();
      myForm.setOverlay(true);
      // TODO: hit api here, changes for bilty_info
      const url =
        SERVER_URL +
        "/pod/all_info/" +
        String(myForm.pageState.pod_challan_no) +
        "?branch_id=" +
        myForm.pageState.created_from + 
        "&companyId=" + myForm.pageState.company_id + 
        "&fyear=" + fYear_fetch;

      const response = await fetch(url);

      myForm.setOverlay(false);

      if (!response.ok) {
        myForm.setPageState({
          ...myForm.pageState,
          ["pod_challan_no"]: "Invalid Pod",
        });
        return;
      }
      const temp_response = await response.json();
      console.log("Temp response", temp_response);
      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["pod_challan_no"]: "Not possible to add this bilty",
        });
        return;
      }
      console.log("oopsy", temp_response);
      myForm.setPageState({
        ...myForm.pageState,
        ...temp_response,
      });
    }
  };

  const inwardTrip = async (e) => {
    const url = SERVER_URL + "/pod/inward/";
    const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pod_chalan_nos: [myForm.pageState.pod_challan_no],
        removed_bilty_ids: myForm.pageState.removed_bilty_ids,
        inward_date: myForm.pageState.input_date,
        fyear: fYear_fetch,
        companyId: myForm.pageState.company_id,
      }),
    });

    if (!response.ok) {
      myForm.setPageMode("error");
      myForm.setPopupError("Issue in Challan inward");
      return;
    }
    myForm.setPageMode("submitted");
  };

  const checkVisibilityCondition = (fieldInfo) => {
    if (fieldInfo.name == "edit_button") {
      return false;
    } else if (fieldInfo.name == "delete_button") {
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
    const url =
      SERVER_URL + "/challan/?booking_chalan_no=" + myForm.pageState.challan_no;
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
    }
  };

  const deleteEntryFromTableCallback = (infoObject) => {
    console.log("Info objecyt", infoObject);
    let biltyObj = myForm.pageState.trip_info[infoObject.idx];
    let biltyId = biltyObj.bilty_id;
    console.log("Bilty objecy", biltyObj);
    let newState = {};

    newState.trip_info = infoObject.rows;
    newState.removed_bilty_ids = [
      ...myForm.pageState.removed_bilty_ids,
      biltyId,
    ];

    console.log("New state", newState);
    myForm.setPageState({
      ...myForm.pageState,
      ...newState,
    });
  };

  return (
    <div className="mr-form-container">
      {
        USE_OVERLAY && (
          <LoadingOverlay
          active={myForm.overlay}
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
        )
      }
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
                  <div>Trip Saving Successful </div>
                ) : (
                  <div>Error In POD Challan Inward Module </div>
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
                  Pod Challan Inward is successfully created
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
                  Error in POD Inward module with the following info:-
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
                        ...ChallanInwardDataObject,
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
      <div className="form-header">Pod Challan Inward</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Pod Challan No:</label>
            <input
              className="form-input"
              type="text"
              name="pod_challan_no"
              placeholder=""
              value={myForm.pageState.pod_challan_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={linkBilty}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "pod_challan_no")
              }
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
            Pod Challan Inward Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
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
            />
          </div>
        </div>

        <div className="multi-table-container">
          <div className="small-table-container">
            <DynamicViewTable
              tableHeader={challanTableHeader}
              tableItems={challanTableItems}
              tableValues={myForm.pageState["pod_info_list"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["pod_info_list"]}
              // deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="pod_info_list"
            />
          </div>
          <div className="table-container">
            <DynamicViewTable
              tableHeader={challanBiltyTableHeader}
              tableItems={challanBiltyTableItems}
              tableValues={myForm.pageState["pod_info"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["pod_info"]}
              deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="pod_info"
            />
          </div>
        </div>

        <div className="form-footer">
        {checkVisibilityCondition({ name: "inward_button" }) ? (
              <button onClick={inwardTrip}>Inward</button>
            ) : (
              <button
                onClick={() => {
                  myForm.setPageState({
                    ...ChallanInwardDataObject,
                    ...variablesFromSession,
                  });
                  window.location.reload();
                  myForm.setPageMode("write");
                }}
              >
                Clear
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <span>
      Search:{" "}
      <input
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      className="form-control"
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,

    // Pagination Props
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },

    // Search / Filtering Props
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageindex: 2 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  // Render the UI for your table
  return (
    <React.Fragment>
      {/* <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      /> */}
      <table {...getTableProps()} className="table mt-4 mb-3">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{ verticalAlign: "middle" }}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
	        Pagination can be built however you'd like. 
	        This is just a very basic UI implementation:
	      */}
      <div className="float-right mb-3">
        <select
          style={{
            padding: "7px",
            borderRadius: "3px",
            border: "1px solid #007bff",
          }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>{" "}
        <button
          className="btn btn-outline-primary"
          style={{ marginTop: "-4px" }}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button
          className="btn btn-outline-primary"
          style={{ marginTop: "-4px" }}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          className="btn btn-outline-primary"
          style={{ marginTop: "-4px" }}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>{" "}
        <button
          className="btn btn-outline-primary"
          style={{ marginTop: "-4px" }}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </React.Fragment>
  );
}

function ChallanTable({ challanTripData, intakeCallback }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Challan No.",
        accessor: "booking_chalan_no",
        // disableFilters: true
      },
      {
        Header: "Station From",
        accessor: "station_from_name",
      },

      {
        Header: "Station To",
        accessor: "station_to_name",
      },
      {
        Header: "Take Inward",
        accessor: "is_inwarded_button",
      },
      // {
      //   Header: "Status",
      //   accessor: "status"
      // },
      // {
      //   Header: "Profile Progress",
      //   accessor: "progress"
      // }
    ],
    []
  );

  const convertChallanData = (inputData) => {
    let dummyObject = lodash.cloneDeep(inputData);

    for (let i = 0; i < dummyObject.length; i++) {
      if (
        dummyObject[i].is_inwarded == 0 ||
        dummyObject[i].is_inwarded == "0" ||
        dummyObject[i].is_inwarded == null
      ) {
        dummyObject[i].is_inwarded_button = (
          <button
            value="Intake"
            id={dummyObject[i].booking_chalan_no}
            onClick={() => intakeCallback(dummyObject[i].booking_chalan_no, i)}
          >
            Inward
          </button>
        );
      } else {
        dummyObject[i].is_inwarded_button = <label>Inward Done</label>;
      }
    }
    return dummyObject;
  };

  return (
    <React.Fragment>
      <Table columns={columns} data={convertChallanData(challanTripData)} />
    </React.Fragment>
  );
}

export default PodChallanInwardForm;
