'use client';
import { useEffect, useState } from 'react';
import API from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import QandA from '@/components/QandA';
import { useAuth } from '@/context/AuthContext';

export default function CollegeDetail() {
  const { user, token } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const toggleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      const res = await API.post(`/auth/saved/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(res.data.saved);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await API.get(`/colleges/${id}`);
        setCollege(res.data);
        try {
          const qRes = await API.get(`/colleges/${id}/questions`);
          setQuestions(qRes.data);
        } catch {
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
      Loading...
    </div>
  );

  if (!college) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
      College not found
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-blue-700 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-200 text-sm mb-4 block hover:text-white">
            ← Back to Colleges
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{college.name}</h1>
              <p className="text-blue-200 mt-1">📍 {college.location}, {college.state}</p>
              <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium ${
                college.type === 'Government'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {college.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">⭐ {college.rating}</div>
              <div className="text-blue-200 text-sm">Rating</div>
              <button
                onClick={toggleSave}
                className={`mt-3 px-6 py-2 rounded-xl font-bold text-sm transition ${
                  isSaved
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}>
                {isSaved ? '❤️ Saved!' : '🤍 Save College'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{(college.fees_min / 100000).toFixed(1)}L
            </p>
            <p className="text-gray-500 text-sm">Min Fees/Year</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {college.placement_percent}%
            </p>
            <p className="text-gray-500 text-sm">Placement Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {college.established}
            </p>
            <p className="text-gray-500 text-sm">Established</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          {['overview', 'courses', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{college.overview}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-500 font-medium">Location</p>
                <p className="font-bold text-gray-800 mt-1">{college.location}, {college.state}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-sm text-green-500 font-medium">Type</p>
                <p className="font-bold text-gray-800 mt-1">{college.type}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <p className="text-sm text-purple-500 font-medium">Fees Range</p>
                <p className="font-bold text-gray-800 mt-1">
                  ₹{(college.fees_min / 100000).toFixed(1)}L - ₹{(college.fees_max / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <p className="text-sm text-yellow-600 font-medium">Established</p>
                <p className="font-bold text-gray-800 mt-1">{college.established}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Offered</h2>
            <div className="space-y-3">
              {college.courses?.map((course: any) => (
                <div key={course.id}
                  className="flex justify-between items-center border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800">{course.name}</p>
                    <p className="text-sm text-gray-500">⏱ {course.duration}</p>
                  </div>
                  <p className="font-bold text-blue-600">
                    ₹{(course.fees / 100000).toFixed(1)}L/yr
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Student Reviews</h2>
            <div className="space-y-4">
              {college.reviews?.map((review: any) => (
                <div key={review.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">{review.user_name}</p>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Q&A Button */}
      <button
        onClick={() => setShowQA(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-2xl font-bold text-sm hover:bg-blue-700 transition z-40">
        💬 Q&A
      </button>

      {/* Q&A Sliding Drawer */}
      {showQA && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          {/* Backdrop */}
          <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowQA(false)}
              />
          {/* Drawer */}
          <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl p-6 animate-slide-in pointer-events-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
  <h2 className="text-xl font-bold text-gray-800">💬 Questions & Answers</h2>
  <button
    onClick={() => setShowQA(false)}
    className="bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition">
    ✕
  </button>
</div>
            <QandA collegeId={Number(id)} questions={questions} />
          </div>
        </div>
      )}

    </main>
  );
}
