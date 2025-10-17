import React from 'react';

export default function LinkIcon({ className = '', width = 20, height = 20, color = '#0f5130' }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.59 13.41a1 1 0 0 1 0-1.41l3.59-3.59a1 1 0 0 1 1.41 1.41L12 13.41a1 1 0 0 1-1.41 0z" fill={color}/>
      <path d="M7 17a5 5 0 0 0 7.07 0l3.59-3.59a5 5 0 0 0-7.07-7.07l-1.41 1.41" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
