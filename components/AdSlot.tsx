'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdSlot({ type }: { type: 'header' | 'sidebar' | 'in-content' | 'native' | 'popunder' }) {
  const [adScript, setAdScript] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Ambil script dari DB berdasarkan tipe slot
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        let content = '';
        if (type === 'header') content = data.header_ad_script || '';
        if (type === 'sidebar') content = data.sidebar_ad_script || '';
        if (type === 'in-content') content = data.in_content_ad_script || '';
        if (type === 'native') content = data.native_ad_script || '';
        if (type === 'popunder') content = data.popunder_ad_script || '';
        setAdScript(content);
      });
  }, [type]);

  // 2. SUPER PARSER (Mengenali 3 jenis iklan Adsterra)
  useEffect(() => {
    if (!adScript || !containerRef.current) return;
    containerRef.current.innerHTML = '';

    // --- TIPE 1: BANNER (Yang sudah berhasil sebelumnya) ---
    const keyMatch = adScript.match(/'key'\s*:\s*'([^']+)'/);
    if (keyMatch) {
      const adKey = keyMatch[1];
      (window as any).atOptions = { 'key': adKey, 'format': 'iframe', 'height': 250, 'width': 300, 'params': {} };
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
      script.async = true;
      containerRef.current.appendChild(script);
      return; // Stop di sini jika ini Banner
    }

    // --- TIPE 2: NATIVE AD (Pola: invoke.js + div id="container-...") ---
    const nativeMatch = adScript.match(/id="container-([^"]+)"/);
    const nativeSrcMatch = adScript.match(/src="([^"]+effectivecpmnetwork\.com[^"]+)"/);
    
    if (nativeMatch && nativeSrcMatch) {
      const containerId = nativeMatch[1];
      const scriptSrc = nativeSrcMatch[1];

      // 1. Buat wadah div-nya dulu
      const div = document.createElement('div');
      div.id = `container-${containerId}`;
      containerRef.current.appendChild(div);

      // 2. Muat script invoke-nya
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      containerRef.current.appendChild(script);
      return; // Stop di sini jika ini Native
    }

    // --- TIPE 3: POPUNDER / SOCIAL BAR (Hanya script .js biasa) ---
    const popMatch = adScript.match(/src="([^"]+\.js)"/);
    if (popMatch) {
      const scriptSrc = popMatch[1];
      const script = document.createElement('script');
      script.src = scriptSrc;
      containerRef.current.appendChild(script);
      return;
    }

  }, [adScript]);

  // Jika tidak ada script, atau ini popunder (biar tidak menciptakan ruang kosong di layout)
  if (!adScript || type === 'popunder') return null;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center my-4"
      style={{ minHeight: '50px' }}
    />
  );
}