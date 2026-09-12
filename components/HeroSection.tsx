import Link from 'next/link';

// Menerima props artikel dari luar
export default function HeroSection({ heroArticle }: { heroArticle: any }) {
  // Jika belum ada artikel, jangan tampilkan apa-apa
  if (!heroArticle) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* TEKS UTAMA */}
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/30 rounded border border-cyan-900">
            Featured Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {heroArticle.title}
          </h1>
          <p className="text-slate-400 text-lg">
            {heroArticle.excerpt}
          </p>
          <div className="pt-4">
            {/* LINK YANG SUDAH DIPERBAIKI */}
            <Link href={`/article/${heroArticle.slug}`} className="text-cyan-400 font-semibold hover:underline">
              Read Full Story →
            </Link>
          </div>
        </div>

        {/* GAMBAR BESAR */}
        <div className="relative h-64 md:h-full w-full overflow-hidden rounded-xl border border-slate-800">
          <img 
            src={heroArticle.image_url} 
            alt={heroArticle.title} 
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          />
        </div>

      </div>
    </section>
  );
}