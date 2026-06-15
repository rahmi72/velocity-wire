import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsCard from '@/components/NewsCard';
import supabase from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import AdSlot from '@/components/AdSlot';

export default async function Home() {
  // 1. AMBIL DATA DARI SUPABASE
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published') // Hanya ambil yang statusnya published
    .order('created_at', { ascending: false }) // Terbaru di atas
    .limit(6); // Ambil 6 artikel terbaru

  // Jika error, tampilkan di console (opsional)
  if (error) console.error("Error fetching articles:", error);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      {/* 1. HERO SECTION DINAMIS (Ambil artikel paling atas / Index 0) */}
      {articles && articles.length > 0 && (
        <HeroSection heroArticle={articles[0]} />
      )}

      {/* 2. SECTION BERITA TERBARU (GRID) */}
      <section className="container mx-auto px-4 py-12 border-t border-slate-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="w-2 h-8 bg-cyan-500 mr-3 rounded-full"></span>
            Latest Wire
          </h2>
          <span className="text-xs text-slate-500">
            {articles?.length || 0} Articles Found
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* KOLOM KIRI: DAFTAR ARTIKEL (3 kolom) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles && articles.length > 0 ? (
              // .slice(1) artinya: Mulai dari artikel ke-2, agar tidak duplikat dengan Hero Section
              articles.slice(1).map((article: any) => (
                <NewsCard 
                  key={article.id}
                  title={article.title}
                  category={article.category}
                  image={article.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600"}
                  time={formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                  slug={article.slug}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 border border-slate-800 rounded-lg bg-slate-900/50">
                No articles published yet.
              </div>
            )}
          </div>

          {/* KOLOM KANAN: IKLAN SIDEBAR (1 kolom) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center text-xs text-slate-500 mb-4">
                SPONSORED
              </div>
              <AdSlot type="sidebar" />
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-slate-600 text-sm">
        &copy; 2024 Velocity Wire. All rights reserved.
      </footer>
    </main>
  );
}