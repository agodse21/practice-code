import { forEach, now, size } from "lodash";
import React from "react";
import numToWords from "num-to-words";
import { array, date, string } from "yup/lib/locale";
import { accountGroupTableItems } from "../config/accountMasterForm";
import { TRANSPORTER_NAME } from "../config/config";

const revertDate = (date) => {
    let newDate = date.split("-");
    return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
};

const tableStyle = {
    display: "none",
    width: "29.7cm",
    // borderStyle: "solid"
    border: "1px solid black",
}

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

const excel_bill_columns = [
    {
        Header: "Bill No",
        accessor: "bill_no",
        columnStyle: {
            width: "90px",
            minWidth: "190px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },
    {
        Header: "Bill Date",
        accessor: "bill_date",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },
    {
        Header: "Party Name",
        accessor: "party_name",
        columnStyle: {
            borderStyle: "solid",
            width: "190px",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },
    {
        Header: "Gross Amount",
        accessor: "amount",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },
    {
        Header: "Add Amt.",
        accessor: "add",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },

    // this is commented as discussed with meet it is not necessary right now
    // {
    //   Header: "Less Amt.",
    //   accessor: "less",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },
    {
        Header: "Service Tax",
        accessor: "ser_tax_amount",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
        canFilter: true,
    },
    {
        Header: "Net Amt.",
        accessor: "net_amount",
        canFilter: true,
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
];

const concillation_columns = [
    {
        Header: "Vou. Num",
        accessor: "voucher_num",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap" },
    },
    {
        Header: "Date",
        accessor: "date",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap" },
    },
    {
        Header: "Cheque No",
        accessor: "cheque_no",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap" },
    },
    {
        Header: "Party Name",
        accessor: "party",
        columnStyle: {
            borderStyle: "solid",
            width: "190px",
            minWidth: "190px",
            whiteSpace: "nowrap",
        },
        style: { whiteSpace: "nowrap" },
    },
    {
        Header: "Net Amount",
        accessor: "total_amount",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap" },
    },
];

const excel_bilty_columns = [
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        canFilter: true,
        columnStyle: {
            width: "90px",
            minWidth: "90px",
        },
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
        columnStyle: {
            width: "120px",
            minWidth: "120px",
        },
    },
    {
        Header: "Station From",
        accessor: "station_from_name",
        canFilter: true,
        columnStyle: {
            width: "100px",
            minWidth: "100px",
        },
    },
    {
        Header: "Station To",
        accessor: "station_to_name",
        canFilter: true,
    },
    {
        Header: "Consignor Name",
        accessor: "consignor_name",
        canFilter: true,
    },
    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        canFilter: true,
    },
    {
        Header: "Packages",
        accessor: "pkgs",
        canFilter: true,
        columnStyle: {
            width: "50px",
            minWidth: "50px",
        },
    },
    {
        Header: "Pay Type",
        accessor: "pay_type_name",
        canFilter: true,
    },
    {
        Header: "Total Amt",
        accessor: "total_amount",
        canFilter: true,
        columnStyle: {
            width: "70px",
            minWidth: "50px",
        },
    },
    {
        Header: "Challan",
        accessor: "booking_chalan_no",
        canFilter: true,
        columnStyle: {
            width: "70px",
            minWidth: "50px",
        },
    },
    {
        Header: "Inward Date",
        accessor: "inward_date",
        canFilter: true,
        columnStyle: {
            width: "120px",
            minWidth: "120px",
        },
    },
    {
        Header: "MR No.",
        accessor: "mr_no",
        canFilter: true,
        columnStyle: {
            width: "70px",
            minWidth: "50px",
        },
    },
    {
        Header: "Trip No.",
        accessor: "trip_no",
        canFilter: true,
        columnStyle: {
            width: "70px",
            minWidth: "50px",
        },
    },
    {
        Header: "User",
        accessor: "created_by",
        canFilter: true,
    },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },


];

const excel_pending_partb_columns = [
    {
      Header: "EWB No",
      accessor: "ewb_no",
      width: "120px",
      minWidth: "120px",
      canFilter: true,
    },
    {
      Header: "Bilty No",
      accessor: "bilty_no",
      width: "50px",
      minWidth: "70px",
      canFilter: true,
    },
    {
      Header: "Bilty Date",
      accessor: "bilty_date",
      width: "80px",
      minWidth: "80px",
      canFilter: true,
    },
    {
      Header: "Station From",
      accessor: "from_station",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Station To",
      accessor: "to_station",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Packages",
      accessor: "pkgs",
      width: "50px",
      minWidth: "50px",
      canFilter: true,
    },
    {
      Header: "Consignor Name",
      accessor: "consignor_name",
      width: "250px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Consignee Name",
      accessor: "consignee_name",
      width: "250px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Challan No",
      accessor: "chalan_no",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "MR No",
      accessor: "mr_no",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
        Header: "CWB No",
        accessor: "cwb_no",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },
];

const excel_vehicle_regigster_columns = [
    {
        Header: "Register Id",
        accessor: "vr_no",
        width: "110px",
        minWidth: "110px",
        canFilter: true,
    },
    {
        Header: "Vehicle No",
        accessor: "vehicle_no",
        width: "110px",
        minWidth: "110px",
        canFilter: true,
    },
    {
        Header: "Letter No",
        accessor: "letter_no",
        width: "110px",
        minWidth: "110px",
        canFilter: true,
    },
    {
        Header: "Memo No",
        accessor: "memo_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    {
        Header: "Register Date",
        accessor: "register_date",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Lorry No",
        accessor: "lorry_no",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Freight",
        accessor: "freight",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Transport Name",
        accessor: "transport_name",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Station",
        accessor: "station_name",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Received Date",
        accessor: "received_date",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Remarks",
        accessor: "remarks",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Received Amount",
        accessor: "received_amount",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Payment Method",
        accessor: "payment_method",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Cheque details",
        accessor: "cheque_details",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "receiver details",
        accessor: "receiver_detail",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "Date",
        accessor: "x_date",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
];
const pod_statement_columns = [
    {
        Header: 'POD Statement No',
        accessor: 'pod_statement_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Party Name',
        accessor: 'party_name',
        canFilter: true,
        width: '350px',
        minWidth: '350px'
    },
    {
        Header: ' Statement Date',
        accessor: 'pod_statement_date',
        canFilter: true,
        width: '100px',
        minWidth: '80px'
    },
    {
        Header: ' Received Date',
        accessor: 'pod_receive_date',
        canFilter: true,
        width: '100px',
        minWidth: '90px'
    },
    {
        Header: 'Bilties',
        accessor: 'no_of_bilties',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
];

const mr_pending_report_columns = [
    {
        Header: 'Sr No',
        accessor: 'register_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Branch',
        accessor: 'branch',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Date',
        accessor: 'date',
        canFilter: false,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Mr No',
        accessor: 'mr_no',
        canFilter: false,
        width: '90px',
        minWidth: '90px'
    },
    // {
    //     Header: 'Mr ID',
    //     accessor: 'mr_id',
    //     canFilter: false,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    // {
    //     Header: 'Mr Register Id',
    //     accessor: 'mr_register_id',
    //     canFilter: false,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    {
        Header: 'Debit Amount',
        accessor: 'debit_amount',
        canFilter: false,
        width: '150px',
        minWidth: '150px'
    },
    {
        Header: 'Party Name',
        accessor: 'party_name',
        canFilter: true,
        width: '150px',
        minWidth: '150px'
    },
    {
        Header: 'Credit Amount',
        accessor: 'credit_amount',
        canFilter: false,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Credit Date',
        accessor: 'credit_date',
        canFilter: false,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Credit Type',
        accessor: 'credit_type',
        canFilter: false,
        width: '100px',
        minWidth: '100px'
    },
    {
        Header: 'Cheque No',
        accessor: 'cheque_no',
        canFilter: false,
        width: '120px',
        minWidth: '120px'
    },
    {
        Header: 'Remarks',
        accessor: 'remarks',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
];
const vehicle_report_columns = [
    {
      Header: "Vehicle No",
      accessor: "vehicle_no",
      width: "110px",
      minWidth: "110px",
      canFilter: true,
    },
    {
      Header: "Pan No",
      accessor: "pan_no",
      width: "130px",
      minWidth: "130px",
      canFilter: true,
    },
    {
      Header: "Owner Name",
      accessor: "owner_name",
      width: "130px",
      minWidth: "130px",
      canFilter: true,
    },
    {
      Header: "Owner Address",
      accessor: "owner_address",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Policy No",
      accessor: "policy_no",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Driver Name",
      accessor: "driver_name",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Ownership",
      accessor: "vehicle_ownership",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Second Owner Name",
      accessor: "second_owner_name",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Third Owner Name",
      accessor: "third_owner_name",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Created From",
      accessor: "created_from_name",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Created By",
      accessor: "created_by_name",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Verified By",
      accessor: "verified_by",
      width: "100px",
      minWidth: "100px",
      canFilter: true,
    },
    {
      Header: "Entry Date",
      accessor: "entry_date",
      width: "120px",
      minWidth: "120px",
      // Cell: ({ value }) => {
      //   value = value.split("T");
      //   return value[0];
      // },
      canFilter: true,
    },
];


const mr_statement_report_columns = [
    {
        Header: 'MR Statement No',
        accessor: 'mr_statement_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Mr Date',
        accessor: 'created_date',
        canFilter: true,
        width: '120px',
        minWidth: '120px',
        // Cell: ({ date }) => {
        //     date = date.split("T");
        //     return date[0];
        // },
    },
    {
        Header: 'To Pay',
        accessor: 'to_pay_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Hamali',
        accessor: 'hamali',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Service Charge',
        accessor: 'service_charge',
        canFilter: true,
        width: '100px',
        minWidth: '100px'
    },
    {
        Header: 'Demarage Charge',
        accessor: 'demarage_charge',
        canFilter: true,
        width: '120px',
        minWidth: '120px'
    },
    {
        Header: 'Other Charge',
        accessor: 'other_charge',
        canFilter: true,
        width: '100px',
        minWidth: '100px'
    },
    {
        Header: 'Refund',
        accessor: 'refund',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total Amount',
        accessor: 'total_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
];


const income_hisab_report_columns = [
    {
        Header: 'Sr. No',
        accessor: 'sr_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Created Date',
        accessor: 'created_date',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Branch',
        accessor: 'created_from',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'To Pay',
        accessor: 'to_pay_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Hamali',
        accessor: 'hamali',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Service Charge',
        accessor: 'service_charge',
        canFilter: true,
        width: '100px',
        minWidth: '100px'
    },
    {
        Header: 'Demarage Charge',
        accessor: 'demarage_charge',
        canFilter: true,
        width: '120px',
        minWidth: '120px'
    },
    // {
    //     Header: 'Other Charge',
    //     accessor: 'other_charge',
    //     canFilter: true,
    //     width: '100px',
    //     minWidth: '100px'
    // },
    {
        Header: 'Refund',
        accessor: 'refund',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total Amount',
        accessor: 'total_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Mr No',
        accessor: 'mr_range',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
];
const paid_hisab_report_columns = [
    {
        Header: 'Sr. No',
        accessor: 'sr_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Created Date',
        accessor: 'created_date',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Branch',
        accessor: 'created_from',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Paid Statement No',
        accessor: 'paid_statement_no',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total Amount',
        accessor: 'total_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    
];
const fleet_management_report_columns = [
    {
        Header: 'Date',
        accessor: 'trip_date',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Trip No',
        accessor: 'trip_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'From',
        accessor: 'station_from_name',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'To',
        accessor: 'station_to_name',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Total LH',
        accessor: 'total_lh',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    
    // {
    //     Header: 'Driver Name',
    //     accessor: 'driver_name',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    // {
    //     Header: 'Vehicle No',
    //     accessor: 'vehicle_no',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    {
        Header: 'Advance',
        accessor: 'advance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance',
        accessor: 'balance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Truck Freight REC',
        accessor: 'truck_freight',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Silak from R.C.C.',
        accessor: 'silak',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Cash',
        accessor: 'cash',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Bank',
        accessor: 'bank',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: '',
        accessor: '',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Diesel',
        accessor: 'diesel',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Rassa',
        accessor: 'rassa',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Hamali',
        accessor: 'hamali',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Tollnaka',
        accessor: 'toll',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Bhattha',
        accessor: 'bhattha',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Driver Salary',
        accessor: 'salary',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'R.T.O',
        accessor: 'rto',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'MIS',
        accessor: 'miscellaneous',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Truck Insurance',
        accessor: 'insurance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Telephone',
        accessor: 'telephone',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Tyre Repairing',
        accessor: 'repair_tyre',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Body Repairing',
        accessor: 'repair_body',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'General Repairing',
        accessor: 'repair_gen',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Cash Received by Driver',
        accessor: 'cash_driver',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Commission',
        accessor: 'commission',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance Freight',
        accessor: 'balance_freight',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total Amount',
        accessor: 'total_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance Type',
        accessor: 'balance_type',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    // {
    //     Header: 'MIS',
    //     accessor: 'balance_type',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
];

const vehicle_fleet_report_columns = [
    {
        Header: 'FM No.',
        accessor: 'fleet_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Date',
        accessor: 'trip_date',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Trip No',
        accessor: 'trip_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'From',
        accessor: 'station_from_name',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'To',
        accessor: 'station_to_name',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Silak from R.C.C.',
        accessor: 'silak',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total LH',
        accessor: 'total_lh',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    
    // {
    //     Header: 'Driver Name',
    //     accessor: 'driver_name',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    // {
    //     Header: 'Vehicle No',
    //     accessor: 'vehicle_no',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
    {
        Header: 'Advance',
        accessor: 'advance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance',
        accessor: 'balance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Truck Freight REC',
        accessor: 'truck_freight',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Cash',
        accessor: 'cash',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Bank',
        accessor: 'bank',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: '',
        accessor: '',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Diesel',
        accessor: 'diesel',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Rassa',
        accessor: 'rassa',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Hamali',
        accessor: 'hamali',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Tollnaka',
        accessor: 'toll',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Bhattha',
        accessor: 'bhattha',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Driver Salary',
        accessor: 'salary',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'R.T.O',
        accessor: 'rto',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'MIS',
        accessor: 'miscellaneous',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Truck Insurance',
        accessor: 'insurance',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Telephone',
        accessor: 'telephone',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Tyre Repairing',
        accessor: 'repair_tyre',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Body Repairing',
        accessor: 'repair_body',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'General Repairing',
        accessor: 'repair_gen',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Cash Received by Driver',
        accessor: 'cash_driver',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Commission',
        accessor: 'commission',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance Freight',
        accessor: 'balance_freight',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Expenses',
        accessor: 'total_debit',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Total Amount',
        accessor: 'total_amount',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    {
        Header: 'Balance Type',
        accessor: 'balance_type',
        canFilter: true,
        width: '90px',
        minWidth: '90px'
    },
    // {
    //     Header: 'MIS',
    //     accessor: 'balance_type',
    //     canFilter: true,
    //     width: '90px',
    //     minWidth: '90px'
    // },
];

const paid_statement_report_columns = [
    {
        Header: "Paid Statement No",
        accessor: "paid_statement_no",
        width: "200px",
        minWidth: "200px",
        canFilter: true,
    },
    {
        Header: "Paid Statement Date",
        accessor: "paid_statement_date",
        width: "200px",
        minWidth: "200px",
        canFilter: true,
    },
    {
        Header: "Total Amount",
        accessor: "total_amount",
        width: "200px",
        canFilter: true,
    },
    {
        Header: "Created By",
        accessor: "created_by_name",
        width: "200px",
        canFilter: true,
    },
];

const excel_ack_pending_columns = [
    {
        Header: "Sr No",
        accessor: "sr_no",
        width: "70px",
        minWidth: "70px",
        canFilter: true,
    },

    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "120px",
        minWidth: "120px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    {
        Header: "Consignor Name",
        accessor: "consignor_name",
        canFilter: true,
    },
    {
      Header: "Consignee Name",
      accessor: "consignee_name",
      canFilter: true,
    },
    {
        Header: "Packages",
        accessor: "no_of_package",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },
    {
        Header: "From Station",
        accessor: "station_from_name",
        canFilter: true,
    },
    {
        Header: "To Station",
        accessor: "station_to_name",
        canFilter: true,
    },

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },
    // {
    //   Header: "Total Amt",
    //   accessor: "total_amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },

    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
];

const brokerage_summary_excel_columns = [
    {
        Header: "MF. NO.",
        accessor: "trip_no",
        width: "70px",
        minWidth: "70px",
        canFilter: true,
    },
    {
        Header: "DATE",
        accessor: "date",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "LORRY NO",
        accessor: "vehicle_no",
        width: "120px",
        minWidth: "120px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    {
        Header: "TO PAY",
        accessor: "to_pay",
        canFilter: true,
    },
    // {
    //   Header: "Consignee Name",
    //   accessor: "consignee_name",
    //   canFilter: true,
    // },
    {
        Header: "PAID",
        accessor: "paid",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },
    {
        Header: "T.B.B.",
        accessor: "tbb",
        canFilter: true,
    },

    {
        Header: "CROSSING",
        accessor: "less",
        canFilter: true,
    },
    // {
    //   Header: "Total Amt",
    //   accessor: "total_amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },

    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
];

const excel_pod_statement_columns = [
    {
        Header: "Sr No",
        accessor: "sr_no",
        width: "70px",
        minWidth: "70px",
        canFilter: true,
    },
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "65px",
        minWidth: "90px",
        canFilter: true,
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "70px",
        minWidth: "100px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    // {
    //   Header: "Consignor Name",
    //   accessor: "consignor_name",
    //   width: "120px",
    //   minWidth: "120px",
    //   canFilter: true,
    // },
    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },

    {
        Header: "Case",
        accessor: "no_of_package",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },

    //removed because jeet asked to via yash  on 17th jul 2021

    {
        Header: "Station To",
        accessor: "station_to_name",
        canFilter: true,
    },

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },
    // {
    //   Header: "Total Amt",
    //   accessor: "total_amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },

    //removed because jeet asked to via yash  on 17th jul 2021
    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    {
        Header: "Remarks",
        accessor: "remarks",
        width: "190px",
        minWidth: "180px",
        canFilter: true,
    },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
];

const excel_party_bill_columns = [
    {
        Header: "Sr No",
        accessor: "sr_no",
        width: "70px",
        minWidth: "70px",
        canFilter: true,
    },
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "65px",
        minWidth: "90px",
        canFilter: true,
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "70px",
        minWidth: "100px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    {
        Header: "Station To",
        accessor: "station_to_name",
        canFilter: true,
    },
    {
        Header: "Invoice",
        accessor: "private_marka_no",
        canFilter: true,
    },
    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },
    {
        Header: "Description",
        accessor: "item_name",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },
    {
        Header: "DD",
        accessor: "door_del_charge",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },
    {
        Header: "Case",
        accessor: "pkgs",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },
    {
        Header: "Weight",
        accessor: "weight",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },
    {
        Header: "Rate",
        accessor: "rate",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },
    {
        Header: "Amount",
        accessor: "item_amount",
        canFilter: true,
        width: "35px",
        minWidth: "50px",
    },

    //removed because jeet asked to via yash  on 17th jul 2021

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },
    // {
    //   Header: "Total Amt",
    //   accessor: "total_amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },

    //removed because jeet asked to via yash  on 17th jul 2021
    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Remarks",
    //   accessor: "remarks",
    //   width: "190px",
    //   minWidth: "180px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
];

const admin_report_excel_data = [
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "120px",
        minWidth: "120px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    {
        Header: "Consignor Name",
        accessor: "consignor_name",
        canFilter: true,
    },

    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        canFilter: true,
    },

    {
        Header: "Private Marka",
        accessor: "private_marka_no",
        canFilter: true,
    },
    {
        Header: "Station To",
        accessor: "station_to_name",
        canFilter: true,
    },

    {
        Header: "Case",
        accessor: "pkgs",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    {
        Header: "Weight",
        accessor: "weight",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    {
        Header: "Rate",
        accessor: "rate",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    {
        Header: "Amount",
        accessor: "amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    {
        Header: "DD",
        accessor: "door_del_charge",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },
    {
        Header: "Collection Amt",
        accessor: "collection_amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },
    {
        Header: "Total Amt",
        accessor: "total_amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },

    // {
    //   Header: "Item",
    //   accessor: "item_name",
    //   canFilter: true,
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },
];

const admin_print_excel_data = [
    {
        Header: "Sr No",
        accessor: "sr_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "120px",
        minWidth: "120px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },

    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        canFilter: true,
    },
    // {
    //   Header: "Consignor Name",
    //   accessor: "consignor_name",
    //   canFilter: true,
    // },
    {
        Header: "Weight",
        accessor: "charge_weight",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    {
        Header: "To Station",
        accessor: "station_to_name",
        canFilter: true,
    },

    {
        Header: "Nos",
        accessor: "pkgs",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    {
        Header: "Item Name",
        accessor: "item_name",
        canFilter: true,
    },

    {
        Header: "BiltyType",
        accessor: "pay_type_name",
        canFilter: true,
    },
    {
        Header: "Collection Amt",
        accessor: "collection_amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },
    {
        Header: "NetAmt",
        accessor: "total_amount",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },
    {
        Header: "Acknow Dt.",
        accessor: "ack_date",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    {
        Header: "Challan",
        accessor: "booking_chalan_no",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    {
        Header: "Private Marka",
        accessor: "private_marka_no",
        canFilter: true,
    },

    {
        Header: "MR No.",
        accessor: "mr_no",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    {
        Header: "MR Date.",
        accessor: "mr_date",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },

    // {
    //   Header: "Rate",
    //   accessor: "rate",
    //   canFilter: true,
    //   width: "50px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Amount",
    //   accessor: "amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "DD",
    //   accessor: "door_del_charge",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },
];

const excel_pod_columns = [
    {
        Header: "Bilty No",
        accessor: "bilty_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    //   {
    //     Header: "Suffix",
    //     accessor: "suffix",
    //     width: "50px",
    //     minWidth: "50px",
    //     canFilter: true,
    //   },
    {
        Header: "Bilty Date",
        accessor: "bilty_date",
        width: "100px",
        minWidth: "100px",
        Cell: ({ value }) => {
            value = value.split("T");
            return value[0];
        },
        canFilter: true,
    },
    {
        Header: "Consignor Name",
        accessor: "consignor_name",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },
    {
        Header: "Consignee Name",
        accessor: "consignee_name",
        width: "120px",
        minWidth: "120px",
        canFilter: true,
    },

    {
        Header: "Packages",
        accessor: "no_of_package",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },

    //removed because jeet asked to via yash  on 17th jul 2021

    // {
    //   Header: "Station To",
    //   accessor: "station_to_name",
    //   canFilter: true,
    // },

    // {
    //   Header: "Pay Type",
    //   accessor: "pay_type_name",
    //   canFilter: true,
    // },
    // {
    //   Header: "Total Amt",
    //   accessor: "total_amount",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "MR No.",
    //   accessor: "mr_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },

    //removed because jeet asked to via yash  on 17th jul 2021
    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },

    // {
    //   Header: "Destination",
    //   accessor: "destination_name",
    // },

    // {
    //   Header: "Challan",
    //   accessor: "booking_chalan_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },

    // {
    //   Header: "Trip No.",
    //   accessor: "trip_no",
    //   canFilter: true,
    //   width: "70px",
    //   minWidth: "50px",
    // },
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

const excel_trip_columns = [
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
        Header: "Owner",
        accessor: "vehicle_ownership",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   if (value == "1"){
        //     return "Other"
        //   }
        //   else{
        //     return "Self"
        //   }
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
        Header: "Bhada Paid Branch",
        accessor: "bhada_paid_branch_name",
        width: "150px",
        minWidth: "150px",
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

const excel_mr_columns = [
    {
        Header: 'MR No',
        accessor: 'mr_no',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Mr Date',
        accessor: 'mr_date',
        canFilter: true,
        width: '72px',
        minWidth: '72px'
    },
    {
        Header: 'Bilty No',
        accessor: 'bilty_no',
        canFilter: true,
        width: '70px',
        minWidth: '70px'
    },
    {
        Header: 'Party Name',
        accessor: 'party_name',
        canFilter: true,
        width: '250px',
        minWidth: '250px'
    },
    {
        Header: 'To Pay',
        accessor: 'to_pay_amount',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Hamali',
        accessor: 'hamali',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Service',
        accessor: 'service_charge',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Demarage',
        accessor: 'demarage_charge',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Other',
        accessor: 'other_charge',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Refund',
        accessor: 'refund',
        canFilter: true,
        width: '60px',
        minWidth: '60px'
    },
    {
        Header: 'Total',
        accessor: 'total_amount',
        canFilter: true,
        width: '80px',
        minWidth: '80px'
    },
    {
        Header: 'Marfatiya',
        accessor: 'marfatiya',
        canFilter: true,
        width: '65px',
        minWidth: '65px'
    },
    {
        Header: 'Created By',
        accessor: 'created_by',
        canFilter: true,
        width: '75px',
        minWidth: '75px'
    },
];

const excel_tds_columns = [
    {
        Header: "Pan No",
        accessor: "pan_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    // {
    //   Header: "Trip Date",
    //   accessor: "trip_date",
    //   width: "120px",
    //   minWidth: "120px",
    //   // Cell: ({ value }) => {
    //   //   value = value.split("T");
    //   //   return value[0];
    //   // },
    //   canFilter: true,
    // },
    {
        Header: "Truck",
        accessor: "truck_no",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
    },
    {
        Header: "Owner",
        accessor: "owner_name",
        width: "200px",
        minWidth: "200px",
        // Cell: ({ value }) => {
        //   if (value == "1"){
        //     return "Other"
        //   }
        //   else{
        //     return "Self"
        //   }
        // },
        canFilter: true,
    },
    // {
    //   Header: "Station From",
    //   accessor: "station_from_name",
    //   width: "100px",
    //   minWidth: "100px",
    //   canFilter: true,
    // },
    // {
    //   Header: "Station To",
    //   accessor: "station_to_name",
    //   canFilter: true,
    // },
    {
        Header: "Total Amt",
        accessor: "total_amount",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    {
        Header: "Advance",
        accessor: "advance",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    {
        Header: "Balance",
        accessor: "balance",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    {
        Header: "TDS Amount",
        accessor: "tds_amount",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    {
        Header: "Net Balance",
        accessor: "net_balance",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    {
        Header: "Tds Received",
        accessor: "paid_tds",
        canFilter: true,
        width: "80px",
        minWidth: "80px",
    },
    // {
    //   Header: "Bhada Paid Date",
    //   accessor: "bhada_paid_date",
    //   width: "120px",
    //   minWidth: "120px",
    //   // Cell: ({ value }) => {
    //   //   value = value.split("T");
    //   //   return value[0];
    //   // },
    //   canFilter: true,
    // },
    // {
    //   Header: "User",
    //   accessor: "created_by",
    //   canFilter: true,
    // },
];

const excel_vinod_columns = [
    {
        Header: "memo_no",
        accessor: "memo_no",
        width: "90px",
        minWidth: "90px",
        canFilter: true,
    },
    {
        Header: "Date",
        accessor: "date",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
    },
    {
        Header: "station_from",
        accessor: "station_from",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   value = value.split("T");
        //   return value[0];
        // },
        canFilter: true,
    },
    {
        Header: "station_to",
        accessor: "station_to",
        width: "120px",
        minWidth: "120px",
        // Cell: ({ value }) => {
        //   if (value == "1"){
        //     return "Other"
        //   }
        //   else{
        //     return "Self"
        //   }
        // },
        canFilter: true,
    },
    {
        Header: "station_to_name",
        accessor: "station_to_name",
        width: "100px",
        minWidth: "100px",
        canFilter: true,
    },
    {
        Header: "created_from",
        accessor: "created_from",
        canFilter: true,
    },
    {
        Header: "created_from_name",
        accessor: "created_from_name",
        canFilter: true,
    },
    {
        Header: "paid",
        accessor: "paid",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },
    {
        Header: "to_pay",
        accessor: "to_pay",
        canFilter: true,
        width: "50px",
        minWidth: "50px",
    },
    {
        Header: "tbb",
        accessor: "tbb",
        canFilter: true,
        width: "70px",
        minWidth: "50px",
    },
];

const account_report_columns = [
    // {
    //   Header: "Date",
    //   accessor: "created_date",
    //   width: "90px",
    //   minWidth: "90px",
    // },
    {
        accessor: "voucher_det",
        Header: "Vou No.",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: {
            whiteSpace: "nowrap", borderStyle: "", fontSize: "90%", border: '1px solid rgb(186, 186, 186)'
        },
    },
    {
        accessor: "party_name",
        Header: "Account Head",
        columnStyle: {
            width: "250px",
            minWidth: "250px",
            whiteSpace: "nowrap",
            borderStyle: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: { whiteSpace: "nowrap", borderStyle: "", fontSize: "90%", border: '1px solid rgb(186, 186, 186)' }
    },
    {
        accessor: "cheque_no",
        Header: "Cheque No.",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: { whiteSpace: "nowrap", borderStyle: "", fontSize: "90%", border: '1px solid rgb(186, 186, 186)' },
    },
    {
        accessor: "debit",
        Header: "Debit",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "blue",
            borderColor: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "blue",
            borderColor: "",
            fontWeight: "",
            fontSize: "90%",
            border: '1px solid rgb(186, 186, 186)'
        },
    },
    {
        accessor: "credit",
        Header: "Credit",

        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "#C71585",
            borderColor: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "#C71585",
            borderColor: "",
            fontSize: "90%",
            border: '1px solid rgb(186, 186, 186)'
        },
    },
    {
        accessor: "balance",
        Header: "Balance",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "red",
            borderColor: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "",
            color: "red",
            borderColor: "",
            fontSize: "90%",
            border: '1px solid rgb(186, 186, 186)'
        },
    },
    // {
    //   accessor: "voucher_type",
    //   Header: "Vou. Type",
    //   width: "90px",
    //   minWidth: "90px",
    // },

    {
        accessor: "balance_type",
        Header: "",
        columnStyle: {
            width: "26px",
            minWidth: "26px",
            whiteSpace: "nowrap",
            borderStyle: "",
            fontWeight: "bolder",
            border: '1px solid rgb(186, 186, 186)',
        },
        style: { whiteSpace: "nowrap", borderStyle: "", fontSize: "90%", border: '1px solid rgb(186, 186, 186)' },
    },

    // {
    //   type: "text",
    //   name: "created_from",
    //   label: "Created From",`
    //   className: "form-control-large-col",
    // },
];

const account_report_report_columns = [
    {
        Header: "Date",
        accessor: "date",
        columnStyle: {
            width: "70px",
            minWidth: "70px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Vou. No.",
        accessor: "voucher_det",
        columnStyle: {
            width: "55px",
            minWidth: "55px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Description",
        accessor: "party_name",
        columnStyle: {
            width: "195px",
            minWidth: "195px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Cheque No",
        accessor: "cheque_no",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Debit",
        accessor: "debit",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Credit",
        accessor: "credit",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Balance",
        accessor: "balance",
        columnStyle: {
            width: "65px",
            minWidth: "65px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "",
        accessor: "balance_type",
        columnStyle: {
            width: "25px",
            minWidth: "25px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
]

const challan_report_columns = [
    {
        Header: "Challan No",
        accessor: "booking_chalan_no",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Challan Date",
        accessor: "booking_chalan_date",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Vehicle No",
        accessor: "vehicle_no",
        columnStyle: {
            width: "120px",
            minWidth: "120px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Station From",
        accessor: "station_from_name",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Station To",
        accessor: "station_to_name",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "No Of Pkgs",
        accessor: "no_of_pkgs",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Total Weight",
        accessor: "total_weight",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "To Pay",
        accessor: "to_pay",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Paid",
        accessor: "paid",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "CEWB No.",
        accessor: "cewb_no",
        columnStyle: {
            width: "120px",
            minWidth: "120px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Inwarded",
        accessor: "inwarded",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        Header: "Created By",
        accessor: "created_by_name",
        columnStyle: {
            width: "140px",
            minWidth: "140px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
]

const crossing_outward_report_columns = [
    // {
    //   Header: "Date",
    //   accessor: "created_date",
    //   width: "90px",
    //   minWidth: "90px",
    // },
    {
        accessor: "crossing_outward_no",
        Header: "Cr Challan No",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_outward_date",
        Header: "Date",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "transporter_name",
        Header: "Transporter Name ",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "no_of_bilties",
        Header: "No Of Bilty",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "no_of_pkgs",
        Header: "No Of Pkgs",

        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "#C71585",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "#C71585",
            borderColor: "black",
        },
    },
    {
        accessor: "paid_amount",
        Header: "Paid Booking",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "red",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "red",
            borderColor: "black",
        },
    },
    // {
    //   accessor: "voucher_type",
    //   Header: "Vou. Type",
    //   width: "90px",
    //   minWidth: "90px",
    // },

    {
        accessor: "tbb_amount",
        Header: "TBB Booking",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },

    {
        accessor: "to_pay_amount",
        Header: "To Pay Booking",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_amount",
        Header: "Crossing Amount",
        columnStyle: {
            width: "120px",
            minWidth: "120px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "debit",
        Header: "Debit Amt.",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "credit",
        Header: "Credit Amt.",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },

    // {
    //   type: "text",
    //   name: "created_from",
    //   label: "Created From",
    //   className: "form-control-large-col",
    // },
];

const crossing_inward_report_columns = [
    {
        accessor: "crossing_inward_no",
        Header: "Cr Chall No",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_inward_date",
        Header: "Cr. Date",
        columnStyle: {
            width: "120px",
            minWidth: "120px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "transporter_name",
        Header: "Transport",
        columnStyle: {
            width: "250px",
            minWidth: "250px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "no_of_bilties",
        Header: "Bilties",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "no_of_pkgs",
        Header: "Packages",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "to_pay_amount",
        Header: "To Pay",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "door_del_charge",
        Header: "Door Del.",
        columnStyle: {
            width: "100px",
            minWidth: "100px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "crossing_amount",
        Header: "Crossing Hr.",

        columnStyle: {
            width: "100px",
            minWidth: "100px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "#C71585",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "#C71585",
            borderColor: "black",
        },
    },
    {
        accessor: "credit",
        Header: "Credit",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "red",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "red",
            borderColor: "black",
        },
    },
    {
        accessor: "debit",
        Header: "Debit",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
];

const party_rate_master_report_columns = [
    {
        accessor: "station_from_name",
        Header: "Station From",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "station_to_name",
        Header: "Station To",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "item_name",
        Header: "Item Name",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "unit",
        Header: "Unit",
        columnStyle: {
            width: "60px",
            minWidth: "60px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "truck_size",
        Header: "Truck Size",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "rate",
        Header: "Rate",
        columnStyle: {
            width: "60px",
            minWidth: "60px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "commission",
        Header: "Commission",
        columnStyle: {
            width: "100px",
            minWidth: "100px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
];

const party_rate_master_report_bottom_columns = [
    {
        accessor: "station_from_name",
        Header: "Station From",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "station_to_name",
        Header: "Station To",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "consignee_name",
        Header: "Consignee Name",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "item_name",
        Header: "Item Name",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "charge_name",
        Header: "Charge Type",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "charge_type_name",
        Header: "Apply Type",
        columnStyle: {
            width: "150px",
            minWidth: "150px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "qty_from_case",
        Header: "From(c)",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "qty_to_case",
        Header: "To(c)",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "qty_from_kg",
        Header: "From(w)",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "qty_to_kg",
        Header: "To(w)",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
    {
        accessor: "amount",
        Header: "Amount",
        columnStyle: {
            width: "80px",
            minWidth: "80px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
        style: {
            whiteSpace: "nowrap",
            borderStyle: "solid",
            // color: "blue",
            borderColor: "black",
        },
    },
];


const balance_sheet_columns = [
    // {
    //   Header: "Date",
    //   accessor: "created_date",
    //   width: "90px",
    //   minWidth: "90px",
    // },
    {
        accessor: "crossing_outward_no",
        Header: "Account Name",
        columnStyle: {
            width: "355px",
            minWidth: "355px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "transporter_name",
        Header: "Expenditure(Dr)",
        columnStyle: {
            width: "103px",
            minWidth: "103px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_outward_date",
        Header: "Income(Cr)",
        columnStyle: {
            width: "103px",
            minWidth: "103px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
];

const balance_sheet_data = [
    // {
    //   Header: "Date",
    //   accessor: "created_date",
    //   width: "90px",
    //   minWidth: "90px",
    // },
    {
        accessor: "account_name",
        Header: "Account Name",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_outward_date",
        Header: "Amout (Dr)",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "transporter_name",
        Header: "Amout (Cr)",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
];

const inward_bill_columns = [
    {
        accessor: "sr_no",
        Header: "NO",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "date",
        Header: "DATE",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "memo_no",
        Header: "MEMO",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "bilty_no",
        Header: "LR NO",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "no_of_pkgs",
        Header: "PKG",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "description",
        Header: "DESCRIPTION",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "crossing_amt",
        Header: "CROSSING",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "dd_charge",
        Header: "D/D",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "to_pay",
        Header: "TO PAY",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "amt",
        Header: "AMT",
        columnStyle: {
            width: "90px",
            minWidth: "90px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
    {
        accessor: "dr_cr",
        Header: "Dr/Cr",
        columnStyle: {
            width: "200px",
            minWidth: "200px",
            whiteSpace: "nowrap",
            borderStyle: "solid",
        },
        style: { whiteSpace: "nowrap", borderStyle: "solid" },
    },
];

function inward_bill_excel(data, date) {
    let total_pkg = 0;
    let total_crossing = 0;
    let total_dd = 0;
    let total_to_pay = 0;
    let total_amt = 0;
    let net_debit_balance = 0;
    data = {
        transporter_name: "TAKATUKA TRANSPORT",
        branch_name: "SARKHEJ",
        branch_address:
            "1,PRIME ESTATE,NR. ATUL SHAKTI GODOWN,UJALA CHOWKDI,SARKHEJ",
        bill_no: 1,
        bill_date: "17-09-2021",
        from_date: "01-05-2021",
        to_date: "16-10-2021",
        credit: 0,
        debit: 1610,
        bilty_info: [
            {
                memo_no: 2,
                date: "09-07-2021",
                crossing_amt: 0,
                to_pay: 0,
                credit: 0,
                debit: 750,
                bilty_no: 5766,
                no_of_pkgs: 1,
                description: "BIKE",
                dd_charge: null,
                our_freight: 750,
            },
            {
                memo_no: 5,
                date: "14-07-2021",
                crossing_amt: 0,
                to_pay: 0,
                credit: 0,
                debit: 160,
                bilty_no: 6013,
                no_of_pkgs: 2,
                description: "HOUSEHOLD",
                dd_charge: null,
                our_freight: 160,
            },
            {
                memo_no: 10,
                date: "26-07-2021",
                crossing_amt: 0,
                to_pay: 0,
                credit: 0,
                debit: 750,
                bilty_no: 6590,
                no_of_pkgs: 1,
                description: "ACTIVA",
                dd_charge: null,
                our_freight: 750,
            },
            {
                memo_no: 14,
                date: "07-07-2021",
                crossing_amt: 130,
                to_pay: 130,
                credit: 50,
                debit: 0,
                bilty_no: 5580,
                no_of_pkgs: 2,
                description: "MEDICINE",
                dd_charge: null,
                our_freight: 80,
            },
        ],
    };
    date = date.dateState;
    console.log("data inward", data);
    if (data) {
        for (let i = 0; i < data["bilty_info"].length; i++) {
            data["bilty_info"][i]["sr_no"] = i + 1;
            total_pkg += data["bilty_info"][i]["no_of_pkgs"];
            total_crossing += data["bilty_info"][i]["crossing_amt"];
            total_dd += data["bilty_info"][i]["dd_charge"];
            total_to_pay += data["bilty_info"][i]["to_pay"];
            if (data["bilty_info"][i]["credit"] > data["bilty_info"][i]["debit"]) {
                data["bilty_info"][i]["dr_cr"] = "Cr";
                data["bilty_info"][i]["amt"] =
                    "-" + String(data["bilty_info"][i]["credit"]);
                total_amt -= data["bilty_info"][i]["credit"];
            } else {
                data["bilty_info"][i]["dr_cr"] = "Dr";
                data["bilty_info"][i]["amt"] = String(data["bilty_info"][i]["debit"]);
                total_amt += data["bilty_info"][i]["debit"];
            }
        }
    }

    // console.log("balance sheet report data", final_data_list);
    // date = data["dateState"];
    console.log("date is ", date);
    // excel_rep_data = data["data"];

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="inward_bill_excel">
            <thead>
                <tr>
                    <th
                        colSpan="11"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {" "}
                        Subject To{" "}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </th>
                </tr>
                <tr>
                    <th colSpan="11" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}
                    </th>
                </tr>
                <tr>
                    <th
                        colSpan="11"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {data.branch_address}
                    </th>
                </tr>
                <tr>
                    <th
                        colSpan="11"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        INWARD FREIGHT BILL
                    </th>
                </tr>
                <tr>
                    <td
                        colSpan="6"
                        style={{
                            fontWeight: "bold",
                            borderTopStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        M/S.
                    </td>
                    <td
                        colSpan="5"
                        style={{
                            fontWeight: "bold",
                            borderTopStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        CROSSING BILL NO : {data.bill_no}
                    </td>
                </tr>
                <tr>
                    <td
                        colSpan="6"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    >
                        {data.transporter_name}
                    </td>
                    <td
                        colSpan="5"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    >
                        CROSSING BILL DATE : {data.bill_date}
                    </td>
                </tr>
                <tr>
                    <td
                        colSpan="6"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    >
                        {data.branch_name}
                    </td>
                    <td
                        colSpan="5"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    >
                        CROSSING BILL PERIOD
                    </td>
                </tr>
                <tr>
                    <td
                        colSpan="6"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    ></td>
                    <td
                        colSpan="5"
                        style={{ fontWeight: "bold", borderRightStyle: "solid" }}
                    >
                        FROM DATE : {data.from_date}
                    </td>
                </tr>
                <tr>
                    <td
                        colSpan="6"
                        style={{
                            fontWeight: "bold",
                            borderBottomStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    ></td>
                    <td
                        colSpan="5"
                        style={{
                            fontWeight: "bold",
                            borderBottomStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        TO DATE : {data.to_date}
                    </td>
                </tr>
                <tr>
                    {inward_bill_columns.map((column) => (
                        <td align="left" style={column.columnStyle}>
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["bilty_info"].map((data) => (
                    <tr>
                        {inward_bill_columns.map((cell) => (
                            <td>{data[cell.accessor]}</td>
                        ))}
                    </tr>
                ))}

                <tr>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}></td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}></td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}></td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}></td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }} v>
                        {total_pkg}
                    </td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}></td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {total_crossing}
                    </td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {total_dd}
                    </td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {total_to_pay}
                    </td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {total_amt}
                    </td>
                    <td style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {total_amt < 0 ? "Cr" : "Dr"}
                    </td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="right"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        NET DEBIT BALANCE : {net_debit_balance} (dummy)
                    </td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="left"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        Amount In Words :
                    </td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="left"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        {numToWords(Number(net_debit_balance)) + " only"} (dummy)
                    </td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="right"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    >
                        {" "}
                        {"For, " + TRANSPORTER_NAME}
                    </td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="right"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                        }}
                    ></td>
                </tr>

                <tr>
                    <td
                        colSpan="11"
                        align="right"
                        style={{
                            fontWeight: "bold",
                            borderLeftStyle: "solid",
                            borderRightStyle: "solid",
                            borderBottomStyle: "solid",
                        }}
                    >
                        AUTHORISED
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function balance_sheet_excel(data, date, reportType) {
    console.log("data in profit loss is : ", data, date, reportType);
    // date.date_from = date.date_from.toISOString();
    // date.date_to = date.date_to.toISOString();

    date.date_from = new Date(date.date_from);
    date.date_to = new Date(date.date_to);

    if (reportType == "bs") {
        reportType = "Balance Sheet"
    }
    else if (reportType == "pl") {
        reportType = "P & L Report"
    }
    else {
        reportType = "Trial Balance Sheet"
    }

    console.log("date received is : ", date);
    let new_date = new Date();
    let temp_data_list = [];
    let final_data_list = [];
    console.log("data herhe", data);
    let totalCredit = 0, totalDebit = 0;
    if ("report" in data) {
        for (let i = 0; i < data["report"].length; i++) {
            const keys = Object.keys(data["report"][i]);
            if (i == data["report"].length - 1) {
                totalDebit = data["report"][i].dr;
                totalCredit = data["report"][i].cr;
            }

            if (keys.includes("group") && i != 0) {
                console.log("temp balance data", temp_data_list);
                final_data_list.push(temp_data_list);
                temp_data_list = [];
            }
            temp_data_list.push(data["report"][i]);
        }
        final_data_list.push(temp_data_list);
    }

    const comp = (obj1, obj2) => {
        return obj1["account_name"].localeCompare(obj2["account_name"]);
    }

    let final_sorted_data_list = final_data_list.map(grp => {
        let listOfAccounts = [];
        let newGrp = [];

        grp.forEach(obj => {
            const keys = Object.keys(obj);

            if (keys.includes("account_name")) {
                listOfAccounts.push(obj);
            }
            else {
                if (keys.includes("total") && listOfAccounts.length > 0) {
                    listOfAccounts.sort(comp);
                    newGrp.push(...listOfAccounts);
                    listOfAccounts = [];
                }
                newGrp.push(obj);
            }
        })

        return newGrp;
    })
    console.log("balance sheet report data", final_data_list);
    console.log("final balance sheet report data", final_sorted_data_list);
    // date = data["dateState"];
    // console.log("date is ", date);
    final_data_list = final_sorted_data_list;
    let grandTotalObj = {};
    // excel_rep_data = data["data"];

    const netProfit = totalCredit - totalDebit;

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="balance_sheet_excel"
        >
            <thead>
                <tr>
                    <th colSpan="3" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}
                    </th>

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
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="4"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="4"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {reportType} :{" "}
                        {String(date["date_from"].getUTCDate()) +
                            "/" +
                            String(date["date_from"].getUTCMonth() + 1) +
                            "/" +
                            String(date["date_from"].getUTCFullYear())}{" "}
                        To{" "}
                        {String(date["date_to"].getUTCDate()) +
                            "/" +
                            String(date["date_to"].getUTCMonth() + 1) +
                            "/" +
                            String(date["date_to"].getUTCFullYear())}{" "}
                    </th>
                </tr>
                <tr>
                    <td colspan="4" align="center">
                        {String(new_date.getUTCDate()) +
                            "/" +
                            String(new_date.getUTCMonth() + 1) +
                            "/" +
                            String(new_date.getUTCFullYear())}{" "}
                        {String(new_date.getHours()) + ":" + String(new_date.getMinutes())}
                    </td>
                </tr>
                <tr></tr>
                <tr>
                    {balance_sheet_columns.map((column) => (
                        <td align="left" style={column.columnStyle}>
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {final_data_list.map((data) => {
                    return (
                        <React.Fragment>
                            {data.map((meta) => {
                                if ("total" in meta && meta.total == "Grand Total") {
                                    grandTotalObj = { ...meta };
                                    if (grandTotalObj.cr > grandTotalObj.dr) {
                                        grandTotalObj.dr = grandTotalObj.cr;
                                    }
                                    else {
                                        grandTotalObj.cr = grandTotalObj.dr;
                                    }

                                    return <></>;
                                }
                                return (
                                    <tr>
                                        {Object.keys(meta).map((d) => (
                                            <td
                                                style={{
                                                    color:
                                                        d == "group" ? "red" : d == "sub_group" ? "blue" : "",
                                                }}
                                            >
                                                {meta[d]}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    )
                })}
                {
                    reportType == "P & L Report" && <tr>
                        <th align="left" style={{ color: "purple" }}>
                            {
                                netProfit >= 0 ? "Net Profit" : "Net Loss"
                            }
                        </th>
                        {netProfit < 0 && <td></td>}
                        <td style={{ color: "purple" }}>{Math.abs(netProfit)}</td>
                    </tr>
                }
                <tr>
                    {Object.keys(grandTotalObj).map((key) => {
                        return <td>{grandTotalObj[key]}</td>
                    })}
                </tr>

                <tr></tr>
            </tbody>
        </table>
    );
}

function crossing_outward_report_excel_data(data, date) {
    let newDate = new Date();
    let account_table_data = [];
    let first_row = {};
    let item_total = 1;
    let no_of_bilty_total = 0;
    let pkgs_total = 0;
    let paid_total = 0;
    let tbb_total = 0;
    let to_pay_total = 0;
    let crossing_amount_total = 0;
    let debit_total = 0;
    let credit_total = 0;
    let previous_date;
    let new_dta = data["ex_data"]["crossing_data"];
    console.log("account report data", data);
    date = data["dateState"];
    console.log("date is ", date);
    // excel_rep_data = data["data"];
    first_row = data[0];

    console.log("first row account report data", first_row);
    if (new_dta != undefined) {
        item_total = new_dta.length;
        for (let i = 0; i < new_dta.length; i++) {
            // if (data[i]["date"] != previous_date) {
            //   account_table_data.push(data[i]["date"]);
            //   previous_date = data[i]["date"];
            // }
            no_of_bilty_total += new_dta[i]["no_of_bilties"];
            pkgs_total += new_dta[i]["no_of_pkgs"];
            paid_total += new_dta[i]["paid_amount"];
            tbb_total += new_dta[i]["tbb_amount"];
            to_pay_total += new_dta[i]["to_pay_amount"];
            crossing_amount_total += new_dta[i]["crossing_amount"];
            debit_total += new_dta[i]["debit"];
            credit_total += new_dta[i]["credit"];
            account_table_data.push(new_dta[i]);
            // data[i]["voucher_id"] = null;
            // data[i]["voucher_det"] = String(
            //   data[i]["voucher_type"] + "-" + String(data[i]["voucher_id"])
            // );
            console.log("final", data);
        }
    }
    console.log("account table data", typeof account_table_data[1]);

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="crossing_outward_report_excel"
        >
            <thead>
                <tr>
                    <th colSpan="11" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="11"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}

                        {/* {date.party_name} A/c. From :{" "} */}
                        {/* {String(date["date_from"].getUTCDate()) +
              "/" +
              String(date["date_from"].getUTCMonth() + 1) +
              "/" +
              String(date["date_from"].getUTCFullYear())}{" "}
            To{" "}
            {String(date["date_to"].getUTCDate()) +
              "/" +
              String(date["date_to"].getUTCMonth() + 1) +
              "/" +
              String(date["date_to"].getUTCFullYear())}{" "} */}
                        {/* BILTY REPORT {"  "} FROM:
            {String(dateState["dateState"].date_from.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_from.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_from.getUTCFullYear())}
            {"  "}
            TO:
            {String(dateState["dateState"].date_to.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_to.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_to.getUTCFullYear())}
            ) */}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="11"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        Crossing Outward Register From {revertDate(date["date_from"])} To{" "}
                        {revertDate(date["date_to"])}{" "}
                    </th>
                </tr>
                <tr>
                    {crossing_outward_report_columns.map((column) => (
                        <td align="left" style={column.columnStyle}>
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {crossing_outward_report_columns.map((data) => (
                        <td align="left" style={data.style}>
                            {/* {console.log("dsdas", first_row)} */}
                            {first_row == undefined ? "" : first_row[data.accessor]}
                        </td>
                    ))}
                </tr>
                {data == undefined
                    ? []
                    : account_table_data.map((cell) => (
                        <React.Fragment>
                            <tr>
                                {typeof cell == "string" ? (
                                    <td
                                        colSpan="7"
                                        align="left"
                                        style={{ whiteSpace: "nowrap", borderStyle: "solid" }}
                                    >
                                        {cell}
                                    </td>
                                ) : (
                                    crossing_outward_report_columns.map((column) => (
                                        <td align="left" style={column.style}>
                                            {cell[column.accessor]}
                                        </td>
                                    ))
                                )}
                            </tr>
                            {typeof cell == "string" ? "" : ""}
                        </React.Fragment>
                    ))}
                <tr>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        GRAND TOTAL
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {item_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        { }
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {no_of_bilty_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {pkgs_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {paid_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {tbb_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {to_pay_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {crossing_amount_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {debit_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bold", borderStyle: "solid" }}>
                        {credit_total}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function crossing_inward_report_excel_data(data) {

    const date = data.dateState;
    data = data.ex_data;

    let new_date = new Date();
    console.log("crossing_inward_report_excel_data", data);
    console.log("date is ", date);

    const maincs = 7;

    let toPay = 0, dd = 0, ch = 0, credit = 0, debit = 0, bilties = 0, pkgs = 0;
    data.forEach(row => {
        toPay += row.to_pay_amount ?? 0;
        dd += row.door_del_charge ?? 0;
        ch += row.crossing_amount ?? 0;
        credit += row.credit ?? 0;
        debit += row.debit ?? 0;
        bilties += row.no_of_bilties ?? 0;
        pkgs += row.no_of_pkgs ?? 0;
    })

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="crossing_outward_report_excel"
        >
            <thead>
                <tr>
                    <th colSpan={maincs} align="left" style={{ fontSize: "130%" }}>
                        {TRANSPORTER_NAME}
                    </th>
                </tr>
                <tr>
                    <th
                        colSpan="4"
                        align="left"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </th>
                    <td colspan="3" align="left">
                        {String(new_date.getUTCDate()) +
                            "/" +
                            String(new_date.getUTCMonth() + 1) +
                            "/" +
                            String(new_date.getUTCFullYear())}{" "}
                        {String(new_date.getHours()) + ":" + String(new_date.getMinutes())}
                    </td>
                </tr>
                <tr>
                    <th
                        colSpan={maincs}
                        align="left"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        Crossing Inward Register From: {revertDate(date["date_from"])} To{" "}
                        {revertDate(date["date_to"])}{" "}
                    </th>
                </tr>
                <tr></tr>
                <tr>
                    {crossing_inward_report_columns.map((column) => (
                        <td align="left" style={{ ...column.columnStyle, fontWeight: "bolder" }}>
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(row => {
                    return (
                        <tr>
                            {crossing_inward_report_columns.map(col => {
                                return (
                                    <td align="left" style={col.style}>{row[col.accessor]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
                <tr>
                    <th align="left">Total</th>
                    <th align="left"></th>
                    <th align="left"></th>
                    <th align="left">{bilties}</th>
                    <th align="left">{pkgs}</th>
                    <th align="left">{toPay}</th>
                    <th align="left">{dd}</th>
                    <th align="left">{ch}</th>
                    <th align="left">{credit}</th>
                    <th align="left">{debit}</th>
                </tr>
            </tbody>
        </table>
    );
}

function party_rate_master_report_excel_data(partyName, data1, data2) {
    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="party_rate_master_excel"
        >
            {prepareTableHeader(7, 4, `Party Rate Master Report of ${partyName}`, null, party_rate_master_report_columns)}
            <tbody>
                {prepareTableRows(data1, party_rate_master_report_columns, null, null)}
            </tbody>

            <tr></tr>
            <tr></tr>

            {prepareTableHeader(11, 8, "", null, party_rate_master_report_bottom_columns)}
            <tbody>
                {prepareTableRows(data2, party_rate_master_report_bottom_columns, null, null)}
            </tbody>
        </table>
    );
}

function account_report_excel_data(data, date) {
    console.log("data in account_report_excel_data", data);
    console.log("date is: ", date);
    let newDate = {}
    newDate.date_from = String(date.date_from).split('-');
    newDate.date_to = String(date.date_to).split('-');
    console.log("new date is: ", newDate);
    let total_credit = 0;
    let total_debit = 0;
    let day_wise_total_credit = 0;
    let day_wise_total_debit = 0;
    let account_table_data = [];
    let first_row = {};
    let previous_date;
    console.log("account report data", data);
    // excel_rep_data = data["data"];
    console.log("first row", data);
    first_row = data[0];

    if (data.length > 0) {
        first_row.party_name = first_row.remarks;
    }

    // account_table_data.push(first_row)
    console.log("first row :- ", first_row);

    for (let i = 1; i < data.length; i++) {
        // if (i == 1){
        //   account_table_data.push(data[i]["date"]);
        //   continue;
        // }
        //
        total_credit += data[i].credit || 0;
        total_debit += data[i].debit || 0;
        total_credit = parseFloat(total_credit);
        total_debit = parseFloat(total_debit);
        if (data[i]["date"] != previous_date) {
            if (i > 1) {
                account_table_data.push({
                    voucher_det: "",
                    party_name: "Daywise Total",
                    cheque_no: "",
                    debit: day_wise_total_debit,
                    credit: day_wise_total_credit,
                    balance: "",
                    balance_type: "",
                    flag: true,
                });
                day_wise_total_credit = 0;
                day_wise_total_debit = 0;
            }

            account_table_data.push(data[i]["date"]);
            previous_date = data[i]["date"];
        }
        day_wise_total_credit += data[i].credit || 0;
        day_wise_total_debit += data[i].debit || 0;

        day_wise_total_credit = parseFloat(day_wise_total_credit);
        day_wise_total_debit = parseFloat(day_wise_total_debit);

        account_table_data.push(data[i]);
        // data[i]["voucher_id"] = null;
        if (data[i]["voucher_type"].includes('-')) {
            data[i]["voucher_det"] = data[i]["voucher_type"];
            // data[i]["voucher_det"] = temp.split('-').reverse().join('-');
        }
        else {
            data[i]["voucher_det"] = String(
                data[i]["voucher_type"] + "-" + String(data[i]["voucher_id"])
            );
        }
    }

    // this is to handle dayWiseTotal of last date entries
    // but what if whole data is blank? that's why if condition
    if (data.length > 0) {
        account_table_data.push({
            voucher_det: "",
            party_name: "Daywise Total",
            cheque_no: "",
            debit: day_wise_total_debit,
            credit: day_wise_total_credit,
            balance: "",
            balance_type: "",
            flag: true,
        });
    }

    if (first_row != null && "balance_type" in first_row) {
        if (first_row.balance_type.toLowerCase() == "dr") {
            total_debit += first_row.balance;
        } else {
            total_credit += first_row.balance;
        }
    }

    console.log("account table data", account_table_data);

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="account_report_excel"
        >
            <thead>
                <tr>
                    <th colSpan="7" align="center" style={{ fontSize: "130%" }}>
                        {TRANSPORTER_NAME}{" ("}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                        {")"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="7"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {date.party_name} A/c. From : {String(newDate.date_from[2]) + '/' + String(newDate.date_from[1]) + '/' + String(newDate.date_from[0])} To {String(newDate.date_to[2]) + '/' + String(newDate.date_to[1]) + '/' + String(newDate.date_to[0])}
                        {/* BILTY REPORT {"  "} FROM:
            {String(dateState["dateState"].date_from.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_from.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_from.getUTCFullYear())}
            {"  "}
            TO:
            {String(dateState["dateState"].date_to.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_to.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_to.getUTCFullYear())}
            ) */}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    {account_report_columns.map((column) => (
                        <td align="left" style={column.columnStyle} borderColor="red">
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {account_report_columns.map((data) => (
                        <td
                            align="left"
                            style={{
                                whiteSpace: "nowrap",
                                borderStyle: "",
                                fontWeight: "bolder",
                                border: '1px solid rgb(186, 186, 186)'
                            }}
                        >
                            {console.log("dsdas", data.style)}
                            {first_row == undefined ? "" : first_row[data.accessor]}
                        </td>
                    ))}
                </tr>
                {data == undefined
                    ? []
                    : account_table_data.map((cell) => (
                        <React.Fragment>
                            <tr>
                                {typeof cell == "string" ? (
                                    <td
                                        colSpan="7"
                                        align="left"
                                        style={{
                                            whiteSpace: "nowrap",
                                            borderStyle: "",
                                            fontWeight: "bolder",
                                            fontSize: "90%",
                                            border: '1px solid rgb(186, 186, 186)'
                                        }}
                                    >
                                        {cell}
                                    </td>
                                ) : (
                                    account_report_columns.map((column) => {
                                        return (
                                            <td
                                                align="left"
                                                style={cell.flag ? column.columnStyle : column.style}
                                            >
                                                {cell[column.accessor]}
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                            {typeof cell == "string" ? (
                                ""
                            ) : (
                                <tr>
                                    <td></td>
                                    <td
                                        colSpan="6"
                                        align="left"
                                        style={{ whiteSpace: "nowrap", borderStyle: "", border: '1px solid rgb(186, 186, 186)' }}
                                    >
                                        {cell.remarks}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                <tr>
                    <td></td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        CLOSING BALANCE
                    </td>
                    <td
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    ></td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? "" : total_debit - total_credit}
                    </td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? total_credit - total_debit : ""}
                    </td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? "Credit" : "Debit"}
                    </td>
                    <td
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    ></td>
                </tr>
            </tbody>
        </table>
    );
}

function account_report_report_excel_data(dataOrig, dateState) {
    console.log("data in account_report_excel_data", dataOrig, dateState);

    const date = {
        date_from: formatDateSlash(dateState.date_from),
        date_to: formatDateSlash(dateState.date_to),
    }

    let data = [...dataOrig] ?? [];
    let totalDebit = 0, totalCredit = 0;

    let firstRow = [];
    if (data.length > 0) {
        const first = data[0];

        firstRow.push("", "", "Opening Balance", "");
        first.balance_type == "cr"
            ? firstRow.push("", first.balance)
            : firstRow.push(first.balance, "")

        firstRow.push(first.balance, first.balance_type);
        data.shift();


        first.balance_type == "cr" ?
            totalCredit += (first.balance) || 0 :
            totalDebit += (first.balance) || 0;

        totalDebit = parseFloat(totalDebit);
        totalCredit = parseFloat(totalCredit);

        data.forEach(row => {
            totalDebit += (row.debit) || 0;
            totalCredit += (row.credit) || 0;
            totalDebit = parseFloat(totalDebit);
            totalCredit = parseFloat(totalCredit);
        })
    }

    console.log({ firstRow });

    const diff = Math.abs(totalCredit - totalDebit);
    let lrow1 = ["", "", "Total", "", totalDebit, totalCredit, "", ""];
    let lrow2 = ["", "", "Closing Balance", ""];

    totalDebit >= totalCredit ?
        lrow2.push("", diff, "Debit", ""):
        lrow2.push(diff, "", "Credit", "") ;

    const lastRow = [lrow1, lrow2];

    // console.log(data, typeof data);
    return (
        <table
            style={tableStyle}
            id="account_report_report_excel"
        >
            {prepareTableHeader(8, 5, `Account Statement of ${dateState.party_name}`, date, account_report_report_columns)}
            {/* {prepareTableRows(finalData, account_report_report_columns, firstRow, lastRow)} */}
            <tbody>
                {prepareOneRow(firstRow)}
                {
                    data.map(row => {
                        return (
                            <>
                                <tr>
                                    {
                                        account_report_report_columns.map(col => {
                                            return (
                                                <td
                                                    align="left"
                                                    style={{
                                                        fontSize: "10px",
                                                        whiteSpace: "nowrap",
                                                        border: '1px solid rgb(186, 186, 186)',
                                                    }}
                                                >{row[col.accessor]}</td>
                                            )
                                        })
                                    }
                                </tr>
                                {row.remarks != "" && <tr>
                                    {["", "", row.remarks, "", "", "", "", ""].map(item => {
                                        return (
                                            <td align="left" style={{
                                                fontSize: "10px",
                                                whiteSpace: "nowrap",
                                                border: '1px solid rgb(186, 186, 186)',
                                            }}> {item} </td>
                                        )
                                    })}
                                </tr>}
                            </>
                        )
                    })
                }
                {lastRow.map(row => {
                    return prepareOneRow(row);
                })}
            </tbody>
        </table>
    );
}

function account_report_negative_excel_data(data, date) {
    console.log("data in account_report_excel_data", data);
    console.log("date is: ", date);
    let newDate = {}
    newDate.date_from = String(date.date_from).split('-');
    newDate.date_to = String(date.date_to).split('-');
    console.log("new date is: ", newDate);
    let total_credit = 0;
    let total_debit = 0;
    let day_wise_total_credit = 0;
    let day_wise_total_debit = 0;
    let account_table_data = [];
    let temp_table_data = [];
    let first_row = {};
    let previous_date;
    console.log("account report data", data);
    // excel_rep_data = data["data"];
    console.log("first row", data);
    first_row = data[0];

    if (data.length > 0) {
        first_row.party_name = first_row.remarks;
    }

    // account_table_data.push(first_row)
    console.log("first row :- ", first_row);

    if (first_row != null && "balance_type" in first_row) {
        if (first_row.balance_type.toLowerCase() == "dr") {
            total_debit += first_row.balance;
        } else {
            total_credit += first_row.balance;
        }
    }

    for (let i = 1; i < data.length; i++) {
        total_credit += data[i].credit || 0;
        total_debit += data[i].debit || 0;

        total_credit = parseFloat(total_credit);
        total_debit = parseFloat(total_debit);


        if (data[i]["date"] != previous_date) {
            if (i > 1) {
                if (total_credit > total_debit) {

                    temp_table_data.forEach((row) => {
                        account_table_data.push(row);
                    })

                    account_table_data.push({
                        voucher_det: "",
                        party_name: "Daywise Total",
                        cheque_no: "",
                        debit: day_wise_total_debit,
                        credit: day_wise_total_credit,
                        balance: "",
                        balance_type: "",
                        flag: true,
                    });
                }
                day_wise_total_credit = 0;
                day_wise_total_debit = 0;
                temp_table_data = [];
            }

            temp_table_data.push(data[i]["date"]);
            previous_date = data[i]["date"];
        }
        day_wise_total_credit += data[i].credit || 0;
        day_wise_total_debit += data[i].debit || 0;
        total_credit += data[i].credit || 0;
        total_debit += data[i].debit || 0;
        
        total_credit = parseFloat(total_credit);
        total_debit = parseFloat(total_debit);
        day_wise_total_credit = parseFloat(day_wise_total_credit);
        day_wise_total_debit = parseFloat(day_wise_total_debit);

        temp_table_data.push(data[i]);
        // data[i]["voucher_id"] = null;
        // data[i]["voucher_det"] = String(
        //     data[i]["voucher_type"] + "-" + String(data[i]["voucher_id"])
        // );
        if (data[i]["voucher_type"].includes('-')) {
            data[i]["voucher_det"] = data[i]["voucher_type"];
            // data[i]["voucher_det"] = temp.split('-').reverse().join('-');
        }
        else {
            data[i]["voucher_det"] = String(
                data[i]["voucher_type"] + "-" + String(data[i]["voucher_id"])
            );
        }
    }
    if (total_credit > total_debit) {

        temp_table_data.forEach((row) => {
            account_table_data.push(row);
        })

        account_table_data.push({
            voucher_det: "",
            party_name: "Daywise Total",
            cheque_no: "",
            debit: day_wise_total_debit,
            credit: day_wise_total_credit,
            balance: "",
            balance_type: "",
            flag: true,
        });
    }

    console.log("account table data", account_table_data);

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="account_report_negative_excel"
        >
            <thead>
                <tr>
                    <th colSpan="7" align="center" style={{ fontSize: "130%" }}>
                        {TRANSPORTER_NAME}{" ("}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                        {")"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th
                        colSpan="7"
                        align="center"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {date.party_name} A/c. From : {String(newDate.date_from[2]) + '/' + String(newDate.date_from[1]) + '/' + String(newDate.date_from[0])} To {String(newDate.date_to[2]) + '/' + String(newDate.date_to[1]) + '/' + String(newDate.date_to[0])}
                        {/* BILTY REPORT {"  "} FROM:
              {String(dateState["dateState"].date_from.getUTCDate()) +
                "/" +
                String(dateState["dateState"].date_from.getUTCMonth() + 1) +
                "/" +
                String(dateState["dateState"].date_from.getUTCFullYear())}
              {"  "}
              TO:
              {String(dateState["dateState"].date_to.getUTCDate()) +
                "/" +
                String(dateState["dateState"].date_to.getUTCMonth() + 1) +
                "/" +
                String(dateState["dateState"].date_to.getUTCFullYear())}
              ) */}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    {account_report_columns.map((column) => (
                        <td align="left" style={column.columnStyle}>
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* <tr>
                    {account_report_columns.map((data) => (
                        <td
                            align="left"
                            style={{
                                whiteSpace: "nowrap",
                                borderStyle: "",
                                fontWeight: "bolder",
                                border: '1px solid rgb(186, 186, 186)'
                            }}
                        >
                            {console.log("dsdas !!!", data.style)}
                            {first_row == undefined ? "" : first_row[data.accessor]}
                        </td>
                    ))}
                </tr> */}
                {data == undefined
                    ? []
                    : account_table_data.map((cell) => (
                        <React.Fragment>
                            <tr>
                                {typeof cell == "string" ? (
                                    <td
                                        colSpan="7"
                                        align="left"
                                        style={{
                                            whiteSpace: "nowrap",
                                            borderStyle: "",
                                            fontWeight: "bolder",
                                            border: '1px solid rgb(186, 186, 186)'
                                        }}
                                    >
                                        {cell}
                                    </td>
                                ) : (
                                    account_report_columns.map((column) => {
                                        return (
                                            <td
                                                align="left"
                                                style={cell.flag ? column.columnStyle : column.style}
                                            >
                                                {cell[column.accessor]}
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                            {typeof cell == "string" ? (
                                ""
                            ) : (
                                <tr>
                                    <td></td>
                                    <td
                                        colSpan="6"
                                        align="left"
                                        style={{ whiteSpace: "nowrap", borderStyle: "", fontSize: "90%", border: '1px solid rgb(186, 186, 186)' }}
                                    >
                                        {cell.remarks}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                {/* <tr>
                    <td></td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        Closing Balance:
                    </td>
                    <td
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    ></td>
                    <td
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    ></td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? "" : total_debit - total_credit}
                    </td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? total_credit - total_debit : ""}
                    </td>
                    <td
                        align="left"
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    >
                        {total_credit > total_debit ? "Credit" : "Debit"}
                    </td>
                    <td
                        style={{
                            whiteSpace: "nowrap",
                            borderStyle: "",
                            fontWeight: "bolder",
                        }}
                    ></td>
                </tr> */}
            </tbody>
        </table>
    );
}

function paid_statement_excel_data(data, dateState) {
    //   for (let col in data) {
    // excel_rep_data = data;
    // console.log("sddsdsds", dateState["dateState"].date_from);
    let newDate = new Date();
    let to_pay_total = 0;
    let paid_total = 0;
    // excel_rep_data = data["data"];
    // for (let i = 0; i < data["ex_data"].length; i++) {
    //   // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
    //   if (data["ex_data"][i]["pay_type"] == 1) {
    //     to_pay_total += Number(data["ex_data"][i]["total_amount"]);
    //   } else if (data["ex_data"][i]["pay_type"] == 2) {
    //     paid_total += Number(data["ex_data"][i]["total_amount"]);
    //   }
    // }

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
            <thead>
                <tr>
                    <th colSpan="12" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}{" ("}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                        {")"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan="4" align="left" style={{ whiteSpace: "nowrap" }}>
                        {/* BILTY REPORT {"  "} FROM:
            {String(dateState["dateState"].date_from.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_from.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_from.getUTCFullYear())}
            {"  "}
            TO:
            {String(dateState["dateState"].date_to.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_to.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_to.getUTCFullYear())}
            ) */}
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    {admin_report_excel_data.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"] == undefined
                    ? []
                    : data["ex_data"].map((cell) => (
                        <tr>
                            {admin_report_excel_data.map((column) => (
                                <td
                                    align="left"
                                    style={{ whiteSpace: "nowrap", borderStyle: "solid" }}
                                >
                                    {cell[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}

function admin_print_report_excel_data(
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
    let weight_total = 0;
    let pkgs_total = 0;
    let amt_total = 0;
    let collection_total = 0;
    let admin_table_data = [];
    let previous_consignor = "";
    // excel_rep_data = data["data"];
    for (let i = 0; i < data["ex_data"].length; i++) {
        // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
        // if (data["ex_data"][i]["pay_type"] == 1) {
        //   to_pay_total += Number(data["ex_data"][i]["total_amount"]);
        // } else if (data["ex_data"][i]["pay_type"] == 2) {
        //   paid_total += Number(data["ex_data"][i]["total_amount"]);
        // }

        if("private_marka_no" in data["ex_data"][i]) {
            let tmp = data["ex_data"][i]["private_marka_no"].split(',');
            let newMarka = tmp[0];
            for(let i = 1; i < tmp.length; i++) {
                newMarka += ", " + tmp[i];
            }
            data["ex_data"][i]["private_marka_no"] = newMarka;
        }

        if (data["ex_data"][i]["consignor_name"] != previous_consignor) {
            if (i != 0) {
                admin_table_data.push([
                    "Consignor Wise",
                    weight_total,
                    pkgs_total,
                    collection_total,
                    amt_total,
                ]);
            }
            weight_total = 0;
            pkgs_total = 0;
            amt_total = 0;
            weight_total += Number(data["ex_data"][i]["weight"]);
            pkgs_total += Number(data["ex_data"][i]["pkgs"]);
            amt_total += Number(data["ex_data"][i]["total_amount"]);
            collection_total += Number(data["ex_data"][i]["collection_amount"]);
            admin_table_data.push(data["ex_data"][i]["consignor_name"]);
            previous_consignor = data["ex_data"][i]["consignor_name"];
        } else {
            weight_total += Number(data["ex_data"][i]["weight"]);
            pkgs_total += Number(data["ex_data"][i]["pkgs"]);
            amt_total += Number(data["ex_data"][i]["total_amount"]);
            collection_total += Number(data["ex_data"][i]["collection_amount"]);
        }
        data["ex_data"][i]["sr_no"] = i + 1;
        admin_table_data.push(data["ex_data"][i]);
    }
    console.log("admin report table ", admin_table_data);

    return (
        <table style={{ display: "none" }} id="admin_print_report_excel">
            <thead>
                <tr>
                    <th colSpan="12" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}{" ("}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                        {")"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan="15" align="left" style={{ whiteSpace: "nowrap" }}>
                        Consignorwise Bilty Checklist{"  "} FROM:
                        {String(dateState["dateState"].date_from.getUTCDate()) +
                            "/" +
                            String(dateState["dateState"].date_from.getUTCMonth() + 1) +
                            "/" +
                            String(dateState["dateState"].date_from.getUTCFullYear())}
                        {"  "}
                        TO:
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    {admin_print_excel_data.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"] == undefined
                    ? []
                    : admin_table_data.map((cell) => (
                        <React.Fragment>
                            <tr>
                                {typeof cell == "string" ? (
                                    <td
                                        colSpan="15"
                                        align="left"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        {cell}
                                    </td>
                                ) : cell[0] == "Consignor Wise" ? (
                                    <React.Fragment>
                                        <td>{cell[0]}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ fontWeight: "bold" }}>{cell[1]}</td>
                                        <td></td>
                                        <td style={{ fontWeight: "bold" }}>{cell[2]}</td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ fontWeight: "bold" }}>{cell[3]}</td>
                                        <td style={{ fontWeight: "bold" }}>{cell[4]}</td>
                                    </React.Fragment>
                                ) : (
                                    admin_print_excel_data.map((column) => {
                                        // console.log(cell[column.accessor]);
                                        return (
                                            <td align="left" style={column.style}>
                                                {cell[column.accessor]}
                                            </td>
                                        )
                                    })
                                )}
                            </tr>
                            {/* {typeof cell == "string" ? (
                  ""
                ) : (
                  <tr>
                    <td></td>
                    <td
                      colSpan="6"
                      align="left"
                      style={{ whiteSpace: "nowrap", borderStyle: "solid" }}
                    >
                      {cell.remarks}
                    </td>
                  </tr>
                )} */}
                        </React.Fragment>
                    ))}
            </tbody>
        </table>
    );
}

function admin_bilty_report_excel_data(
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
    // excel_rep_data = data["data"];
    for (let i = 0; i < data["ex_data"].length; i++) {
        // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
        if("private_marka_no" in data["ex_data"][i]) {
            let tmp = data["ex_data"][i]["private_marka_no"].split(',');
            let newMarka = tmp[0];
            for(let i = 1; i < tmp.length; i++) {
                newMarka += ", " + tmp[i];
            }
            data["ex_data"][i]["private_marka_no"] = newMarka;
        }

        if (data["ex_data"][i]["pay_type"] == 1) {
            to_pay_total += Number(data["ex_data"][i]["total_amount"]);
        } else if (data["ex_data"][i]["pay_type"] == 2) {
            paid_total += Number(data["ex_data"][i]["total_amount"]);
        }
    }

    return (
        <table style={{ display: "none" }} id="bilty_report_excel">
            <thead>
                <tr>
                    <th colSpan="12" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}{" ("}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                        {")"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan="4" align="left" style={{ whiteSpace: "nowrap" }}>
                        BILTY REPORT {"  "} FROM:
                        {String(dateState["dateState"].date_from.getUTCDate()) +
                            "/" +
                            String(dateState["dateState"].date_from.getUTCMonth() + 1) +
                            "/" +
                            String(dateState["dateState"].date_from.getUTCFullYear())}
                        {"  "}
                        TO:
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    {admin_report_excel_data.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {admin_report_excel_data.map((column) => (
                            <td
                                align="left"
                                style={{ whiteSpace: "nowrap", borderStyle: "solid" }}
                            >
                                {cell[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function vehicle_register_excel(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    const date = {
        date_from: formatDateSlash(dateState.dateState.date_from),
        date_to: formatDateSlash(dateState.dateState.date_to),
    }
    console.log(date);

    data = data.ex_data;

    let totalFreight = 0, totalReceived = 0

    data.forEach((row) => {
        totalFreight += row.freight ?? 0;
        totalReceived += row.received_amount ?? 0;
    })

    const lastRow = [["Total", "", "", "", "", "", totalFreight, "", "", "", "", totalReceived, "", "", "", ""]];

    return (
        <table
            style={tableStyle}
            id="vehicle_register_report_excel"
        >
            {prepareTableHeader(16, 12, `Vehicle Register Report`, date, excel_vehicle_regigster_columns)}
            {prepareTableRows(data, excel_vehicle_regigster_columns, null, lastRow)}
        </table>
    );
}

function pod_statement_excel(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    const date = {
        date_from: formatDateSlash(dateState.dateState.date_from),
        date_to: formatDateSlash(dateState.dateState.date_to),
    }
    // console.log(date);

    data = data.ex_data;

    let totalBilties = 0;

    data.forEach((row) => {
        totalBilties += row.no_of_bilties ?? 0;
    })

    const lastRow = [["Total", "", "", "", totalBilties]];

    const mainCs = pod_statement_columns.length;

    return (
        <table
            style={tableStyle}
            id="pod_statement_report_excel"
        >
            {prepareTableHeader(mainCs, mainCs - 4, `POD Statement Report`, date, pod_statement_columns)}
            {prepareTableRows(data, pod_statement_columns, null, lastRow)}
        </table>
    );
}

function excel_pending_partb_report(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {

    const date = {
        date_from: formatDateSlash(dateState.dateState.date_from),
        date_to: formatDateSlash(dateState.dateState.date_to),
    }
    console.log(date);

    data = data.ex_data;

    // console.log({ data }, "!!!");

    const mainCs = excel_pending_partb_columns.length;

    // const row1 = ["", "", "", "", "", "", "", "", "", "", "", "", "To Pay", to_pay_total];
    // const row2 = ["", "", "", "", "", "", "", "", "", "", "", "", "Paid", paid_total];
    // const row3 = ["", "", "", "", "", "", "", "", "", "", "", "", "Total", to_pay_total + paid_total];
    // const lastRow = [row1, row2, row3];

    return (
        <table
            style={tableStyle}
            id="pending_partb_report_excel"
        >
            {prepareTableHeader(mainCs, 8, `Pending Part B Report`, null, excel_pending_partb_columns)}
            {prepareTableRows(data, excel_pending_partb_columns, null, [])}
        </table>
    );
}
function excel_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    let reportType = dateState.dateState.report_type;
    if (reportType == "inward") reportType = "Inward"
    else reportType = "Bilty"

    console.log({ data, dateState, reportType });

    let newDate = new Date();
    let to_pay_total = 0;
    let paid_total = 0;

    for (let i = 0; i < data["ex_data"].length; i++) {
        if (data["ex_data"][i]["pay_type"] == 1) {
            to_pay_total += Number(data["ex_data"][i]["total_amount"]);
        } else if (data["ex_data"][i]["pay_type"] == 2) {
            paid_total += Number(data["ex_data"][i]["total_amount"]);
        }
    }

    const date = {
        date_from: formatDateSlash(dateState.dateState.date_from),
        date_to: formatDateSlash(dateState.dateState.date_to),
    }
    console.log(date);

    data = data.ex_data;

    console.log({ data }, "!!!");

    const row1 = ["", "", "", "", "", "", "", "", "", "", "", "", "To Pay", to_pay_total];
    const row2 = ["", "", "", "", "", "", "", "", "", "", "", "", "Paid", paid_total];
    const row3 = ["", "", "", "", "", "", "", "", "", "", "", "", "Total", to_pay_total + paid_total];
    const lastRow = [row1, row2, row3];

    return (
        <table
            style={tableStyle}
            id="bilty_report_excel"
        >
            {prepareTableHeader(14, 8, `${reportType} Report`, date, excel_bilty_columns)}
            {prepareTableRows(data, excel_bilty_columns, null, lastRow)}
        </table>
    );

    // return (
    //     <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
    //         <thead>
    //             <tr>
    //                 <th align="left">{TRANSPORTER_NAME+" AHMEDABAD"}</th>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>BRANCH NAME</td>
    //                 <td>
    //                     {JSON.parse(sessionStorage.getItem("branch_name"))[
    //                         "branch_name"
    //                     ].toUpperCase()}
    //                 </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>DATE(PRINT)</td>
    //                 <td>TIME</td>
    //             </tr>
    //             <tr>
    //                 <td>
    //                     BILTY REPORT FROM-TO(
    //                     {String(dateState["dateState"].date_from.getUTCDate()) +
    //                         "/" +
    //                         String(dateState["dateState"].date_from.getUTCMonth() + 1) +
    //                         "/" +
    //                         String(dateState["dateState"].date_from.getUTCFullYear())}{" "}
    //                     -{" "}
    //                     {String(dateState["dateState"].date_to.getUTCDate()) +
    //                         "/" +
    //                         String(dateState["dateState"].date_to.getUTCMonth() + 1) +
    //                         "/" +
    //                         String(dateState["dateState"].date_to.getUTCFullYear())}
    //                     )
    //                 </td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>
    //                     {newDate.getDate() +
    //                         "/" +
    //                         newDate.getMonth() +
    //                         "/" +
    //                         newDate.getFullYear()}
    //                 </td>
    //                 <td>
    //                     {newDate.getHours() +
    //                         ":" +
    //                         newDate.getMinutes() +
    //                         ":" +
    //                         newDate.getSeconds()}
    //                 </td>
    //             </tr>
    //             <tr></tr>
    //             <tr></tr>
    //             <tr>
    //                 {excel_bilty_columns.map((column) => (
    //                     <td style={{ width: column.width, whiteSpace: "nowrap" }}>{column.Header}</td>
    //                 ))}
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {data["ex_data"].map((cell) => (
    //                 <tr>
    //                     {excel_bilty_columns.map((column) => (
    //                         <td style={{ whiteSpace: "nowrap" }}>{cell[column.accessor]}</td>
    //                     ))}
    //                 </tr>
    //             ))}
    //             <tr></tr>
    //             <tr></tr>

    //             <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>TOPAY(TOTAL)</td>
    //                 <td>{to_pay_total}</td>
    //             </tr>
    //             <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>PAID (TOTAL)</td>
    //                 <td>{paid_total}</td>
    //             </tr>
    //             <tr>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>TOTAL</td>
    //                 <td>{paid_total + to_pay_total}</td>
    //             </tr>
    //         </tbody>
    //     </table>
    // );

    // return (
    //     <table>

    //     </table>
    // );
}

function brokerage_summary_excel(data) {
    //   for (let col in data) {
    // excel_rep_data = data;
    // console.log("sddsdsds", dateState["dateState"].date_from);
    let newDate = new Date();
    let to_pay_total = 0;
    let paid_total = 0;
    let less_total = 0;
    let tbb_total = 0;
    let to_station = "";
    let from_station = "";
    if (data["ex_data"] != []) {
        to_station = data["ex_data"]["to_station"];
        from_station = data["ex_data"]["from_station"];
    } else {
        to_station = "";
        from_station = "";
    }

    // excel_rep_data = data["data"];
    if (data["ex_data"]["chalan_data"]) {
        for (let i = 0; i < data["ex_data"]["chalan_data"].length; i++) {
            // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
            data["ex_data"]["chalan_data"][i]["sr_no"] = i + 1;
            to_pay_total += Number(data["ex_data"]["chalan_data"][i]["to_pay"]);
            paid_total += Number(data["ex_data"]["chalan_data"][i]["paid"]);
            tbb_total += Number(data["ex_data"]["chalan_data"][i]["tbb"]);
            less_total += Number(data["ex_data"]["chalan_data"][i]["less"]);
        }
    }

    return (
        <table
            id="bilty_report_excel"
            style={{
                width: "29.7cm",
                display: "none",
            }}
        >
            <thead>
                <tr>
                    <th colSpan="7" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr></tr>
                <tr style={{ textDecoration: "underline", fontSize: "120%" }}>
                    <td align="left" style={{ whiteSpace: "nowrap" }}>
                        {/* ACK PENDING FROM-TO */}
                        {from_station}
                    </td>
                    <td align="center">To</td>
                    <td align="left" style={{ whiteSpace: "nowrap" }}>
                        {to_station}
                    </td>
                    <td align="left" style={{ whiteSpace: "nowrap" }}>
                        From {data["ex_data"]["date_from"]} To {data["ex_data"]["date_to"]}
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
                </tr>
                <tr></tr>
                <tr>
                    {brokerage_summary_excel_columns.map((column) => (
                        <th
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                fontSize: "120%",
                                // borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"]["chalan_data"] != undefined
                    ? data["ex_data"]["chalan_data"].map((cell) => (
                        <tr>
                            {brokerage_summary_excel_columns.map((column) => (
                                <td
                                    align="left"
                                    style={{
                                        whiteSpace: "nowrap",
                                        fontSize: "120%",
                                        // borderStyle: "solid",
                                    }}
                                >
                                    {cell[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                    : ""}
                <tr></tr>
                <tr>
                    <td align="left" style={{ fontWeight: "bolder", fontSize: "120%" }}>
                        Total:
                    </td>
                    <td></td>
                    <td></td>
                    <td align="left" style={{ fontWeight: "bolder", fontSize: "120%" }}>
                        {to_pay_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bolder", fontSize: "120%" }}>
                        {paid_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bolder", fontSize: "120%" }}>
                        {tbb_total}
                    </td>
                    <td align="left" style={{ fontWeight: "bolder", fontSize: "120%" }}>
                        {less_total}
                    </td>
                </tr>
                <tr></tr>

                {/* <tr>
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
        </tr> */}
            </tbody>
        </table>
    );
}

function excel_data_ack_pending(
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
    let newDate = revertDate(formatDate(new Date()));
    let to_pay_total = 0;
    let paid_total = 0;
    let to_station = "";
    console.log("asdd", data["ex_data"][0]);
    if (data["ex_data"][0] != undefined) {
        to_station = data["ex_data"][0]["station_to_name"];
    } else {
        to_station = "";
    }
    // excel_rep_data = data["data"];
    for (let i = 0; i < data["ex_data"].length; i++) {
        // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
        data["ex_data"][i]["sr_no"] = i + 1;
    }

    return (
        <table
            id="bilty_report_excel"
            style={{
                width: "29.7cm",
                display: "none",
            }}
        >
            <thead>
                <tr>
                    <th colSpan="6" align="center" style={{ fontSize: "150%" }}>
                        {TRANSPORTER_NAME + "AHMEDABAD"}
                    </th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan="2" align="left" style={{ whiteSpace: "nowrap" }}>
                        {/* ACK PENDING FROM-TO */}
                        From:{" "}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </td>
                    <td colSpan="3" align="left" style={{ whiteSpace: "nowrap" }}>
                        To: {to_station}
                        {/* {String(dateState["dateState"].date_from.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_from.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_from.getUTCFullYear())}{" "}
            -{" "}
            {String(dateState["dateState"].date_to.getUTCDate()) +
              "/" +
              String(dateState["dateState"].date_to.getUTCMonth() + 1) +
              "/" +
              String(dateState["dateState"].date_to.getUTCFullYear())} */}
                    </td>
                    <td align="left" style={{ whiteSpace: "nowrap" }}>
                        Date: {newDate}
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
                    <td>
                        {/* {newDate.getHours() +
              ":" +
              newDate.getMinutes() +
              ":" +
              newDate.getSeconds()} */}
                    </td>
                </tr>
                <tr>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td colSpan="5" align="left"></td>
                </tr>
                <tr>
                    {excel_ack_pending_columns.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                // borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_ack_pending_columns.map((column) => (
                            <td
                                align="left"
                                style={{
                                    whiteSpace: "nowrap",
                                    // borderStyle: "solid",
                                }}
                            >
                                {cell[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr></tr>
                <tr></tr>

                {/* <tr>
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
        </tr> */}
            </tbody>
        </table>
    );
}

function challan_report_excel(data, dateState) {

    console.log("!!!challan excel data", data, dateState);

    const new_date = new Date();
    let dateFrom = formatDateSlash(dateState.date_from)
    let dateTo = formatDateSlash(dateState.date_to);
    const maincs = 10;

    let totalPkgs = 0, totalWeight = 0, toPay = 0, paid = 0;
    data.forEach(row => {
        totalPkgs += row.no_of_pkgs;
        totalWeight += row.total_weight;
        toPay += row.to_pay;
        paid += row.paid;
    })

    return (
        <table
            style={{ display: "none", width: "29.7cm" }}
            id="challan_report_excel"
        >
            <thead>
                <tr>
                    <th colSpan={maincs} align="left" style={{ fontSize: "130%" }}>
                        {TRANSPORTER_NAME}
                    </th>
                </tr>
                <tr>
                    <th
                        colSpan="6"
                        align="left"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </th>
                    <td colspan="4" align="left">
                        {String(new_date.getUTCDate()) +
                            "/" +
                            String(new_date.getUTCMonth() + 1) +
                            "/" +
                            String(new_date.getUTCFullYear())}{" "}
                        {String(new_date.getHours()) + ":" + String(new_date.getMinutes())}
                    </td>
                </tr>
                <tr>
                    <th
                        colSpan={maincs}
                        align="left"
                        style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                    >
                        Challan Report | From: {dateFrom} To: {" "}
                        {dateTo} {" "}
                    </th>
                </tr>
                <tr></tr>
                <tr>
                    {challan_report_columns.map((column) => (
                        <th align="left" style={column.columnStyle}>
                            {column.Header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(row => {
                    return (
                        <tr>
                            {challan_report_columns.map(col => {
                                return (
                                    <td align="left" style={col.style}>{row[col.accessor]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
                <tr>
                    <th align="left">Total</th>
                    <th align="left"></th>
                    <th align="left"></th>
                    <th align="left"></th>
                    <th align="left"></th>
                    <th align="left">{totalPkgs}</th>
                    <th align="left">{totalWeight}</th>
                    <th align="left">{toPay}</th>
                    <th align="left">{paid}</th>
                </tr>
            </tbody>
        </table>
    );
}

function excel_trip_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    let newDate = new Date();
    let advance_total = 0;
    let balance_total = 0;
    let total_bhada_total = 0;
    for (let i = 0; i < data["ex_data"].length; i++) {
        console.log("Owner ship type", data["ex_data"][i]["vehicle_ownership"]);
        if (data["ex_data"][i]["vehicle_ownership"].toLowerCase() == "other") {
            advance_total += Number(data["ex_data"][i]["advance_bhada"]);
            balance_total += Number(data["ex_data"][i]["balance_bhada"]);
            total_bhada_total += Number(data["ex_data"][i]["amount"]);
        } else {
            data["ex_data"][i]["advance_bhada"] = "0";
            data["ex_data"][i]["balance_bhada"] = "0";
            data["ex_data"][i]["amount"] = "0";
        }
    }

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
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
                        Trip REPORT FROM-TO(
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
                    {excel_trip_columns.map((column) => (
                        <td style={{ width: column.width, whiteSpace: "nowrap" }}>{column.Header}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_trip_columns.map((column) => (
                            <td style={{ whiteSpace: "nowrap" }}>{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>TOTAL</td>
                    <td>{advance_total}</td>
                    <td>{balance_total}</td>
                    <td>{total_bhada_total}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}
function fleet_vehicle_trip_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState,
    pageData
) {
    console.log(dateObject, dateState);
    // let newDate = new Date();
    data = data.ex_data;
    
    const pageState = pageData.pageState;
    
    const date = {
        date_from: formatDateSlash(pageState.date_from),
        date_to: formatDateSlash(pageState.date_to),
    }

    console.log(date);

    // let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    // data.forEach(row => {
    //     toPay += row.to_pay_amount ?? 0;
    //     hamali += row.hamali ?? 0;
    //     service += row.service_charge ?? 0;
    //     demarage += row.demarage_charge ?? 0;
    //     other += row.other_charge ?? 0;
    //     refund += row.refund ?? 0;
    //     totalAmount += row.total_amount ?? 0;
    // })

    // const lastRow = [["Total", "", toPay, hamali, service, demarage, other, refund, totalAmount]];

    const mainColspan = vehicle_fleet_report_columns.length;
    const secColspan = mainColspan - 4;

    // let advance = 0, balance = 0;
    let freightPending = 0, totalCredit = 0, totalDebit = 0;
    let total_final_amount = 0;

    let totalLh = 0, totalAdvance = 0, totalBalance = 0, totalTruckFreight = 0, totalSilak = 0;
    let totalCash = 0, totalBank = 0, totalDiesel = 0, totalRassa = 0, totalHamali = 0;
    let totalTollnaka = 0, totalBhattha = 0, totalSalary = 0, totalRto = 0, totalMis = 0, totalInsuracne = 0;
    let totalTelephone = 0, totalTyre = 0, totalBody = 0, totalGeneral = 0, totalBalFregiht = 0, totalExpense = 0;
    let totalCashreceived = 0, totalCommission = 0;

    data = data.map(row => {
        row.total_lh = parseFloat(row.advance) || 0;
        row.total_lh += parseFloat(row.balance) || 0;
        row.trip_date = row.trip_date?.split('T')[0];

        // console.log(row);
        // advance += row.advance || 0;
        // balance += row.balance || 0;

        freightPending += parseFloat(row.balance_freight) || 0;
        totalDebit += parseFloat(row.total_debit) || 0;
        totalCredit += parseFloat(row.total_credit) || 0;

        if(row.balance_type == "cr") {
            total_final_amount += parseFloat(row.total_amount) || 0;
        }
        else {
            total_final_amount -= parseFloat(row.total_amount) || 0;
        }

        totalLh += parseFloat(row.total_lh) || 0;
        totalAdvance += parseFloat(row.advance) || 0;
        totalBalance += parseFloat(row.balance) || 0;
        totalTruckFreight += parseFloat(row.truck_freight) || 0;
        totalSilak += parseFloat(row.silak) || 0;
        totalCash += parseFloat(row.cash) || 0;
        totalBank += parseFloat(row.bank) || 0;
        totalDiesel += parseFloat(row.diesel) || 0;
        totalRassa += parseFloat(row.rassa) || 0;
        totalHamali += parseFloat(row.hamali) || 0;
        totalTollnaka += parseFloat(row.toll) || 0;
        totalBhattha += parseFloat(row.bhattha) || 0;
        totalSalary += parseFloat(row.salary) || 0;
        totalRto += parseFloat(row.rto) || 0;
        totalMis += parseFloat(row.miscellaneous) || 0;
        totalInsuracne += parseFloat(row.insurance) || 0;
        totalTelephone += parseFloat(row.telephone) || 0;
        totalTyre += parseFloat(row.repair_tyre) || 0;
        totalBody += parseFloat(row.repair_body) || 0;
        totalGeneral += parseFloat(row.repair_gen) || 0;
        totalBalFregiht += parseFloat(row.balance_freight) || 0;
        totalCashreceived += parseFloat(row.cash_driver) || 0;
        totalCommission += parseFloat(row.commission) || 0;
        totalExpense += parseFloat(row.total_debit) || 0;

        row.total_debit = (parseFloat(row.total_debit) || 0) - (parseFloat(row.balance_freight) || 0);
        return row;
    }) 

    let lastRow = [["Total", "", "", "", "", totalSilak, totalLh,
        totalAdvance, totalBalance, totalTruckFreight, totalCash, totalBank, "",
        totalDiesel, totalRassa, totalHamali, totalTollnaka, totalBhattha, totalSalary, 
        totalRto, totalMis, totalInsuracne, totalTelephone, totalTyre, totalBody, totalGeneral,
        totalCashreceived, totalCommission, totalBalFregiht, totalExpense, total_final_amount, ""
    ]];

    totalDebit -= parseFloat(freightPending);
    totalCredit -= parseFloat(totalSilak);

    return (
        <table
            style={tableStyle}
            id="vehicle_fleet_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `Fleet Management Report of (Driver: ${pageState.driver_name}, Vehicle: ${pageState.vehicle_no})`, date, vehicle_fleet_report_columns)}
            {prepareTableRows(data, vehicle_fleet_report_columns, null, lastRow)}
            <tr></tr>
            <tr> 
                <th>Total silak </th>
                <th>{totalSilak} </th>
            </tr>
            <tr> 
                <th>LH Receivable by Driver </th>
                <th>{totalCredit} </th>
            </tr>
            <tr> 
                <th>Less Exp </th>
                <th>{totalDebit} </th>
            </tr>
            <tr> 
                <th>Freight Pending </th>
                <th>{totalBalFregiht} </th>
            </tr>
            <tr> 

                <th>Balance With Driver </th>
                <th>{total_final_amount} </th>
            </tr>
        </table>
    );
}

function excel_mr_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    let newDate = new Date();
    //   let advance_total = 0;
    //   let balance_total = 0;
    //   let total_bhada_total = 0;
    //   for (let i = 0; i < data["ex_data"].length; i++) {
    //     console.log("Owner ship type", data["ex_data"][i]["vehicle_ownership"]);
    //     if (data["ex_data"][i]["vehicle_ownership"].toLowerCase() == "other") {
    //       advance_total += Number(data["ex_data"][i]["advance_bhada"]);
    //       balance_total += Number(data["ex_data"][i]["balance_bhada"]);
    //       total_bhada_total += Number(data["ex_data"][i]["amount"]);
    //     } else {
    //       data["ex_data"][i]["advance_bhada"] = "0";
    //       data["ex_data"][i]["balance_bhada"] = "0";
    //       data["ex_data"][i]["amount"] = "0";
    //     }
    //   }

    console.log(data);
    let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    data["ex_data"].forEach(row => {
        toPay += row.to_pay_amount ?? 0;
        hamali += row.hamali ?? 0;
        service += row.service_charge ?? 0;
        demarage += row.demarage_charge ?? 0;
        other += row.other_charge ?? 0;
        refund += row.refund ?? 0;
        totalAmount += row.total_amount ?? 0;
    })

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
            <thead>
                <tr>
                    <th align="left" colSpan="4" style={{ fontSize: "130%" }}>{TRANSPORTER_NAME + " AHMEDABAD"}</th>
                    <td></td>
                    <td></td>
                    <td>DATE</td>
                    <td>TIME</td>
                </tr>
                <tr>
                    <td colSpan="4">
                        MR REPORT FROM-TO(
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
                <tr>
                    <td></td>
                    <td></td>
                    <td>BRANCH</td>
                    <td>
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    {excel_mr_columns.map((column) => (
                        <td style={{ width: column.width, fontWeight: "bolder", whiteSpace: "nowrap" }}>{column.Header}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_mr_columns.map((column) => (
                            <td style={{ whiteSpace: "nowrap" }}>{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <th>Total</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>{toPay}</th>
                    <th>{hamali}</th>
                    <th>{service}</th>
                    <th>{demarage}</th>
                    <th>{other}</th>
                    <th>{refund}</th>
                    <th>{totalAmount}</th>
                    <th></th>
                    <th></th>
                </tr>
                {/* <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>TOTAL</td>
            <td>{advance_total}</td>
            <td>{balance_total}</td>
            <td>{total_bhada_total}</td>
            <td></td>
          </tr> */}
            </tbody>
        </table>
    );
}


function excel_mr_pending_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log(dateObject, dateState);
    let newDate = new Date();

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    console.log(date);
    data = data.ex_data;

    // let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    // data["ex_data"].forEach(row => {
    //     toPay += row.to_pay_amount ?? 0;
    //     hamali += row.hamali ?? 0;
    //     service += row.service_charge ?? 0;
    //     demarage += row.demarage_charge ?? 0;
    //     other += row.other_charge ?? 0;
    //     refund += row.refund ?? 0;
    //     totalAmount += row.total_amount ?? 0;
    // })

    const mainColspan = mr_pending_report_columns.length;
    const secColspan = mainColspan - 4;

    return (
        <table
            style={tableStyle}
            id="mr_pending_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `MR Pending Amount Report`, date, mr_pending_report_columns)}
            {prepareTableRows(data, mr_pending_report_columns, null, null)}
        </table>
    );
}


function excel_vehicle_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log(dateObject, dateState);
    // let newDate = new Date();

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    console.log(date);
    data = data.ex_data;

    // let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    // data["ex_data"].forEach(row => {
    //     toPay += row.to_pay_amount ?? 0;
    //     hamali += row.hamali ?? 0;
    //     service += row.service_charge ?? 0;
    //     demarage += row.demarage_charge ?? 0;
    //     other += row.other_charge ?? 0;
    //     refund += row.refund ?? 0;
    //     totalAmount += row.total_amount ?? 0;
    // })

    const mainColspan = vehicle_report_columns.length;
    const secColspan = mainColspan - 4;

    return (
        <table
            style={tableStyle}
            id="vehicle_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `vehicle Report`, date, vehicle_report_columns)}
            {prepareTableRows(data, vehicle_report_columns, null, null)}
        </table>
    );
}

function excel_mr_statement_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log(dateObject, dateState);
    let newDate = new Date();

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    console.log(date);
    data = data.ex_data;

    let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    data.forEach(row => {
        toPay += row.to_pay_amount ?? 0;
        hamali += row.hamali ?? 0;
        service += row.service_charge ?? 0;
        demarage += row.demarage_charge ?? 0;
        other += row.other_charge ?? 0;
        refund += row.refund ?? 0;
        totalAmount += row.total_amount ?? 0;
    })

    const lastRow = [["Total", "", toPay, hamali, service, demarage, other, refund, totalAmount]];

    const mainColspan = mr_statement_report_columns.length;
    const secColspan = mainColspan - 4;

    return (
        <table
            style={tableStyle}
            id="mr_statement_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `MR Statement Report`, date, mr_statement_report_columns)}
            {prepareTableRows(data, mr_statement_report_columns, null, lastRow)}
        </table>
    );
}

function excel_income_hisab_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log({data});
    let newDate = new Date();

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    data = data.ex_data1;

    let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;

    let finalData = [];

    let id = 0;
    data.forEach(row => {
        if(row["sr_no"] != null && row["sr_no"] != "1") {
            finalData.push(["Total", "", "", toPay, hamali, service, demarage, refund, totalAmount]);
            finalData.push(["", "", "", "", "", "", "", "", "", ""]);
            toPay = hamali = service = demarage = totalAmount = refund = 0;
        }

        toPay += row.to_pay_amount || 0;
        hamali += row.hamali || 0;
        service += row.service_charge || 0;
        demarage += row.demarage_charge || 0;
        totalAmount += row.total_amount || 0;
        refund += row.refund || 0;

        let currRow = [];

        income_hisab_report_columns.forEach((column) => {
            currRow.push(row[column.accessor]);
        })
        
        finalData.push(currRow);

        id++;

    })

    finalData.push(["Total", "", "", toPay, hamali, service, demarage, refund, totalAmount]);

    const mainColspan = income_hisab_report_columns.length;
    const secColspan = mainColspan - 4;

    console.log("data is : ");
    console.log(data);
    console.log("final data is : ");
    console.log(finalData);

    return (
        <table
            style={tableStyle}
            id="income_hisab_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `Income Hisab Report`, date, income_hisab_report_columns)}
            {/* {prepareTableRows(data, income_hisab_report_columns, null, null)} */}
            <tbody>
                {finalData.map((row) => {
                    return  (<tr>
                    {row.map(item => {
                        return (
                            <td align="left" style={{
                                whiteSpace: "nowrap",
                                border: '1px solid rgb(186, 186, 186)',
                                fontWeight: row[0] == "Total" ? "bold" : "",
                            }}> {item} </td>
                        )
                    })}
                    </tr>)
                })}
                
            </tbody>
        </table>
    );
}
function excel_paid_hisab_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log({data});

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    data = data.ex_data;

    let totalAmount = 0;

    let finalData = [];

    for(let i = 0; i < data.length; i++) {
        if(i && data[i].created_date != null) {
            finalData.push(["Total", "", "",  "", totalAmount]);
            finalData.push(["", "", "", "", ""]);
            totalAmount = 0;
        }

        let currRow = [];
        paid_hisab_report_columns.forEach((col) => {
            currRow.push(data[i][col.accessor]);
        })

        totalAmount += data[i]["total_amount"] || 0;

        finalData.push(currRow);
    }

    if(totalAmount != 0) {
        finalData.push(["Total", "", "",  "", totalAmount]);
    }

    const mainColspan = paid_hisab_report_columns.length;
    const secColspan = mainColspan - 4;

    console.log("data is : ");
    console.log(data);
    console.log("final data is : ");
    console.log(finalData);

    return (
        <table
            style={tableStyle}
            id="paid_hisab_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `Paid Hisab Report`, date, paid_hisab_report_columns)}
            {/* {prepareTableRows(data, income_hisab_report_columns, null, null)} */}
            <tbody>
                {finalData.map((row) => {
                    return  (<tr>
                    {row.map(item => {
                        return (
                            <td align="left" style={{
                                whiteSpace: "nowrap",
                                border: '1px solid rgb(186, 186, 186)',
                                fontWeight: row[0] == "Total" ? "bold" : "",
                            }}> {item} </td>
                        )
                    })}
                    </tr>)
                })}
                
            </tbody>
        </table>
    );
}
function excel_fleet_report_data(
    data
) {
    console.log({data});

    let advance = 0, balance = 0;
    let freightPending = 0, totalCredit = 0, totalDebit = 0;

    data.trip_info = data.trip_info.map(row => {
        console.log(row);
        advance += row.advance || 0;
        balance += row.balance || 0;
        freightPending += row.balance_freight || 0;
        totalDebit += row.total_debit || 0;
        totalCredit += row.total_credit || 0;

        row.total_lh = (row.advance) || 0;
        row.total_lh += (row.balance) || 0;
        return row;
    }) 

    
    const mainColspan = fleet_management_report_columns.length;
    const secColspan = mainColspan - 4;

    return (
        <table
            style={tableStyle}
            id="fleet_report_excel"
        >

            {prepareTableHeader(mainColspan, secColspan, `Fleet Management Report of Fleet No : ${data.fleet_no}, (Driver: ${data.driver_name}, Vehicle: ${data.vehicle_no})`, null, fleet_management_report_columns)}
            {prepareTableRows(data.trip_info, fleet_management_report_columns, null, null)}
            <tr></tr>
            <tr> 
                <th>Total LH </th>
                <th>{advance + balance} </th>

                <td></td>
                <td></td>

                <th>LH Receivable by Driver </th>
                <th>{totalCredit} </th>
            </tr>
            <tr> 
                <th>Advance </th>
                <th>{advance} </th>

                <td></td>
                <td></td>

                <th>Less Exp </th>
                <th>{totalDebit} </th>
            </tr>
            <tr> 
                <th>Balance </th>
                <th>{balance} </th>

                <td></td>
                <td></td>

                <th>Freight Pending </th>
                <th>{freightPending} </th>
            </tr>
            <tr> 
                <th> </th>
                <th></th>

                <td></td>
                <td></td>

                <th>Balance With Driver </th>
                <th>{data.total_final_amount} </th>
            </tr>
        </table>
    );
}

function excel_paid_statement_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log(dateObject, dateState);
    let newDate = new Date();

    const date = {
        date_from: formatDateSlash(dateObject.dateState.date_from),
        date_to: formatDateSlash(dateObject.dateState.date_to),
    }

    console.log(date);
    data = data.ex_data;

    // let toPay = 0, hamali = 0, service = 0, demarage = 0, other = 0, refund = 0, totalAmount = 0;
    let totalAmount = 0;

    data.forEach(row => {
        totalAmount += row.total_amount ?? 0;
    })

    const lastRow = [["Total", "", totalAmount, ""]];

    const mainColspan = paid_statement_report_columns.length;
    const secColspan = mainColspan - 2;

    return (
        <table
            style={tableStyle}
            id="paid_statement_report_excel"
        >
            {prepareTableHeader(mainColspan, secColspan, `Paid Statement Report`, date, paid_statement_report_columns)}
            {prepareTableRows(data, paid_statement_report_columns, null, lastRow)}
        </table>
    );
}

function excel_tds_data(data, dateState) {
    let newDate = new Date();
    let advance = 0;
    let balance = 0;
    let totalAmount = 0;
    let totalTdsAmount = 0;
    let totalNetBalance = 0;
    let totalTdsReceived = 0;
    console.log("ex data", data["ex_data"]);
    // for (let i = 0; i < data["ex_data"].length; i++) {
    //     console.log("Owner ship type", data["ex_data"][i]["vehicle_ownership"]);
    //     // if (data["ex_data"][i]["vehicle_ownership"].toLowerCase() == "other") {
    //     // if(true){
    //     //   advance_total += Number(data["ex_data"][i]["advance_bhada"]);
    //     //   balance_total += Number(data["ex_data"][i]["balance_bhada"]);
    //     //   total_bhada_total += Number(data["ex_data"][i]["amount"]);
    //     // } else {
    //     //   data["ex_data"][i]["advance_bhada"] = "0";
    //     //   data["ex_data"][i]["balance_bhada"] = "0";
    //     //   data["ex_data"][i]["amount"] = "0";
    //     // }
    // }

    data.ex_data.forEach(row => {
        advance += row.advance;
        balance += row.balance;
        totalAmount += row.total_amount;
        totalTdsAmount += row.tds_amount;
        totalNetBalance += row.net_balance;
        totalTdsReceived += row.paid_tds;
    })

    const bodyStyle = {
        whiteSpace: "nowrap"
    }

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="tds_excel">
            <thead>
                <tr>
                    <th align="center" colSpan="6">
                        {TRANSPORTER_NAME}
                    </th>
                </tr>
                <tr>
                    <td align="left" colSpan="2">
                        BRANCH NAME
                    </td>
                    <td align="left" colSpan="2">
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </td>
                </tr>
                {/* <tr>
          <td>
            Trip REPORT FROM-TO(
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
        </tr> */}
                <tr></tr>
                <tr></tr>
                <tr>
                    {excel_tds_columns.map((column) => (
                        <th style={{ width: column.width }}>{column.Header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_tds_columns.map((column) => (
                            <td style={bodyStyle}>{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <th align="left">TOTAL</th>
                    <td></td>
                    <td></td>
                    <th align="right">{totalAmount}</th>
                    <th align="right">{advance}</th>
                    <th align="right">{balance}</th>
                    <th align="right">{totalTdsAmount}</th>
                    <th align="right">{totalNetBalance}</th>
                    <th align="right">{totalTdsReceived}</th>
                </tr>
            </tbody>
        </table>
    );
}

function excel_vinod_data(data, dateState) {
    // let newDate = new Date();
    // let advance_total = 0;
    // let balance_total = 0;
    // let total_bhada_total = 0;
    // for (let i = 0; i < data["ex_data"].length; i++) {
    //   console.log("Owner ship type", data["ex_data"][i]["vehicle_ownership"]);
    //   if (data["ex_data"][i]["vehicle_ownership"].toLowerCase() == "other") {
    //     advance_total += Number(data["ex_data"][i]["advance_bhada"]);
    //     balance_total += Number(data["ex_data"][i]["balance_bhada"]);
    //     total_bhada_total += Number(data["ex_data"][i]["amount"]);
    //   } else {
    //     data["ex_data"][i]["advance_bhada"] = "0";
    //     data["ex_data"][i]["balance_bhada"] = "0";
    //     data["ex_data"][i]["amount"] = "0";
    //   }
    // }
    console.log("vinod", data);

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="vinod_excel">
            <thead>
                {/* <tr>
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
            Trip REPORT FROM-TO(
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
        <tr></tr> */}
                <tr>
                    {excel_vinod_columns.map((column) => (
                        <td style={{ width: column.width }}>{column.Header}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {console.log("data", data)}
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_vinod_columns.map((column) => (
                            <td>{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                {/* <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>TOTAL</td>
          <td>{advance_total}</td>
          <td>{balance_total}</td>
          <td>{total_bhada_total}</td>
          <td></td>
        </tr> */}
            </tbody>
        </table>
    );
}

//for party statement
function excel_pod_data(data) {
    let newDate = new Date();
    let total_packages = 0;

    for (let i = 0; i < data["pod_info_list"].length; i++) {
        total_packages += data["pod_info_list"][i]["no_of_package"];
        // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
        data["pod_info_list"][i]["sr_no"] = i + 1;
    }
    //   else{
    //     data["pod_info_list"][i]["advance_bhada"] = "0"
    //     data["pod_info_list"][i]["balance_bhada"] = "0"
    //     data["pod_info_list"][i]["amount"] = "0"
    //   }
    // }

    console.log("data", data);

    return (
        <table
            style={{ display: "none", width: "29.7cm", borderStyle: "solid" }}
            id="bilty_report_excel"
        >
            <thead>
                <tr>
                    <th
                        colSpan="7"
                        align="Center"
                        style={{ width: "1%", whiteSpace: "nowrap", fontSize: "150%" }}
                    >
                        {TRANSPORTER_NAME + " AHMEDABAD"}
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        {/* {JSON.parse(sessionStorage.getItem("branch_name"))[
              "branch_name"
            ].toUpperCase()} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        colSpan="2"
                        style={{ whiteSpace: "nowrap", fontWeight: "bolder" }}
                    >
                        Statement No: {data["pod_statement_no"]}
                    </td>
                    <td
                        colSpan="2"
                        style={{ whiteSpace: "nowrap", fontWeight: "bolder" }}
                    >
                        {" "}
                        {data["consignor_name"]}
                    </td>
                    <td></td>
                    <td>
                        Date:
                        {String(data["input_date"].getUTCDate()) +
                            "/" +
                            String(data["input_date"].getUTCMonth() + 1) +
                            "/" +
                            String(data["input_date"].getUTCFullYear())}
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
                </tr>
                <tr>
                    <td>Dear Sir,</td>
                </tr>
                <tr>
                    <td></td>
                    <td align="left" colSpan="7" style={{ whiteSpace: "nowrap" }}>
                        Here with we are sending the list of G.C., till we receive
                        acknowledgement
                    </td>
                </tr>
                <tr>
                    {excel_pod_statement_columns.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["pod_info_list"].map((cell) => (
                    <tr>
                        {excel_pod_statement_columns.map((column) => (
                            <td
                                align="left"
                                padding={column.accessor == "remarks" ? "15px" : ""}
                                style={
                                    column.accessor == "remarks"
                                        ? {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            borderStyle: "solid",
                                        }
                                        : { borderStyle: "solid", whiteSpace: "nowrap" }
                                }
                            >
                                {cell[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        Total:
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["pod_info_list"].length}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_packages}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}

//for party statement
function excel_party_bill(data) {
    let newDate = new Date();
    let total_packages = 0;
    let total_weight = 0;
    let total_dd = 0;
    let total_amount = 0;

    for (let i = 0; i < data["bilty_ids"].length; i++) {
        total_packages += parseInt(data["bilty_ids"][i]["pkgs"]) || 0;
        total_weight += parseInt(data["bilty_ids"][i]["weight"]) || 0;
        total_dd += parseFloat(data["bilty_ids"][i]["door_del_charge"]) || 0;
        total_amount += parseFloat(data["bilty_ids"][i]["item_amount"]) || 0;
        // console.log("cellll", data["data"][i], data["data"][i]["pay_type_name"]);
        data["bilty_ids"][i]["sr_no"] = i + 1;
    }
    console.log("dddsd", data);
    //   else{
    //     data["pod_info_list"][i]["advance_bhada"] = "0"
    //     data["pod_info_list"][i]["balance_bhada"] = "0"
    //     data["pod_info_list"][i]["amount"] = "0"
    //   }
    // }

    return (
        <table
            style={{ display: "none", width: "29.7cm", borderStyle: "solid" }}
            id="bilty_report_excel"
        >
            <thead>
                <tr>
                    <th
                        colSpan="12"
                        align="Center"
                        style={{ width: "1%", whiteSpace: "nowrap", fontSize: "150%" }}
                    >
                        {TRANSPORTER_NAME + " AHMEDABAD"}
                    </th>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        {/* {JSON.parse(sessionStorage.getItem("branch_name"))[
              "branch_name"
            ].toUpperCase()} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        colSpan="2"
                        style={{ whiteSpace: "nowrap", fontWeight: "bolder" }}
                    >
                        Bill No: {data["bill_no"]}
                    </td>
                    <td
                        colSpan="2"
                        style={{ whiteSpace: "nowrap", fontWeight: "bolder" }}
                    >
                        {" "}
                        {data["consignor_name"]}
                    </td>
                    <td></td>
                    <td>
                        Date:
                        {revertDate(data["bill_date"])}
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
                </tr>
                {/* <tr>
          <td>Dear Sir,</td>
        </tr> */}
                <tr>
                    <td></td>
                    <td></td>
                    <td>{data["consignor_gst"]}</td>
                    {/* <td align="left" colSpan="7" style={{ whiteSpace: "nowrap" }}>
            Here with we are sending the list of G.C., till we receive
            acknowledgement
          </td> */}
                </tr>
                <tr>
                    {excel_party_bill_columns.map((column) => (
                        <td
                            align="left"
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                borderStyle: "solid",
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["bilty_ids"].map((cell) => (
                    <tr>
                        {excel_party_bill_columns.map((column) => (
                            <td
                                align="left"
                                padding={column.accessor == "remarks" ? "15px" : ""}
                                style={
                                    column.accessor == "remarks"
                                        ? {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            borderStyle: "solid",
                                        }
                                        : { borderStyle: "solid", whiteSpace: "nowrap" }
                                }
                            >
                                {cell[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        Total:
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["bilty_ids"].length}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_dd}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_packages}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_weight}
                    </td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_amount}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {data["bilty_ids"].length} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_dd} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_packages} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        DD Charge
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {total_dd}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {data["bilty_ids"].length} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_dd} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_packages} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        Bilty Charge
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["bilty_charge"]}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {data["bilty_ids"].length} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_dd} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_packages} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["description1"]}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["amt1"]}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {data["bilty_ids"].length} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_dd} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_packages} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["description2"]}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["amt2"]}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {data["bilty_ids"].length} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    ></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_dd} */}
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {/* {total_packages} */}
                    </td>
                    <td></td>
                    <td></td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        Grand Total
                    </td>
                    <td
                        align="left"
                        style={{ fontWeight: "bolder", borderStyle: "solid" }}
                    >
                        {data["net_amount"]}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}

function excel_pod_challan_data(data) {
    let title_font = "150%";
    let sub_title_font = "";
    let column_heading_font = "";
    let data_font = "";
    let newDate = new Date();
    let total_packages = 0;
    let total_entries = data["bilty_ids"].length;
    for (let i = 0; i < data["bilty_ids"].length; i++) {
        total_packages += data["bilty_ids"][i]["no_of_package"];
    }
    // for (let i = 0; i < data["pod_info_list"].length; i++) {
    //   console.log("Owner ship type",data["pod_info_list"][i]["vehicle_ownership"])
    //   if (data["pod_info_list"][i]["vehicle_ownership"].toLowerCase() == "other"){
    //     advance_total += Number(data["pod_info_list"][i]["advance_bhada"]);
    //     balance_total += Number(data["pod_info_list"][i]["balance_bhada"]);
    //     total_bhada_total += Number(data["pod_info_list"][i]["amount"]);
    //   }
    //   else{
    //     data["pod_info_list"][i]["advance_bhada"] = "0"
    //     data["pod_info_list"][i]["balance_bhada"] = "0"
    //     data["pod_info_list"][i]["amount"] = "0"
    //   }
    // }

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
            <thead>
                <tr>
                    <th
                        colSpan="4"
                        align="Center"
                        style={{ width: "1%", whiteSpace: "nowrap", fontSize: title_font }}
                    >
                        {TRANSPORTER_NAME + " AHMEDABAD"}
                    </th>
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
                    {/* removed data from here because we didn't want according to jeet  on jul 17 2021*/}
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td style={{ fontSize: sub_title_font, whiteSpace: "nowrap" }}>
                        POD Challan No:
                    </td>
                    <td align="left">{String(data["pod_challan_no"])}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: sub_title_font }}>
                        From:{" "}
                        {JSON.parse(sessionStorage.getItem("branch_name"))[
                            "branch_name"
                        ].toUpperCase()}
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: sub_title_font }}>
                        To: {data["station_to_name"]}
                    </td>
                    <td style={{ fontSize: sub_title_font, whiteSpace: "nowrap" }}>
                        Date:
                        {String(data["input_date"].getUTCDate()) +
                            "/" +
                            String(data["input_date"].getUTCMonth() + 1) +
                            "/" +
                            String(data["input_date"].getUTCFullYear())}
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
                </tr>

                <tr>
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
                        {/*removed data from here because we didn't want according to jeet  on jul 17 2021*/}
                    </td>
                    <td>
                        {/* removed data from here because we didn't want according to jeet  on jul 17 2021 */}
                    </td>
                </tr>

                <tr>
                    {excel_pod_columns.map((column) => (
                        <td
                            style={{
                                width: column.width,
                                whiteSpace: "nowrap",
                                // borderStyle: "solid",
                                fontSize: column_heading_font,
                            }}
                        >
                            {column.Header}
                        </td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["bilty_ids"].map((cell) => (
                    <tr>
                        {excel_pod_columns.map((column) => (
                            <td
                                align="left"
                                style={
                                    column.accessor == "consignor_name" || "consignee_name"
                                        ? {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            // borderStyle: "solid",
                                            fontSize: data_font,
                                        }
                                        : {
                                            // borderStyle: "solid",
                                            fontSize: data_font,
                                        }
                                }
                            >
                                {cell[column.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <td align="left" style={{ borderStyle: "solid" }}>
                        {total_entries}
                    </td>
                    <td style={{ borderStyle: "solid" }}></td>
                    <td style={{ borderStyle: "solid" }}></td>
                    <td align="left" style={{ borderStyle: "solid" }}>
                        Total:{" "}
                    </td>
                    <td align="left" style={{ borderStyle: "solid" }}>
                        {total_packages}
                    </td>
                    <td></td>
                    <td>{ }</td>
                    <td>{ }</td>
                    <td>{ }</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}

function excel_bill_report_data(
    columns,
    data,
    fetchData,
    dateObject,
    loading,
    pageCount,
    dateState
) {
    console.log("bill data", data);
    let grand_total = 0;
    let newDate = new Date();
    for (let i = 0; i < data["ex_data"].length; i++) {
        grand_total += parseFloat(data["ex_data"][i]["net_amount"]) || 0;
        if (data["ex_data"][i]["ser_tax_amount"] == null) {
            data["ex_data"][i]["ser_tax_amount"] = 0;
        }
        if (data["ex_data"][i]["pay_type"] == 1) {
            to_pay_total += Number(data["ex_data"][i]["total_amount"]);
        } else if (data["ex_data"][i]["pay_type"] == 2) {
            paid_total += Number(data["ex_data"][i]["total_amount"]);
        }
    }
    grand_total = parseInt(grand_total) || 0;

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="bilty_report_excel">
            <thead>
                <tr>
                    <th align="center" colSpan="7">{TRANSPORTER_NAME + " AHMEDABAD"}</th>
                    {/* <td></td>
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
                    <td></td> */}
                </tr>
                <tr>
                    <td colSpan="5" align="center">
                        Freight Bill Register FROM-TO(
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
                    {/* <td></td>
                    <td></td>
                    <td></td>
                    <td></td> */}

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
                    {excel_bill_columns.map((column) => (
                        <td style={column.columnStyle}>{column.Header}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data["ex_data"].map((cell) => (
                    <tr>
                        {excel_bill_columns.map((column) => (
                            <td style={{ whiteSpace: "nowrap" }}>{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <td>Grand Total:</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{grand_total}</td>
                </tr>
                <tr></tr>

                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
}

function excel_concillation_report_data(pageState, data) {
    console.log("bill data", data);
    console.log({ pageState });

    const bank = pageState.consignor_name;
    const dateFrom = pageState.date_from.split('-').reverse().join('-');
    const dateTo = pageState.date_to.split('-').reverse().join('-');

    const first = data["0"] ?? [];
    const second = data["1"] ?? [];
    const headerStyle = {
        whiteSpace: "nowrap",
    }
    const colspan = 5;
    const smallColSpan = 4;

    console.log({ first, second });

    return (
        <table style={{ display: "none", width: "29.7cm" }} id="concillation_report_excel">
            <thead>
                <tr>
                    <th align="left" style={{ fontSize: "130%" }} colSpan={colspan}>{TRANSPORTER_NAME + " AHMEDABAD"}</th>
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
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={colspan} align="left" style={{ fontSize: "120%" }} >
                        BANK RECONCILIATION FROM: {dateFrom} | TO: {dateTo}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={colspan} align="left" style={{ fontSize: "120%" }} >
                        {bank} 
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    {concillation_columns.map((column) => (
                        <td style={column.columnStyle}>{column.Header}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th colspan={colspan} align="left">Cheque Issued But Not Presented in The Bank </th>
                </tr>
                {first.map((cell) => (
                    <tr>
                        {concillation_columns.map((column) => (
                            <td style={column.style} align="left">{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <th colspan={smallColSpan} align="left">Total</th>
                    <th align="left">{data["3"]}</th>
                </tr>

                <tr />

                <tr>
                    <th colspan={colspan} align="left">Cheque Deposited But Not Cleared  in The Bank </th>
                </tr>
                {second.map((cell) => (
                    <tr>
                        {concillation_columns.map((column) => (
                            <td style={column.style} align="left">{cell[column.accessor]}</td>
                        ))}
                    </tr>
                ))}
                <tr>
                    <th colspan={smallColSpan} align="left">Total</th>
                    <th align="left">{data["4"]}</th>
                </tr>

                <tr />


                <tr>
                    <th colspan={smallColSpan} align="left">Balance As Per Books </th>
                    <th align="left">{data["2"]}</th>
                </tr>
                <tr>
                    <th colspan={smallColSpan} align="left">Add  : Cheques Issued But Not Presented in The Bank </th>
                    <th align="left">{data["3"]}</th>
                </tr>
                <tr>
                    <th colspan={smallColSpan} align="left">Less : Cheques Deposited But Not Cleared  </th>
                    <th align="left">{data["4"]}</th>
                </tr>
                <tr>
                    <th colspan={smallColSpan} align="left">Balance as Per Bank  </th>
                    <th align="left">{data["5"]}</th>
                </tr>
            </tbody>
        </table>
    );
}

const formatDateSlash = (dateInp) => {
    console.log({ dateInp });
    let date = dateInp;
    date = new Date(date).toISOString();
    date = date.split('T')[0];
    date = date.split('-').reverse().join('/');
    return date;
}

const prepareTableHeader = (mainCs, secCs, formName, date, columns) => {
    const new_date = new Date();
    const showDate = date != null;
    return (
        <thead>
            <tr>
                <th colSpan={mainCs} align="left" style={{ fontSize: "130%", whiteSpace: "nowrap" }}>
                    {TRANSPORTER_NAME} {"-"} {JSON.parse(sessionStorage.getItem("branch_name"))[
                        "branch_name"
                    ].toUpperCase()}
                </th>
            </tr>
            {/* <tr>
                <th
                    colSpan={secCs}
                    align="center"
                    style={{ whiteSpace: "nowrap", fontSize: "120%" }}
                >
                    {JSON.parse(sessionStorage.getItem("branch_name"))[
                        "branch_name"
                    ].toUpperCase()}
                </th>
                <td colspan={mainCs - secCs} align="center">
                    {String(new_date.getUTCDate()) +
                        "/" +
                        String(new_date.getUTCMonth() + 1) +
                        "/" +
                        String(new_date.getUTCFullYear())}{" "}
                    , {String(new_date.getHours()) + ":" + String(new_date.getMinutes())}
                </td>
            </tr> */}
            <tr>
                <th
                    colSpan={mainCs}
                    align="left"
                    style={{ whiteSpace: "nowrap", fontSize: "100%" }}
                >
                    {formName}  {showDate && 
                            <> | From: {date["date_from"]} To{" "} {date["date_to"]}</>
                }
                </th>
            </tr>
            {/* {
                showDate && (
                    <tr>
                        <th colSpan={mainCs}
                            align="center"
                            style={{ whiteSpace: "nowrap", fontSize: "110%" }}
                        >
                            From: {date["date_from"]} To{" "} {date["date_to"]}{" "}
                        </th>
                    </tr>
                )
            } */}
            <tr></tr>
            <tr>
                {columns.map((column) => (
                    <th align="left" style={{
                        ...column.columnStyle,
                        whiteSpace: "nowrap",
                        border: '1px solid rgb(186, 186, 186)'
                    }}>
                        {column.Header}
                    </th>
                ))}
            </tr>
            <tr></tr>
        </thead>
    )
}

const prepareTableRows = (data, columns, firstRow, lastRow) => {
    lastRow = lastRow ?? [];

    return (
        <tbody>
            {firstRow && prepareOneRow(firstRow)}
            {
                data.map(row => {
                    return (
                        <tr>
                            {
                                columns.map(col => {
                                    return (
                                        <td
                                            align="left"
                                            style={{
                                                whiteSpace: "nowrap",
                                                border: '1px solid rgb(186, 186, 186)',
                                            }}
                                        >{row[col.accessor]}</td>
                                    )
                                })
                            }
                        </tr>
                    )
                })
            }
            {lastRow.map(row => {
                return prepareOneRow(row);
            })}
        </tbody>
    )
}

const prepareOneRow = (data) => {
    return (
        <tr>
            {data.map(item => {
                return (
                    <th align="left" style={{
                        whiteSpace: "nowrap",
                        border: '1px solid rgb(186, 186, 186)',
                    }}> {item} </th>
                )
            })}
        </tr>
    )
}

export default {
    excel_data,
    challan_report_excel,
    excel_trip_data,
    excel_mr_data,
    excel_pod_data,
    excel_data_ack_pending,
    excel_pod_challan_data,
    admin_bilty_report_excel_data,
    paid_statement_excel_data,
    account_report_excel_data,
    account_report_negative_excel_data,
    admin_print_report_excel_data,
    brokerage_summary_excel,
    excel_party_bill,
    crossing_outward_report_excel_data,
    crossing_inward_report_excel_data,
    excel_bill_report_data,
    excel_concillation_report_data,
    balance_sheet_excel,
    inward_bill_excel,
    excel_vinod_data,
    excel_tds_data,
    party_rate_master_report_excel_data,
    account_report_report_excel_data,
    vehicle_register_excel,
    excel_mr_pending_report_data,
    excel_mr_statement_report_data,
    excel_paid_statement_report_data,
    pod_statement_excel,
    excel_pending_partb_report,
    excel_income_hisab_report_data,
    excel_paid_hisab_report_data,
    excel_fleet_report_data,
    fleet_vehicle_trip_data,
    excel_vehicle_report_data,
};
