import React, { useState } from 'react';
import axios from 'axios';
import styles from './SelectRole.module.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../config/AuthContext';

const roles = ['sales', 'production', 'accountant'];

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const { id } = useParams(); // Extract user ID from URL
  const { state } = useLocation(); // Get token from state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      alert('Please select a role.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${state.token}` } } // Include token in headers
      );
      console.log(response.data);
      login();
      navigate('/admin-dashboard',); 
    } catch (error) {
      console.error('Error updating role:', error);
      alert('An error occurred while updating the role.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Select Your Role</h2>
      <div className={styles.selectContainer}>
        <label htmlFor="role" className={styles.label}>Role:</label>
        <select 
          id="role" 
          value={selectedRole} 
          onChange={handleRoleChange} 
          className={styles.select}
        >
          <option value="" disabled>Select a role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
    </div>
  );
};

export default SelectRole;
