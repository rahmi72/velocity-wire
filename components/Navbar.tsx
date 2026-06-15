'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        
        {/* BAGIAN ATAS: LOGO & SEARCH */}
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter text-cyan-400">
            VELOCITY WIRE
          </Link>

          <button className="text-slate-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        {/* BAGIAN BAWAH: MENU LINKS */}
        {/* overflow-x-auto membuatnya bisa di-geser di HP */}
        <div className="flex gap-6 overflow-x-auto py-3 no-scrollbar text-sm font-medium text-slate-400 md:justify-center">
          <Link href="/category/sports" className="whitespace-nowrap hover:text-cyan-400 transition-colors">SPORTS</Link>
          <Link href="/category/automotive" className="whitespace-nowrap hover:text-cyan-400 transition-colors">AUTOMOTIVE</Link>
          <Link href="/category/gaming" className="whitespace-nowrap hover:text-cyan-400 transition-colors">GAMING</Link>
          <Link href="/category/crypto" className="whitespace-nowrap hover:text-cyan-400 transition-colors">CRYPTO</Link>
          <Link href="/category/finance" className="whitespace-nowrap hover:text-cyan-400 transition-colors">FINANCE</Link>
        </div>

      </div>
    </nav>
  );
}