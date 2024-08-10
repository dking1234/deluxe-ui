import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddForm from '../AddForm/AddForm';
import styles from './Order.module.css';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 }, // Display sequence instead of ID
  { field: 'customerName', headerName: 'Customer', width: 150 },
  { field: 'itemsSummary', headerName: 'Items', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 110 },
  { field: 'totalAmount', headerName: 'Amount', width: 110 },
  { field: 'status', headerName: 'Status', width: 150 },
  // Add more columns as needed
];

const orderFields = [
  { name: 'customer', label: 'Customer', placeholder: 'Customer', required: true },
  { name: 'items', label: 'Items', placeholder: 'Items', required: true },
  { name: 'description', label: 'Description', placeholder: 'Description' },
  { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Quantity', required: true },
  { name: 'deadline', label: 'Deadline', type: 'date', placeholder: 'Select Deadline', required: true },
];

const Orders = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const fetchOrderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const transformedRows = response.data.map((item, index) => ({
        id: item._id, // Keep the backend ID for navigation
        sequence: index + 1, // Use a separate 'sequence' field for display
        customerName: item.customer.name, // Display customer name
        itemsSummary: item.items.map(i => `${i.product} (Qty: ${i.quantity})`).join(', '), // Display items
        quantity: item.items.reduce((sum, i) => sum + i.quantity, 0), // Total quantity
        totalAmount: item.totalAmount, // Total amount
        status: item.status, // Status
      }));
      setRows(transformedRows);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchOrderData(); // Re-fetch order data after adding a new order
  };

  const handleRowClick = (id) => {
    navigate(`/orders/${id}`); // Navigate to the OrderDetails page with the order ID
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
        <span className={styles.title}>Job Order</span>
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Order</button>
        </div>
      </div>
      {showAddForm && (
        <AddForm
          fields={orderFields}
          apiEndpoint="http://localhost:5000/api/orders"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="orders" onRowClick={handleRowClick} />
      </div>
    </div>
  );
};

export default Orders;
