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
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/quotations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformedRows = response.data.map((item, index) => ({
          id: item._id,
          sequence: index + 1,
          quotationNumber: item.quotationNumber,
          customerName: item.customer.name,
          customerEmail: item.customer.email,
          issueDate: new Date(item.issueDate).toLocaleDateString(),
          expirationDate: new Date(item.expirationDate).toLocaleDateString(),
          subtotal: item.subtotal,
          tax: item.tax,
          totalAmount: item.totalAmount,
          status: item.status,
          notes: item.notes || 'N/A',
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