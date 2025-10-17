import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { isAdmin as checkIsAdmin } from './adminService';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        const s = data?.session || null;
        if (!mounted) return;
        setSession(s);
        if (s && s.user && s.user.email) {
          try {
            const admin = await checkIsAdmin(s.user.email);
            if (mounted) setIsAdmin(Boolean(admin));
          } catch (err) {
            console.error('isAdmin check failed', err);
            if (mounted) setIsAdmin(false);
          }
        } else {
          if (mounted) setIsAdmin(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (session && session.user && session.user.email) {
        // run admin check asynchronously but don't return the promise
        (async () => {
          try {
            const admin = await checkIsAdmin(session.user.email);
            if (mounted) setIsAdmin(Boolean(admin));
          } catch (err) {
            console.error('isAdmin check failed', err);
            if (mounted) setIsAdmin(false);
          }
        })();
      } else {
        if (mounted) setIsAdmin(false);
      }
    });

    return () => {
      mounted = false;
      try { listener.subscription.unsubscribe(); } catch (e) { /* ignore */ }
    };
  }, []);

  return { session, loading, isAdmin };
}
