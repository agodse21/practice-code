import React from "react";
// import { Component } from "react";
import "./ComponentToPrint.css";
import { groupInfo } from "../config/Biltyform.js";

let delivery_at = ["DOOR", "GODOWN", "PRIORITY"];
let dict = {};
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <page size="A4">
        <div id="master">
          <div id="main">
            <div id="row1">
              <div id="r1col1">
                <div id="title"></div>
                <div id="consign-details">
                  <div id="consign-details1">
                    <label id="consignor">
                      {this.props.fields.consignor_name}
                    </label>
                    <label id="consignee">
                      {this.props.fields.consignee_name}
                    </label>
                  </div>
                  <div id="consign-details2" style={{ display: "none" }}>
                    <label id="consignorGst">
                      {this.props.fields.consignor_gst}
                    </label>
                    <label id="consigneeGst">
                      {this.props.fields.consignee_gst}
                    </label>
                  </div>
                </div>
              </div>
              <div id="consignment-note">
                <div id="no-date">
                  <label id="consignment-note-no-label">
                    {this.props.fields.bilty_no}
                  </label>
                  <label id="consignment-note-date-label">
                    {String(this.props.fields.input_date.getUTCDate()) +
                      "/" +
                      String(this.props.fields.input_date.getUTCMonth() + 1) +
                      "/" +
                      String(this.props.fields.input_date.getUTCFullYear()) +
                      " " +
                      new Date().getHours() +
                      ":" +
                      new Date().getMinutes()}
                  </label>
                </div>
                <div id="from">
                  <label id="consignment-note-from-label">
                    {this.props.fields.station_from_name}
                  </label>
                </div>
                <div id="to">
                  <label id="consignment-note-to-label">
                    {this.props.fields.station_to_name}
                  </label>
                </div>
              </div>
            </div>

            <div id="row2">
              <div id="no-of-articles">
                <label id="no-of-articles-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.pkgs} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                {/* <label id="no-of-articles-label-packing-type">
              {this.props.fields.item_in.map((d) => (
                <React.Fragment>{d.pkgs} <br></br> </React.Fragment>
              ))}
            </label> */}
              </div>
              <div id="description">
                <label id="description-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.item_name} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                <div id="d_remarks">{this.props.fields.remarks}</div>
                <div id="watermark">
                  {delivery_at[this.props.fields.delivery_dest_type - 1] ==
                  "DOOR"
                    ? "D"
                    : delivery_at[this.props.fields.delivery_dest_type - 1] ==
                      "PRIORITY"
                    ? "U"
                    : ""}
                </div>
              </div>

              <div id="weight">
                <div id="app">
                  <label id="app-label">{dict.appKgs}</label>
                </div>
                <div id="ch">
                  <label id="ch-label">
                    {this.props.fields.item_in.map((d) => (
                      <React.Fragment>
                        {d.weight} <br></br>
                      </React.Fragment>
                    ))}
                  </label>
                </div>
              </div>

              <div id="rate">
                <label id="rate-label">
                  {groupInfo["group-1"][3]["dropdown_items"][
                    this.props.fields.pay_type - 1
                  ].label == "To Be Billed"
                    ? ""
                    : this.props.fields.item_in.map((d) => (
                        <React.Fragment>
                          {d.rate} <br></br>
                        </React.Fragment>
                      ))}
                </label>
              </div>

              <div id="freight">
                <div id="to-pay">
                  <label id="to-pay-label">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Pay"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
                <div id="paid-bill">
                  <label id="paid-bill-label">
                    {" "}
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "Paid"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
              </div>

              <div id="remarks">{this.props.remarks}</div>
            </div>

            <div id="row3">
              <div id="row3col1">
                <div id="row3col1row1">
                  <div id="owner-risk">
                    <div id="owner-risk-row1">
                      <div id="owner-risk-private-mark-div">
                        {this.props.fields.private_marka_no}
                        {/* <label id="owner-risk-private-mark-label">some mark</label> */}
                      </div>
                      <div id="owner-risk-delivery-on-div">
                        <label id="owner-risk-delivery-on-label">{}</label>
                      </div>
                    </div>
                    <div id="owner-risk-row2">
                      <div id="owner-risk-value-rs-div">
                        <label id="owner-risk-value-rs-label">
                          {this.props.fields.goods_invoice_value}
                        </label>
                      </div>
                      <div id="owner-risk-mr-no-div">
                        <label id="owner-risk-mr-no-label">{}</label>
                      </div>
                    </div>
                  </div>
                  <div id="consignor-copy">
                    <div id="cc1"></div>
                    <div id="cc2">
                      <label id="cc2-label">
                        {this.props.fields.eway_bill_no[0]["eway_bill_no"] == ""
                          ? "EB: " + 0
                          : "EB: " + this.props.fields.eway_bill_no.length}
                      </label>
                    </div>
                  </div>
                </div>
                <div id="pan-no"></div>
              </div>
              <div id="total">
                <label id="total-label">{}</label>
              </div>
              <div id="total-details">
                <div id="additional-charges">
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.bilty_charge > 0
                      ? this.props.fields.bilty_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.hamali > 0
                      ? this.props.fields.hamali
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.door_del_charge > 0
                      ? this.props.fields.door_del_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.other_amount > 0
                      ? this.props.fields.other_amount
                      : "00"
                    : ""}
                  <br />
                  <div id="total-amount">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Be Billed"
                      ? ""
                      : this.props.fields.total_amount}
                  </div>
                </div>
                <label id="total-details-label">
                  {
                    groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label
                  }
                </label>
              </div>
            </div>

            <div id="row4">
              <div id="delivery-at">
                  {/* EDIT CODE */}
                <label id="delivery-at-label">
                  {delivery_at[this.props.fields.delivery_dest_type - 1]}
                </label>

              </div>
              <div id="delivery-at-right">
                <label id="delivery-at-right-label">{}</label>
              </div>
              <div id="booking-officer">
                <label>
                  {JSON.parse(sessionStorage.getItem("user_name"))[
                    "user_name"
                  ].toUpperCase()}
                </label>
              </div>
            </div>
          </div>
          {/* <br /> */}
          {/* //Part 2 */}

          <div id="main1">
            <div id="row1">
              <div id="r1col1">
                <div id="title"></div>
                <div id="consign-details">
                  <div id="consign-details1">
                    <label id="consignor">
                      {this.props.fields.consignor_name}
                    </label>
                    <label id="consignee">
                      {this.props.fields.consignee_name}
                    </label>
                  </div>
                  <div id="consign-details2" style={{ display: "none" }}>
                    <label id="consignorGst">
                      {this.props.fields.consignor_gst}
                    </label>
                    <label id="consigneeGst">
                      {this.props.fields.consignee_gst}
                    </label>
                  </div>
                </div>
              </div>
              <div id="consignment-note">
                <div id="no-date">
                  <label id="consignment-note-no-label">
                    {this.props.fields.bilty_no}
                  </label>
                  <label id="consignment-note-date-label">
                    {String(this.props.fields.input_date.getUTCDate()) +
                      "/" +
                      String(this.props.fields.input_date.getUTCMonth() + 1) +
                      "/" +
                      String(this.props.fields.input_date.getUTCFullYear()) +
                      " " +
                      new Date().getHours() +
                      ":" +
                      new Date().getMinutes()}
                  </label>
                </div>
                <div id="from">
                  <label id="consignment-note-from-label">
                    {this.props.fields.station_from_name}
                  </label>
                </div>
                <div id="to">
                  <label id="consignment-note-to-label">
                    {this.props.fields.station_to_name}
                  </label>
                </div>
              </div>
            </div>

            <div id="row2">
              <div id="no-of-articles">
                <label id="no-of-articles-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.pkgs} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                {/* <label id="no-of-articles-label-packing-type">
              {this.props.fields.item_in.map((d) => (
                <React.Fragment>{d.pkgs} <br></br> </React.Fragment>
              ))}
            </label> */}
              </div>
              <div id="description">
                <label id="description-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.item_name} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                <div id="d_remarks">{this.props.fields.remarks}</div>
                <div id="watermark">
                  {delivery_at[this.props.fields.delivery_dest_type - 1] ==
                  "DOOR"
                    ? "D"
                    : delivery_at[this.props.fields.delivery_dest_type - 1] ==
                      "PRIORITY"
                    ? "U"
                    : ""}
                </div>
              </div>

              <div id="weight">
                <div id="app">
                  <label id="app-label">{dict.appKgs}</label>
                </div>
                <div id="ch">
                  <label id="ch-label">
                    {this.props.fields.item_in.map((d) => (
                      <React.Fragment>
                        {d.weight} <br></br>
                      </React.Fragment>
                    ))}
                  </label>
                </div>
              </div>

              <div id="rate">
                <label id="rate-label">
                  {groupInfo["group-1"][3]["dropdown_items"][
                    this.props.fields.pay_type - 1
                  ].label == "To Be Billed"
                    ? ""
                    : this.props.fields.item_in.map((d) => (
                        <React.Fragment>
                          {d.rate} <br></br>
                        </React.Fragment>
                      ))}
                </label>
              </div>

              <div id="freight">
                <div id="to-pay">
                  <label id="to-pay-label">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Pay"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
                <div id="paid-bill">
                  <label id="paid-bill-label">
                    {" "}
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "Paid"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
              </div>

              <div id="remarks">{this.props.remarks}</div>
            </div>

            <div id="row3">
              <div id="row3col1">
                <div id="row3col1row1">
                  <div id="owner-risk">
                    <div id="owner-risk-row1">
                      <div id="owner-risk-private-mark-div">
                        {this.props.fields.private_marka_no}
                        {/* <label id="owner-risk-private-mark-label">some mark</label> */}
                      </div>
                      <div id="owner-risk-delivery-on-div">
                        <label id="owner-risk-delivery-on-label">{}</label>
                      </div>
                    </div>
                    <div id="owner-risk-row2">
                      <div id="owner-risk-value-rs-div">
                        
                        <label id="owner-risk-value-rs-label">
                          {this.props.fields.goods_invoice_value}
                        </label>
                      </div>
                      
                      <div id="owner-risk-mr-no-div">
                        <label id="owner-risk-mr-no-label">{}</label>
                        
                      </div>
                      
                    </div>
                  </div>
                  
                  <div id="consignor-copy">
                    <div id="cc1"></div>
                    <div id="cc2">
                      <label id="cc2-label">
                        {this.props.fields.eway_bill_no[0]["eway_bill_no"] == ""
                          ? "EB: " + 0
                          : "EB: " + this.props.fields.eway_bill_no.length}
                      </label>
                    </div>
                  </div>
                </div>
                <div id="pan-no"></div>
              </div>
              
              <div id="total">
                <label id="total-label">{}</label>
              </div>
              <div id="total-details">
                <div id="additional-charges">
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.bilty_charge > 0
                      ? this.props.fields.bilty_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.hamali > 0
                      ? this.props.fields.hamali
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.door_del_charge > 0
                      ? this.props.fields.door_del_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.other_amount > 0
                      ? this.props.fields.other_amount
                      : "00"
                    : ""}
                  <br />
                  
                  <div id="total-amount">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Be Billed"
                      ? ""
                      : this.props.fields.total_amount}
                  </div>
                </div>
                
                <label id="total-details-label">
                  {
                    groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label
                  }
                </label>
              </div>
            </div>

            <div id="row4">
              <div id="delivery-at">
                <label id="delivery-at-label">
                  {delivery_at[this.props.fields.delivery_dest_type - 1]}
                </label>
              </div>
              <div id="delivery-at-right">
                <label id="delivery-at-right-label">{}</label>
              </div>
              <div id="booking-officer">
                <label>
                  {JSON.parse(sessionStorage.getItem("user_name"))[
                    "user_name"
                  ].toUpperCase()}
                </label>
              </div>
            </div>
          </div>
          {/* <br /> */}
          {/* pART3 */}
          <div id="main2">
            <div id="row1">
              <div id="r1col1">
                <div id="title"></div>
                <div id="consign-details">
                  <div id="consign-details1">
                    <label id="consignor">
                      {this.props.fields.consignor_name}
                    </label>
                    <label id="consignee">
                      {this.props.fields.consignee_name}
                    </label>
                  </div>
                  <div id="consign-details2" style={{ display: "none" }}>
                    <label id="consignorGst">
                      {this.props.fields.consignor_gst}
                    </label>
                    <label id="consigneeGst">
                      {this.props.fields.consignee_gst}
                    </label>
                  </div>
                </div>
              </div>
              <div id="consignment-note">
                <div id="no-date">
                  <label id="consignment-note-no-label">
                    {this.props.fields.bilty_no}
                  </label>
                  <label id="consignment-note-date-label">
                    {String(this.props.fields.input_date.getUTCDate()) +
                      "/" +
                      String(this.props.fields.input_date.getUTCMonth() + 1) +
                      "/" +
                      String(this.props.fields.input_date.getUTCFullYear()) +
                      " " +
                      new Date().getHours() +
                      ":" +
                      new Date().getMinutes()}
                  </label>
                </div>
                <div id="from">
                  <label id="consignment-note-from-label">
                    {this.props.fields.station_from_name}
                  </label>
                </div>
                <div id="to">
                  <label id="consignment-note-to-label">
                    {this.props.fields.station_to_name}
                  </label>
                </div>
              </div>
            </div>

            <div id="row2">
              <div id="no-of-articles">
                <label id="no-of-articles-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.pkgs} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                {/* <label id="no-of-articles-label-packing-type">
              {this.props.fields.item_in.map((d) => (
                <React.Fragment>{d.pkgs} <br></br> </React.Fragment>
              ))}
            </label> */}
              </div>
              <div id="description">
                <label id="description-label">
                  {this.props.fields.item_in.map((d) => (
                    <React.Fragment>
                      {d.item_name} <br></br>
                    </React.Fragment>
                  ))}
                </label>
                <div id="d_remarks">{this.props.fields.remarks}</div>
                <div id="watermark">
                  {delivery_at[this.props.fields.delivery_dest_type - 1] ==
                  "DOOR"
                    ? "D"
                    : delivery_at[this.props.fields.delivery_dest_type - 1] ==
                      "PRIORITY"
                    ? "U"
                    : ""}
                </div>
              </div>

              <div id="weight">
                <div id="app">
                  <label id="app-label">{dict.appKgs}</label>
                </div>
                <div id="ch">
                  <label id="ch-label">
                    {this.props.fields.item_in.map((d) => (
                      <React.Fragment>
                        {d.weight} <br></br>
                      </React.Fragment>
                    ))}
                  </label>
                </div>
              </div>

              <div id="rate">
                <label id="rate-label">
                  {groupInfo["group-1"][3]["dropdown_items"][
                    this.props.fields.pay_type - 1
                  ].label == "To Be Billed"
                    ? ""
                    : this.props.fields.item_in.map((d) => (
                        <React.Fragment>
                          {d.rate} <br></br>
                        </React.Fragment>
                      ))}
                </label>
              </div>

              <div id="freight">
                <div id="to-pay">
                  <label id="to-pay-label">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Pay"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
                <div id="paid-bill">
                  <label id="paid-bill-label">
                    {" "}
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "Paid"
                      ? this.props.fields.freight
                      : ""}
                  </label>
                </div>
              </div>

              <div id="remarks">{this.props.remarks}</div>
            </div>

            <div id="row3">
              <div id="row3col1">
                <div id="row3col1row1">
                  <div id="owner-risk">
                    <div id="owner-risk-row1">
                      <div id="owner-risk-private-mark-div">
                        {this.props.fields.private_marka_no}
                        {/* <label id="owner-risk-private-mark-label">some mark</label> */}
                      </div>
                      <div id="owner-risk-delivery-on-div">
                        <label id="owner-risk-delivery-on-label">{}</label>
                      </div>
                    </div>
                    <div id="owner-risk-row2">
                      <div id="owner-risk-value-rs-div">
                        <label id="owner-risk-value-rs-label">
                          {this.props.fields.goods_invoice_value}
                        </label>
                      </div>
                      <div id="owner-risk-mr-no-div">
                        <label id="owner-risk-mr-no-label">{}</label>
                      </div>
                    </div>
                  </div>
                  <div id="consignor-copy">
                    <div id="cc1"></div>
                    <div id="cc2">
                      <label id="cc2-label">
                        {this.props.fields.eway_bill_no[0]["eway_bill_no"] == ""
                          ? "EB: " + 0
                          : "EB: " + this.props.fields.eway_bill_no.length}
                      </label>
                    </div>
                  </div>
                </div>
                <div id="pan-no"></div>
              </div>
              <div id="total">
                <label id="total-label">{}</label>
              </div>
              <div id="total-details">
                <div id="additional-charges">
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.bilty_charge > 0
                      ? this.props.fields.bilty_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.hamali > 0
                      ? this.props.fields.hamali
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.door_del_charge > 0
                      ? this.props.fields.door_del_charge
                      : "00"
                    : ""}
                  <br />
                  {this.props.fields.pay_type != 4
                    ? this.props.fields.other_amount > 0
                      ? this.props.fields.other_amount
                      : "00"
                    : ""}
                  <br />
                  <div id="total-amount">
                    {groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label == "To Be Billed"
                      ? ""
                      : this.props.fields.total_amount}
                  </div>
                </div>
                <label id="total-details-label">
                  {
                    groupInfo["group-1"][3]["dropdown_items"][
                      this.props.fields.pay_type - 1
                    ].label
                  }
                </label>
              </div>
            </div>

            <div  id="row4">
              <div id="delivery-at">
                <label id="delivery-at-label">
                  {delivery_at[this.props.fields.delivery_dest_type - 1]}
                </label>
              </div>
              <div id="delivery-at-right">
                <label id="delivery-at-right-label">{}</label>
              </div>
              <div id="booking-officer">
                <label>
                  {JSON.parse(sessionStorage.getItem("user_name"))[
                    "user_name"
                  ].toUpperCase()}
                </label>
              </div>
            </div>
          </div>
        </div>
      </page>
    );
  }
}

export default ComponentToPrint;
