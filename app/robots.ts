import { MetadataRoute } from 'next'

// Fungsi ini akan otomatis menghasilkan /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Izinkan semua search engine (Google, Bing, Yandex)
      allow: '/',     // Izinkan crawl seluruh website
    },
    sitemap: 'https://velocity-wire.vercel.app/sitemap.xml', // Arahkan ke sitemap (Ganti dengan domain .com nanti)
  }
}