import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Koneksi ke database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 2. Ambil semua artikel yang statusnya published
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  // 3. Format URL artikel untuk sitemap
  const articleUrls = (articles || []).map((article) => ({
    url: `https://velocity-wire.vercel.app/article/${article.slug}`,
    lastModified: new Date(article.updated_at || article.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 4. Gabungkan dengan halaman statis (Home, Category)
  return [
    {
      url: 'https://velocity-wire.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://velocity-wire.vercel.app/category/SPORTS',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: 'https://velocity-wire.vercel.app/category/AUTOMOTIVE',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: 'https://velocity-wire.vercel.app/category/GAMING',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: 'https://velocity-wire.vercel.app/category/CRYPTO',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: 'https://velocity-wire.vercel.app/category/FINANCE',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...articleUrls, // Masukkan semua URL artikel dinamis di sini
  ]
}