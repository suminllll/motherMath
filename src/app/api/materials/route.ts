import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, contents } = body

    if (!title || !contents) {
      return NextResponse.json(
        { error: 'Title and contents are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createSupabaseAdmin()
    
    const { data, error } = await supabaseAdmin
      .from('materials')
      .insert({ title, contents })
      .select()
      .single()

    if (error) {
      console.error('Error creating material:', error)
      return NextResponse.json(
        { error: 'Failed to create material' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, contents } = body

    console.log('PUT request received:', { id, title, contentsLength: contents?.length })

    if (!id || !title || !contents) {
      console.error('Missing required fields:', { id: !!id, title: !!title, contents: !!contents })
      return NextResponse.json(
        { error: 'ID, title and contents are required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('materials')
      .update({ title, contents })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating material:', error)
      return NextResponse.json(
        { error: 'Failed to update material', details: error.message },
        { status: 500 }
      )
    }

    console.log('Material updated successfully:', data?.id)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createSupabaseAdmin()
    
    const { error } = await supabaseAdmin
      .from('materials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting material:', error)
      return NextResponse.json(
        { error: 'Failed to delete material' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}