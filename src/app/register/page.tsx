'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill all fields!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h1>
        <p className="text-gray-500 text-center mb-8">Join to save your favorite colleges</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>

        <div className="text-center mt-3">
          <Link href="/" className="text-gray-400 text-sm hover:text-gray-600">
            ← Back to Colleges
          </Link>
        </div>
      </div>
    </main>
  );
}