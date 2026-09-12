'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManageArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Ambil semua artikel saat halaman dimuat
  useEffect(() => {
    fetch('/api/settings') // Trik: Ambil dari API yang sudah ada? Tidak, kita buat fetch manual
      .catch(() => {}); 
    
    // Fetch artikel dari Supabase (Direct client fetch for list)
    fetch('/api/articles/list') 
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) setArticles(data.articles);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Hapus artikel dari tampilan lokal tanpa reload
        setArticles(articles.filter((art) => art.id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      alert('Error deleting article');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400">Manage Articles</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/admin')}
              className="text-sm text-slate-400 hover:text-white"
            >
              Write New
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-slate-400 hover:text-white"
            >
              Home
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading articles...</p>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded border border-slate-800">
            <p className="text-slate-400">No articles found.</p>
            <button 
              onClick={() => router.push('/admin')}
              className="mt-4 text-cyan-400 hover:underline"
            >
              Write your first article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                
                {/* INFO ARTIKEL */}
                <div className="flex items-center gap-4 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt="thumb" 
                    className="w-16 h-16 object-cover rounded bg-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className={`px-2 py-0.5 rounded ${article.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {article.status.toUpperCase()}
                      </span>
                      <span>• {article.category}</span>
                      <span>• {new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* TOMBOL AKSI */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link 
                    href={`/article/${article.slug}`}
                    target="_blank"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded border border-slate-700 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                    className={`text-xs px-3 py-2 rounded border transition-colors ${
                      deletingId === article.id 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-red-900/20 text-red-400 border-red-900/50 hover:bg-red-900 hover:text-white'
                    }`}
                  >
                    {deletingId === article.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}