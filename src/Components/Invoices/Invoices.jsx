import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import styles from './Invoices.module.css'; // Adjust the path or rename as needed

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'invoiceNumber', headerName: 'Invoice Number', width: 150 },
  { field: 'customerName', headerName: 'Customer Name', width: 150 },
  { field: 'customerAddress', headerName: 'Customer Address', width: 200 },
  { field: 'customerEmail', headerName: 'Customer Email', width: 200 },
  { field: 'customerPhone', headerName: 'Customer Phone', width: 150 },
  { field: 'subtotal', headerName: 'Subtotal', width: 120 },
  { field: 'tax', headerName: 'Tax', width: 120 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
  { field: 'status', headerName: 'Status', width: 110 },
  { field: 'issueDate', headerName: 'Issue Date', width: 150 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
  { field: 'notes', headerName: 'Notes', width: 200 },
  // Add more columns as needed
];

const Invoice = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoiceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/invoices', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Sort invoices by issueDate in descending order and limit to 10
      const sortedAndLimitedData = response.data
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
        .slice(0, 10);

      const transformedRows = sortedAndLimitedData.map((item, index) => ({
        id: item._id, // Keep the backend ID for navigation
        sequence: index + 1, // Use a separate 'sequence' field for display
        invoiceNumber: item.invoiceNumber,
        customerName: item.customer?.name || '',
        customerAddress: item.customer?.address || '',
        customerEmail: item.customer?.email || '',
        customerPhone: item.customer?.phone || '',
        subtotal: item.subtotal,
        tax: item.tax,
        totalAmount: item.totalAmount,
        status: item.status,
        issueDate: new Date(item.issueDate).toLocaleDateString(),
        dueDate: new Date(item.dueDate).toLocaleDateString(),
        notes: item.notes,
      }));

      setRows(transformedRows);
    } catch (error) {
      setError('Failed to fetch invoice data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.addContainer}>
        <span className={styles.title}>Tax Invoice</span>
      </div>
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="invoices" />
      </div>
    </div>
  );
};

export default Invoice;
