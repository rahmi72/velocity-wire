import Link from 'next/link';

export default function NewsCard({ title, category, image, time, slug }: any) {
  return (
    // Bungkus dengan Link agar bisa diklik
    <Link href={`/article/${slug}`} className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors group h-full">
      
      {/* GAMBAR */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur text-xs font-bold text-white px-2 py-1 rounded">
          {category}
        </div>
      </div>

      {/* KONTEN */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <div className="mt-auto flex items-center text-xs text-slate-500">
          <span>{time}</span>
        </div>
      </div>
    </Link>
  );
}