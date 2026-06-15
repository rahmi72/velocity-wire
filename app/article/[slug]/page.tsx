import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdSlot from '@/components/AdSlot';
import supabase from '@/lib/supabaseClient';

// 1. Mengambil Detail Artikel berdasarkan Slug (URL)
async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

// 2. Generate Meta Tags SEO Otomatis
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // <--- TAMBAHKAN INI
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | Velocity Wire`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // <--- TAMBAHKAN INI
  const article = await getArticle(slug);

  // Jika artikel tidak ditemukan, tampilkan 404
  if (!article) {
    notFound();
  }

  // LOGIKA: Potong artikel menjadi 2 bagian untuk pasang iklan di tengah
  // Kita cari paragraf ke-3 (berdasarkan baris kosong \n\n)
  const paragraphs = article.content.split('\n\n');
  const introParagraphs = paragraphs.slice(0, 3);
  const restParagraphs = paragraphs.slice(3);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      
      {/* HEADER GAMBAR BESAR */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <img 
          src={article.image_url} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-cyan-400 uppercase bg-slate-900/80 backdrop-blur rounded border border-cyan-900 mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KOLOM KIRI: ISI ARTIKEL (Ambil 8 kolom) */}
          <article className="lg:col-span-8 space-y-8">
            
            <div className="text-lg leading-relaxed text-slate-300 space-y-4">
              {/* BAGIAN 1: Paragraf Awal */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {introParagraphs.join('\n\n')}
              </ReactMarkdown>

              {/* IKLAN DI TENGAH ARTIKEL (SLOT IN-CONTENT) */}
              <AdSlot type="in-content" />

              {/* BAGIAN 2: Sisa Artikel */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {restParagraphs.join('\n\n')}
              </ReactMarkdown>
            </div>

            <div className="pt-8 border-t border-slate-800 mt-12">
              <p className="text-sm text-slate-500 italic">
                Published on {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>

          </article>

          {/* KOLOM KANAN: SIDEBAR IKLAN & MENU (Ambil 4 kolom) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-8">
            
            {/* STICKY SIDEBAR IKLAN */}
            <div className="sticky top-24">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center text-xs text-slate-500 mb-4">
                SPONSORED CONTENT
              </div>
              <AdSlot type="sidebar" />
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}