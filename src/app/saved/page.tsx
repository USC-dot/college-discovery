'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SavedPage() {
  const { user, token } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const fetchSaved = async () => {
      try {
        const res = await API.get('/auth/saved', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSaved(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
      Loading...
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-600 text-sm mb-6 block hover:underline">
          ← Back to Colleges
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">❤️ Saved Colleges</h1>

        {saved.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No saved colleges yet!</p>
            <Link href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((college: any) => (
              <div key={college.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">{college.name}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  📍 {college.location}, {college.state}
                </p>
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Fees</p>
                    <p className="text-sm font-bold text-gray-800">
                      ₹{(college.fees_min/100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-bold text-yellow-600">⭐ {college.rating}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Placement</p>
                    <p className="text-sm font-bold text-green-600">{college.placement_percent}%</p>
                  </div>
                </div>
                <Link href={`/colleges/${college.id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}