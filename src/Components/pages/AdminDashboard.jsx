import React from 'react';
import StatCard from '../StaticsComponent/StatCard';
import styles from './AdminDashboard.module.css';
import PieChart from '../PieChart/PieChart';
import Analytics from '../Analytic/Analytics';
import Invoices from '../Invoices/Invoices';

const AdminDashboard = () => {


  const stats = {
    sales: 10,
    customers: 150,
    invoices: 25,
    orders: 75,
  };  

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsContainer}>
        <StatCard 
          number={stats.sales} 
          label="Sales" 
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
