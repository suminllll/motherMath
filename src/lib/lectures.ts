import { supabase } from './supabase'
import type { Lecture, LectureInsert, LectureUpdate } from '@/types/database'

export const getLectures = async (): Promise<Lecture[]> => {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures:', error)
    throw error
  }

  return data || []
}

export const getLecturesByGrade = async (grade: string): Promise<Lecture[]> => {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('grade', grade)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures by grade:', error)
    throw error
  }

  return data || []
}

export const getLecturesBySubject = async (subject: string): Promise<Lecture[]> => {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('subject', subject)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures by subject:', error)
    throw error
  }

  return data || []
}

export const getLecturesByGradeAndSubject = async (grade: string, subject: string): Promise<Lecture[]> => {
  const { data, error } = await supabase
    .from('lectures')
    .select('*')
    .eq('grade', grade)
    .eq('subject', subject)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures by grade and subject:', error)
    throw error
  }

  return data || []
}

export const createLecture = async (lecture: LectureInsert): Promise<Lecture> => {
  const { data, error } = await supabase
    .from('lectures')
    .insert(lecture)
    .select()
    .single()

  if (error) {
    console.error('Error creating lecture:', error)
    throw error
  }

  return data
}

export const updateLecture = async (id: string, updates: LectureUpdate): Promise<Lecture> => {
  const { data, error } = await supabase
    .from('lectures')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lecture:', error)
    throw error
  }

  return data
}

export const deleteLecture = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('lectures')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lecture:', error)
    throw error
  }
}

export const incrementViewCount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .rpc('increment', { table_name: 'lectures', row_id: id, column_name: 'view_count' })

  if (error) {
    // Fallback: manual increment
    const { data: lecture } = await supabase
      .from('lectures')
      .select('view_count')
      .eq('id', id)
      .single()

    if (lecture) {
      await supabase
        .from('lectures')
        .update({ view_count: (lecture.view_count || 0) + 1 })
        .eq('id', id)
    }
  }
}