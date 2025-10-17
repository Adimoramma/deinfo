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
    <main>
      <h2>Reset Admin Password</h2>
      {sent ? (
        <p>Password reset link sent to {email}</p>
      ) : (
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
      )}
    </main>
  );
}

export default AdminReset;
