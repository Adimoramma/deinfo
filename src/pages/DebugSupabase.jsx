import React, { useEffect, useState } from 'react';
import styles from '../styles/global.module.css';
import { supabase } from '../services/supabaseClient';

export default function DebugSupabase() {
  const [session, setSession] = useState(null);
  const [admins, setAdmins] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data?.session || null);

        const { data: adminsData, error: qErr } = await supabase.from('admins').select('*').limit(5);
        if (qErr) throw qErr;
        if (!mounted) return;
        setAdmins(adminsData || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div>
          <h2 className={styles.pageTitle}>Supabase Debug</h2>
          <p className={styles.lead}>Quick diagnostics for Supabase connectivity and `admins` table.</p>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section>
        <h3>Session</h3>
        <pre style={{ background: '#f6f6f6', padding: 12 }}>{JSON.stringify(session, null, 2)}</pre>
      </section>

      <section>
        <h3>Admins (sample)</h3>
        {admins ? (
          <ul>
            {admins.map(a => <li key={a.email}>{a.name} — {a.email}</li>)}
          </ul>
        ) : (
          <p className={styles.muted}>No data</p>
        )}
      </section>
    </main>
  );
}
