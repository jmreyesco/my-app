'use client';
import { useState } from 'react';
import { Program } from '../../types';
import api from '../../lib/api';

interface Props {
  onSuccess?: () => void;
  program?: Program;
}

export default function ProgramForm({ onSuccess, program }: Props) {
  const [data, setData] = useState<Partial<Program>>(program || {});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/programs', data);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Error saving program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <input
        value={data.name || ''}
        onChange={e => setData(d => ({ ...d, name: e.target.value }))}
        placeholder="Program name"
        required
      />
      <textarea
        value={data.description || ''}
        onChange={e => setData(d => ({ ...d, description: e.target.value }))}
        placeholder="Description"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Program'}
      </button>
    </form>
  );
}