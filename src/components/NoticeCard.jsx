import React from 'react';
import styles from '../styles/global.module.css';
import annIcon from '../assets/icons/announcements.svg';

function isImageUrl(url) {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i);
}

export default function NoticeCard({ notice }) {
  return (
    <article className={styles.notice}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={annIcon} alt="" style={{ height: 22 }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{notice.title}</h3>
          <p style={{ marginTop: 8 }}>{notice.summary}</p>
        </div>
      </div>

      {notice.media_url && (
        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          {isImageUrl(notice.media_url) ? (
            <img src={notice.media_url} alt={notice.title} style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
          ) : (
            <a href={notice.media_url} target="_blank" rel="noopener noreferrer" className={styles.smallLink}>Open attached file</a>
          )}
        </div>
      )}
    </article>
  );
}
