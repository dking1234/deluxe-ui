import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logo from '../Assets/Logo.svg';

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${styles.container} ${expanded ? styles.expanded : styles.collapsed}`}>
      <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
        <nav className={styles.nav}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" className={styles.logo} />
          </div>
          <ul className={styles.children}>
            {React.Children.map(children, child => 
              React.cloneElement(child, { expanded })
            )}
          </ul>
          <div className={styles.nameLink}>
            <span className={styles.bottomText}>Deluxe Promotion</span>
            <span className={styles.bottomText}>CRM System 2024</span>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export function SidebarItem({ icon, text, path, expanded, alert }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  const handleClick = () => {
    navigate(path);
  };

  return (
    <li 
      className={`${styles.list} ${isActive ? styles.active : styles.deactive} ${alert ? styles.alert : ''}`}
      onClick={handleClick}
    >
      {icon}
      <span className={`${styles.text} ${expanded && isActive ? '' : styles.hidden}`}>
        {text}
      </span>
      {alert && <div className={styles.alert}></div>}
    </li>
  );
}

export default Sidebar;
