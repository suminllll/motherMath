import { supabase } from './supabase'
import type { Material, MaterialInsert, MaterialUpdate } from '@/types/database'

export const getMaterials = async (): Promise<Material[]> => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching materials:', error)
    throw error
  }

  return data || []
}


export const searchMaterials = async (searchTerm: string, searchType: 'title' | 'content' = 'title'): Promise<Material[]> => {
  let query = supabase
    .from('materials')
    .select('*')

  if (searchType === 'title') {
    query = query.ilike('title', `%${searchTerm}%`)
  } else {
    query = query.ilike('contents', `%${searchTerm}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching materials:', error)
    throw error
  }

  return data || []
}

export const createMaterial = async (material: MaterialInsert): Promise<Material> => {
  const response = await fetch('/api/materials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(material),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create material')
  }

  return response.json()
}

export const updateMaterial = async (id: string, updates: MaterialUpdate): Promise<Material> => {
  const response = await fetch('/api/materials', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...updates }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update material')
  }

  return response.json()
}

export const deleteMaterial = async (id: string): Promise<void> => {
  const response = await fetch(`/api/materials?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete material')
  }
}

export const getAnnouncements = async (limit = 5): Promise<Material[]> => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching announcements:', error)
    throw error
  }

  return data || []
}
