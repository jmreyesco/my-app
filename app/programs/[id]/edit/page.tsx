'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Program } from '../../../../types';
import { programsApi } from '../../../../lib/api';
import ProgramForm from '../../../../components/programs/ProgramForm';

export default function EditProgramPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push('/programs');
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await programsApi.getById(id);
        if (mounted) setProgram(res.data);
      } catch (err) {
        console.error('Error loading program:', err);
        router.push('/programs');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!program) return <div className="p-6 text-center">Program not found</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Program</h1>
        <button onClick={() => router.push('/programs')} className="px-4 py-2 border rounded-lg">
          Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProgramForm program={program} onSuccess={() => router.push('/programs')} />
      </div>
    </main>
  );
}