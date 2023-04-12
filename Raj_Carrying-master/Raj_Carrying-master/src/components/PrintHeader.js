import React from "react";
import "./PrintHeader.css";
import { TRANSPORTER_NAME } from "../config/config";

const PrintHeader = (props) => {
  return (
    <div id="main_header">
      <div id="rcc_title">
        <u>
          <b> {TRANSPORTER_NAME}</b>
        </u>
      </div>
      <div id="location">AHMEDABAD</div>
      <div id="address">
        SAHJANAND ESTATE, O/S.RAIPUR GATE AHMEDABAD. .,AHMEDABAD.-
      </div>
      <div id="phone">Phone: 079-25461263.25461273</div>
    </div>
  );
};

export default PrintHeader;
