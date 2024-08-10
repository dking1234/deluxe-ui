import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../config/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginSignup.module.css';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import logo from '../Assets/Logo.svg';

const LoginSignup = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const userId = response.data._id; // Extract userId from the response
      const token = response.data.token; // Extract token from the response

      // Authenticate the user
      login(userId, token);

      // Navigate to the dashboard
      navigate('/admin-dashboard');

      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) onLoginSuccess(userId);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" />
      </div>
      <div className={styles.header}>
        <div className={styles.text}>Login</div>
        <div className={styles.underline}></div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src={email_icon} alt="Email Icon" />
          <input 
            type="email" 
            placeholder='Email' 
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            onKeyDown={handleKeyDown} 
          />
        </div>
        <div className={styles.input}>
          <img src={password_icon} alt="Password Icon" />
          <input 
            type="password" 
            placeholder='Password' 
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            onKeyDown={handleKeyDown} 
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.submitContainer}>
          <div 
            className={styles.submit}
            onClick={handleSubmit}
          >
            Login
          </div>
        </div>
      </div>
    </div>  
  );
};

export default LoginSignup;
