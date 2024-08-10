import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './CustomerDetails.module.css'
import Invoices from '../../Invoices/Invoices';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/customer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCustomer(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!customer) {
    return <div>No customer found</div>;
  }

  return (
    <div className={styles.main}>
       
        <h1>Customer Details</h1>
        <div className={styles.separate}>
           <div className={styles.container}>
             <div className={styles.name}>
             <div className={styles.incontainer}>
                  <span className={styles.initials}>JM</span>  
            </div>
                 <div className={styles.nameType}>
                <span className={styles.header}>{customer.name}</span>
               <span>{customer.type}</span>
             </div> 
           </div>

        <div className={styles.details}>
             <span>Email: {customer.email}</span>
             <span>Phone: {customer.phone}</span>
        </div>

      <p>Address: {customer.address}</p>
      <p>Company Name: {customer.companyName}</p>
      <p>Total Purchases: {customer.totalPurchases}</p>

      <button className={styles.updateButton}>update</button>
      <button className={styles.deleteButton}>delete</button>
    </div>
    <div className={styles.invoiceContainer}>
        <Invoices />
      </div>  
    </div>
  
    </div>
  );
};

export default CustomerDetails;
