import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import styles from './App.module.css'

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
          <>
            <Header />
            <Sidebar>
              <SidebarItem icon={<LayoutDashboard size={30} />} text="AdminDashboard" />
              <SidebarItem icon={<BarChart3 size={30} />} text="Statistics" alert />
              <SidebarItem icon={<UserCircle size={30} />} text="User" />
              <SidebarItem icon={<Boxes size={30} />} text="Inventory" active />
              <SidebarItem icon={<Package size={30} />} text="Orders" />
              <SidebarItem icon={<Receipt size={30} />} text="Invoice" />
              <SidebarItem icon={<Calculator size={30} />} text="Quotes" alert />
            </Sidebar>
            <div className={styles.content}>
              <Outlet />
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
