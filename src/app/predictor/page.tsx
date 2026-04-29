'use client';
import { useState } from 'react';
import API from '@/lib/api';
import Link from 'next/link';

export default function PredictorPage() {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

 const handlePredict = async () => {
  if (!exam || !rank) {
    alert('Please select exam and enter rank!');
    return;
  }
  setLoading(true);
  setSearched(false);
  setResults([]);  // ← clears old results
  try {
    const res = await API.get('/colleges/predictor/results', {
      params: { exam, rank }
    });
    setResults(res.data);
    setSearched(true);  // ← only set true after success
  } catch (err) {
    console.error(err);
    setSearched(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-700 text-white py-12 px-6 text-center">
        <Link href="/" className="text-blue-200 text-sm mb-4 block hover:text-white">
          ← Back to Colleges
        </Link>
        <h1 className="text-4xl font-bold mb-2">🧠 College Predictor</h1>
        <p className="text-blue-200">Enter your exam and rank to find the best colleges for you</p>
      </div>

      {/* Input Form */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Exam
            </label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
            >
              <option value="">-- Choose Exam --</option>
              <option value="JEE">JEE Main / Advanced</option>
              <option value="BITSAT">BITSAT</option>
              <option value="MHT-CET">MHT-CET</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Your Rank
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Predicting...' : '🔮 Predict My Colleges'}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {results.length > 0
                ? `🎉 ${results.length} Colleges Found for You!`
                : '😕 No colleges found for this rank'}
            </h2>
            <div className="space-y-4">
              {results.map((college: any) => (
                <div key={college.id}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{college.name}</h3>
                    <p className="text-gray-500 text-sm">📍 {college.location}, {college.state}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-yellow-600 font-medium">⭐ {college.rating}</span>
                      <span className="text-sm text-green-600 font-medium">🎯 {college.placement_percent}% Placement</span>
                      <span className="text-sm text-blue-600 font-medium">💰 ₹{(college.fees_min/100000).toFixed(1)}L/yr</span>
                    </div>
                  </div>
                  <Link
                    href={`/colleges/${college.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}