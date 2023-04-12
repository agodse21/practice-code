const menuItems = ["Master Files", "Modules", "Reports", "Accounting", "Utility"];
const subMenuItemsDict = {
  "Master Files": [
    { name: "Vehicle Master", status: 1, children: [], url: "/vehicle" },
    { name: "Account Master", status: 1, children: [], url: "/account_master" },
    { name: "Item Master", status: 1, children: [], url: "/item_master" },
    { name: "Group Master", status: 1, children: [], url: "/group_master" },
    { name: "Subgroup Master", status: 1, children: [], url: "/subgroup_master" },
    { name: "Station Master", status: 1, children: [], url: "/station_master" },
    { name: "PartyRate Master", status: 1, children: [], url: "/party_rate_master" },
    { name: "GeneralRate Master", status: 1, children: [], url: "/general_rate_master" },
    { name: "Mail Master", status: 1, children: [], url: "/mail-master" },
  ],
  Modules: [
    {
      name: "Bilty/Lr",
      status: 1,
      children: [
        { name: "Create bilty", status: 1, children: [], url: "/bilty" },
        {
          name: "Paid Bilty Statement",
          status: 1,
          children: [],
          url: "/biltystatement",
        },
      ],
      url: "",
    },
    {
      name: "Challan/Memo",
      status: 1,
      children: [
        { name: "Create Challan", status: 1, children: [], url: "/challan" },
        { name: "Challan Inward", status: 1, children: [], url: "/inward" },
      ],
      url: "",
    },
    {
      name: "MR Entry",
      status: 1,
      children: [
        { name: "Create MR", status: 1, children: [], url: "/mr" },
        { name: "Daily MR Statement", status: 1, children: [], url: "/mrstatement" },
        { name: "MR Pending Amount", status: 1, children: [], url: "/mr-pending-amount" },
      ],
      url: "",
    },
    {
      name: "Vehicle Register",
      status: 1,
      children: [],
      url: "/vehicleregister",
    },
    {
      name: "Crossing Memo",
      status: 1,
      children: [
        {
          name: "Inward",
          status: 1,
          children: [],
          url: "/crossingInward",
        },
        {
          name: "Outward",
          status: 1,
          children: [],
          url: "/crossingOutward",
        },
      ],
      url: "",
    },
    {
      name: "Crossing Billing",
      status: 1,
      children: [],
      url: "/crossingbilling",
    },
    {
      name: "Bill Entry",
      status: 1,
      children: [
        {
          name: "Party Billing",
          status: 1,
          children: [],
          url: "/consignorbilling?pod_billing=0",
        },
        {
          name: "Party Auto Billing",
          status: 1,
          children: [],
          url: "/consignor-auto-billing",
        },
        {
            name: "Party POD Billing",
            status: 1,
            children: [],
            url: "/consignorbilling?pod_billing=1",
        },
        {
          name: "Bill Paid",
          status: 1,
          children: [],
          url: "/bill-paid",
        },
      ],
      url: "",
    },
    {
      name: "Truck Bhada",
      status: 1,
      children: [
        {
          name: "Bhada Chitthi",
          status: 1,
          children: [],
          url: "/trip",
        },
        { name: "Trip Bhada Payable", status: 1, children: [], url: "/tripbhada" },
        { name: "Fleet Management", status: 1, children: [], url: "/fleet-management" },
      ],
      url: "",
    },
    {
      name: "POD",
      status: 1,
      children: [
        { name: "Pod Challan", status: 1, children: [], url: "/pod_challan" },
        {
          name: "Pod Challan Inward",
          status: 1,
          children: [],
          url: "/pod_challan_inward",
        },
        {
          name: "POD Party Statement",
          status: 1,
          children: [],
          url: "/pod_statement",
        },
        {
            name: "POD Auto Party Statement",
            status: 1,
            children: [],
            url: "/pod-auto-statement",
        },
        {
          name: "Bilty POD ACK",
          status: 1,
          children: [],
          url: "/bilty-ack",
        },        
      ],
      url: "",
    },
    {
        name: "Stock Management",
        status: 1,
        children: [
          {
            name: "Stock Inward",
            status: 1,
            children: [],
            url: "/stock-inward",
          },
          { name: "Stock Outward", status: 1, children: [], url: "/stock-outward" },
        ],
        url: "",
      },
    {
      name: "Local Delivery",
      status: 1,
      children: [],
      url: "/separate-ewb",
    },
  ],
  Reports: [
    {
      name: "Inquiry",
      status: 1,
      children: [
        { name: "Bilty Inquiry", status: 1, children: [], url: "/bilty-inquiry" },
        { name: "MR Inquiry", status: 1, children: [], url: "/mr-inquiry" },
        { name: "Trip Inquiry", status: 1, children: [], url: "/mr-inquiry" },
      ],
      url: "",
    },
    {
      name: "Booking Report",
      status: 1,
      children: [
        { name: "Bilty Report", status: 1, children: [], url: "/report-bilty?report_type=bilty" },
        { name: "Admin LR Report", status: 1, children: [], url: "/admin-report-bilty" },
        { name: "Paid Statement Report", status: 1, children: [], url: "/report-paid-statement" },
      ],
      url: "",
    },
    { name: "Challan Report", status: 1, children: [], url: "/report-challan" },
    {
      name: "Delivery Report",
      status: 1,
      children: [
        { name: "Inward Report", status: 1, children: [], url: "/report-bilty?report_type=inward" },
        { name: "Admin Inward Report", status: 1, children: [], url: "/report-bilty?report_type=admin-inward" },
        { name: "Marfatiya Report", status: 1, children: [], url: "/marfatiya-wise" },
        { name: "MR Report", status: 1, children: [], url: "/report-mr" },
        { name: "MR Pending Amount Report", status: 1, children: [], url: "/report-mr-pending-amount" },
        { name: "MR Statement Report", status: 1, children: [], url: "/report-mr-statement" },
      ],
      url: "",
    },
    {
      name: "Crossing Report",
      status: 1,
      children: [
        { name: "Crossing Inward Report", status: 1, children: [], url: "/crossing-inward-report" },
        { name: "Crossing Outward Report", status: 1, children: [], url: "/crossing-outward-report" },
      ],
      url: "",
    },
    {
      name: "EWB",
      status: 1,
      children: [
        {
            name: "Ewb Report",
            status: 1,
            children: [],
            url: "/ewbextensionreport",
        },
        { name: "Pending Part B Report", status: 1, children: [], url: "/report-pending-partb" },
      ],
      url: "",
    },
    {
      name: "Vehicle",
      status: 1,
      children: [
        { name: "Vehicle Report", status: 1, children: [], url: "/report-vehicle" },
        { name: "Vehicle Register Report", status: 1, children: [], url: "/report-vehicleregister" },
        { name: "Trip Report", status: 1, children: [], url: "/report-trip" },
        { name: "Fleet Report", status: 1, children: [], url: "/report-fleet" },
      ],
      url: "",
    },
    {
      name: "Account Report",
      status: 1,
      children: [
        { name: "Account Report", status: 1, children: [], url: "/account-report" },
        { name: "Profit & Loss", status: 1, children: [], url: "/pl-report" },
        {
          name: "Outstanding",
          status: 1,
          children: [],
          url: "/outstanding-partywise",
        },
      ],
      url: "",
    },
    {
      name: "Brokerage",
      status: 1,
      children: [
        { name: "Memo Brokerage", status: 1, children: [], url: "/brokerage" },
        { name: "Brokerage Summary", status: 1, children: [], url: "/brokerage-summary" },
      ],
      url: "",
    },
    { name: "Freight Bill Report", status: 1, children: [], url: "/report-bill" },
    {
        name: "POD",
        status: 1,
        children: [
          { name: "Ack Pending", status: 1, children: [], url: "/ackpendingpartyreport" },
          { name: "Party Statement", status: 1, children: [], url: "/report-pod-statement" },
        ],
        url: "",
    },
    { name: "Vinod Report", status: 1, children: [], url: "/vinod-report" },
    { name: "TDS Report", status: 1, children: [], url: "/tds-report" },
    { name: "User Report", status: 1, children: [], url: "/report-user" },
    { name: "Hisab", status: 1, children: [], url: "/hisab" },
  ],
  Accounting: [
    { name: "Journal Voucher", status: 1, children: [], url: "/account-transaction?voucher_type=jv" },
    { name: "Cash Receipt", status: 1, children: [], url: "/account-transaction?voucher_type=cr" },
    { name: "Cash Payment", status: 1, children: [], url: "/account-transaction?voucher_type=cp" },
    { name: "Bank Payment", status: 1, children: [], url: "/account-transaction?voucher_type=bp" },
    { name: "Bank Receipt", status: 1, children: [], url: "/account-transaction?voucher_type=br" },
    { name: "Opening Balance", status: 1, children: [], url: "/opening-balance" },
    { name: "Bank Clearance", status: 1, children: [], url: "/bank-clearance" },
  ],
  Utility: [
    { name: "Change Branch", status: 1, children: [], url: "/branch-sel" },
    { name: "Change Password", status: 1, children: [], url: "/change-password" },
    { name: "Sign Up", status: 1, children: [], url: "/signup" },
    { name: "GST", status: 1, children: [], url: "https://www.gstsearch.in/verify.html" },
    { name: "Anydesk", status: 1, children: [], url: "https://download.anydesk.com/AnyDesk.exe" },
    { name: "Manage Dashboard", status: 1, children: [], url: "/manage-dashboard" },
    // { name: "preferences", status: 1, children: ["c", "d"] },
  ],
  Help: [
    { name: "Welcome", status: 1, children: ["c", "d"] },
    { name: "About Us", status: 1, children: ["c", "d"] },
  ],
};

export { menuItems, subMenuItemsDict };
