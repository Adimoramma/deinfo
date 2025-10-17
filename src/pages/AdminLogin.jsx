import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// admin table verification intentionally skipped for now
import styles from '../styles/global.module.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Development/demo: no authentication, just navigate to admin dashboard
    navigate('/admin');
  };

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Admin Login</h2>
          <p className={styles.lead}>Secure access to the administration dashboard</p>
        </div>
      </div>

      <form onSubmit={handleLogin} style={{ maxWidth: 480 }}>
        <input
          className={styles.formInput}
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.formInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.btnPrimary} type="submit">Login</button>
      </form>
    </main>
  );
}

export default AdminLogin;
