import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import supabase from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Ambil nama kategori dari URL (misal: CRYPTO, SPORTS)
  const { slug } = await params;
  const categoryName = slug.toUpperCase();

  // Ambil artikel dari database berdasarkan kategori
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category', categoryName) // Filter berdasarkan kategori
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12">
      <Navbar />
        <div className="container mx-auto px-4">
        
        {/* HEADER KATEGORI */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
            <p className="text-sm font-bold text-cyan-400 tracking-widest">CATEGORY</p>
          </div>
          <h1 className="text-4xl font-bold text-white">
            {categoryName}
          </h1>
          <p className="text-slate-400 mt-2">
            Showing {articles?.length || 0} article(s) in this category.
          </p>
        </div>

        {/* LIST ARTIKEL */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <NewsCard 
                key={article.id}
                title={article.title}
                category={article.category}
                image={article.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600"}
                time={formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                slug={article.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">📰</p>
            <p className="text-xl font-bold text-white mb-2">No articles yet</p>
            <p>There are no articles published in the {categoryName} category right now.</p>
            <Link href="/" className="text-cyan-400 hover:underline mt-4 inline-block">
              ← Back to Homepage
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}