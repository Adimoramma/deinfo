import React from 'react';

export default function InfoIcon({ className = '', width = 20, height = 20, color = '#0f5130' }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.2" />
      <path d="M11 10h2v6h-2zM11 7h2v2h-2z" fill={color} />
    </svg>
  );
}
