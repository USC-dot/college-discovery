
'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import API from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

     const [compareList, setCompareList] = useState<any[]>([]);

    const toggleCompare = (college: any) => {
    setCompareList(prev => {
    const exists = prev.find(c => c.id === college.id);
    if (exists) return prev.filter(c => c.id !== college.id);
    if (prev.length >= 3) {
      alert('You can compare max 3 colleges!');
      return prev;
    }
    return [...prev, college];
  });
};
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await API.get('/colleges', {
        params: { search, state, type }
      });
      setColleges(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, state, type]);

  return (
    
    <main className="min-h-screen bg-gray-50">

    {/* Navbar */}
<nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
  <h1 className="text-blue-700 font-bold text-xl">🎓 CollegeDiscover</h1>
  <div className="flex gap-3 items-center">
    {user ? (
      <>
        <Link href="/saved" className="text-sm text-gray-600 font-medium hover:text-blue-600">
          ❤️ Saved
        </Link>
        <span className="text-sm text-gray-600">Hi, {user.name}!</span>
        <button
          onClick={logout}
          className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200">
          Logout
        </button>
      </>
    ) : (
      <>
        <Link href="/login"
          className="text-sm text-gray-600 font-medium hover:text-blue-600">
          Login
        </Link>
        <Link href="/register"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          Register
        </Link>
      </>
    )}
  </div>
</nav>
      
      {/* Header */}
      <div className="bg-blue-700 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-2">🎓 Find Your Dream College</h1>
        <p className="text-blue-200 mb-6">Discover, Compare and Decide</p>
        <input
           type="text"
           placeholder="Search colleges..."
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full max-w-xl px-5 py-3 rounded-full text-gray-800 bg-white text-base outline-none shadow-lg placeholder-gray-400"
        />
        <div className="mt-4">
  <Link
    href="/predictor"
    className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
    🧠 Try College Predictor
  </Link>
</div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-4 flex-wrap">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm text-gray-800 font-medium"
        >
          <option value="">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Karnataka">Karnataka</option>
          <option value="West Bengal">West Bengal</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm bg-white shadow-sm text-gray-800 font-medium"
        >
          <option value="">All Types</option>
          <option value="Government">Government</option>
          <option value="Private">Private</option>
        </select>

        <span className="text-sm text-gray-700 font-semibold self-center">
          {colleges.length} colleges found
        </span>
      </div>

      {/* College Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            Loading colleges...
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            No colleges found 😕
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {colleges.map((college: any) => (
  <CollegeCard
    key={college.id}
    college={college}
    onCompare={toggleCompare}
    isCompared={!!compareList.find(c => c.id === college.id)}
  />
))}
          </div>
        )}
      </div>
      {/* Compare Bar */}
{compareList.length > 0 && (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-2xl px-6 py-4 z-50">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <span className="font-bold text-gray-700">Compare ({compareList.length}/3):</span>
        {compareList.map(c => (
          <span key={c.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {c.name} ✕
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setCompareList([])}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          Clear
        </button>
        <Link
          href={`/compare?ids=${compareList.map(c => c.id).join(',')}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
          Compare Now →
        </Link>
      </div>
    </div>
  </div>
)}
    </main>
  );
}