  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import DataTable from '../dataTable/DataTable';
  import AddFormAPI from '../AddForm/AddFormAPI';
  import styles from './Quotation.module.css';

  const columns = [
    { field: 'sequence', headerName: 'ID', width: 90 },
    { field: 'quotationNumber', headerName: 'Quotation Number', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    { field: 'customerEmail', headerName: 'Customer Email', width: 200 },
    { field: 'issueDate', headerName: 'Issue Date', width: 150 },
    { field: 'expirationDate', headerName: 'Expiration Date', width: 150 },
    { field: 'subtotal', headerName: 'Subtotal', width: 120 },
    { field: 'tax', headerName: 'Tax', width: 120 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  const quotationFields = [
    { name: 'customer', label: 'Customer', type: 'select', required: true, apiEndpoint: 'http://localhost:5000/api/customer' },
    { name: 'items', label: 'Items', type: 'dynamic', required: true, apiEndpoint: 'http://localhost:5000/api/item' },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { name: 'expirationDate', label: 'Expiration Date', type: 'date', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ];
  

  const Quotation = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const fetchQuotationData = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
    
        // Ensure the token exists before making the request
        if (!token) {
          throw new Error('No token found. Please log in.');
        }
    
        // Make the GET request to fetch quotations
        const response = await axios.get('http://localhost:5000/api/quotations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error('Failed to fetch quotation data.');
        }
    
        // Transform the data received from the API
        const transformedRows = response.data.map((item, index) => ({
          id: item._id,
          sequence: index + 1,
          quotationNumber: item.quotationNumber,
          customerName: item.customer?.name || 'N/A',
          customerEmail: item.customer?.email || 'N/A',
          issueDate: new Date(item.issueDate).toLocaleDateString(),
          expirationDate: new Date(item.expirationDate).toLocaleDateString(),
          subtotal: item.subtotal,
          tax: item.tax,
          totalAmount: item.totalAmount,
          status: item.status,
          notes: item.notes || 'N/A',
        }));
    
        // Update the state with the transformed data
        setRows(transformedRows);
      } catch (error) {
        // Handle any errors that occur during the fetch
        setError(error.message || 'Failed to fetch quotation data. Please try again later.');
      } finally {
        // Set loading to false, regardless of success or failure
        setLoading(false);
      }
    };
    

    useEffect(() => {
      fetchQuotationData();
    }, []);

    const handleAddFormClick = () => {
      setShowAddForm(true);
    };

    const handleCloseAddForm = () => {
      setShowAddForm(false);
      fetchQuotationData(); // Re-fetch quotation data after adding a new quotation
    };

    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.addContainer}>
          <span className={styles.title}>Quotations</span>
          <div className={styles.buttons}>
            <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
            <button className={styles.addButton} onClick={handleAddFormClick}>Add Quotation</button>
          </div>
        </div>
        {showAddForm && (
          <AddFormAPI
            fields={quotationFields}
            apiEndpoint="http://localhost:5000/api/quotations"
            onClose={handleCloseAddForm}
            token={localStorage.getItem('token')}
            formTitle="Add Quotation"
          />
        )}
        <DataTable columns={columns} rows={rows} slug="quotations" />
      </div>
    </div>
  );
};

export default Quotation;