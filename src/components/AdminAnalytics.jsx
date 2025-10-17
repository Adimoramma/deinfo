import React from 'react';
import styles from '../styles/global.module.css';

export default function AdminAnalytics({ counts = {}, onView }) {
  const items = [
    { key: 'news', title: 'News', count: counts.news || 0, color: 'green' },
    { key: 'students', title: 'Students', count: counts.students || 0, color: 'gray' },
    { key: 'admins', title: 'Admins', count: counts.admins || 0, color: 'red' },
    { key: 'events', title: 'Events', count: counts.events || 0, color: 'green' },
  ];

  return (
    <div className={styles.analyticsGrid}>
      {items.map(it => (
        <div key={it.key} className={styles.analyticsCard}>
          <div className={styles.analyticsTop}>
            <div className={styles.analyticsCount}>{it.count}</div>
            <div className={styles.analyticsTitle}>{it.title}</div>
          </div>
          <div className={styles.analyticsActions}>
            <button className={styles.smallLink} onClick={() => onView && onView(it.key)}>View</button>
            <button className={styles.btnPrimary} onClick={() => onView && onView(it.key)}>Manage</button>
          </div>
        </div>
      ))}
    </div>
  );
}
