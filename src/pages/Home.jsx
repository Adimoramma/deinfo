import { useEffect, useState } from 'react';
import { getActiveNews } from '../services/newsService';
import { Link } from 'react-router-dom';
import styles from '../styles/global.module.css';

function Home() {
  const [news, setNews] = useState([]);
  useEffect(() => { getActiveNews().then(setNews); }, []);

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Student Information Board</h2>
          <p className={styles.lead}>Stay updated with announcements, events and results.</p>
        </div>
      </div>
      <div className={styles.grid}>
        {news.map(item => (
          <div key={item.id} className={styles.notice}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <small>{item.date_posted}</small>
            <Link to={`/notice/${item.id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
export default Home;
