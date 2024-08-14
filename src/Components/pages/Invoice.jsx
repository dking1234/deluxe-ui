import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddFormAPI from '../AddForm/AddFormAPI'; // Adjust the import path as necessary
import styles from './Invoice.module.css'; // Adjust the path or rename as needed

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

const invoiceFields = [
  { name: 'customer', label: 'Customer', type: 'select', required: true, apiEndpoint: 'http://localhost:5000/api/customer' },
  { name: 'items', label: 'Items', type: 'dynamic', required: true },
  { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
  { name: 'dueDate', label: 'Expiration Date', type: 'date', required: true },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

const Invoice = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchInvoiceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/invoices', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const transformedRows = response.data.map((item, index) => ({
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

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchInvoiceData(); // Re-fetch invoice data after adding a new invoice
  };

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
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Invoice</button>
        </div>
      </div>
      {showAddForm && (
        <AddFormAPI
          fields={invoiceFields}
          apiEndpoint="http://localhost:5000/api/invoices"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
          formTitle="Add Invoices"
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="invoices" />
      </div>
    </div>
  );
};

export default Invoice;
  