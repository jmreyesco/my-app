'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Program } from '../../types';
import { programsApi } from '../../lib/api';

export default function ProgramsPage() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  async function fetchPrograms() {
    setLoading(true);
    try {
      const res = await programsApi.list({ name: search, page, limit });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <button
          onClick={() => router.push('/programs/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          New Program
        </button>
      </div>

      <div className="mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programs..."
          className="common-input"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No programs found. Create one!
        </div>
      ) : (
        <div className="space-y-2">
       
{items.map((program) => (
  <div
    key={program._id}
    className="p-4 border rounded-lg hover:bg-gray-50"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium">{program.name}</h3>
        <p className="text-sm text-gray-500">{program.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm px-2 py-1 rounded ${
          program.status === 'published' ? 'bg-green-100 text-green-800' :
          program.status === 'archived' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {program.status}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/programs/${program._id}/edit`);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (!confirm('Are you sure you want to delete this program?')) return;
            try {
              if (program._id) {
                await programsApi.delete(program._id);
                fetchPrograms();
              } else {
                alert('Program ID is undefined');
              }
              fetchPrograms();
            } catch (err) {
              console.error(err);
              alert('Error deleting program');
            }
          }}
          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
))}

        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= Math.ceil(total / limit)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}