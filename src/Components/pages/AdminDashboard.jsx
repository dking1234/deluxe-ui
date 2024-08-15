import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '../StaticsComponent/StatCard';
import styles from './AdminDashboard.module.css';
import PieChart from '../PieChart/PieChart';
import Analytics from '../Analytic/Analytics';
import Invoices from '../Invoices/Invoices';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    customers: 0,
    invoices: 0,
    orders: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [employeesResponse, customersResponse, invoicesResponse, ordersResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users/employees/count', { headers }),
        axios.get('http://localhost:5000/api/customer/count', { headers }),
        axios.get('http://localhost:5000/api/invoices/count', { headers }),
        axios.get('http://localhost:5000/api/orders/count', { headers }),
      ]);

      setStats({
        employees: employeesResponse.data.count,
        customers: customersResponse.data.count,
        invoices: invoicesResponse.data.count,
        orders: ordersResponse.data.count,
      });
      console.log(employeesResponse)
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsContainer}>
        <StatCard 
          number={stats.employees} 
          label="Employees" 
          analytics="12.20% Since last week"
          borderColor="#007bff" // Blue
        />
        <StatCard 
          number={stats.customers} 
          label="Customers" 
          analytics="12.20% Since last week"
          borderColor="#ff9800" // Orange
        />
        <StatCard 
          number={stats.invoices} 
          label="Invoices" 
          analytics="12.20% Since last week"
          borderColor="#4caf50" // Green
        />
        <StatCard 
          number={stats.orders} 
          label="Orders" 
          analytics="12.20% Since last week"
          borderColor="#f44336" // Red
        />
      </div>
      <div className={styles.analyticsContainer}>
        <PieChart />
        <Analytics  />
      </div>
      <div className={styles.invoiceContainer}>
        <Invoices />
      </div>  
    </div>
  );
};

export default AdminDashboard;
