import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: 12, borderTop: '1px solid #eee', marginTop: 24 }}>
      <small>© {new Date().getFullYear()} Student Info Board</small>
    </footer>
  );
}
