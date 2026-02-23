import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, grade, images } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('student_records')
      .insert({ title, grade: grade || [], images: images || [] })
      .select()
      .single()

    if (error) {
      console.error('Error creating student record:', error)
      return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, grade, images } = body

    if (!id || !title) {
      return NextResponse.json({ error: 'ID and title are required' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('student_records')
      .update({ title, grade: grade || [], images: images || [] })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating student record:', error)
      return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const supabaseAdmin = createSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('student_records')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting student record:', error)
      return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
