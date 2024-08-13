import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable';
import AddForm from '../AddForm/AddForm';
import styles from './Customers.module.css';

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'companyName', headerName: 'Company Name', width: 200 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'totalPurchases', headerName: 'Total Purchases', width: 150 },
];

const customerFields = [
  { name: 'name', label: 'Name', placeholder: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true },
  { name: 'phone', label: 'Phone', placeholder: 'Phone', required: true },
  { name: 'address', label: 'Address', placeholder: 'Address' },
  { name: 'companyName', label: 'Company Name', placeholder: 'Company Name' },
  { name: 'customerTIN', label: 'Customer TIN', placeholder: 'Customer TIN' },
  { name: 'customerVRN', label: 'Customer VRN', placeholder: 'Customer VRN' },
  { name: 'type', label: 'Type', type: 'select', options: ['Individual', 'Business', 'Industry'], placeholder: 'Select Type' },
];

const Customers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchCustomerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/customer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transformedRows = response.data.map((item, index) => ({
        id: item._id,
        sequence: index + 1,
        ...item,
      }));
      setRows(transformedRows);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchCustomerData(); // Re-fetch customer data after adding a new customer
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
        <span className={styles.title}>Customers</span>
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Customer</button>
        </div>
      </div>
      {showAddForm && (
        <AddForm
          fields={customerFields}
          apiEndpoint="http://localhost:5000/api/customer"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
          formTitle="Add Customer"
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="customers" />
      </div>
    </div>
  );
};

export default Customers;
