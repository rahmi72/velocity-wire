'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State Form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'SPORTS',
    image_url: '',
    status: 'published' // Default langsung publish biar cepat
  });

  // Fungsi: Auto Generate Slug dari Judul
  const handleTitleChange = (e: any) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title: title,
      slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    });
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('✅ Artikel berhasil dipublish!');
        setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'SPORTS', image_url: '', status: 'published' });
        
      } else {
        setMessage('❌ Error: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER NAVIGASI (SUDAH DIPERBAIKI) */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/admin/manage')}
              className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Manage Articles
            </button>
            <button 
              onClick={() => router.push('/admin/settings')}
              className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Ad Settings
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-slate-400 hover:text-white"
            >
              ← Back to Home 
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-4 rounded ${message.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* JUDUL & SLUG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Article Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="e.g. Ferrari Wins Le Mans"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">URL Slug (SEO)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="ferrari-wins-le-mans"
              />
            </div>
          </div>

          {/* KATEGORI */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
            >
              <option value="SPORTS">SPORTS</option>
              <option value="AUTOMOTIVE">AUTOMOTIVE</option>
              <option value="GAMING">GAMING</option>
              <option value="CRYPTO">CRYPTO</option>
              <option value="FINANCE">FINANCE</option>
            </select>
          </div>

          {/* IMAGE URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Image URL (Unsplash/Imgur)</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-slate-500">*Copy link gambar dari Unsplash dan paste di sini.</p>
          </div>

          {/* EXCERPT (RINGKASAN) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Short Excerpt (Meta Description)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="Brief summary for SEO..."
            />
          </div>

          {/* KONTEN UTAMA */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Article Content (Markdown Supported)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none font-mono text-sm"
              placeholder="# Your Content Here..."
            />
          </div>

          {/* TOMBOL */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 rounded font-bold text-white transition-all ${
                loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}