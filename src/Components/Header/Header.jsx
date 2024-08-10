import React, { useEffect, useState } from 'react';
import { InputBase, IconButton, Badge, Typography } from '@mui/material';
import { Search, Bell, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Header.module.css';
import { useAuth } from '../../config/AuthContext';

const Header = () => {
  const [username, setUsername] = useState('');
  const { userId } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/employees/${userId}`);
        setUsername(response.data.name); // Assuming the response has a name field
        console.log(response)
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    if (userId) {
      fetchUsername();
    }
  }, [userId]);

  // Handler for navigating to notifications
  const handleNotificationsClick = () => {
    navigate('/notifications'); // Change to the path for Notification component
  };

  // Handler for navigating to profile
  const handleProfileClick = () => {
    navigate('/profile'); // Change to the path for Profile component
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <Typography variant="h4" className={styles.welcomeText}>
          Welcome, {username}
        </Typography>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <InputBase
            placeholder="Search"
            className={styles.searchInput}
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton type="submit" aria-label="search">
            <Search />
          </IconButton>
        </div>
        <IconButton 
          aria-label="notifications" 
          className={styles.iconButton} 
          onClick={handleNotificationsClick} // Add onClick handler
        >
          <Badge badgeContent={4} color="secondary">
            <Bell />
          </Badge>
        </IconButton>
        <IconButton 
          aria-label="account" 
          className={styles.iconButton} 
          onClick={handleProfileClick} // Add onClick handler
        >
          <User />
        </IconButton>
      </div>
    </div>
  );
};

export default Header;
