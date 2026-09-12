'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State untuk Daftar Artikel
  const [articles, setArticles] = useState<any[]>([]);
  
  // State untuk Form
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'SPORTS',
    image_url: '',
    status: 'published'
  });

  // Ambil Daftar Artikel Saat Halaman Dibuka
  useEffect(() => {
    fetch('/api/articles/list')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
        else if (data.data) setArticles(data.data);
      })
      .catch(() => {});
  }, [message]);

  // Fungsi Auto Slug
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

  // Fungsi Isi Form dengan Data Artikel yang dipilih
  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`);
      const data = await res.json();
      
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        category: data.category,
        image_url: data.image_url || '',
        status: data.status
      });
      setEditingId(id);
      setIsEditing(true);
      setMessage('📝 Anda sedang mengedit artikel. Form di bawah sudah terisi.');
    } catch (error) {
      setMessage('❌ Gagal mengambil data artikel.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Batal Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'SPORTS', image_url: '', status: 'published' });
    setMessage('');
  };

  // Fungsi Hapus Artikel
  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`⚠️ Are you sure you want to permanently delete:\n\n"${title}"?\n\nThis action cannot be undone.`);
    if (!confirmDelete) return; 

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setMessage(`🗑️ Article "${title}" has been deleted.`);
        setArticles(articles.filter(a => a.id !== id));
      } else {
        setMessage('❌ Failed to delete article.');
      }
    } catch (error) {
      setMessage('❌ Terjadi kesalahan koneksi.');
    }
  };

  // Fungsi Submit (Buat Baru / Update) -- YANG INI HANYA SATU
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = isEditing ? `/api/articles/${editingId}` : '/api/articles';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(`✅ Artikel berhasil ${isEditing ? 'diupdate' : 'dipublish'}!`);
        if (!isEditing) {
          setFormData({ title: '', slug: '', excerpt: '', content: '', category: 'SPORTS', image_url: '', status: 'published' });
        }
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
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button onClick={() => router.push('/admin/settings')} className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">Ad Settings</button>
            <button onClick={() => router.push('/')} className="text-sm text-slate-400 hover:text-white">Home</button>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded flex justify-between items-center ${message.includes('✅') || message.includes('🗑️') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            <span>{message}</span>
            {isEditing && <button onClick={handleCancelEdit} className="underline text-sm font-bold">Batal Edit</button>}
          </div>
        )}

        {/* DAFTAR ARTIKEL */}
        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Your Articles</h2>
          {articles.length === 0 ? (
            <p className="text-slate-500 text-sm">Belum ada artikel.</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
                  <div className="flex-1 mr-4">
                    <p className="text-white font-medium truncate">{article.title}</p>
                    <p className="text-xs text-slate-500">{article.category} • {article.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(article.id)}
                      className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded font-bold"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id, article.title)}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM TULIS / EDIT */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-2">
            {isEditing ? '✏️ Update Article' : '✍️ Write New Article'}
          </h2>
          
          {/* JUDUL & SLUG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">Article Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleTitleChange} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none" placeholder="e.g. Ferrari Wins Le Mans" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">URL Slug (SEO)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none" placeholder="ferrari-wins-le-mans" />
            </div>
          </div>

          {/* KATEGORI */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none">
              <option value="SPORTS">SPORTS</option>
              <option value="AUTOMOTIVE">AUTOMOTIVE</option>
              <option value="GAMING">GAMING</option>
              <option value="CRYPTO">CRYPTO</option>
              <option value="FINANCE">FINANCE</option>
            </select>
          </div>

          {/* IMAGE URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Image URL</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none" placeholder="https://images.unsplash.com/..." />
          </div>

          {/* EXCERPT */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Short Excerpt (Meta Description)</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none" placeholder="Brief summary for SEO..." />
          </div>

          {/* KONTEN */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Article Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows={12} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none font-mono text-sm" placeholder="# Your Content Here..." />
          </div>

          {/* TOMBOL */}
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className={`flex-1 py-3 px-6 rounded font-bold text-white transition-all ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
              {loading ? 'Processing...' : isEditing ? 'UPDATE ARTICLE' : 'PUBLISH ARTICLE'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="px-6 py-3 rounded font-bold text-white bg-slate-700 hover:bg-slate-600 transition-all">
                CANCEL
              </button>
            )}
          </div>
        </form>

      </div>
    </main>
  );
}