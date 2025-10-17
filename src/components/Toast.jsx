import React, { useEffect } from 'react';
import styles from '../styles/global.module.css';

export default function Toast({ message, onClose, duration = 3000, variant = 'info' }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;
  const cls = `${styles.toast} ${styles['toast-' + variant]}`;
  return (
    <div className={cls} role="status">
      {message}
    </div>
  );
}
