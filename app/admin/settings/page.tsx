'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  // State untuk menyimpan script
  const [scripts, setScripts] = useState({
    header_ad_script: '',
    sidebar_ad_script: '',
    in_content_ad_script: ''
  });

  // Ambil data script yang sudah ada saat halaman dibuka
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.header_ad_script !== undefined) {
          setScripts(data);
        }
        setFetching(false);
      });
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scripts),
      });

      if (res.ok) {
        setMessage('✅ Pengaturan iklan berhasil disimpan!');
      } else {
        setMessage('❌ Gagal menyimpan.');
      }
    } catch (error) {
      setMessage('❌ Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setScripts({ ...scripts, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400">Monetization Settings</h1>
          <button 
            onClick={() => router.push('/admin')}
            className="text-sm text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded"
          >
            ← Back to Dashboard
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded ${message.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {message}
          </div>
        )}

        {fetching ? (
          <p className="text-slate-500">Loading settings...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* HEADER AD */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2">Header Banner Ad</h2>
              <p className="text-sm text-slate-500 mb-4">Script iklan yang muncul di paling atas website.</p>
              <textarea
                name="header_ad_script"
                value={scripts.header_ad_script}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                placeholder="<script>...</script>"
              />
            </div>

            {/* SIDEBAR AD */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2">Sidebar / Sticky Ad</h2>
              <p className="text-sm text-slate-500 mb-4">Iklan di samping kanan (Desktop) atau bawah (Mobile).</p>
              <textarea
                name="sidebar_ad_script"
                value={scripts.sidebar_ad_script}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                placeholder="<script>...</script>"
              />
            </div>

            {/* IN-CONTENT AD */}
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2">In-Content Ad (Middle)</h2>
              <p className="text-sm text-slate-500 mb-4">Iklan yang otomatis muncul di tengah artikel (setelah paragraf ke-3).</p>
              <textarea
                name="in_content_ad_script"
                value={scripts.in_content_ad_script}
                onChange={handleChange}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                placeholder="<script>...</script>"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded font-bold text-white text-lg transition-all ${
                loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              {loading ? 'Saving...' : 'Save Ad Scripts'}
            </button>

          </form>
        )}
      </div>
    </main>
  );
}