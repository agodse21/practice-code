const item_name = "item_info[0][item_name]";
const tableToPrintTableHeader = [
  { label: "S. No." },
  { label: "Bilty No." },
  //   { label: "Bilty Date", className: "text-center table-header" },
  //   { label: "Station From", className: "text-center table-header" },
  //   { label: "Station To", className: "text-center table-header" },
  { label: "Consignor Name" },
  { label: "Consignee Name" },
  { label: "Content" },
  { label: "Private Marka No" },
  { label: "No Of Package" },
  { label: "Charge Weight" },
  { label: "To Pay" },
  { label: "Paid" },
  { label: "TBB" },
  { label: "Destination" },
];

const tableToPrintTableItems = [
  {
    type: "text",
    name: "sr_no",
    label: "Sr No",
  },

  {
    type: "text",
    name: "bilty_no",
    label: "Bilty No",
  },
  {
    type: "text",
    name: "consignor_name",
    label: "Consignor Name",
  },

  {
    type: "text",
    name: "consignee_name",
    label: "Consignee Name",
  },
  {
    type: "text",
    name: "content",
    label: "Content",
  },
  {
    type: "text",
    name: "private_marka_no",
    label: "Private Marka No",
  },
  {
    type: "text",
    name: "no_of_package",
    label: "No Of Package",
  },
  {
    type: "text",
    name: "charge_weight",
    label: "Charge Weight",
  },
  {
    type: "text",
    name: "to_pay",
    label: "To Pay",
  },
  {
    type: "text",
    name: "paid",
    label: "Paid",
  },
  {
    type: "text",
    name: "tbb",
    label: "TBB",
  },
  {
    type: "text",
    name: "destination_name",
    label: "Destination",
  },
  {
    type: "text",
    name: "eb_no",
    label: "EB No",
  },
];

export { tableToPrintTableHeader, tableToPrintTableItems };
