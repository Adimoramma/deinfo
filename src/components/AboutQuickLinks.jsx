import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/global.module.css';
import LinkIcon from './icons/LinkIcon';
import InfoIcon from './icons/InfoIcon';
import { getSiteInfo } from '../services/adminService';

const DEFAULT = {
  about: 'Desinfo is a student information board that keeps students and staff informed about announcements, events and results.',
  quickLinks: [
    { label: 'Announcements', to: '/announcements' },
    { label: 'Events', to: '/events' },
    { label: 'Results', to: '/results' },
    { label: 'Student Portal', to: '/portal' },
  ],
};

export default function AboutQuickLinks() {
  const [siteInfo, setSiteInfo] = useState(DEFAULT);

  useEffect(() => {
    const info = getSiteInfo();
    if (info) setSiteInfo({ ...DEFAULT, ...info });
  }, []);

  return (
    <div className={styles.aboutSection}>
      <div className={styles.aboutBox}>
        <h4>About Us</h4>
        <p>{siteInfo.about}</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <InfoIcon width={18} height={18} color={'var(--accent-4)'} />
          <small className={styles.muted}>Managed by the Student Affairs Office</small>
        </div>
      </div>

      <div className={styles.quickLinks}>
        <h4>Quick Links</h4>
        <div className={styles.linkGrid}>
          {siteInfo.quickLinks.map((q, i) => (
            <Link key={i} to={q.to} className={styles.linkCard} aria-label={`Quick link ${q.label}`}>
              <LinkIcon width={18} height={18} color={'var(--accent-2)'} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.label}</div>
                {q.description ? (
                  <div className={styles.muted} style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>{q.description}</div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
