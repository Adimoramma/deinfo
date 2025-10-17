import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNoticeById } from '../services/newsService';
import styles from '../styles/global.module.css';

function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getNoticeById(id)
      .then((n) => {
        if (mounted) setNotice(n);
      })
      .catch((err) => {
        console.error('Failed to load notice', err);
        if (mounted) setError('Failed to load notice');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <main className={styles.container}><div className={styles.contentCard}><p className={styles.muted}>{error}</p></div></main>;
  if (!notice) return <main className={styles.container}><div className={styles.contentCard}><p className={styles.muted}>Notice not found</p></div></main>;

  const renderMedia = () => {
    if (!notice.media_url) return null;
    if (notice.media_type === 'image') return <img src={notice.media_url} alt={notice.title || 'Media'} style={{ maxWidth: '100%' }} />;
    if (notice.media_type === 'video') return <video controls src={notice.media_url} style={{ maxWidth: '100%' }} />;
    if (notice.media_type === 'document') return <a href={notice.media_url} target="_blank" rel="noreferrer">View Document</a>;
    return null;
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentCard}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>{notice.title}</h2>
          <p className={styles.lead}>{notice.date_posted ? new Date(notice.date_posted).toLocaleString() : ''}</p>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <p>{notice.summary}</p>
        {renderMedia()}
        <p style={{ marginTop: 12 }}>{notice.details}</p>
      </div>
      </div>
    </main>
  );
}

export default NoticeDetail;
