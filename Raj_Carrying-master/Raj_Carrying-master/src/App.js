import React from "react";
import Navbar from "./components/Navbar";
import NavItem from "./components/NavItem";
import Titlebar from "./components/Titlebar";
import "./App.css";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Products from "./components/pages/Products";
import Inward from "./components/pages/Inward";
import BiltyStatement from "./components/pages/BiltyStatement";
import MrStatement from "./components/pages/MrStatement";
import PodChallanInward from "./components/pages/PodChallanInward";
import MR from "./components/pages/MR";
import CrossingInward from "./components/pages/CrossingInward";
import CrossingOutward from "./components/pages/CrossingOutWard";
import TripInward from "./components/pages/TripInward";
import VehiclePage from "./components/pages/Vehicle";
import AccountMasterPage from "./components/pages/AccountMaster";
import ItemMasterPage from "./components/pages/ItemMaster";
import StationMasterPage from "./components/pages/StationMaster";
import Challan from "./components/pages/Challan";
import PodChallan from "./components/pages/PodChallan";
import TripPage from "./components/pages/TripPage";
import VehicleRegisterPage from "./components/pages/VehicleRegisterPage";
import TripBhadaPage from "./components/pages/TripBhada";
import Bilty from "./components/pages/Bilty";
import { menuItems, subMenuItemsDict } from "./config/menuItems.js";
import Login from "./components/Login";
import BranchSelector from "./components/BranchSelector";

import useSessionVariables from "./components/useSessionVariables.js";
import ReportBilty from "./components/pages/ReportBilty";
import AdminReportBilty from "./components/pages/AdminReportBilty";
import ReportMr from "./components/pages/ReportMr";
import AccountReport from "./components/pages/AccountReport";
import ProfitLossReport from "./components/pages/ProfitLossReport";
import ReportChallan from "./components/pages/ReportChallan";
import ReportVehicle from "./components/pages/ReportVehicle";
import ReportVehicleRegister from "./components/pages/ReportVehicleRegister";
import Trip from "./components/Trip";
import ConsignorBilling from "./components/pages/ConsignorBillingPage";
import BankClearancePage from "./components/pages/BankClearancePage";
import EwbExtensionReportPage from "./components/pages/EwbExtensionReportPage";
import CrossingBillingPage from "./components/pages/CrossingBillingPage";
import PartyRateMaster from "./components/pages/PartyRateMasterPage";
import GeneralRateMaster from "./components/pages/GeneralRateMasterPage";
import AckPendingPartyReportPage from "./components/pages/AckPendingPartyReportPage";
import PodStatementPage from "./components/pages/PodStatementPage";
import BiltyInquiryPage from "./components/pages/BiltyInquiryPage";
import MrInquiryPage from "./components/pages/mrInquiryPage";
import AccountTransactionPage from "./components/pages/AccountTransactionPage";
import MarfatiyaWise from "./components/MarfatiyaWise";
import Brokerage from "./components/BrokerageForm";
import PaidStatement from "./components/PaidStatement";
import BrokerageSummary from "./components/BrokerageSummary";
import TripReportPage from "./components/pages/TripReportPage";
import BillReportPage from "./components/pages/BillReportPage";
import BiltyAcknowledgement from "./components/BiltyAcknowledgement";
import AdminBiltyReport from "./components/AdminBiltyReport";
import BillPaid from "./components/BillPaID.js";
import OutstandingPartywise from "./components/OutstandingPartyWise";
import CrossingOutWardReport from "./components/CrossingOutwardReport";
import OpeningBalance from "./components/OpeningBalance";
import VinodReport from "./components/VinodReport";
import TDSReport from "./components/TDSReport";
import CrossingInWardReport from "./components/CrossingInwardReport";
import Signup from "./components/Signup";
import EditRoleId from "./components/EditRoleId";
import MrReport from "./components/MrReport";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import GroupMasterPage from "./components/pages/GroupMasterPage";
import SubgroupMasterPage from "./components/pages/SubgroupMasterPage";
import SeparateEwbPage from "./components/pages/SeparateEwbPage";
import EditRoleIdPage from "./components/pages/EditRoleIdPage";
import SignupPage from "./components/pages/SignupPage";
import ConsignorAutoBillingPage from "./components/pages/ConsignorAutoBillingPage";
import MrPendingAmountPage from "./components/pages/MrPendingAmountPage"
import ReportMrPendingAmount from "./components/pages/ReportMrPendingAmount";
import ReportUser from "./components/pages/ReportUser";
import ReportPaidStatement from "./components/pages/ReportPaidStatement";
import ReportMrStatement from "./components/pages/ReportMrStatement";
import MailMasterPage from "./components/pages/MailMaster";
import ReportPodStatement from "./components/pages/ReportPodStatement";
import ManageDashboardPage from "./components/pages/ManageDashboardPage";
import ReportPendingPartBPage from "./components/pages/ReportPendingPartBPage";
import HisabPage from "./components/pages/HisabPage";
import PodAutoStatementPage from "./components/pages/PodAutoStatementPage";
import FleetManagementPage from "./components/pages/FleetManagementPage";
import FleetReportPage from "./components/pages/FleetReportPage";
import StockOutwardPage from "./components/pages/StockOutwardPage";
import StockInwardPage from "./components/pages/StockInwardPage";

// import { ReactComponent as BellIcon } from './components/icons/bell.svg';
// import { ReactComponent as MessengerIcon } from './components/icons/messenger.svg';
// import { ReactComponent as CaretIcon } from './components/icons/caret.svg';
// import { ReactComponent as PlusIcon } from './components/icons/plus.svg';

let roleIdAdded = false;

function App() {
    const sessionObject = useSessionVariables();

  function handleLogout() {
    // sessionStorage.clear()
    sessionObject.saveSessionVariableByField("access_token", "");
    // sessionObject.saveSessionVariableByField("branch_id", "");
  }
  return (
    <Router>
      <Titlebar />
      {!sessionObject.sessionVariables.access_token ? (
        <Login sessionObject={sessionObject} />
      ) : !sessionObject.sessionVariables.branch_id ? (
        <BranchSelector sessionObject={sessionObject} mainBranchSelector={true} />
      ) : (
        <div>
          <Navbar handleLogout={handleLogout} sessionObject={sessionObject}>
            {menuItems.map((menuItem) => (
              <NavItem
                text={menuItem}
                dropDownMenuItems={subMenuItemsDict[menuItem]}
              />
            ))}
          </Navbar>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/inward">
              <Inward sessionObject={sessionObject} />
            </Route>
            <Route path="/biltystatement">
              <BiltyStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/mrstatement">
              <MrStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/pod_challan_inward">
              <PodChallanInward sessionObject={sessionObject} />
            </Route>
            <Route path="/mr">
              <MR sessionObject={sessionObject} />
            </Route>
            <Route path="/crossingInward">
              <CrossingInward sessionObject={sessionObject} />
            </Route>
            <Route path="/party_rate_master">
              <PartyRateMaster sessionObject={sessionObject} />
            </Route>
            <Route path="/general_rate_master">
              <GeneralRateMaster sessionObject={sessionObject} />
            </Route>
            <Route path="/consignorbilling">
              <ConsignorBilling sessionObject={sessionObject} />
            </Route>
            <Route path="/consignor-auto-billing">
              <ConsignorAutoBillingPage sessionObject={sessionObject} />
            </Route>
            <Route path="/pod-auto-statement">
              <PodAutoStatementPage sessionObject={sessionObject} />
            </Route>
            <Route path="/bank-clearance">
              <BankClearancePage sessionObject={sessionObject} />
            </Route>
            <Route path="/pod_statement">
              <PodStatementPage sessionObject={sessionObject} />
            </Route>
            <Route path="/crossingbilling">
              <CrossingBillingPage sessionObject={sessionObject} />
            </Route>
            <Route path="/crossingOutward">
              <CrossingOutward sessionObject={sessionObject} />
            </Route>
            <Route path="/tripInward">
              <TripInward sessionObject={sessionObject} />
            </Route>
            <Route path="/ewbextensionreport">
              <EwbExtensionReportPage sessionObject={sessionObject} />
            </Route>
            <Route path="/ackpendingpartyreport">
              <AckPendingPartyReportPage sessionObject={sessionObject} />
            </Route>
            <Route path="/vehicle">
              <VehiclePage sessionObject={sessionObject} />
            </Route>
            <Route path="/account_master">
              <AccountMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/item_master">
              <ItemMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/group_master">
              <GroupMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/subgroup_master">
              <SubgroupMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/station_master">
              <StationMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/challan">
              <Challan sessionObject={sessionObject} />
            </Route>
            <Route path="/fleet-management">
              <FleetManagementPage sessionObject={sessionObject} />
            </Route>
            <Route path="/stock-outward">
              <StockOutwardPage sessionObject={sessionObject} />
            </Route>
            <Route path="/stock-inward">
              <StockInwardPage sessionObject={sessionObject} />
            </Route>
            <Route path="/account-transaction">
              <AccountTransactionPage sessionObject={sessionObject} />
            </Route>
            <Route path="/pod_challan">
              <PodChallan sessionObject={sessionObject} />
            </Route>
            <Route path="/bilty">
              <Bilty sessionObject={sessionObject} />
            </Route>
            <Route path="/bilty-inquiry">
              <BiltyInquiryPage sessionObject={sessionObject} />
            </Route>
            <Route path="/mr-inquiry">
              <MrInquiryPage sessionObject={sessionObject} />
            </Route>
            <Route path="/report-bilty">
              <ReportBilty sessionObject={sessionObject} />
            </Route>
            <Route path="/report-vehicle">
              <ReportVehicle sessionObject={sessionObject} />
            </Route>
            <Route path="/report-pending-partb">
              <ReportPendingPartBPage sessionObject={sessionObject} />
            </Route>
            <Route path="/report-vehicleregister">
              <ReportVehicleRegister sessionObject={sessionObject} />
            </Route>
            <Route path="/report-mr">
              <MrReport sessionObject={sessionObject} />
            </Route>
            <Route path="/report-pod-statement">
              <ReportPodStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/report-user">
              <ReportUser sessionObject={sessionObject} />
            </Route>
            <Route path="/report-paid-statement">
              <ReportPaidStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/report-mr-statement">
              <ReportMrStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/report-mr-pending-amount">
              <ReportMrPendingAmount sessionObject={sessionObject} />
            </Route>
            <Route path="/report-trip">
              <TripReportPage sessionObject={sessionObject} />
            </Route>
            <Route path="/report-fleet">
              <FleetReportPage sessionObject={sessionObject} />
            </Route>
            <Route path="/report-bill">
              <BillReportPage sessionObject={sessionObject} />
            </Route>
            <Route path="/account-report">
              <AccountReport sessionObject={sessionObject} />
            </Route>
            <Route path="/pl-report">
              <ProfitLossReport sessionObject={sessionObject} />
            </Route>
            <Route path="/report-challan">
              <ReportChallan sessionObject={sessionObject} />
            </Route>
            <Route path="/trip">
              <TripPage sessionObject={sessionObject} />
            </Route>
            <Route path="/vehicleregister">
              <VehicleRegisterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/mr-pending-amount">
              <MrPendingAmountPage sessionObject={sessionObject} />
            </Route>
            <Route path="/bank-clearance">
              <BankClearancePage sessionObject={sessionObject} />
            </Route>
            <Route path="/tripbhada">
              <TripBhadaPage sessionObject={sessionObject} />
            </Route>
            <Route path="/branch-sel">
              <BranchSelector sessionObject={sessionObject} mainBranchSelector={false} />
            </Route>
            <Route path="/marfatiya-wise">
              <MarfatiyaWise sessionObject={sessionObject} />
            </Route>
            <Route path="/bilty-ack">
              <BiltyAcknowledgement sessionObject={sessionObject} />
            </Route>
            <Route path="/brokerage">
              <Brokerage sessionObject={sessionObject} />
            </Route>
            <Route path="/brokerage-summary">
              <BrokerageSummary sessionObject={sessionObject} />
            </Route>
            <Route path="/outstanding-partywise">
              <OutstandingPartywise sessionObject={sessionObject} />
            </Route>
            <Route path="/crossing-outward-report">
              <CrossingOutWardReport sessionObject={sessionObject} />
            </Route>
            <Route path="/opening-balance">
              <OpeningBalance sessionObject={sessionObject} />
            </Route>
            <Route path="/mail-master">
              <MailMasterPage sessionObject={sessionObject} />
            </Route>
            <Route path="/vinod-report">
              <VinodReport sessionObject={sessionObject} />
            </Route>
            <Route path="/tds-report">
              <TDSReport sessionObject={sessionObject} />
            </Route>
            <Route path="/crossing-inward-report">
              <CrossingInWardReport sessionObject={sessionObject} />
            </Route>
            <Route path="/bill-paid">
              <BillPaid sessionObject={sessionObject} />
            </Route>
            <Route path="/paid-statement">
              <PaidStatement sessionObject={sessionObject} />
            </Route>
            <Route path="/admin-report-bilty">
              <AdminReportBilty sessionObject={sessionObject} />
            </Route>
            <Route path="/signup"> 
                <SignupPage sessionObject={sessionObject}/>
            </Route>
            <Route path="/change-password"> 
                <ResetPasswordPage sessionObject={sessionObject}/>
            </Route>
            <Route path="/edit-role-id"> 
                <EditRoleIdPage sessionObject={sessionObject}/>
            </Route>
            <Route path="/manage-dashboard"> 
                <ManageDashboardPage sessionObject={sessionObject}/>
            </Route>
            <Route path="/hisab"> 
                <HisabPage sessionObject={sessionObject}/>
            </Route>
            <Route path="/separate-ewb"> 
                <SeparateEwbPage sessionObject={sessionObject}/>
            </Route>
          </Switch>
        </div>
      )}
    </Router>
  );
}

export default App;
