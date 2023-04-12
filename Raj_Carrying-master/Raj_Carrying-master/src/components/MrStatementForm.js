import React from "react";
// import DynamicTable from "./DynamicTable";
import Popup from "reactjs-popup";
import DynamicViewTable from "./DynamicViewTable";
import "./Form.css";
import { Prompt } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import "./AutoSuggest.css";
import useForm from "./useForm";
import { mrStatementApiConfig } from "../config/apiConfig.js";
import {
  mrStatementGroupInfo,
  mrStatementDataObject,
  mrStatementValidate,
  mrStatementTableHeader,
  mrStatementTableItems,
} from "../config/mrStatementForm.js";
import {
  challanBiltyTableItems,
  challanBiltyTableHeader,
} from "../config/challanForm.js";
import { SERVER_URL } from "../config/config";
import DatePicker from "react-datepicker";

import "./ChallanInwardForm.css";

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

const MrStatementForm = ({ sessionObject }) => {
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
    role_id: String(sessionObject.sessionVariables.role_id),
    company_id: sessionObject.sessionVariables.company_id ?? "1",
    fYear: sessionObject.sessionVariables.financial_year,
};

  const myForm = useForm(
    "MrStatement",
    mrStatementValidate,
    { ...mrStatementDataObject, ...variablesFromSession },
    mrStatementApiConfig
  );

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const linkBilty = async (e) => {
    if (e.key == "Enter") {
        const fYear_fetch = JSON.parse(sessionStorage.getItem("financial_year_for_fetch")).financial_year_for_fetch;

      let clear_flag = 0;
      let temp_response = null;
      if (e.target.name == "mr_statement_no") {
        // TODO: hit api here, changes for bilty_info
        if (myForm.pageState.mr_statement_no == "") {
          myForm.makeFocusOnParticularField("input_date");
          return;
        }
        let url =
          SERVER_URL +
          "/mr_statement/date/?mr_statement_no=" +
          myForm.pageState.mr_statement_no +
          "&branch_id=" +
          myForm.pageState.created_from;

        url += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

        const response = await fetch(url);
        if (!response.ok) {
          myForm.setPageState({
            ...myForm.pageState,
            ["mr_statement_no"]: "Invalid Statement No",
          });
          return;
        }
        temp_response = await response.json();
        myForm.pageState.id = temp_response['id']
      } else {
        // TODO: hit api here, changes for bilty_info
        if (myForm.pageState.input_date == "") {
          myForm.makeFocusOnParticularField("save_button");
          return;
        }
        let url =
          SERVER_URL +
          "/mr_statement/date/?date=" +
          myForm.pageState.input_date +
          "&branch_id=" +
          myForm.pageState.created_from;

          url += "&fyear=" + fYear_fetch + "&companyId=" + myForm.pageState.company_id;

        const response = await fetch(url);

        if (!response.ok) {
          myForm.setPageState({
            ...myForm.pageState,
            ["input_date"]: "Invalid Date",
          });
          return;
        }
        temp_response = await response.json();
        if (response.ok && temp_response['mr_statement_no'] == null){
          clear_flag = 1
        }
      }

      if (temp_response.check_fail) {
        myForm.setPageState({
          ...myForm.pageState,
          ["mr_statement_no"]: "Not possible to add this mr",
        });
        return;
      }

      let total_mrs = 0;
      let total_amounts = 0;
      for (let mrs in temp_response["mr_info_list"]) {
        total_mrs += 1;

        if (
          temp_response["mr_info_list"][mrs].total_amount != "" &&
          temp_response["mr_info_list"][mrs].total_amount != null
        ) {
          total_amounts += parseInt(
            temp_response["mr_info_list"][mrs].total_amount
          );
        }
      }
      let mr_count = total_mrs;
      let total_amount = total_amounts;
      let newState = {
        mr_info_list: temp_response["mr_info_list"],
        mr_count: mr_count,
        total_amount: total_amount,
      };

      if ("created_date" in temp_response) {
        newState.input_date = formatDate(new Date(temp_response.created_date));
      }
      if ("mr_statement_no" in temp_response) {
        newState.mr_statement_no = temp_response.mr_statement_no;
      }
      if (clear_flag == 1){
        newState.mr_statement_no = ''
      }

      newState.fYear_get = temp_response.fyear;
      myForm.setPageState({
        ...myForm.pageState,
        ...newState,
      });
      myForm.setPageMode("view");

      // myForm.setPageState({
      //   ...myForm.pageState,
      //   ...temp_response,
      // });
    }
  };

  const inwardTrip = async (e) => {
    let url = SERVER_URL + "/challan/inward/";
    url += "?fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;

    let response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking_challan_nos: [myForm.pageState.mr_statement_no],
        removed_mr_ids: myForm.pageState.removed_mr_ids,
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
    }
    // else if (fieldInfo.name == "save_button" && myForm.pageMode == "view"){
    //   console.log("DONEEEE")
    //   return false;
    // }
    else if (fieldInfo.name == "delete_button" &&
    myForm.pageState.role_id != "1") {
      return false;
    } else if (fieldInfo.name == "save_button" && myForm.pageMode == "write") {
      return false;
    } else if (fieldInfo.name == "print_button" && myForm.pageMode == "write") {
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

  const handleDelete = async () => {
    let url =
      SERVER_URL + "/mr_statement/?mr_statement_id=" + myForm.pageState.id;
    url += "&fyear=" + myForm.pageState.fYear_get + "&companyId=" + myForm.pageState.company_id;

    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.log("Not able to delete challan");
      return;
    }
    const temp_response = await response.json();
    if (temp_response.is_deleted) {
      // myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
      myForm.setPageMode("write");
      window.location.reload();
      return;
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

  // const handleDelete = async () => {
  //   const url =
  //     SERVER_URL +
  //     "/challan/?booking_chalan_no=" +
  //     myForm.pageState.mr_statement_no;
  //   const response = await fetch(url, { method: "DELETE" });
  //   if (!response.ok) {
  //     console.log("Not able to delete challan");
  //     return;
  //   }
  //   const temp_response = await response.json();
  //   if (temp_response.is_deleted) {
  //     myForm.setPageState({ ...challanDataObject, ...variablesFromSession });
  //     myForm.setPageMode("write");
  //     window.location.reload();
  //     return;
  //   }
  // };

  const deleteEntryFromTableCallback = (infoObject) => {
    // console.log("Info objecyt", infoObject);
    // let biltyObj = myForm.pageState.bilty_info_list[infoObject.idx];
    // let biltyId = biltyObj.bilty_id;
    // console.log("Bilty objecy", biltyObj);
    // let newState = {};
    // newState.bilty_info_list = infoObject.rows;
    // newState.removed_bilty_ids = [
    //   ...myForm.pageState.removed_bilty_ids,
    //   biltyId,
    // ];
    // // console.log("New state", newState);
    // myForm.setPageState({
    //   ...myForm.pageState,
    //   ...newState,
    // });
  };

  return (
    <div className="mr-form-container">
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
                  <div>Mr Statement Saving Successful </div>
                ) : (
                  <div>Error In Mr Statement Module </div>
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
                  Mr Statement is successfully created
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
                  Error in Mr Statement module with the following info:-
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
                        ...mrStatementDataObject,
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
      <div>
        <Popup
          // trigger={<button className="button"> Open Modal </button>}
          open={myForm.deletePopup}
          modal
          contentStyle={contentStyle}
          closeOnDocumentClick={false}
        >
          {(close) => (
            <div className="pop-up-container">
              <div className="pop-up-header">Are you sure want to delete?</div>
              <div className="pop-up-actions">
                <button
                  className="pop-up-button"
                  onClick={() => {
                    handleDelete();
                    myForm.setDeletePopup(false);
                    close();
                  }}
                >
                  Yes
                </button>
                <button
                  className="pop-up-button"
                  onClick={() => {
                    myForm.setDeletePopup(false);
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
      <div className="form-header">Mr Statement</div>
      <div className="form">
        <div className="form-title">
          <div className="form-row">
            <label className="form-label">Mr Statement No:</label>
            <input
              className="form-input"
              type="text"
              name="mr_statement_no"
              placeholder=""
              value={myForm.pageState.mr_statement_no}
              onChange={myForm.handleChange}
              onBlur={() => {}}
              onKeyPress={linkBilty}
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "mr_statement_no")
              }
              disabled={myForm.pageMode == "view" ? "disabled" : ""}
            />
          </div>
          <div className="form-row">
            <label className="form-label">MR Date:</label>
            <input
              className="form-input-mr-statement-date"
              type="date"
              name="input_date"
              placeholder=""
              value={myForm.pageState.input_date}
              onChange={myForm.handleChange}
              onKeyPress={linkBilty}
              ref={(a) => myForm.storeInputReferenceForSelect(a, "input_date")}
              // disabled={myForm.pageMode == "view" ? "disabled" : ""}
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

          {/* <div>
            Mr Date:{" "}
            <DatePicker
              dateFormat="dd-MM-yyy"
              selected={myForm.pageState.input_date}
              disabled={true}
              onChange={(date) =>
                myForm.setPageStateByField("input_date", date)
              }
              ref={(a) => myForm.storeInputReferenceForSelect(a, "mr_date")}
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
          </div> */}

          <div className="form-row">
            <label className="form-last_bilty">Last Mr Statement No:</label>
            <label className="form-last_statement">
              {myForm.pageState.last_mr_statement_no}
            </label>
          </div>
        </div>

        <div className="multi-table-container">
          {/* <div className="small-table-container"> */}
          {/* {console.log("***********", myForm.pageState["bilty_info_list"])} */}
          {/* <DynamicViewTable
              tableHeader={mrStatementTableHeader}
              tableItems={mrStatementTableItems}
              tableValues={myForm.pageState["amount_list"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["amount_list"]}
              // deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="amount_list"
            /> */}
          {/* </div> */}
          <div className="table-container">
            <DynamicViewTable
              tableHeader={mrStatementTableHeader}
              tableItems={mrStatementTableItems}
              tableValues={myForm.pageState["mr_info_list"]}
              setPageStateByField={myForm.setPageStateByField}
              pageStateArray={myForm.pageState["mr_info_list"]}
              deleteEntryFromTableCallback={deleteEntryFromTableCallback}
              fieldMapping="mr_info_list"
            />
          </div>
        </div>

        <div className="chform-row">
          {mrStatementGroupInfo["group-1"].map(function (info) {
            return (
              <div className={info["className"]} key={info["name"]}>
                <label className={info["labelClassName"]}>
                  {info["label"]}:
                  <input
                    disabled={true}
                    type={info["type"]}
                    value={myForm.pageState[info["name"]]}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="form-footer">
          {checkVisibilityCondition({ name: "save_button" }) && (
            <button
              onClick={myForm.handleSubmit}
              type="button"
              className="btn btn-primary"
              ref={(a) => myForm.storeInputReferenceForSelect(a, "save_button")}
            >
              Save
            </button>
          )}
          {checkVisibilityCondition({ name: "print_button" }) && (
            <button
              onClick={(e) => {
                console.log("Values", myForm.pageState);
                console.log("Values", myForm.pageState);
                myForm.setServerPrintNeeded(true);
                myForm.handleSubmit(e);
              }}
              type="button"
              className="btn btn-primary"
              ref={(a) =>
                myForm.storeInputReferenceForSelect(a, "print_button")
              }
            >
              Print
            </button>
          )}
          <button
            onClick={() => {
              myForm.setPageState({
                ...mrStatementDataObject,
                ...variablesFromSession,
              });
              window.location.reload();
              myForm.setPageMode("write");
            }}
          >
            New
          </button>
          {checkVisibilityCondition({ name: "delete_button" }) && (
            <button onClick={()=>myForm.setDeletePopup(true)}>Delete</button>
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

export default MrStatementForm;
