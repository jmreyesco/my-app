'use client';

import { useRouter } from 'next/navigation';
import ProgramForm from '../../../components/programs/ProgramForm';
import React from 'react';

export default function NewProgramPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 18 }}>
        <button
          className="common-button"
          onClick={() => router.back()}
          style={{ padding: '6px 10px', background: '#e5e7eb', color: '#111' }}
        >
          ← Volver
        </button>

        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Crear nuevo programa</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 13 }}>
            Completa los campos para crear un programa. Puedes editarlo después.
          </p>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          padding: 18,
          borderRadius: 8,
          boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
        }}
      >
        <ProgramForm onSuccess={() => router.push('/programs')} />
      </div>
    </div>
  );
}