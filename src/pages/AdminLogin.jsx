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
    try { localStorage.setItem('dev_admin', 'true'); } catch (e) { /* ignore */ }
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
          id="admin-email"
          name="admin-email"
          className={styles.formInput}
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          id="admin-password"
          name="admin-password"
          className={styles.formInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button className={styles.btnPrimary} type="submit">Login</button>
      </form>
    </main>
  );
}

export default AdminLogin;
