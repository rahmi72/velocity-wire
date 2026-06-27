'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdSlot({ type }: { type: 'header' | 'sidebar' | 'in-content' }) {
  const [adHtml, setAdHtml] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Ambil script dari DB
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        let content = '';
        if (type === 'header') content = data.header_ad_script || '';
        if (type === 'sidebar') content = data.sidebar_ad_script || '';
        if (type === 'in-content') content = data.in_content_ad_script || '';
        setAdHtml(content);
      });
  }, [type]);

  // 2. Force Execution Script Secara Berurutan (PENTING UNTUK ADSTERRA)
  useEffect(() => {
    if (!adHtml || !containerRef.current) return;

    // Bersihkan container dulu sebelum menyuntikkan ulang
    containerRef.current.innerHTML = '';

    // Gunakan DOMParser untuk memecah HTML yang datang dari database
    const parser = new DOMParser();
    const doc = parser.parseFromString(adHtml, 'text/html');

    // Langkah A: Masukkan elemen HTML biasa (div, gambar, dll) terlebih dahulu
    const nonScripts = doc.body.querySelectorAll(':not(script)');
    nonScripts.forEach(el => {
      containerRef.current?.appendChild(el.cloneNode(true));
    });

    // Langkah B: Eksekusi script SATU PER SATU secara BERURUTAN
    const scripts = doc.body.querySelectorAll('script');
    
    const executeScript = (index: number) => {
      // Berhenti jika sudah tidak ada script lagi
      if (index >= scripts.length) return;

      const oldScript = scripts[index];
      const newScript = document.createElement('script');

      // Salin semua atribut (src, type, dll)
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Salin isi script inline (kode atOptions = {...})
      newScript.textContent = oldScript.textContent;

      // Jika ini script eksternal (invoke.js), tunggu sampai selesai load,
      // BARU lanjut ke script berikutnya (agar variabel atOptions sudah terbaca)
      if (oldScript.src) {
        newScript.onload = () => executeScript(index + 1);
        newScript.onerror = () => executeScript(index + 1);
      } else {
        // Jika script inline, langsung lanjut ke berikutnya
        executeScript(index + 1);
      }

      // Masukkan script baru yang sudah siap ke halaman
      containerRef.current?.appendChild(newScript);
    };

    // Mulai eksekusi dari script pertama
    executeScript(0);

  }, [adHtml]);

  if (!adHtml) return null;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center my-4"
      style={{ minHeight: '50px' }}
    />
  );
}