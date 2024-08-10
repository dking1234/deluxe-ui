import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './InvoiceDetails.module.css'; // Adjust the import path as necessary

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
      <h1>Invoice Details</h1>
      <div className={styles.details}>
        <h2>Invoice #{invoice.invoiceNumber}</h2>
        <p><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Customer Name:</strong> {invoice.customer.name}</p>
        <p><strong>Customer Address:</strong> {invoice.customer.address}</p>
        <p><strong>Customer Email:</strong> {invoice.customer.email}</p>
        <p><strong>Customer Phone:</strong> {invoice.customer.phone}</p>
        <p><strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> ${invoice.tax.toFixed(2)}</p>
        <p><strong>Total Amount:</strong> ${invoice.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Payment Terms:</strong> {invoice.paymentTerms || 'N/A'}</p>
        <p><strong>Notes:</strong> {invoice.notes || 'N/A'}</p>

        <h3>Items</h3>
        <ul>
          {invoice.items.map((item, index) => (
            <li key={index} className={styles.item}>
              <p><strong>Product:</strong> {item.product}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Unit Price:</strong> ${item.unitPrice.toFixed(2)}</p>
              <p><strong>Total Price:</strong> ${item.totalPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvoiceDetails;
