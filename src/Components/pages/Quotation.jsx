import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import styles from './Quotation.module.css';

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'quotationNumber', headerName: 'Quotation Number', width: 150 },
  { field: 'customerName', headerName: 'Customer Name', width: 150 },
  { field: 'customerAddress', headerName: 'Customer Address', width: 200 },
  { field: 'customerEmail', headerName: 'Customer Email', width: 200 },
  { field: 'customerPhone', headerName: 'Customer Phone', width: 150 },
  { field: 'issueDate', headerName: 'Issue Date', width: 150 },
  { field: 'expirationDate', headerName: 'Expiration Date', width: 150 },
  { field: 'subtotal', headerName: 'Subtotal', width: 120 },
  { field: 'tax', headerName: 'Tax', width: 120 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'notes', headerName: 'Notes', width: 200 },
  // Add more columns as needed
];

const Quotation = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuotationData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/quotations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformedRows = response.data.map((item, index) => ({
        id: item._id, // Use the actual ID from the backend
        sequence: index + 1, // Use a separate 'sequence' field for display
        ...item,
        quotationNumber: item.quotationNumber,
        customerName: item.customer.name, // Customer name
        customerAddress: item.customer.address, // Customer address
        customerEmail: item.customer.email, // Customer email
        customerPhone: item.customer.phone, // Customer phone
        issueDate: new Date(item.issueDate).toLocaleDateString(), // Format issue date
        expirationDate: new Date(item.expirationDate).toLocaleDateString(), // Format expiration date
        subtotal: item.subtotal,
        tax: item.tax,
        totalAmount: item.totalAmount,
        status: item.status,
        notes: item.notes || 'N/A', // Display 'N/A' if notes are not present
      }));

      setRows(transformedRows);
    } catch (error) {
      setError('Failed to fetch quotation data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotationData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <span className={styles.title}>Quotations</span>
        <DataTable columns={columns} rows={rows} slug="quotations" />
      </div>
    </div>
  );
};

export default Quotation;
