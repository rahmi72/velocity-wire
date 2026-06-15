import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Gunakan Service Role agar admin bisa edit
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. AMBIL PENGATURAN SAAT INI (GET)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('*')
    .single(); // Ambil satu baris saja

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. SIMPAN PENGATURAN BARU (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Update baris dengan ID 1
    const { data, error } = await supabaseAdmin
      .from('settings')
      .update({
        header_ad_script: body.header_ad_script,
        sidebar_ad_script: body.sidebar_ad_script,
        in_content_ad_script: body.in_content_ad_script,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1); // Kita update row ID 1 yang kita buat tadi

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}