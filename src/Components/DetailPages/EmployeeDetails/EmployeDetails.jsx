import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './EmployeDetails.module.css';

const EmployeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployee(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!employee) {
    return <div className={styles.noEmployee}>No Employee found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{employee.name}</h1>
          <p className={styles.subTitle}>{employee.role}</p>
        </div>
        <div className={styles.info}>
          <div className={styles.infoItem}>Email: <strong>{employee.email}</strong></div>
          <div className={styles.infoItem}>Phone: <strong>{employee.phone}</strong></div>
          <div className={styles.infoItem}>Role: <strong>{employee.role}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default EmployeDetails;
