import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './JobOrderDetails.module.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!order) {
    return <div>No Order found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Details</h1>
      <div className={styles.details}>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer Name:</strong> {order.customer.name}</p>
        <p><strong>Customer Email:</strong> {order.customer.email}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p>
      </div>
      <div className={styles.items}>
        <h3 className={styles.itemsTitle}>Items:</h3>
        <ul>
          {order.items.map(item => (
            <li key={item._id} className={styles.item}>
              Product: {item.product}, Quantity: {item.quantity}, Price: ${item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
