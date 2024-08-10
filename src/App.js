import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import { UserProvider } from './Components/UserContext/UserContext';
import { AuthProvider } from './config/AuthContext';

import Header from './Components/Header/Header';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Sidebar, { SidebarItem } from './Components/Sidebar/Sidebar';
import AdminDashboard from './Components/pages/AdminDashboard';
import Customer from './Components/pages/Customers';
import Employee from './Components/pages/Employee';
import Invoice from './Components/pages/Invoice';
import Order from './Components/pages/Order';
import Quotation from './Components/pages/Quotation';
import DeliveryNote from './Components/DeliveryNote/DeliveryNote';
import Transaction from './Components/pages/Transactions';
import Accounts from './Components/pages/Accounts';
import SelectRole from './Components/LoginSignup/SelectRole';
import CustomerDetails from './Components/DetailPages/CustomerDetails/CustomerDetails';
import EmployeDetails from './Components/DetailPages/EmployeeDetails/EmployeDetails';
import OrderDetails from './Components/DetailPages/JobOrderDetails/JobOrderDetails';
import QuotationsDetails from './Components/DetailPages/QuotationDetails/QuotationsDetails';
import InvoiceDetails from './Components/DetailPages/InvoiceDetails/InvoiceDetails';

import { LayoutDashboard, User, Users, Package, FileText, Calendar, Receipt } from 'lucide-react';

import PrivateRoute from './config/PrivateRoute';
import Notification from './Components/Notification/Notification';
import { Profile } from './Components/Profile/Profile';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/select-role/:id" element={<SelectRole />} />
            <Route path="*" element={
              <PrivateRoute>
                <div className={styles.appContainer}>
                  <Sidebar className={styles.sidebar}>
                    <SidebarItem icon={<LayoutDashboard size={30} />} text="Dashboard" path="/admin-dashboard" />
                    <SidebarItem icon={<User size={30} />} text="Customer" path="/customer" alert />
                    <SidebarItem icon={<Users size={30} />} text="Employee" path="/employee" />
                    <SidebarItem icon={<Package size={30} />} text="Job Order" path="/order" />
                    <SidebarItem icon={<FileText size={30} />} text="Quotation" path="/quotes" alert />
                    <SidebarItem icon={<Calendar size={30} />} text="Tax Invoice" path="/invoice" />
                    <SidebarItem icon={<Receipt size={30} />} text="DeliveryNote" path="/deliveryNote" />
                    <SidebarItem icon={<FileText size={30} />} text="Accounts" path="/accounts" alert />
                  </Sidebar>
                  <div className={styles.mainContainer}>
                    <Header className={styles.header} /> {/* Header does not need userId prop if it's coming from context */}
                    <div className={styles.content}>
                      <Routes>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/customer" element={<Customer />} />
                        <Route path="/employee" element={<Employee />} />
                        <Route path="/order" element={<Order />} />
                        <Route path="/quotes" element={<Quotation />} />
                        <Route path="/invoice" element={<Invoice />} />
                        <Route path="/deliveryNote" element={<DeliveryNote />} />
                        <Route path="/" element={<Transaction />} />
                        <Route path="/accounts" element={<Accounts />} />
                        <Route path="/customers/:id" element={<CustomerDetails />} />
                        <Route path="/employee/:id" element={<EmployeDetails />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                        <Route path="/quotations/:id" element={<QuotationsDetails />} />
                        <Route path="/invoices/:id" element={<InvoiceDetails />} />
                        <Route path="/notifications" element={<Notification />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
