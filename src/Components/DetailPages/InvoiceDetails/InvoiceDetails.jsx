import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InvoiceDetails.module.css'; // Adjust the import path as necessary
import logo from '../../Assets/Logo.svg'; // Adjust the path to your logo image

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoice(response.data);
      } catch (error) {
        setError('Failed to fetch invoice details.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!invoice) {
    return <div className={styles.noData}>No Invoice found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.invoiceInfo}>
          <h1>Invoice</h1>
          <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Issue Date:</strong> {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </header>
      
      <section className={styles.customerInfo}>
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> {invoice.customer?.name || 'N/A'}</p>
        <p><strong>Address:</strong> {invoice.customer?.address || 'N/A'}</p>
        <p><strong>Email:</strong> {invoice.customer?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {invoice.customer?.phone || 'N/A'}</p>
        <p><strong>Customer TIN:</strong> {invoice.customer?.customerTIN || 'N/A'}</p>
        <p><strong>Customer VRN:</strong> {invoice.customer?.customerVRN || 'N/A'}</p>
      </section>
      
      <section className={styles.itemsSection}>
        <p>{invoice.notes || 'N/A'}</p>
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
            {invoice.items?.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product || 'N/A'}</td>
                  <td>{item.quantity || 'N/A'}</td>
                  <td>${item.unitPrice?.toFixed(2) || 'N/A'}</td>
                  <td>${item.totalPrice?.toFixed(2) || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No items available for this invoice.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className={styles.detailsSection}>
        <div className={styles.invoiceDetails}>
          <h2>Invoice Details</h2>
          <p><strong>Status:</strong> {invoice.status || 'N/A'}</p>
          <p><strong>Payment Terms:</strong> {invoice.paymentTerms || 'N/A'}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        
        <div className={styles.summarySection}>
          <h2>Summary</h2>
          <p><strong>Subtotal:</strong> ${invoice.subtotal?.toFixed(2) || 'N/A'}</p>
          <p><strong>Tax:</strong> ${invoice.tax?.toFixed(2) || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ${invoice.totalAmount?.toFixed(2) || 'N/A'}</p>
        </div>
      </section>

      <section className={styles.footer}>
        <div className={styles.signatureSection}>
          <p><strong>Signature:</strong> ___________________</p>
          <p><strong>Received By:</strong> ___________________</p>
          <p><strong>Date:</strong> ___________________</p>
        </div>
        
        <div className={styles.paymentInfo}>
          <p><strong>Account Name:</strong> {invoice.accountName || 'N/A'}</p>
          <p><strong>Account Number:</strong> {invoice.accountNumber || 'N/A'}</p>
          <p><strong>Bank Number:</strong> {invoice.bankNumber || 'N/A'}</p>
        </div>
      </section>
    </div>
  );
};

export default InvoiceDetails;
