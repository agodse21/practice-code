import React from "react";
import "./PrintFooter.css";
import { TRANSPORTER_NAME } from "../config/config";

const PrintFooter = (props) => {
  return (
    <div id="main_footer">
      <div id="drivers_row_div">
        <label id="drivers_label">Driver's Or Owner's</label>
        <label id="rcc_label">{"For, "+TRANSPORTER_NAME}</label>
      </div>
      <div id="signature_print_div">
        <label id="sign_label">Signature</label>
        <label id="print_label">Printed By</label>
      </div>
      <div id="signature_print_details_div">
        <label id="sign_label">5:00 pm</label>
        <label id="print_label">Ahmedabad</label>
        <label id="dispatch_label">Dispatch Officer</label>
      </div>
    </div>
  );
};

export default PrintFooter;
