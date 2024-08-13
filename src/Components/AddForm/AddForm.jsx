import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddForm.module.css'; // Import the updated styles

const AddForm = ({ fields, apiEndpoint, onClose, token, formTitle }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2>{formTitle}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => {
            if (field.name === 'totalPurchases') return null; // Skip rendering totalPurchases field
            return (
              <div key={field.name} className={styles.inputGroup}>
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            );
          })}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
