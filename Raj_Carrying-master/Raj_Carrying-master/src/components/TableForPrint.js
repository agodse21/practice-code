import React from "react";
// import "./DynamicTable.css";
import "./TableForPrint.css";

const TableForPrint = (props) => {
  let total_entries = 0;
  let total_packages = 0;
  let total_weight = 0;
  let total_to_pay = 0;
  let total_paid = 0;
  let total_eb = 0;
  total_entries = props.tableValues.length;
  let ele =  <div id="ex1"></div>
  let span_length =  0;
  span_length = parseInt(2.4*(28-(Number(total_entries) % 28)));

  for (let item in props.tableValues) {
    total_packages += props.tableValues[item]["no_of_package"];
    total_weight += props.tableValues[item]["charge_weight"];
    if (props.tableValues[item]["pay_type_name"] == "To Pay") {
      total_to_pay += Number(props.tableValues[item]["total_amount"]);
    } else if (props.tableValues[item]["pay_type_name"] == "PAID") {
      total_paid += Number(props.tableValues[item]["total_amount"]);
    }
    total_eb += props.tableValues[item]["eway_bill_info"].length;
  }
  return (
    <table>
      <div id="table-div">
        {props.tableItems.map((item) => (
          <div style={{ fontWeight: "bolder" }} key={item.label}>
            {item.label}
          </div>
        ))}
        {/* {props.tableValues.map((item, idx) => (
          <div id="sr">{idx + 1}</div>
        ))} */}

        {props.tableValues.map((item, idx) =>
          props.tableItems.map((row) => (
            <div id={row.name} key={idx + row.name}>
              {row.name == "sr_no"
                ? idx + 1
                : row.name == "to_pay"
                ? item["pay_type_name"] == "To Pay"
                  ? item["total_amount"]
                  : ""
                : row.name == "paid"
                ? item["pay_type_name"] == "PAID"
                  ? item["total_amount"]
                  : ""
                : row.name == "tbb"
                ? item["pay_type_name"] == "To Be Billed"
                  ? "TBB"
                  : ""
                : row.name == "eb_no"
                ? item["eway_bill_info"].length
                : item[row["name"]]}
            </div>
          ))
        )}

        {/* <tfoot id="tfooter">
          {
            <tr key="1">
              <td>Page Total</td>
              {props.tableItems.map((row) => (
                <td id={row.name} key={1 + row.name}>
                  <div>
                    {row.name == "no_of_package" ? "123" : ""}
                    {}
                  </div>
                </td>
              ))}
            </tr>
          }
        </tfoot> */}
        <div id="ex1" style={{gridRowEnd: `span ${span_length}`,alignSelf: "end"}}></div>
        <div id="grand_total"> Grand Total</div>
        <div id="total_package">{total_packages}</div>
        <div id="total_weight">{total_weight}</div>
        <div id="total_to_pay">{total_to_pay}</div>
        <div id="total_paid">{total_paid}</div>
        <div id="total_eb">{total_eb}</div>
      </div>
    </table>
  );
};

export default TableForPrint;
