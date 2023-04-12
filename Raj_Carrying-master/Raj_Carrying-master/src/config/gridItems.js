// const gridItems = [
//   { label: "Create Bilty", url: "/bilty" },
//   { label: "Create Challan", url: "/challan" },
//   { label: "Bhada Chitthi", url: "/trip" },
//   { label: "Challan Inward", url: "/inward" },
//   // { label: "Report - Challan", url: "/report-challan" },
//   // { label: "Add Vehicle", url: "/vehicle" },
//   { label: "Create MR", url: "/mr" },
//   { label: "Trip Inward", url: "/tripInward" },
//   { label: "Crossing Inward", url: "/crossingInward" },
//   { label: "Bilty Report", url: "/report-bilty" },
//   { label: "Bilty Inquiry", url: "/bilty-inquiry" },
// ];

const dashboardInfo = JSON.parse(window.sessionStorage.getItem("dashboard_info"))?.dashboard_info ?? [];
let gridItems = [];

dashboardInfo.forEach((item) => {
    gridItems.push({
        label: item.menu_name,
        url: "/" + item.menu_accessor,
    })
})

export default gridItems;
