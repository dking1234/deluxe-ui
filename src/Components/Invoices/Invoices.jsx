import React from 'react';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import styles from './Invoices.module.css';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'customer', headerName: 'Customer', width: 150 },
  { field: 'Service', headerName: 'Service', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 110 },
  // Add more columns as needed
];

const rows = [
  { id: 1, date: '2024-07-01', customer: 'John Doe', amount: 200, status: 'Paid' },
  { id: 2, date: '2024-07-02', customer: 'Jane Smith', amount: 150, status: 'Pending' },
  { id: 3, date: '2024-07-03', customer: 'Alice Johnson', amount: 250, status: 'Overdue' },
  // Add more rows as needed
];

const Invoices = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <span className={styles.title}>Recent Invoices</span>
        <DataTable columns={columns} rows={rows} slug="invoices" />
      </div>
    </div>
  );
};

export default Invoices;
