import React from 'react';
import styles from '../styles/global.module.css';

export default function NoticeCard({ notice }) {
  return (
    <article className={styles.notice}>
      <h3>{notice.title}</h3>
      <p>{notice.summary}</p>
    </article>
  );
}
