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
    .contains('grade', [grade])  // 배열에 해당 값이 포함되어 있는지 확인
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lectures by grade:', error)
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