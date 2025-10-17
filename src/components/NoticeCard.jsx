import React from 'react';
import styles from '../styles/global.module.css';
import annIcon from '../assets/icons/announcements.svg';

export default function NoticeCard({ notice }) {
  return (
    <article className={styles.notice}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={annIcon} alt="" style={{ height: 22 }} />
        <h3 style={{ margin: 0 }}>{notice.title}</h3>
      </div>
      <p style={{ marginTop: 10 }}>{notice.summary}</p>
    </article>
  );
}
