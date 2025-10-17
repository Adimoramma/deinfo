import { useState } from 'react';
import { getResultsByRegNumber } from '../services/resultService';
import styles from '../styles/global.module.css';

function Results() {
  const [regNumber, setRegNumber] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getResultsByRegNumber(regNumber);
    setResults(data || []);
  };

  const gradeBadge = (grade) => {
    if (!grade) return <span className={`${styles.badge} ${styles['badge-wait']}`}>Pending</span>;
    const g = String(grade).toUpperCase();
    if (['A','B','C','D'].includes(g) || Number(grade) >= 50) return <span className={`${styles.badge} ${styles['badge-pass']}`}>{grade}</span>;
    return <span className={`${styles.badge} ${styles['badge-fail']}`}>{grade}</span>;
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Check Your Results</h2>
          <p className={styles.lead}>Enter your registration number to view your grades.</p>
        </div>
      </div>

      <form className={styles.resultsForm} onSubmit={handleSubmit}>
        <input className={styles.formInput} value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="Enter Reg Number" />
        <button className={styles.btnPrimary} type="submit">View Results</button>
      </form>

      {results.length === 0 ? (
        <div className={styles.notice}>
          <h3>No results found</h3>
          <p className={styles.muted}>No records for that registration number.</p>
        </div>
      ) : (
        <div>
          <div className={styles.resultsCardRow}>
            {results.map((r, i) => (
              <div key={i} className={styles.notice}>
                <h3>{r.course_code}</h3>
                <p className={styles.muted}>{r.course_title || ''}</p>
                <div style={{ marginTop: 8 }}>{gradeBadge(r.grade)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Results;
