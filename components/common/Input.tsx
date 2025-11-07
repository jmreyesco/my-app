// ...existing code...
'use client';

import React from 'react';

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`common-input ${props.className || ''}`}
      autoComplete="off"
    />
  );
}
// ...existing code...