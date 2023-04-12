import React from "react";
import "./DynamicTable.css";
import Autosuggest from "react-autosuggest";
import { object } from "yup";

class DynamicTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [{}],
      focusOnAddRow: true,
    };
    let rowsDummy = [{}];
    for (var tableItem of this.props.tableItems) {
      rowsDummy[0][tableItem.name] = "";
    }
    this.props.setPageStateByField(this.props.fieldMapping, rowsDummy);
  }
  handleChange = (idx) => (e) => {
    const { name, value } = e.target;
    const rows = [...this.props.pageStateArray];
    rows[idx][name] = value;
    // this.setState({
    //   rows,
    // });  
    this.props.setPageStateByField(this.props.fieldMapping, rows);
  };
  handleChangeByField = (name, value, idx) => {
    const rows = [...this.props.pageStateArray];
    rows[idx][name] = String(value);
    this.props.setPageStateByField(this.props.fieldMapping, rows);
  };

  updateSuggestionValueInState = (idx, objectToUpdate) => {
    const rows = [...this.props.pageStateArray];
    let rowObject = rows[idx];
    rowObject = { ...rowObject, ...objectToUpdate };
    rows[idx] = rowObject;
    this.props.setPageStateByField(this.props.fieldMapping, rows);
  };
  handleAddRow = () => {
    /**
     * Check if any field is empty and don't let the row add
     * if any field is empty.
     */
    for (var item_index in this.props.pageStateArray) {
      let item = this.props.pageStateArray[item_index];
      for (var key in item) {
        if (item[key] == "") {
          return;
        }
      }
    }
    const item = {};
    for (var tableItem of this.props.tableItems) {
        // console.log({tableItem});
      if (tableItem.name == "packing_type") {
        item[tableItem.name] = "1";
        continue;
      }
      if (tableItem.name == "new_row") {
        item[tableItem.name] = "N";
        continue;
      }
      if(tableItem.name == "unit" && this.props.fieldMapping == "item_in") {
        item[tableItem.name] = "C";
        continue;
      }
      item[tableItem.name] = "";
    }
    console.log("table item", item);

    this.setState({
      rows: [...this.state.rows, item],
      focusOnAddRow: true,
    });
    this.props.setPageStateByField(this.props.fieldMapping, [
      ...this.props.pageStateArray,
      item,
    ]);
  };
  handleRemoveRow = () => {
    // this.setState({
    //   rows: this.state.rows.slice(0, -1),
    // });
    let rows = this.props.pageStateArray;
    rows = rows.slice(0, -1);
    this.props.setPageStateByField(this.props.fieldMapping, rows);
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.props.pageStateArray];
    rows.splice(idx, 1);
    this.props.setPageStateByField(this.props.fieldMapping, rows);
  };

  onKeyPress =  (e, index, totalLength, fieldInfoObject) => {
    const keyString = String(e.key);
    console.log("inside !!!");
    // Automatic value updation block
    if (fieldInfoObject.name == "unit" && keyString == "Enter") {
      if ("rate_info" in this.props.pageStateArray[index]) {
          this.props.setOverlay(true);
        //   await new Promise(resolve => setTimeout(resolve, 2000));
        let rateInfoObject = this.props.pageStateArray[index]["rate_info"];
        for (let i = 0; i < rateInfoObject.length; i++) {
          if (
            rateInfoObject[i].unit.toUpperCase() ==
            this.props.pageStateArray[index].unit.toUpperCase()
          ) {
            if (
              "rate" in rateInfoObject[i] &&
              this.props.pageStateArray[index].unit.toUpperCase() != "F"
            ) {
              this.handleChangeByField("rate", rateInfoObject[i].rate, index);
            }
            if ("weight" in rateInfoObject[i]) {
              this.handleChangeByField(
                "weight",
                rateInfoObject[i].weight,
                index
              );
            }
          }
        }
        this.props.setOverlay(false);
      }
    }

    console.log("outside!!!");

    if (fieldInfoObject.name == "weight" && keyString == "Enter") {
      console.log("In weight :- ",this.props.pageStateArray)
      console.log("In weight  index:- ",index)
      if (
        "rate_info" in this.props.pageStateArray[index] &&
        this.props.pageStateArray[index].unit.toUpperCase() == "F"
      ) {
        let rateInfoObject = this.props.pageStateArray[index]["rate_info"];
        console.log("rate info object Before :- ",rateInfoObject)
        for (let i = 0; i < rateInfoObject.length; i++) {
          console.log("rate info object :- ",rateInfoObject[i])
          if (
            "rate" in rateInfoObject[i] &&
            this.props.pageStateArray[index].truck_size ==
              rateInfoObject[i].truck_size &&
            rateInfoObject[i].unit.toUpperCase() == "F"
          ) {
            this.handleChangeByField("rate", rateInfoObject[i].rate, index);
            // rateValue[rateInfoObject[i].truck_size] = rateInfoObject[i].rate
          }
        }
      }
    }

    // Ewaybill info update block
    if (
      fieldInfoObject.name == "new_row" &&
      this.props.fieldMapping == "eway_bill_no" &&
      keyString == "Enter"
    ) {
      if (
        this.props.pageStateArray[index].new_row == "n" ||
        this.props.pageStateArray[index].new_row == "N"
      ) {
        let apiInputData = [];
        let dummyEwbObject = {};
        let ewbEmpty = false;
        for (let i = 0; i < this.props.pageStateArray.length; i++) {
          dummyEwbObject = this.props.pageStateArray[i];
          if (dummyEwbObject.eway_bill_no == "") {
            ewbEmpty = true;
            break;
          }
          apiInputData.push({ eway_bill_no: dummyEwbObject.eway_bill_no });
        }
        if (!ewbEmpty) {
          this.props.refStoreObject.current.eway_bill_no[index].new_row.blur();
          console.log("api input data", apiInputData);
          console.log("asassadasd", this.props);
          this.props.setOverlay(true);
          let data = {
            // apiUrlTail: "?bilty_no=" + this.props.pageState.bilty_no + "&suffix=" + this.props.pageState.suffix,
            apiType: "getEwbInfo",
            apiConfig: this.props.apiConfig,
            apiInputData: apiInputData,
          };
          if(this.props.pageState.bilty_id != ""){
            data.apiUrlTail = "?bilty_id=" + this.props.pageState.bilty_id}
          this.props.performSuggestions(data);
          return;
        }
      }
    }

    if (
      fieldInfoObject.name == "new_row" &&
      this.props.fieldMapping == "item_in" &&
      keyString == "Enter"
    ) {
      if (
        this.props.pageStateArray[index].new_row == "n" ||
        this.props.pageStateArray[index].new_row == "N"
      ) {
        this.props.fetchChargeRate();
        return;
      }
    }

    // Keyboard navigation block
    if (
      "keyboardNavigationMap" in fieldInfoObject &&
      keyString in fieldInfoObject.keyboardNavigationMap
    ) {
      e.preventDefault();
      /**
       * For all the boxes which are not end box, shift the focus.
       * If it is end box, conditional nav flag needs to be there.
       */
      if (
        !("conditionalNav" in fieldInfoObject.keyboardNavigationMap[keyString])
      ) {
        if (
          fieldInfoObject.name == "weight" &&
          this.props.pageState.pay_type == "4"
        ) {
          this.props.makeFocusOnParticularFieldForItem(
            this.props.fieldMapping,
            index,
            "new_row"
          );
          return;
        }
        if (
          fieldInfoObject.name == "unit" &&
          (this.props.pageStateArray[index].unit == "f" ||
            this.props.pageStateArray[index].unit == "F")
        ) {
          this.props.makeFocusOnParticularFieldForItem(
            this.props.fieldMapping,
            index,
            "truck_size"
          );
          return;
        }
        this.props.makeFocusOnParticularFieldForItem(
          this.props.fieldMapping,
          index,
          fieldInfoObject.keyboardNavigationMap[keyString].nextField
        );
        return;
      }

      /***
       * If end row or not
       */
      if (index + 1 == totalLength) {
        let valueForNav = this.props.pageStateArray[index].new_row;
        if (valueForNav == "y" || valueForNav == "Y") {
          /**
           * Check if any field is empty and don't let the row add
           * if any field is empty.
           */
          for (var item_index in this.props.pageStateArray) {
            let item = this.props.pageStateArray[item_index];
            for (var key in item) {
              if (item[key] == "") {
                return;
              }
            }
          }
          this.handleAddRow();
          return;
        } else if (valueForNav == "n" || valueForNav == "N") {
          /**
           * Make focus to anywhere else.
           */
          this.props.makeFocusOnParticularField(
            fieldInfoObject.keyboardNavigationMap[keyString].nextFieldOnPage
          );
          return;
        }
      } else {
        // Not end row
        this.props.makeFocusOnParticularFieldForItem(
          this.props.fieldMapping,
          index + 1,
          fieldInfoObject.keyboardNavigationMap[keyString].nextField
        );
        return;
      }
    }
  };

  getAdditionalInfoForSuggestionFetch = () => {
    let additionalInfoObject = {};
    additionalInfoObject.station_from = this.props.pageState.station_from;
    additionalInfoObject.station_to = this.props.pageState.station_to;
    if (this.props.pageState.pay_type == "4") {
      additionalInfoObject.consignor_id = this.props.pageState.consignor_id;
      additionalInfoObject.consignee_id = null;
    } else {
      additionalInfoObject.consignor_id = null;
      additionalInfoObject.consignee_id = this.props.pageState.consignee_id;
    }
    return additionalInfoObject;
  };

  getShouldRenderSugggestions = (fieldInfo) => {
    if ("suggestionsOff" in fieldInfo && fieldInfo.suggestionsOff == true) {
      return false;
    } else {
      return true;
    }
  };

  checkToBeBilledCondition = (fieldInfo, idx) => {
    if (
      this.props.pageState.pay_type == "4" &&
      (fieldInfo.name == "rate" || fieldInfo.name == "amount") &&
      this.props.pageState.role_id != "1"
    ) {
      return false;
    } else if (
      String(this.props.pageStateArray[idx].unit).toUpperCase() != "F" &&
      fieldInfo.name == "truck_size"
    ) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    return (
      <div>
        <div className="dt-container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th />
                    {this.props.tableHeader.map((item) => (
                      <th className={item.className} key={item.label}>
                        {" "}
                        {item.label}{" "}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.props.pageStateArray.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>
                        <button
                          className="item-remove-btn"
                          onClick={this.handleRemoveSpecificRow(idx)}
                        >
                          -
                        </button>
                      </td>

                      <td>{idx + 1}</td>
                      {this.props.tableItems.map((row, index) => {
                        if (row["type"] === "dropdown") {
                          return (
                            <td key={idx + row.name}>
                              {this.checkToBeBilledCondition(row, idx) && (
                                <select
                                  className={row["inputClassName"]}
                                  onChange={(e) => {
                                    const { name, value } = e.target;
                                    this.handleChangeByField(
                                      row["name"],
                                      value,
                                      idx
                                    );
                                  }}
                                  // have introduced new function to disable individual drop downs
                                  disabled={
                                    this.props.pageMode == "view" ||
                                    this.props.disabledFlag == "true"||
                                    ("isDisabled" in row && row.isDisabled({ pageState: this.props.pageState, pageMode: this.props.pageMode, idx })) 
                                      ? "disabled"
                                      : ""
                                  }
                                  value={
                                    this.props.pageStateArray[idx][row["name"]]
                                  }
                                  ref={(a) =>
                                    this.props.storeInputReferenceForSelectForDynamicTable(
                                      a,
                                      row["name"],
                                      idx,
                                      this.props.fieldMapping
                                    )
                                  }
                                  onKeyPress={(e) => {
                                    this.onKeyPress(
                                      e,
                                      idx,
                                      this.props.pageStateArray.length,
                                      row
                                    );
                                  }}
                                >
                                  {row["dropdown_items"].map(
                                    (dropdown_item) => (
                                      <option
                                        value={dropdown_item.value}
                                        key={dropdown_item.label}
                                      >
                                        {dropdown_item.label}
                                      </option>
                                    )
                                  )}
                                </select>
                              )}
                            </td>
                          );
                        } else {
                          return (
                            <td key={idx + row.name}>
                              {this.checkToBeBilledCondition(row, idx) && (
                                <Autosuggest
                                  id={row["name"] + "#" + idx}
                                  suggestions={this.props.suggestions}
                                  onSuggestionsFetchRequested={(a) =>
                                    this.props.onSuggestionsFetchRequested(
                                      a,
                                      (b) =>
                                        this.props.suggestionFetchApi(
                                          row,
                                          b,
                                          this.getAdditionalInfoForSuggestionFetch()
                                        )
                                    )
                                  }
                                  onSuggestionsClearRequested={() =>
                                    this.props.onSuggestionsClearRequested(row)
                                  }
                                  shouldRenderSuggestions={() =>
                                    this.getShouldRenderSugggestions(row)
                                  }
                                  getSuggestionValue={(suggestion) =>
                                    suggestion[row.suggestionKeyword]
                                  }
                                  onSuggestionSelected={(a, b) =>
                                    this.props.getSuggestionValue(
                                      b.suggestion,
                                      row,
                                      this.props.performSuggestions,
                                      (d) =>
                                        this.updateSuggestionValueInState(
                                          idx,
                                          d
                                        ),
                                      idx
                                    )
                                  }
                                  renderSuggestion={(a) =>
                                    this.props.renderSuggestion(a, row)
                                  }
                                  highlightFirstSuggestion={true}
                                  ref={(a) => {
                                    this.props.storeInputReference(
                                      a,
                                      true,
                                      this.props.fieldMapping
                                    );
                                    if (
                                      "newRowFocus" in row &&
                                      row["newRowFocus"]
                                    ) {
                                      if (
                                        a != null &&
                                        this.state.focusOnAddRow
                                      ) {
                                        a.input.focus();
                                        this.setState({
                                          focusOnAddRow: false,
                                        });
                                      }
                                    }
                                  }}
                                  inputProps={{
                                    placeholder: row["placeholder"],
                                    value: String(
                                      this.props.pageStateArray[idx][
                                        row["name"]
                                      ]
                                    ),
                                    onChange: (a, b) => {
                                      this.props.onChangeAutoSuggest(
                                        a,
                                        b,
                                        row,
                                        (c, d) =>
                                          this.handleChangeByField(c, d, idx)
                                      );
                                    },
                                    onBlur: () => {
                                      row["toValidate"]
                                        ? this.props.onblurValidatorForTable(
                                            this.props.fieldMapping,
                                            idx,
                                            row["name"]
                                          )
                                        : {};
                                    },
                                    onKeyDown: (e) => {
                                      this.onKeyPress(
                                        e,
                                        idx,
                                        this.props.pageStateArray.length,
                                        row
                                      );
                                    },
                                    disabled:
                                      this.props.pageMode == "view" ||
                                      this.props.disabledFlag == "true" ||
                                      ("isDisabled" in row && row.isDisabled({ pageState: this.props.pageState, pageMode: this.props.pageMode, idx })) 
                                      ? "disabled"
                                        : "",
                                    className: row.className,
                                  }}
                                />
                              )}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <button
                        onClick={this.handleAddRow}
                        className="item-add-btn"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <button
                onClick={this.handleRemoveRow}
                className="btn btn-danger float-right item-remove-btn"
              >
                Delete Last Row
              </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DynamicTable;
