import React from 'react';
import styles from '../styles/global.module.css';

export default function AdminHeader({ title = 'Admin Dashboard', subtitle = '', onLogout }) {
  return (
    <header className={styles.adminHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.lead}>{subtitle}</p>}
      </div>
      <div>
        <button className={styles.btnDanger} onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
