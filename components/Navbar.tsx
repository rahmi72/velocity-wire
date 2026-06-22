'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setIsSearching(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        
        {/* BAGIAN ATAS: LOGO & SEARCH */}
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-cyan-400 whitespace-nowrap">
            VELOCITY WIRE
          </Link>

          {/* FORM SEARCH (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-4 pr-10 text-sm text-white focus:border-cyan-500 outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            </div>
          </form>

          {/* TOGGLE SEARCH (Mobile) */}
          <button onClick={() => setIsSearching(!isSearching)} className="md:hidden text-slate-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        {/* FORM SEARCH (Mobile - Muncul saat diklik) */}
        {isSearching && (
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-sm text-white focus:border-cyan-500 outline-none"
            />
          </form>
        )}

        {/* BAGIAN BAWAH: MENU LINKS */}
        <div className="flex gap-6 overflow-x-auto py-3 no-scrollbar text-sm font-medium text-slate-400 md:justify-center">
          <Link href="/category/SPORTS" className="whitespace-nowrap hover:text-cyan-400 transition-colors">SPORTS</Link>
          <Link href="/category/AUTOMOTIVE" className="whitespace-nowrap hover:text-cyan-400 transition-colors">AUTOMOTIVE</Link>
          <Link href="/category/GAMING" className="whitespace-nowrap hover:text-cyan-400 transition-colors">GAMING</Link>
          <Link href="/category/CRYPTO" className="whitespace-nowrap hover:text-cyan-400 transition-colors">CRYPTO</Link>
          <Link href="/category/FINANCE" className="whitespace-nowrap hover:text-cyan-400 transition-colors">FINANCE</Link>
        </div>

      </div>
    </nav>
  );
}