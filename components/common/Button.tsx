// ...existing code...
'use client';

import React from 'react';

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`common-button ${props.className || ''}`}
    >
      {props.children}
    </button>
  );
}
// ...existing code...