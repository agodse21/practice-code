import React from "react";
import "./AccountReportExcel.css";
let excel_date="";
import { TRANSPORTER_NAME } from "../config/config";

function accountReportExcel(){

  
    return (
      <table
        className="table table-bordered table-hover"
        id="tab_excel"
        
      >
        <style>th {}</style>
        <thead>
          <tr>
            <th colSpan="7" align="left">
            {TRANSPORTER_NAME + " AHMEDABAD"}
            </th>
          </tr>

          <tr>
            <th colSpan="7" align="left">
              CASH BOOK A/c. From : 20-May-2021 To 20-May-2021
            </th>
          </tr>
          <tr></tr>
          <tr>
            {this.props.tableHeader.map((item) => (
              <th
                style={
                  item.label == "Credit"
                    ? { color: "rgb(224, 75, 125)" }
                    : item.label == "Debit"
                    ? { color: "blue" }
                    : item.label == "Balance"
                    ? { color: "red" }
                    : {}
                }
                className={item.className}
                key={item.label}
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(excel_date = "")}
          {console.log("partytable", this.props.tableValues)}
          {this.props.tableValues.map((item, idx) => (
            <tr id="addr0" key={idx}>
              {console.log("excel_date", item)}
              {item["created_date"] == excel_date ? (
                ""
              ) : (
                <tr>
                  <td
                    style={{ fontWeight: "bolder", align: "left" }}
                    colSpan="8"
                  >
                    {item["created_date"]}
                  </td>
                </tr>
              )}

              {this.props.tableItems.map((row) => (
                <td key={idx + row.name}>
                  {item["created_date"] == undefined
                    ? ""
                    : (excel_date = item["created_date"])}
                  <div
                    style={
                      row.label == "Credit"
                        ? { color: "rgb(224, 75, 125)" }
                        : row.label == "Debit"
                        ? { color: "blue" }
                        : row.label == "Balance"
                        ? { color: "red" }
                        : {}
                    }
                    className={row["className"]}
                  >
                    {item[row["name"]]}
                  </div>
                </td>
              ))}
              {/* {this.props.delete == 1 ? (
                  <td>
                    <button
                      className="item-delete-btn"
                      // onClick={this.handleRemoveSpecificRow(idx)}
                      onClick={() => this.enablePopup(idx)}
                    >
                      DELETE
                    </button>
                  </td>
                ) : (
                  <td></td>
                )} */}
            </tr>
          ))}
          {/* <tr>
              <td>
                <button
                  onClick={this.handleAddRow}
                  className="item-add-btn"
                >
                  +
                </button>
              </td>
            </tr> */}
        </tbody>
      </table>
    );
  
}

export default accountReportExcel;
