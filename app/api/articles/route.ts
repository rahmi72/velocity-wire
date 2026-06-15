import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// FUNGSI TAMBAH ARTIKEL (Sudah ada)
export async function POST(request: Request) {
  // ... Kode POST Anda yang lama ...
  // Saya tulis ulang biar lengkap:
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
    }
    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([{
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        image_url: body.image_url,
        status: body.status || 'draft',
        created_at: new Date().toISOString(),
      }])
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// FUNGSI HAPUS ARTIKEL (Baru)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Hapus dari Supabase
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}