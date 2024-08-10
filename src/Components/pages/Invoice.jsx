import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddForm from '../AddForm/AddForm'; // Add this if you want to include functionality to add new invoices
import styles from './Invoice.module.css'; // Adjust the path or rename as needed

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'invoiceNumber', headerName: 'Invoice Number', width: 150 },
  { field: 'amount', headerName: 'Amount', width: 110 },
  { field: 'vatRate', headerName: 'VAT Rate (%)', width: 120 },
  { field: 'vatAmount', headerName: 'VAT Amount', width: 120 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
  { field: 'status', headerName: 'Status', width: 110 },
  { field: 'issueDate', headerName: 'Issue Date', width: 150 },
  { field: 'dueDate', headerName: 'Due Date', width: 150 },
  { field: 'notes', headerName: 'Notes', width: 200 },
  // Add more columns as needed
];

const invoiceFields = [
  { name: 'invoiceNumber', label: 'Invoice Number', placeholder: 'Invoice Number', required: true },
  { name: 'amount', label: 'Amount', placeholder: 'Amount', type: 'number', required: true },
  { name: 'vatRate', label: 'VAT Rate (%)', placeholder: 'VAT Rate', type: 'number', defaultValue: 18 },
  { name: 'vatAmount', label: 'VAT Amount', placeholder: 'VAT Amount', type: 'number', required: true },
  { name: 'totalAmount', label: 'Total Amount', placeholder: 'Total Amount', type: 'number', required: true },
  { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Overdue'], placeholder: 'Select Status' },
  { name: 'issueDate', label: 'Issue Date', placeholder: 'Issue Date', type: 'date' },
  { name: 'dueDate', label: 'Due Date', placeholder: 'Due Date', type: 'date' },
  { name: 'notes', label: 'Notes', placeholder: 'Notes' },
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
        ...item,
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
        <AddForm
          fields={invoiceFields}
          apiEndpoint="http://localhost:5000/api/invoices"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="invoices" />
      </div>
    </div>
  );
};

export default Invoice;
