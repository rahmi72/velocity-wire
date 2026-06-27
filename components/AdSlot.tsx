'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdSlot({ type }: { type: 'header' | 'sidebar' | 'in-content' }) {
  const [adScript, setAdScript] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Ambil script mentah dari Database
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        let content = '';
        if (type === 'header') content = data.header_ad_script || '';
        if (type === 'sidebar') content = data.sidebar_ad_script || '';
        if (type === 'in-content') content = data.in_content_ad_script || '';
        setAdScript(content);
      });
  }, [type]);

  // 2. PARSER KHUSUS ADSTERRA (Vanilla JS Injection)
  useEffect(() => {
    if (!adScript || !containerRef.current) return;

    // Bersihkan dulu
    containerRef.current.innerHTML = '';

    // Cari kode 'key' menggunakan Regex
    const keyMatch = adScript.match(/'key'\s*:\s*'([^']+)'/);

    if (keyMatch) {
      const adKey = keyMatch[1];

      // Langkah 1: Buat variabel atOptions secara manual di window
      (window as any).atOptions = {
        'key': adKey,
        'format': 'iframe',
        'height': 250,
        'width': 300,
        'params': {}
      };

      // Langkah 2: Buat elemen script invoke.js secara murni
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;

      // Langkah 3: Suntikkan langsung ke DOM (Di luar kendali React)
      containerRef.current.appendChild(script);
    }
  }, [adScript]);

  if (!adScript) return null;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center my-4"
      style={{ minHeight: '50px' }}
    />
  );
}