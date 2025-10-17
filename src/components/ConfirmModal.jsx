import React from 'react';
import styles from '../styles/global.module.css';

export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className={styles.btnPrimary} onClick={onCancel}>Cancel</button>
          <button className={styles.btnDanger} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
