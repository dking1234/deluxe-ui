import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable';
import AddForm from '../AddForm/AddForm'; 
import styles from './DeliveryNote.module.css';


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'fromCompanyName', headerName: 'From (Company Name)', width: 200 },
  { field: 'toCustomerName', headerName: 'To (Customer Name)', width: 200 },
  { field: 'items', headerName: 'Items', width: 400, renderCell: (params) => 
    params.value.map(item => `${item.description} (Qty: ${item.quantity}, Price: ${item.price})`).join(', ')
  },
  { field: 'order', headerName: 'Order ID', width: 150 },
  { field: 'issueDate', headerName: 'Issue Date', width: 150 },
  // Add more columns as needed
];


const deliveryNoteFields = [
  { name: 'fromCompanyName', label: 'From (Company Name)', placeholder: 'Company Name', required: true },
  { name: 'fromAddress', label: 'From (Address)', placeholder: 'Address', required: true },
  { name: 'fromPhone', label: 'From (Phone)', placeholder: 'Phone', required: true },
  { name: 'fromEmail', label: 'From (Email)', placeholder: 'Email', required: true },
  { name: 'name', label: 'To (Customer Name)', placeholder: 'Customer Name', required: true },
  { name: 'toAddress', label: 'To (Address)', placeholder: 'Address', required: true },
  { name: 'toPhone', label: 'To (Phone)', placeholder: 'Phone', required: true },
  { name: 'toEmail', label: 'To (Email)', placeholder: 'Email', required: true },
  { name: 'order', label: 'Order ID', placeholder: 'Order ID', required: true },
  // Add fields for items
  { name: 'items', label: 'Items', type: 'array', fields: [
    { name: 'description', label: 'Description', placeholder: 'Description', required: true },
    { name: 'quantity', label: 'Quantity', placeholder: 'Quantity', type: 'number', required: true },
    { name: 'price', label: 'Price', placeholder: 'Price', type: 'number', required: true },
  ]},
];


const DeliveryNote = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchDeliveryNoteData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/delivery/delivery-notes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const transformedRows = response.data.map((item, index) => ({
        id: item._id, // Use the actual ID from the backend
        sequence: index + 1, // Use a separate 'sequence' field for display
        ...item,
        fromCompanyName: item.from.companyName,
        toCustomerName: item.to.name, 
        items: item.items,
        order: item.order,
        issueDate: new Date(item.createdAt).toLocaleDateString(),
        // Add other fields as necessary
      }));
      setRows(transformedRows);
    } catch (error) {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.addContainer}>
        <span className={styles.title}>Delivery Notes</span>
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Delivery Note</button>
        </div>
      </div>
      {showAddForm && (
        <AddForm
          fields={deliveryNoteFields}
          apiEndpoint="http://localhost:5000/api/delivery/delivery-notes"
          onClose={handleCloseAddForm}
          token={localStorage.getItem('token')}
          formTitle="Add Delivery Note"
        />
      )}
      <div className={styles.tableContainer}>
        <DataTable columns={columns} rows={rows} slug="delivery-notes" />
      </div>
    </div>
  );
};

export default DeliveryNote;
