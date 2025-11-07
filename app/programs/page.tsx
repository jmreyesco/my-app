// ...existing code...
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api, { setAuthToken } from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function ProgramsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const limit = 10;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  // set auth token from localStorage on mount (if exists)
  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) setAuthToken(token);
    } catch {}
  }, []);

  const fetchList = useCallback(async (search: string, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/programs', { params: { name: search, page: p, limit } });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        // not authorized -> redirect to login
        try { localStorage.removeItem('token'); } catch {}
        router.push('/login');
      } else {
        setError('Error cargando programas. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchList(q, 1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, fetchList]);

  // fetch when page changes (but not overwrite search debounce)
  useEffect(() => {
    fetchList(q, page);
  }, [page, fetchList]); // fetchList already depends on router

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 12 }}>Programs</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input
          className="common-input"
          placeholder="Buscar por nombre"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="common-button"
          onClick={() => { setPage(1); fetchList(q, 1); }}
        >
          Buscar
        </button>
        <button
          className="common-button"
          onClick={() => router.push('/programs/new')}
          style={{ background: '#10b981' }}
        >
          Nuevo
        </button>
      </div>

      {loading && <p style={{ color: '#6b7280' }}>Cargando...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && items.length === 0 && (
        <div style={{ padding: 16, background: '#fff', borderRadius: 6 }}>
          <p style={{ margin: 0 }}>No se encontraron programas. Crea uno nuevo.</p>
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {items.map((p) => (
          <li
            key={p._id || p.id}
            style={{
              padding: 12,
              marginBottom: 8,
              background: '#fff',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => router.push(`/programs/${p._id || p.id}`)}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{p.description || '—'}</div>
            </div>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{p.status || 'draft'}</div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="common-button"
          onClick={() => setPage((s) => Math.max(1, s - 1))}
          disabled={page <= 1}
          style={{ padding: '6px 10px' }}
        >
          Prev
        </button>

        <span style={{ color: '#6b7280' }}>
          {page} / {totalPages}
        </span>

        <button
          className="common-button"
          onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
          disabled={page >= totalPages}
          style={{ padding: '6px 10px' }}
        >
          Next
        </button>

        <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 13 }}>
          Total: {total}
        </div>
      </div>
    </div>
  );
}
// ...existing code...