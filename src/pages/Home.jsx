import { useEffect, useState } from 'react';
import { getActiveNews } from '../services/newsService';
import { getEvents } from '../services/eventService';
import { Link } from 'react-router-dom';
import styles from '../styles/global.module.css';

function Home() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let mounted = true;
    getActiveNews().then((data) => { if (mounted) setNews((data || []).slice(0,5)); }).catch(() => {});
    getEvents().then((data) => { if (mounted) setEvents((data || []).slice(0,5)); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Student Information Board</h2>
          <p className={styles.lead}>Stay updated with announcements, events and results.</p>
        </div>
      </div>

      <section style={{ marginBottom: 16 }}>
        <h3>Latest Announcements</h3>
        <div className={styles.grid}>
          {news.length === 0 ? (
            <div className={styles.notice}><h3>No announcements</h3><p>There are no active announcements yet.</p></div>
          ) : (
            news.map(item => (
              <div key={item.id} className={styles.notice}>
                <h3><Link to={`/notice/${item.id}`}>{item.title}</Link></h3>
                <small>{item.date_posted ? new Date(item.date_posted).toLocaleString() : ''}</small>
                <p>{item.summary}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h3>Upcoming Events</h3>
        <div className={styles.grid}>
          {events.length === 0 ? (
            <div className={styles.notice}><h3>No upcoming events</h3><p>Events created by admins will appear here.</p></div>
          ) : (
            events.map(ev => (
              <div key={ev.id} className={styles.notice}>
                <h3>{ev.title}</h3>
                <small>{ev.date ? new Date(ev.date).toLocaleDateString() : ''}</small>
                <p>{ev.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
