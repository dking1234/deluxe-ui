import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddFormAPI from '../AddForm/AddFormAPI';
import styles from './Order.module.css';
import { useNavigate } from 'react-router-dom';

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'customerName', headerName: 'Customer', width: 150 },
  { field: 'itemsSummary', headerName: 'Description', width: 400 },
  { field: 'quantity', headerName: 'Quantity', width: 110 },
  { field: 'totalAmount', headerName: 'Amount', width: 160 },
  { field: 'status', headerName: 'Status', width: 150 },
];

const orderFields = [
  { name: 'customer', label: 'Customer', type: 'select', required: true, apiEndpoint: 'http://localhost:5000/api/customer' },
  { name: 'items', label: 'Items', type: 'dynamic', required: true, apiEndpoint: 'http://localhost:5000/api/item' },
  { name: 'description', label: 'Description', placeholder: 'Description' },
  { name: 'deadline', label: 'Deadline', type: 'date', placeholder: 'Select Deadline', required: true },
];

const Orders = () => {
  const [rows, setRows] = useState([]);
  const [items, setItems] = useState([]); // State to store items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const fetchOrderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const transformedRows = response.data.map((item, index) => {
        const customerName = item.customer && item.customer.name ? item.customer.name : 'Unknown Customer';
  
        const itemsSummary = item.items && item.items.length > 0
          ? item.items.map(i => {
              const itemName = i.item && i.item.name ? i.item.name : 'Unnamed Item';
              return `${itemName} (Qty: ${i.quantity || 0})`;
            }).join(', ')
          : 'No Items';
  
        return {
          id: item._id,
          sequence: index + 1,
          customerName: customerName,
          itemsSummary: itemsSummary,
          quantity: item.items ? item.items.reduce((sum, i) => sum + (i.quantity || 0), 0) : 0,
          totalAmount: item.totalAmount || 0,
          status: item.status || 'Unknown Status',
          deadline: item.deadline || 'No Deadline'
        };
      });
  
      setRows(transformedRows);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/item');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
    fetchItems();
  }, []);

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchOrderData(); 
  };

  const handleRowClick = (id) => {
    navigate(`/orders/${id}`);
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
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Job Order</button>
        </div>
      </div>
      {showAddForm && (
        <AddFormAPI
          fields={orderFields}
          apiEndpoint="http://localhost:5000/api/orders"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
          formTitle="Add Job Order"
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="orders" onRowClick={handleRowClick} />
      </div>
    </div>
  );
};

export default Orders;
