import { useState } from 'react';
import { getResultsByRegNumber } from '../services/resultService';
import styles from '../styles/global.module.css';

function Results() {
  const [regNumber, setRegNumber] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getResultsByRegNumber(regNumber);
    setResults(data);
  };

  return (
    <main>
      <h2>Check Your Results</h2>
      <form onSubmit={handleSubmit}>
        <input value={regNumber} onChange={e => setRegNumber(e.target.value)} placeholder="Enter Reg Number" />
        <button type="submit">View Results</button>
      </form>
      <div className={styles.grid}>
        {results.map((r, i) => (
          <div key={i} className={styles.notice}>
            <h3>{r.course_code}</h3>
            <p>Grade: {r.grade}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
export default Results;
