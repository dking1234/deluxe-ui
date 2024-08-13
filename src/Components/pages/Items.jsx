    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import DataTable from '../dataTable/DataTable';
    import AddForm from '../AddForm/AddForm';
    import styles from './Items.module.css';

    const columns = [
    { field: 'sequence', headerName: 'ID', width: 90 }, // Use 'sequence' for display
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description  ', width: 200 },
    { field: 'itemType', headerName: 'Item Type', width: 150 },
    { field: 'price', headerName: 'Selling Price', width: 200 },
    ];

    const itemFields = [
        { name: 'name', label: 'Name', placeholder: 'Item Name', required: true },
        { name: 'description', label: 'Description', placeholder: 'Description', required: true },
        { name: 'itemType', label: 'Item Type', type: 'select', options: ['Goods', 'Services'], placeholder: 'Select Type' },    
        { name: 'price', label: 'Selling Price', placeholder: 'Selling Price', required: true },
      ];
      

    const Items = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchCustomerData = async () => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/item', {
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
            <span className={styles.title}>Items</span>
            <div className={styles.buttons}>
            <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
            <button className={styles.addButton} onClick={handleAddFormClick}>Add Item</button>
            </div>
        </div>
        {showAddForm && (
            <AddForm
            fields={itemFields}
            apiEndpoint="http://localhost:5000/api/item"
            onClose={handleCloseAddForm}
            token={localStorage.getItem('token')}
            formTitle="Add Item"
            />
        )}
        <div className={styles.tableContainer}>
            <DataTable columns={columns} rows={rows} slug="items" />
        </div>
        </div>
    );
    };

    export default Items;
