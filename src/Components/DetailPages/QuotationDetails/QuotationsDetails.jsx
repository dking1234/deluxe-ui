import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './QuotationsDetails.module.css'; // Adjust the import path as necessary
import logo from '../../Assets/Logo.svg'; // Adjust the path to your logo image

const QuotationsDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (error) {
        setError('Failed to fetch quotation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!quotation) {
    return <div className={styles.noData}>No Quotation found</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.quotationInfo}>
          <h1>Quotation</h1>
          <p><strong>Quotation Number:</strong> {quotation.quotationNumber}</p>
          <p><strong>Issue Date:</strong> {quotation.issueDate ? new Date(quotation.issueDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </header>
      
      <section className={styles.infoSection}>
        <div className={styles.customerInfo}>
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> {quotation.customer?.name || 'N/A'}</p>
          <p><strong>Address:</strong> {quotation.customer?.address || 'N/A'}</p>
          <p><strong>Email:</strong> {quotation.customer?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {quotation.customer?.phone || 'N/A'}</p>
          <p><strong>Customer TIN:</strong> {quotation.customer?.customerTIN || 'N/A'}</p>
          <p><strong>Customer VRN:</strong> {quotation.customer?.customerVRN || 'N/A'}</p>
        </div>
        
        <div className={styles.companyInfo}>
          <h2>Company Information</h2>
          <p><strong>Company Name:</strong> {quotation.company?.companyName || 'N/A'}</p>
          <p><strong>Phone:</strong> {quotation.company?.phoneNumbers.join(', ') || 'N/A'}</p>
          <p><strong>Address:</strong> {quotation.company?.address || 'N/A'}</p>
          <p><strong>Email:</strong> {quotation.company?.email || 'N/A'}</p>
          <p><strong>TIN:</strong> {quotation.company?.TIN || 'N/A'}</p>
        </div>
      </section>
      
      <section className={styles.itemsSection}>
        <p>{quotation.notes || 'N/A'}</p>
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
            {quotation.items?.length > 0 ? (
              quotation.items.map((item, index) => {
                const unitPrice = item.item?.price || 0;
                const totalPrice = unitPrice * item.quantity;
                return (
                  <tr key={index}>
                    <td>{item.item?.name || 'N/A'}</td>
                    <td>{item.quantity || 'N/A'}</td>
                    <td>${unitPrice.toFixed(2) || 'N/A'}</td>
                    <td>${totalPrice.toFixed(2) || 'N/A'}</td>
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

      <section className={styles.detailsSection}>
        <div className={styles.quotationDetails}>
          <h2>Quotation Details</h2>
          <p><strong>Status:</strong> {quotation.status || 'N/A'}</p>
          <p><strong>Validity:</strong> {quotation.validity || 'N/A'}</p>
        </div>
        
        <div className={styles.summarySection}>
          <h2>Summary</h2>
          <p><strong>Subtotal:</strong> ${quotation.subtotal?.toFixed(2) || 'N/A'}</p>
          <p><strong>Tax:</strong> ${quotation.tax?.toFixed(2) || 'N/A'}</p>
          <p><strong>Total Amount:</strong> ${quotation.totalAmount?.toFixed(2) || 'N/A'}</p>
        </div>
      </section>

      <section className={styles.footer}>
        <div className={styles.signatureSection}>
          <p><strong>Signature:</strong> ___________________</p>
          <p><strong>Authorized By:</strong> ___________________</p>
          <p><strong>Date:</strong> ___________________</p>
        </div>
        
        <div className={styles.paymentInfo}>
          <h2>Payment Information</h2>
          <div>
            <h3>Bank Payments</h3>
            {quotation.company?.payments.length > 0 ? (
              quotation.company.payments.map((payment, index) => (
                <div key={index}>
                  <p><strong>Account Name:</strong> {payment.accountName || 'N/A'}</p>
                  <p><strong>Bank Name:</strong> {payment.bankName || 'N/A'}</p>
                  <p><strong>Account Number:</strong> {payment.accountNumber || 'N/A'}</p>
                  <p><strong>SWIFT Code:</strong> {payment.swiftCode || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p>No bank payment details available.</p>
            )}
          </div>

          <div>
            <h3>Mobile Money Payments</h3>
            {quotation.company?.mobileMoneyPayments.length > 0 ? (
              quotation.company.mobileMoneyPayments.map((payment, index) => (
                <div key={index}>
                  <p><strong>Account Name:</strong> {payment.accountName || 'N/A'}</p>
                  <p><strong>Merchant Number:</strong> {payment.merchantNumber || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p>No mobile money payment details available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotationsDetails;
