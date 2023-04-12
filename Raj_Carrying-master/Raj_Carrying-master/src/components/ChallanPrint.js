import React from "react";
import "./TableToPrint.css";
import DynamicViewTable from "./DynamicViewTable";
import {
  groupInfo,
  dataObject,
  challanBiltyTableItems,
  challanBiltyTableHeader,
  validate,
  popupInfo,
} from "../config/challanForm.js";

import {
  tableToPrintTableHeader,
  tableToPrintTableItems,
} from "../config/ChallanPrint";
import TableForPrint from "./TableForPrint";
import PrintHeader from "./PrintHeader";
import PrintFooter from "./PrintFooter";

class TableToPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  convertData = (e) => {
    var data = e;
    if ("0" in e) {
      for (let idx in data) {
        data[idx].content = e[idx]["item_info"]["0"]["item_name"];
      }
    }
    return data;
  };
  render() {
    return (
      <page size="A4">
        <PrintHeader />
        <div id="details">
          <div id="details_left">
            <label>From: {this.props.fields.pageState.station_from_name}</label>
            <br />
            <label>
              Driver Name: {this.props.fields.pageState.driver_name}
            </label>
            <br />
            <label>licence No: {this.props.fields.pageState.license_no}</label>
            <br />
          </div>
          <div id="details_middle">
            <label>To: {this.props.fields.pageState.station_to_name}</label>
            <br />
            <label>To Address: </label>
            <br />
            <label>Owner: {this.props.fields.pageState.owner_name}</label>
            <br />
          </div>
          <div id="details_right">
            <label>Challan No: {this.props.fields.pageState.challan_no}</label>
            <br />
            <label>
              Challan Date:{" "}
              {String(this.props.fields.pageState.input_date.getUTCDate()) +
                "/" +
                String(
                  this.props.fields.pageState.input_date.getUTCMonth() + 1
                ) +
                "/" +
                String(
                  this.props.fields.pageState.input_date.getUTCFullYear()
                ) +
                " "}
            </label>
            <br />
          </div>
        </div>
        <TableForPrint
          tableItems={tableToPrintTableItems}
          tableValues={this.convertData(
            this.props.fields.pageState["bilty_ids"]
          )}
        />
        <PrintFooter />
      </page>
    );
  }
}

export default TableToPrint;
