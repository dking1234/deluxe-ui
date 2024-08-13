import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './DeliveryNoteDetails.module.css'; // Adjust the import path as necessary
import logo from '../../Assets/Logo.svg'; // Adjust the path to your logo image

const DeliveryNoteDetails = () => {
  const { id } = useParams();
  const [deliveryNote, setDeliveryNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryNoteDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`http://localhost:5000/api/delivery/delivery-notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeliveryNote(response.data);
      } catch (error) {
        console.error('Error fetching delivery note details:', error);
        setError('Failed to fetch delivery note details. Please check the console for more information.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeliveryNoteDetails();
    } else {
      setError('No delivery note ID provided.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!deliveryNote) {
    return <div className={styles.noData}>No Delivery Note found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.deliveryNoteInfo}>
          <h1>Delivery Note</h1>
          <p><strong>Delivery Note Number:</strong> {deliveryNote.deliveryNoteNumber}</p>
          <p><strong>Issue Date:</strong> {deliveryNote.issueDate ? new Date(deliveryNote.issueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </header>
      
      <section className={styles.senderInfo}>
        <h2>Sender Information</h2>
        <p><strong>Company Name:</strong> {deliveryNote.fromCompanyName || 'N/A'}</p>
        <p><strong>Address:</strong> {deliveryNote.fromAddress || 'N/A'}</p>
        <p><strong>Phone:</strong> {deliveryNote.fromPhone || 'N/A'}</p>
        <p><strong>Email:</strong> {deliveryNote.fromEmail || 'N/A'}</p>
      </section>
      
      <section className={styles.receiverInfo}>
        <h2>Receiver Information</h2>
        <p><strong>Customer Name:</strong> {deliveryNote.toCustomerName || 'N/A'}</p>
        <p><strong>Address:</strong> {deliveryNote.toAddress || 'N/A'}</p>
        <p><strong>Phone:</strong> {deliveryNote.toPhone || 'N/A'}</p>
        <p><strong>Email:</strong> {deliveryNote.toEmail || 'N/A'}</p>
      </section>
      
      <section className={styles.itemsSection}>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNote.items?.length > 0 ? (
              deliveryNote.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description || 'N/A'}</td>
                  <td>{item.quantity || 'N/A'}</td>
                  <td>${item.unitPrice?.toFixed(2) || 'N/A'}</td>
                  <td>${(item.quantity * item.unitPrice)?.toFixed(2) || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No items available for this delivery note.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.deliveryNoteDetails}>
          <h2>Delivery Note Details</h2>
          <p><strong>Status:</strong> {deliveryNote.status || 'N/A'}</p>
          <p><strong>Notes:</strong> {deliveryNote.notes || 'N/A'}</p>
        </div>
        
        <div className={styles.summarySection}>
          <h2>Summary</h2>
          <p><strong>Subtotal:</strong> ${deliveryNote.subtotal?.toFixed(2) || 'N/A'}</p>
          <p><strong>Tax:</strong> ${deliveryNote.tax?.toFixed(2) || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ${deliveryNote.totalAmount?.toFixed(2) || 'N/A'}</p>
        </div>
      </section>

      <section className={styles.footer}>
        <div className={styles.signatureSection}>
          <p><strong>Signature:</strong> ___________________</p>
          <p><strong>Received By:</strong> ___________________</p>
          <p><strong>Date:</strong> ___________________</p>
        </div>
      </section>
    </div>
  );
};

export default DeliveryNoteDetails;
