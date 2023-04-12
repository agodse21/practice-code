import React from "react";
import "./MrPrint.css";
import numToWords from "num-to-words"

// numToWords = require('num-to-words');

const delivery_on = {
  0: " ",
  1: "Without LR",
  2: "Due",
  3: "On letter pad",
  4: "Not applicable",
  5: "ccr",
};

const station_shorts = {
  Ahmedabad:"AHM",
  Narol:"NRL",
  ASLALI:"ASL",
  SARKHEJ:"SKJ",
  NADIAD:"NDD",
  Anand:"AND",
  VADODARA:"VDR",
  DASRATH:"DSR",
  BAJWA:"BJW",
  BHARUCH:"BRC",
  ANKLESHWAR:"ANK",
  KAMREJ:"KMJ",
  SURAT:"SRT",
  BARDOLI:"BDL",
  NAVSARI:"NVS",
  VAPI:"VPI",
  SILVASA:"SLV",
  DAMAN:"DMN",
  MEHSANA:"MHN",
  UNJHA:"UNJ",
  SIDHPUR:"SID",
  PALANPUR:"PLN",
  DEESA:"DES",
  PATAN:"PTN",
  BHUJ:"BUJ",
  GANDHIDHAM:"GDM",
  MORBI:"MRB",
  SURENDRANAGAR:"SRN",
  RAJKOT:"RJK",
  NAVAGAM:"NVG",
  JAMNAGAR:"JMN",
  Gondal:"GDL",
  JETPUR:"JTP",
  JUNAGADH:"JND",
  BHAVNAGAR:"BHV",
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}


class MrPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    var mr_date = String(formatDate(this.props.fields.input_date))
    return (
      <page>
        <div id="MR">
          <div id="mr_accounts_copy">
            <div id="mr_details">
              <div id="mr_party_name">{this.props.fields.party_name}</div>
              <div id="mr_no">{this.props.fields.mr_no}</div>
              <div id="mr_address"></div>
              <div id="mr_date">
              {mr_date}
                {/* {String(this.props.fields.input_date.getUTCDate()) +
                  "/" +
                  String(this.props.fields.input_date.getUTCMonth() + 1) +
                  "/" +
                  String(this.props.fields.input_date.getUTCFullYear()) +
                  " " +
                  new Date().getHours() +
                  ":" +
                  new Date().getMinutes()} */}
              </div>
              <div id="mr_type">{this.props.fields.bilty_type}</div>
            </div>
            <div id="mr_row2">
              {this.props.fields.bilty_ids.map((item) => (
                <React.Fragment>
                  <div id="mr_booking_station">{item.suffix}</div>
                  <div id="mr_lr_no">{item.bilty_no}</div>
                  <div id="mr_booking_date">
                    {String(formatDate(
                      item.bilty_date.slice(0, item.bilty_date.indexOf("T"))
                    ))}
                  </div>
                  <div id="mr_pkg">{item.no_of_package}</div>
                  <div id="mr_detailss">{item.pay_type_name}</div>
                  {item.pay_type_name != 'To Be Billed' ? (<div id="mr_row2_freight">{item.crossing_inward_id ? "" : Number(item.total_amount)}</div>) : (<div id="mr_row2_freight">{""}</div>)}
                  <div id="mr_row2_date">
                  {mr_date}
                    {/* {String(this.props.fields.input_date.getUTCDate()) +
                      "/" +
                      String(this.props.fields.input_date.getUTCMonth() + 1) +
                      "/" +
                      String(this.props.fields.input_date.getUTCFullYear())} */}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div id="mr_row3">
              <div id="mr_col1">
                <div>{delivery_on[Number(this.props.fields.delivery_on)]}</div>
                <div>{JSON.parse(sessionStorage.getItem("branch_name"))[
                "branch_name"
              ].toUpperCase()}</div>
                <div>{this.props.fields.cheque_no}</div>
                <div>{}</div>
                <div>{}</div>
                <div id="mr_rupee">{numToWords(Number( this.props.fields.total_amount))+ " only"}</div>
              </div>
              <div id="mr_col2">
                <div id="mr_cht">
                  {this.props.fields.to_pay_amount == ""
                    ? 0
                    : this.props.fields.to_pay_amount}
                </div>
                <div id="mr_cht">
                  {this.props.fields.hamali == ""
                    ? 0
                    : this.props.fields.hamali}
                </div>
                <div id="mr_cht">
                  {this.props.fields.service_charge == ""
                    ? 0
                    : this.props.fields.service_charge}
                </div>
                <div id="mr_cht">
                  {this.props.fields.demarage_charge == ""
                    ? 0
                    : this.props.fields.demarage_charge}
                </div>
                <div id="mr_cht">
                  {this.props.fields.other_charge == ""
                    ? 0
                    : this.props.fields.other_charge}
                </div>
                <div id="mr_ex_cht"></div>
                <div id="mr_cht">
                  {Number(this.props.fields.hamali) +
                    Number(this.props.fields.service_charge) +
                    Number(this.props.fields.demarage_charge) +
                    Number(this.props.fields.other_charge)}
                </div>
                <div id="mr_refund_amount">
                  Refund &nbsp;{" "}
                  {this.props.fields.refund == ""
                    ? 0
                    : "-" + this.props.fields.refund}
                </div>
                <div id="mr_gt_cht">
                  {this.props.fields.total_amount == ""
                    ? 0
                    : this.props.fields.total_amount}
                </div>
              </div>
            </div>
            <div id="mr_row4">
              {" "}
              {JSON.parse(sessionStorage.getItem("user_name"))[
                "user_name"
              ].toUpperCase()}
            </div>
          </div>
          <div id="mr_party_copy"><div id="mr_details">
              <div id="mr_party_name">{this.props.fields.party_name}</div>
              <div id="mr_no">{this.props.fields.mr_no}</div>
              {/* ADDRESS WILL BE BLANK ACCORDING TO DHRUMIL 23/JUN/2021 09:34 AM */}
              <div id="mr_address"></div>
              <div id="mr_date">
              {mr_date}
                {/* {String(this.props.fields.input_date.getUTCDate()) +
                  "/" +
                  String(this.props.fields.input_date.getUTCMonth() + 1) +
                  "/" +
                  String(this.props.fields.input_date.getUTCFullYear()) +
                  " " +
                  new Date().getHours() +
                  ":" +
                  new Date().getMinutes()} */}
              </div>
              <div id="mr_type">{this.props.fields.bilty_type}</div>
            </div>
            <div id="mr_row2">
              {this.props.fields.bilty_ids.map((item) => (
                <React.Fragment>
                  <div id="mr_booking_station2">{item.suffix}</div>
                  <div id="mr_lr_no">{item.bilty_no}</div>
                  <div id="mr_booking_date">
                    {String(
                      item.bilty_date.slice(0, item.bilty_date.indexOf("T"))
                    )}
                  </div>
                  <div id="mr_pkg">{item.no_of_package}</div>
                  <div id="mr_detailss">{item.pay_type_name}</div>
                  {item.pay_type_name != 'To Be Billed' ? (<div id="mr_row2_freight">{item.crossing_inward_id ? "" : Number(item.total_amount)}</div>) : (<div id="mr_row2_freight">{""}</div>)}
                  <div id="mr_row2_date">
                  {mr_date}
                    {/* {String(this.props.fields.input_date.getUTCDate()) +
                      "/" +
                      String(this.props.fields.input_date.getUTCMonth() + 1) +
                      "/" +
                      String(this.props.fields.input_date.getUTCFullYear())} */}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div id="mr_row3">
              <div id="mr_col1">
                <div>{delivery_on[Number(this.props.fields.delivery_on)]}</div>
                <div>{JSON.parse(sessionStorage.getItem("branch_name"))[
                "branch_name"
              ].toUpperCase()}</div>
                <div>{this.props.fields.cheque_no}</div>
                <div>{}</div>
                <div>{}</div>
                <div id="mr_rupee">{numToWords(Number( this.props.fields.total_amount))+ " only"}</div> 
              </div>
              <div id="mr_col2">
                <div id="mr_cht">
                  {this.props.fields.to_pay_amount == ""
                    ? 0
                    : this.props.fields.to_pay_amount}
                </div>
                <div id="mr_cht">
                  {this.props.fields.hamali == ""
                    ? 0
                    : this.props.fields.hamali}
                </div>
                <div id="mr_cht">
                  {this.props.fields.service_charge == ""
                    ? 0
                    : this.props.fields.service_charge}
                </div>
                <div id="mr_cht">
                  {this.props.fields.demarage_charge == ""
                    ? 0
                    : this.props.fields.demarage_charge}
                </div>
                <div id="mr_cht">
                  {this.props.fields.other_charge == ""
                    ? 0
                    : this.props.fields.other_charge}
                </div>
                <div id="mr_ex_cht"></div>
                <div id="mr_cht">
                  {Number(this.props.fields.hamali) +
                    Number(this.props.fields.service_charge) +
                    Number(this.props.fields.demarage_charge) +
                    Number(this.props.fields.other_charge)}
                </div>
                <div id="mr_refund_amount">
                  Refund &nbsp;{" "}
                  {this.props.fields.refund == ""
                    ? 0
                    : "-" + this.props.fields.refund}
                </div>
                <div id="mr_gt_cht">
                  {this.props.fields.total_amount == ""
                    ? 0
                    : this.props.fields.total_amount}
                </div>
              </div>
            </div>
            <div id="mr_row4">
              {" "}
              {JSON.parse(sessionStorage.getItem("user_name"))[
                "user_name"
              ].toUpperCase()}
            </div>
          
          </div>
        </div>{" "}
      </page>
    );
  }
}

export default MrPrint;
