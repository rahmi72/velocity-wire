import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. AMBIL 1 ARTIKEL BERDASARKAN ID (untuk diisi ke form)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. UPDATE ARTIKEL
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        image_url: body.image_url,
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Hapus cache agar perubahan langsung muncul
    revalidatePath('/');
    revalidatePath(`/article/${body.slug}`);
    revalidatePath(`/category/${body.category}`);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} // <-- PERHATIKAN: Kurung penutup PUT ada di sini

// 3. HAPUS ARTIKEL
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Ambil data artikel dulu untuk mengetahui slug & kategori (untuk cache)
    const { data: articleToDelete } = await supabaseAdmin
      .from('articles')
      .select('slug, category')
      .eq('id', id)
      .single();

    // Proses hapus dari database
    const { error } = await supabaseAdmin
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Hapus cache halaman terkait
    revalidatePath('/');
    revalidatePath('/search');
    if (articleToDelete) {
      revalidatePath(`/article/${articleToDelete.slug}`);
      revalidatePath(`/category/${articleToDelete.category}`);
    }

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} // <-- Kurung penutup DELETE ada di sini