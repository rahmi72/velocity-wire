import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // Tangkap kata kunci dari URL
  const { q } = await searchParams;
  const query = q || '';
  let articles = [];

  // Jika ada kata kunci, cari di database
  if (query) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      articles = data;
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pt-24 pb-12">
      <div className="container mx-auto px-4">
        
        {/* HEADER PENCARIAN */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for: <span className="text-cyan-400">"{query}"</span>
          </h1>
          {query && (
            <p className="text-slate-400">Found {articles.length} article(s) matching your query.</p>
          )}
        </div>

        {/* HASIL */}
        {query && articles.length > 0 ? (
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
        ) : query ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-bold text-white mb-2">No articles found</p>
            <p>Try searching for different keywords like "Porsche", "Bitcoin", or "F1".</p>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p>Please enter a search term in the search bar above.</p>
          </div>
        )}

      </div>
    </main>
  );
}