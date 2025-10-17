import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/global.module.css';
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
      </div>
      <div className={styles.quickLinks}>
        <h4>Quick Links</h4>
        <ul>
          {siteInfo.quickLinks.map((q, i) => (
            <li key={i}><Link to={q.to}>{q.label}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
