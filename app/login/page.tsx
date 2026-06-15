'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin'); // Redirect ke dashboard
        router.refresh(); // Refresh state
      } else {
        setError('Password Salah!');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-cyan-400 mb-6 text-center">VELOCITY ADMIN ACCESS</h1>
        
        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="Enter password..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded transition-colors"
          >
            LOGIN
          </button>
        </form>
      </div>
    </main>
  );
}