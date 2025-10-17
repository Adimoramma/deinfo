import { useEffect, useState } from 'react';
import { getActiveNews } from '../services/newsService';
import { Link } from 'react-router-dom';
import styles from '../styles/global.module.css';

function Home() {
  const [news, setNews] = useState([]);
  useEffect(() => { getActiveNews().then(setNews); }, []);

  return (
    <main>
      <h2 style={{ color: 'green' }}>Welcome to Desinfo</h2>
      <p>Stay updated with departmental news and results.</p>
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
