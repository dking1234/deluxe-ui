import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddFormAPI from '../AddForm/AddFormAPI'; // Adjust the import path as necessary
import styles from './DeliveryNote.module.css'; // Adjust the path or rename as needed

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'customerName', headerName: 'Customer Name', width: 150 },
  { field: 'customerAddress', headerName: 'Customer Address', width: 200 },
  { field: 'items', headerName: 'Items', width: 250 },
  { field: 'quantity', headerName: 'Quantity', width: 250 },
  { field: 'additionalInfo', headerName: 'Additional Info', width: 200 },
  // Add more columns as needed
];

const deliveryNoteField = [
  { name: 'customer', label: 'Customer', type: 'select', required: true, apiEndpoint: 'http://localhost:5000/api/customer' },
  { name: 'items', label: 'Items', type: 'dynamic', required: true, apiEndpoint: 'http://localhost:5000/api/item' },
  { name: 'additionalInfo', label: 'Notes', type: 'textarea' },
];

const DeliveryNote = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchDeliveryNoteData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/delivery', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const transformedRows = response.data.map((item, index) => ({
        id: item._id, // Keep the backend ID for navigation
        sequence: index + 1, // Use a separate 'sequence' field for display
        customerName: item.customer.name|| 'N/A', // Access customer name safely
        customerAddress: item.customer.address || 'N/A', // Access customer address safely
        items: item.items?.map(i => `${i.item?.name || 'Unknown'} (${i.quantity})`).join(', ') || 'N/A', // Safely access item properties
        quantity: item.items?.reduce((total, i) => total + i.quantity, 0) || 0, // Sum up the quantities
        additionalInfo: item.additionalInfo || 'N/A', // Additional info
        companyName: item.company?.companyName || 'N/A', // Access company name safely
      }));
  
      setRows(transformedRows);
    } catch (error) {
      console.error('Error fetching delivery note details:', error);
      setError('Failed to fetch delivery note data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchDeliveryNoteData();
  }, []);

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchDeliveryNoteData(); // Re-fetch delivery note data after adding a new note
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.addContainer}>
        <span className={styles.title}>Delivery Note</span>
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Delivery Note</button>
        </div>
      </div>
      {showAddForm && (
        <AddFormAPI
          fields={deliveryNoteField}
          apiEndpoint="http://localhost:5000/api/delivery"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
          formTitle="Add Delivery Note"
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="delivery" />
      </div>
    </div>
  );
};

export default DeliveryNote;
