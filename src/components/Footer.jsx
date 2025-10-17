import React from 'react';
import styles from '../styles/global.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <small>© {new Date().getFullYear()} Desinfo. All rights reserved.</small>
      </div>
    </footer>
  );
}
