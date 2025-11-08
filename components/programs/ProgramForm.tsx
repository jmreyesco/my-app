'use client';

import React, { useEffect, useState } from 'react';
import { Program } from '../../types';
import { programsApi } from '../../lib/api';

interface Props {
  program?: Program | null;
  onSuccess?: () => void;
}

export default function ProgramForm({ program, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<Program>>({
    name: '',
    description: '',
    status: 'draft',
    startDate: ''
  });

  // Sync incoming program prop into internal state whenever it changes
  useEffect(() => {
    if (program) {
      setData({
        name: program.name ?? '',
        description: program.description ?? '',
        status: (program.status as any) ?? 'draft',
        startDate: program.startDate ?? ''
      });
    }
  }, [program]);

  const handleChange = (field: keyof Program, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name?.trim()) {
      alert('Name is required');
      return;
    }

    setLoading(true);
    try {
      if (program && program._id) {
        // UPDATE
        await programsApi.update(program._id, data);
      } else {
        // CREATE
        await programsApi.create(data);
      }
      onSuccess?.();
    } catch (err) {
      console.error('Error saving program:', err);
      alert('Error saving program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className="common-input"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="common-input"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Start date</label>
        <input
          type="date"
          value={data.startDate || ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="common-input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={data.status || 'draft'}
          onChange={(e) => handleChange('status', e.target.value)}
          className="common-input"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="common-button"
      >
        {loading ? 'Saving...' : (program && program._id ? 'Update Program' : 'Create Program')}
      </button>
    </form>
  );
}