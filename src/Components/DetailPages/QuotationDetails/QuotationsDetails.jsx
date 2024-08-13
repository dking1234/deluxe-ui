import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './QuotationsDetails.module.css'; // Adjust the import path as necessary
import logo from '../../Assets/Logo.svg'; // Adjust the import path as necessary

const QuotationsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    notes: '',
  });

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/quotations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuotation(response.data);
        setFormData({
          notes: response.data.notes || '',
        });
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/quotations/${id}`,
        { status: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuotation((prev) => ({ ...prev, status: updatedStatus }));
      setUpdating(false);
    } catch (error) {
      setError(`Error updating status: ${error.message}`);
    }
  };

  const handleUpdateData = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/quotations/${id}`,
        { notes: formData.notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuotation((prev) => ({ ...prev, notes: formData.notes }));
      setUpdatingData(false);
    } catch (error) {
      setError(`Error updating data: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/quotations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/quotations');
    } catch (error) {
      setError(`Error deleting quotation: ${error.message}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!quotation) {
    return <div className={styles.noData}>No Quotation found</div>;
  }

  const {
    quotationNumber,
    issueDate,
    expirationDate,
    customer,
    items = [],
    subtotal = 0,
    tax = 0,
    totalAmount = 0,
    status,
    notes,
  } = quotation;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.quotationInfo}>
          <h1>Quotation</h1>
          <p><strong>Quotation Number:</strong> {quotationNumber}</p>
          <p><strong>Issue Date:</strong> {new Date(issueDate).toLocaleDateString()}</p>
          <p><strong>Expiration Date:</strong> {new Date(expirationDate).toLocaleDateString()}</p>
        </div>
      </header>

      <section className={styles.customerInfo}>
        <h2>Customer Information</h2>
        {customer ? (
          <>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Address:</strong> {customer.address}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>
            <p><strong>TIN:</strong> {customer.customerTIN}</p>
            <p><strong>VRN:</strong> {customer.customerVRN}</p>
          </>
        ) : (
          <p>Customer details not available.</p>
        )}
      </section>

      <section className={styles.itemsSection}>
        <h2>Items</h2>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => {
                const unitPrice = item.item?.price || 0;
                const quantity = item.quantity || 0;
                const totalPrice = unitPrice * quantity;

                return (
                  <tr key={item._id}>
                    <td>{item.item?.name || 'N/A'}</td>
                    <td>${unitPrice.toFixed(2)}</td>
                    <td>{quantity}</td>
                    <td>${totalPrice.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No items available for this quotation.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className={styles.quotationDetails}>
        <h2>Quotation Details</h2>
        <div className={styles.detailsSection}>
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
          <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> {status}</p>
          {updatingData ? (
            <div className={styles.updateForm}>
              <label>
                <strong>Notes:</strong>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={notes || 'No notes'}
                />
              </label>
              <button onClick={handleUpdateData}>Save</button>
              <button onClick={() => setUpdatingData(false)}>Cancel</button>
            </div>
          ) : (
            <p><strong>Notes:</strong> {notes || 'No notes available'}</p>
          )}
        </div>
      </section>

        <aside className={styles.rightSidebar}>
          <div className={styles.sidebarContent}>
            <h2>Actions</h2>
            <button onClick={() => setUpdating(true)}>Update Status</button>
            <button onClick={() => setDeleteConfirm(true)}>Delete</button>

            {updating && (
              <div className={styles.updateModal}>
                <h3>Update Status</h3>
                <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button onClick={handleUpdateStatus}>Save</button>
                <button onClick={() => setUpdating(false)}>Cancel</button>
              </div>
            )}

            {deleteConfirm && (
              <div className={styles.deleteConfirm}>
                <h3>Are you sure you want to delete this quotation?</h3>
                <button onClick={handleDelete}>Yes, Delete</button>
                <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </aside>
    </div>
  );
};

export default QuotationsDetails;
