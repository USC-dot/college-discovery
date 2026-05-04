'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import API from '@/lib/api';
import Link from 'next/link';

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          ids.map(id => API.get(`/colleges/${id}`))
        );
        setColleges(results.map(r => r.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
      Loading...
    </div>
  );

  const rows = [
    { label: '📍 Location', key: (c: any) => `${c.location}, ${c.state}` },
    { label: '🏛 Type', key: (c: any) => c.type },
    { label: '📅 Established', key: (c: any) => c.established },
    { label: '💰 Min Fees', key: (c: any) => `₹${(c.fees_min / 100000).toFixed(1)}L/yr` },
    { label: '💰 Max Fees', key: (c: any) => `₹${(c.fees_max / 100000).toFixed(1)}L/yr` },
    { label: '⭐ Rating', key: (c: any) => `${c.rating} / 5` },
    { label: '🎯 Placement', key: (c: any) => `${c.placement_percent}%` },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 text-sm mb-6 block hover:underline">
          ← Back to Colleges
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">⚖️ College Comparison</h1>
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-700 text-white">
  <th className="p-3 text-left w-28 text-sm">Feature</th>
  {colleges.map(c => (
    <th key={c.id} className="p-3 text-center">
      <div className="font-bold text-sm">{c.name}</div>
      <div className="text-blue-200 text-xs font-normal">{c.location}</div>
    </th>
  ))}
</tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 font-semibold text-gray-600 text-xs">{row.label}</td>
{colleges.map(c => (
  <td key={c.id} className="p-3 text-center text-gray-800 font-medium text-sm">
                      {row.key(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Courses Offered</h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
            {colleges.map(c => (
              <div key={c.id}>
                <h3 className="font-bold text-blue-600 mb-3">{c.name}</h3>
                <div className="space-y-2">
                  {c.courses?.map((course: any) => (
                    <div key={course.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800">{course.name}</p>
                      <p className="text-xs text-gray-500">₹{(course.fees / 100000).toFixed(1)}L/yr</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}