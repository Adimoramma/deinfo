import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../services/useAuth';

export default function Navbar() {
  const { session, isAdmin } = useAuth();
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <NavLink to="/" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Home</NavLink>
      <NavLink to="/announcements" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Announcements</NavLink>
      <NavLink to="/events" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Events</NavLink>
      <NavLink to="/results" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Results</NavLink>
      <NavLink to="/portal" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Portal</NavLink>
      <NavLink to="/archive" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Archive</NavLink>
      {/* show admin links only when authenticated + admin */}
      { session && isAdmin ? (
        <NavLink to="/admin" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Admin Dashboard</NavLink>
      ) : (
        <NavLink to="/login" style={({isActive}) => ({ marginRight: 8, fontWeight: isActive ? 'bold' : 'normal' })}>Admin Login</NavLink>
      )}
    </nav>
  );
}
