import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AddForm.module.css'; // Create and adjust styles as needed

const AddFormAPI = ({ fields, apiEndpoint, onClose, token, formTitle }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || (field.type === 'dynamic' ? [] : '');
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({});

  useEffect(() => {
    // Fetch options for select fields
    fields.forEach(async (field) => {
      if (field.type === 'select' && field.apiEndpoint) {
        try {
          const response = await axios.get(field.apiEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOptions(prev => ({
            ...prev,
            [field.name]: response.data.map(item => ({
              value: item._id,
              label: item.name, // Adjust based on actual API response
            })),
          }));
        } catch (err) {
          setError('Failed to fetch options.');
        }
      }
    });

    // Fetch item options separately
    const fetchItemOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/item', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOptions(prev => ({
          ...prev,
          items: response.data.map(item => ({
            value: item._id,
            label: item.name, // Adjust based on actual API response
          })),
        }));
      } catch (err) {
        setError('Failed to fetch item options.');
      }
    };

    fetchItemOptions();
  }, [fields, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDynamicChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item: '', quantity: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiEndpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.'); // User-friendly error message
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>&times;</span>
        <h2>{formTitle || 'Add Item'}</h2> {/* Dynamic title */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => {
            if (field.name === 'items') {
              return (
                <div key="items" className={styles.dynamicFields}>
                  <label>{field.label}</label>
                  {formData.items.map((item, index) => (
                    <div key={index} className={styles.dynamicItem}>
                      <select
                        name={`items[${index}].item`}
                        value={item.item}
                        onChange={(e) => handleDynamicChange(index, 'item', e.target.value)}
                        required
                      >
                        <option value="">Select Item</option>
                        {(options.items || []).map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name={`items[${index}].quantity`}
                        value={item.quantity}
                        onChange={(e) => handleDynamicChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        required
                      />
                      <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddItem}>Add Item</button>
                </div>
              );
            }

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
                    {(options[field.name] || field.options || []).map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddFormAPI;
