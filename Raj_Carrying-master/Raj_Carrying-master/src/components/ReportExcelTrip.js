import { size } from "lodash";
import React from "react";

const excel_bilty_columns = [
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
    Header: "Total Amt",
    accessor: "amount",
    canFilter: true,
    width: "70px",
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
    Header: "User",
    accessor: "created_by",
    canFilter: true,
  },
];

const excel_challan_columns = [
  {
    Header: "CHALLAN NO",
    accessor: "booking_chalan_no",
    width: "30px",
    minWidth: "10px",
  },
  {
    Header: "DATE",
    accessor: "booking_chalan_no",
    width: "30px",
    minWidth: "10px",
  },
  {
    Header: "TRUCK NO",
    accessor: "vehicle_no",
  },
  {
    Header: "DRIVER NAME",
    accessor: "",
  },
  {
    Header: "BILTY",
    accessor: "",
  },
  {
    Header: "BILTY DATE",
    accessor: "",
  },
  {
    Header: "CONTENTS",
    accessor: "",
  },
  {
    Header: "PACKAGE",
    accessor: "",
  },
  {
    Header: "Station To",
    accessor: "station_to_name",
  },
  {
    Header: "FREIGHT",
    accessor: "",
  },
  {
    Header: "D/C",
    accessor: "",
  },
  {
    Header: "CONSIGNOR",
    accessor: "",
  },
  {
    Header: "CONSIGNEE",
    accessor: "",
  },
  // {
  //   Header: "Station From",
  //   accessor: "station_from_name",
  // },

  // {
  //   Header: "Destination",
  //   accessor: "destination_name",
  // },
  // {
  //   Header: "Distance",
  //   accessor: "distance",
  // },

  // {
  //   Header: "Status",
  //   accessor: "status",
  // },
];

function excel_data(
  columns,
  data,
  fetchData,
  dateObject,
  loading,
  pageCount,
  dateState
) {
  //   for (let col in data) {
  // excel_rep_data = data;
  // console.log("sddsdsds", dateState["dateState"].date_from);
  let newDate = new Date();
  let to_pay_total = 0; 
  let paid_total = 0;
  console.log("asdd",data["ex_data"]);   
  // excel_rep_data = data["data"];
  for (let i = 0; i < data["ex_data"].length; i++) {
    // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
    if (data["ex_data"][i]["pay_type"] == 1) {
      to_pay_total += Number(data["ex_data"][i]["total_amount"]);
    } else if (data["ex_data"][i]["pay_type"] == 2) {
      paid_total += Number(data["ex_data"][i]["total_amount"]);
    }
  }

  return (
    <table 
    style={{ display: "none" }} 
    id="trip_report_excel">
      <thead>
        <tr>
          <th align="left">{TRANSPORTER_NAME + " AHMEDABAD"}</th>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>BRANCH NAME</td>
          <td>
            {JSON.parse(sessionStorage.getItem("branch_name"))[
              "branch_name"
            ].toUpperCase()}
          </td>
          <td></td>
          <td></td>
          <td>DATE(PRINT)</td>
          <td>TIME</td>
        </tr>
        <tr>
          <td>
            BILTY REPORT FROM-TO(
            {String(dateState["dateState"].date_from.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_from.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_from.getUTCFullYear())}{" "}
            -{" "}
            {String(dateState["dateState"].date_to.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_to.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_to.getUTCFullYear())}
            )
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            {newDate.getDate() +
              "/" +
              newDate.getMonth() +
              "/" +
              newDate.getFullYear()}
          </td>
          <td>
            {newDate.getHours() +
              ":" +
              newDate.getMinutes() +
              ":" +
              newDate.getSeconds()}
          </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr>
          {excel_bilty_columns.map((column) => (
            <td
            style={{width:column.width}}
            >{column.Header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data["ex_data"].map((cell) => (
          <tr>
            {excel_bilty_columns.map((column) => (
              <td>{cell[column.accessor]}</td>
            ))}
          </tr>
        ))}
        <tr></tr>
        <tr></tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>TOPAY(TOTAL)</td>
          <td>{to_pay_total}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>PAID (TOTAL)</td>
          <td>{paid_total}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>TOTAL</td>
          <td>{paid_total + to_pay_total}</td>
        </tr>
      </tbody>
    </table>
  );
}

function challan_report_excel(data, pageCount) {
  console.log("challan excel data", data);
  return (
    <table style={{ display: "none" }} id="challan_report_excel">
      <thead>
        <tr>
          <th align="left">{TRANSPORTER_NAME + " AHMEDABAD"}</th>
        </tr>
        <tr>
          <td>BRANCH NAME</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>PAGE COUNT</td>
          <td>temp 6</td>
        </tr>
        <tr>
          <td>BOOKING/MEMO CHALLAN REGISTER FROM TO</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>PRINT DATE</td>
          <td>temp 2/7/2021</td>
        </tr>
        <tr></tr>
        <tr>
          {excel_challan_columns.map((column) => (
            <td>{column.Header}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data["data"].map((cell) => (
          <tr>
            {excel_challan_columns.map((column) => (
              <td>{cell[column.accessor]}</td>
            ))}
          </tr>
        ))}
        <tr></tr>
        <tr></tr>

        <tr>
          <td>TRUCK NO 1</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>XX</td>
          <td></td>
          <td>XX</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
          <td>TRUCK NO 2</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>XX</td>
          <td></td>
          <td>XX</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
          <td>TRUCK NO. WISE</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>XX</td>
          <td></td>
          <td>XX</td>
        </tr>
        <tr>
          <td>GRAND TOTAL</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>XX</td>
          <td></td>
          <td>XX</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
          <td>GRAND TOTAL</td>
        </tr>
      </tbody>
    </table>
  );
}

export default { excel_data, challan_report_excel };
