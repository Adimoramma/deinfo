import React from 'react';
import styles from '../styles/global.module.css';
import { useNavigate } from 'react-router-dom';
import heroAccent from '../assets/hero-accent.svg';
import heroAccentSm from '../assets/hero-accent-sm.svg';

export default function AdminHeader({ title = 'Admin Dashboard', subtitle = '', onLogout }) {
  const navigate = useNavigate();
  return (
    <header className={styles.adminHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.lead}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className={styles.btnPrimary} onClick={() => navigate('/')}>View Site</button>
        <button className={styles.btnDanger} onClick={onLogout}>Logout</button>
  <img src={heroAccent} srcSet={`${heroAccentSm} 320w, ${heroAccent} 640w`} alt="decorative" style={{ height: 42, borderRadius: 8 }} />
      </div>
    </header>
  );
}
