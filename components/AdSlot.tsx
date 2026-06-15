'use client';

import { useState, useEffect } from 'react';

export default function AdSlot({ type }: { type: 'header' | 'sidebar' | 'in-content' }) {
  const [adHtml, setAdHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil script dari database
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        let content = '';
        
        // Pilih script berdasarkan jenis posisi
        if (type === 'header') content = data.header_ad_script || '';
        if (type === 'sidebar') content = data.sidebar_ad_script || '';
        if (type === 'in-content') content = data.in_content_ad_script || '';

        setAdHtml(content);
        setLoading(false);
      });
  }, [type]);

  // Jangan tampilkan apa-apa jika script kosong atau loading
  if (!adHtml || loading) return null;

  return (
    <div className="w-full flex justify-center my-4 py-2">
      {/* Kita gunakan dangerouslySetInnerHTML untuk mengeksekusi script */}
      <div dangerouslySetInnerHTML={{ __html: adHtml }} />
    </div>
  );
}