import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import styles from './App.module.css';

import Header from './Components/Header/Header';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Sidebar, { SidebarItem } from './Components/Sidebar/Sidebar';
import AdminDashboard from './Components/pages/AdminDashboard';
import Customer from './Components/pages/Customers';
import Employee from './Components/pages/Employee';
import Invoice from './Components/pages/Invoice';
import Order from './Components/pages/Order';
import Quotation from './Components/pages/Quotation';
import Transaction from './Components/pages/Transactions';

import {
  Calculator,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="*" element={
          <div className={styles.appContainer}>
            <Sidebar className={styles.sidebar}>
              <SidebarItem icon={<LayoutDashboard size={30} />} text="AdminDashboard" path="/admin-dashboard" />
              <SidebarItem icon={<BarChart3 size={30} />} text="Statistics" path="/statistics" alert />
              <SidebarItem icon={<UserCircle size={30} />} text="User" path="/user" />
              <SidebarItem icon={<Boxes size={30} />} text="Inventory" path="/inventory" />
              <SidebarItem icon={<Package size={30} />} text="Orders" path="/orders" />
              <SidebarItem icon={<Receipt size={30} />} text="Invoice" path="/invoice" />
              <SidebarItem icon={<Calculator size={30} />} text="Quotes" path="/quotes" alert />
            </Sidebar>
            <div className={styles.mainContainer}>
              <Header className={styles.header} />
              <div className={styles.content}>
                <Routes>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/statistics" element={<Customer />} />
                  <Route path="/user" element={<Employee />} />
                  <Route path="/inventory" element={<Order />} />
                  <Route path="/orders" element={<Quotation />} />
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/quotes" element={<Transaction />} />
                </Routes>
                <Outlet />
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
