import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

function AdminReset() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://desinfo.vercel.app/reset-confirm',
    });
    if (!error) setSent(true);
    else alert('Error sending reset email');
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentCard}>
      <h2>Reset Admin Password</h2>
      {sent ? (
        <p>Password reset link sent to {email}</p>
      ) : (
        <form onSubmit={handleReset}>
          <input
            id="reset-email"
            name="reset-email"
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit">Send Reset Link</button>
        </form>
      )}
      </div>
    </main>
  );
}

export default AdminReset;
