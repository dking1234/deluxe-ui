import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuotationsDetails = () => {
  const { id } = useParams(); // Get the ID from the URL parameters
  const [quotation, setQuotation] = useState(null); // State to store quotation details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quotation) {
    return <div>No Quotation found</div>;
  }

  return (
    <div>
      <h1>Quotation Details</h1>
      <p><strong>Quotation Number:</strong> {quotation.quotationNumber}</p>
      <p><strong>Customer Name:</strong> {quotation.customer.name}</p>
      <p><strong>Address:</strong> {quotation.customer.address}</p>
      <p><strong>Email:</strong> {quotation.customer.email}</p>
      <p><strong>Phone:</strong> {quotation.customer.phone}</p>
      <p><strong>Issue Date:</strong> {new Date(quotation.issueDate).toLocaleDateString()}</p>
      <p><strong>Expiration Date:</strong> {new Date(quotation.expirationDate).toLocaleDateString()}</p>
      <p><strong>Subtotal:</strong> {quotation.subtotal}</p>
      <p><strong>Tax:</strong> {quotation.tax}</p>
      <p><strong>Total Amount:</strong> {quotation.totalAmount}</p>
      <p><strong>Status:</strong> {quotation.status}</p>
      {quotation.notes && <p><strong>Notes:</strong> {quotation.notes}</p>}
      <h2>Items</h2>
      <ul>
        {quotation.items.map((item, index) => (
          <li key={index}>
            <p><strong>Product:</strong> {item.product}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Unit Price:</strong> {item.unitPrice}</p>
            <p><strong>Total Price:</strong> {item.totalPrice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuotationsDetails;
