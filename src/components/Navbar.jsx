import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { supabase } from '../services/supabaseClient';
import styles from '../styles/global.module.css';
import logo from '../assets/logo-accent.svg';
import homeIcon from '../assets/icons/home.svg';
import annIcon from '../assets/icons/announcements.svg';
import evIcon from '../assets/icons/events.svg';
import resIcon from '../assets/icons/results.svg';
import logoutIcon from '../assets/icons/logout.svg';

export default function Navbar() {
  const { session, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      // dev override (if any)
      localStorage.removeItem('dev_admin');
      if (supabase?.auth) await supabase.auth.signOut();
    } catch (err) {
      console.error('logout failed', err);
    } finally {
      navigate('/');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.brand} aria-label="Desinfo Home">
          <img src={logo} alt="Desinfo logo" style={{ height: 36, width: 36, marginRight: 10 }} />
          Desinfo
        </Link>

        {/* Home link should not appear on the home page */}
        {!isHome && !isAdminRoute && (
          <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={homeIcon} alt="" style={{ height: 16, marginRight: 6 }} />Home</NavLink>
        )}

        {/* On admin route we only show Home (above) and logout on the right */}
        {!isAdminRoute && (
          <>
            <NavLink to="/announcements" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={annIcon} alt="" style={{ height: 14, marginRight: 6 }} />Announcements</NavLink>
            <NavLink to="/events" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={evIcon} alt="" style={{ height: 14, marginRight: 6 }} />Events</NavLink>
            <NavLink to="/results" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={resIcon} alt="" style={{ height: 14, marginRight: 6 }} />Results</NavLink>
            <NavLink to="/portal" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Portal</NavLink>
            <NavLink to="/archive" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Archive</NavLink>
          </>
        )}
      </div>

      <div className={styles.navRight}>
        {isAdminRoute ? (
          <button onClick={handleLogout} className={styles.btnPrimary}><img src={logoutIcon} alt="" style={{ height: 14, marginRight: 6 }} />Logout</button>
        ) : (
          session && isAdmin ? (
            <NavLink to="/admin" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Admin Dashboard</NavLink>
          ) : (
            <NavLink to="/login" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}>Admin Login</NavLink>
          )
        )}
      </div>
    </nav>
  );
}
