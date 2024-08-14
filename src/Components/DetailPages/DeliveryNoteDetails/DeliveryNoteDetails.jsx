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
        const response = await axios.get(`http://localhost:5000/api/delivery/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDeliveryNote(response.data);
      } catch (error) {
        setError('Failed to fetch delivery note details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryNoteDetails();
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
        </div>
      </header>
      
      <section className={styles.infoSection}>
        <div className={styles.receiverInfo}>
          <h2>Delivered To</h2>
          <p><strong>Customer Name:</strong> {deliveryNote.customer.name || 'N/A'}</p>
          <p><strong>Address:</strong> {deliveryNote.customer.address || 'N/A'}</p>
          <p><strong>Phone:</strong> {deliveryNote.customer.phone || 'N/A'}</p>
          <p><strong>Email:</strong> {deliveryNote.customer.email || 'N/A'}</p>
        </div>

        <div className={styles.senderInfo}>
          <p><strong>Company Name:</strong> {deliveryNote.company.companyName || 'N/A'}</p>
          <p><strong>Address:</strong> {deliveryNote.company.address || 'N/A'}</p>
          <p><strong>Phone:</strong> {deliveryNote.company.phoneNumbers || 'N/A'}</p>
          <p><strong>Email:</strong> {deliveryNote.company.email || 'N/A'}</p>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.deliveryNoteDetails}>
          <h2>Delivery Note Details</h2>
          <p><strong>Notes:</strong> {deliveryNote.additionalInfo || 'N/A'}</p>
        </div>
      </section>
      
      <section className={styles.itemsSection}>
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th>SN</th>
              <th>Description</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNote.items?.length > 0 ? (
              deliveryNote.items.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.index || 'N/A'}</td>
                    <td>{item.description || 'N/A'}</td>
                    <td>{item.quantity || 'N/A'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3">No items available for this delivery note.</td>
              </tr>
            )}
          </tbody>
        </table>
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
