import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from '../dataTable/DataTable'; // Adjust the import path as necessary
import AddForm from '../AddForm/AddForm'; // Adjust the import path as necessary
import styles from './Employee.module.css';

const columns = [
  { field: 'sequence', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'password', headerName: 'Password', width: 250 },
];

const employeeFields = [
  { name: 'name', label: 'Name', placeholder: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', required: true },
  { name: 'role', label: 'Role', type: 'select', options: ['Sales', 'Production', 'Accountant'], placeholder: 'Select Type' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', required: true },
];

const Employee = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/employees', {
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
    fetchEmployeeData();
  }, []);

  const handleAddFormClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
    fetchEmployeeData(); // Re-fetch employee data after adding a new employee
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
      <div className={styles.addContainer}>
        <span className={styles.title}>Employees</span>
        <div className={styles.buttons}>
          <button className={styles.importButton} onClick={handleAddFormClick}>Import CSV</button>
          <button className={styles.addButton} onClick={handleAddFormClick}>Add Employees</button>
        </div>
      </div>
        {showAddForm && (
          <AddForm
            fields={employeeFields}
            apiEndpoint="http://localhost:5000/api/users/register"
            onClose={handleCloseAddForm}
            token={localStorage.getItem('token')}
            formTitle="Add Employees"
          />
        )}
        <DataTable columns={columns} rows={rows} slug="employee" />
      </div>
    </div>
  );
};

export default Employee;
