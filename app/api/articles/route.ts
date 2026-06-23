import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache'; // <--- TAMBAHKAN INI

// Koneksi menggunakan SERVICE ROLE (Dewa)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
    }

    // Simpan ke Database
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([
        {
          title: body.title,
          slug: body.slug,
          excerpt: body.excerpt,
          content: body.content,
          category: body.category,
          image_url: body.image_url,
          status: body.status || 'draft',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // --- PERINTAH RAHASIA VERCEL ---
    // Setelah berhasil simpan, hapus cache halaman ini:
    revalidatePath('/');       // Cache Beranda dihapus
    revalidatePath('/search'); // Cache Halaman Pencarian dihapus
    revalidatePath(`/category/${body.category}`);

    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}