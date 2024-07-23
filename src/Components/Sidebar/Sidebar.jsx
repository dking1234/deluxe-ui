import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import logo from '../Assets/Logo.svg';

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${styles.container} ${expanded ? styles.expanded : styles.collapsed}`}>
      <nav className={styles.nav}>
        <aside className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo" className={styles.logo} />
            <button className={styles.toggleButton} onClick={toggleSidebar}>
              {expanded ? <ArrowLeft /> : <ArrowRight />}
            </button>
          </div>
          <ul className={styles.children}>
            {children}
          </ul>
        </aside>
      </nav>
    </div>
  );
};

export function SidebarItem({ icon, text, active, alert }) {
  return (
    <li className={`${styles.list} ${active ? styles.active : ''} ${alert ? styles.alert : ''}`}>
      {icon}
      <span className={`${styles.text} ${!active ? styles.hidden : ''}`}>
        {text}
      </span>
    </li>
  );
}

export default Sidebar;
