import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import NewsCard from '@/components/NewsCard';
import AdSlot from '@/components/AdSlot';
import supabase from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

// Komponen Kartu Pengisi Ruang Kosong
const ExploreCard = ({ category }: { category: string }) => (
  <Link 
    href={`/category/${category}`} 
    className="flex flex-col bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors group flex items-center justify-center min-h-[350px]"
  >
    <div className="p-5 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
        <span className="text-2xl text-cyan-400 group-hover:scale-110 transition-transform">+</span>
      </div>
      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
        Explore {category}
      </h3>
      <p className="text-sm text-slate-500 mt-2">View all articles in this category</p>
    </div>
  </Link>
);

export default async function Home() {
  // 1. AMBIL DATA DARI SUPABASE
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10); // Ambil 10 artikel

  if (error) console.error("Error fetching articles:", error);

  // 2. PISAHKAN ARTIKEL: Artikel Pertama Jadi Hero, sisanya ke Grid
  const heroArticle = articles?.[0] || null;
  const listArticles = articles?.slice(1) || []; // Ambil mulai dari artikel ke-2

  // 3. LOGIKA PENGISI RUANG KOSONG
  const allCategories = ['SPORTS', 'AUTOMOTIVE', 'GAMING', 'CRYPTO', 'FINANCE'];
  const articleCount = listArticles.length; // Hitung jumlah artikel di grid (tanpa hero)
  
  const remainder = articleCount % 3;
  const placeholdersNeeded = remainder > 0 ? (3 - remainder) : 0;
  
  // Kumpulkan semua kategori yang sudah dipakai (termasuk yang di Hero)
  const usedCategories = (articles || []).map((a: any) => a.category);
  const missingCategories = allCategories.filter(c => !usedCategories.includes(c));
  
  const placeholderCards = missingCategories.slice(0, placeholdersNeeded);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <AdSlot type="header" />
      
      {/* KIRIM ARTIKEL PERTAMA KE HERO SECTION */}
      <HeroSection heroArticle={heroArticle} />

      {/* SECTION BERITA TERBARU */}
      <section className="container mx-auto px-4 py-12 border-t border-slate-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="w-2 h-8 bg-cyan-500 mr-3 rounded-full"></span>
            Latest Wire
          </h2>
          <span className="text-xs text-slate-500">
            {articleCount} Articles Found
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* KOLOM KIRI: BERITA & PENGISI */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Render Artikel Sisa (Mulai dari nomor 2) */}
            {listArticles.length > 0 ? (
              listArticles.map((article: any) => (
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
              <div className="col-span-full text-center py-12 text-slate-500 border border-slate-800 rounded-lg bg-slate-900/50">
                No articles published yet.
              </div>
            )}

            {/* Render Kartu Pengisi Otomatis */}
            {placeholderCards.map((cat) => (
              <ExploreCard key={cat} category={cat} />
            ))}

          </div>

          {/* KOLOM KANAN: IKLAN SIDEBAR */}
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