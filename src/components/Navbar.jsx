import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import { supabase } from '../services/supabaseClient';
import styles from '../styles/global.module.css';
import logo from '../assets/logo-accent.svg';
import logoSm from '../assets/logo-accent-sm.svg';
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
      <div className={styles.navbarInner}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.brand} aria-label="Desinfo Home">
            <img src={logo} srcSet={`${logoSm} 48w, ${logo} 96w`} alt="Desinfo logo" style={{ height: 36, width: 36 }} />
            <span className={styles.navText}>Desinfo</span>
          </Link>

          {/* Home link should not appear on the home page */}
          {!isHome && !isAdminRoute && (
            <NavLink to="/" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={homeIcon} alt="" style={{ height: 16 }} /><span className={styles.navText}>Home</span></NavLink>
          )}

          {/* On admin route we only show Home (above) and logout on the right */}
          {!isAdminRoute && (
            <>
              <NavLink to="/announcements" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={annIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Announcements</span></NavLink>
              <NavLink to="/events" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={evIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Events</span></NavLink>
              <NavLink to="/results" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={resIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Results</span></NavLink>
              <NavLink to="/portal" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={homeIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Portal</span></NavLink>
              <NavLink to="/archive" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={annIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Archive</span></NavLink>
            </>
          )}
        </div>

        <div className={styles.navRight}>
          {isAdminRoute ? (
            <button onClick={handleLogout} className={styles.btnPrimary}><img src={logoutIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Logout</span></button>
          ) : (
            session && isAdmin ? (
              <NavLink to="/admin" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={logoutIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Admin</span></NavLink>
            ) : (
              <NavLink to="/login" className={({isActive}) => isActive ? styles.activeLink : styles.navLink}><img src={logoutIcon} alt="" style={{ height: 14 }} /><span className={styles.navText}>Admin Login</span></NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
