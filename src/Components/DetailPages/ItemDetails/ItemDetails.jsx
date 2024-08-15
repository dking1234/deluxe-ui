import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './ItemDetails.module.css';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/item/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItem(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!item) {
    return <div className={styles.noItem}>No Item found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.subTitle}>{item.category}</p>
        </div>
        <div className={styles.info}>
          <div className={styles.infoItem}>Description: <strong>{item.description}</strong></div>
          <div className={styles.infoItem}>Price: <strong>${item.price.toFixed(2)}</strong></div>
          <div className={styles.infoItem}>Stock: <strong>{item.stock}</strong></div>
          <div className={styles.infoItem}>SKU: <strong>{item.sku}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
