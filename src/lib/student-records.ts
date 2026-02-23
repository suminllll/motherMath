import { supabase } from './supabase'
import type { StudentRecord, StudentRecordInsert, StudentRecordUpdate } from '@/types/database'

export const getStudentRecords = async (): Promise<StudentRecord[]> => {
  const { data, error } = await supabase
    .from('student_records')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching student records:', error)
    throw error
  }

  return data || []
}

export const getLatestStudentRecords = async (limit = 8): Promise<StudentRecord[]> => {
  const { data, error } = await supabase
    .from('student_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest student records:', error)
    return []
  }

  return data || []
}

export const getStudentRecordsByGrade = async (grade: string): Promise<StudentRecord[]> => {
  const { data, error } = await supabase
    .from('student_records')
    .select('*')
    .contains('grade', [grade])
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching student records by grade:', error)
    throw error
  }

  return data || []
}

export const getStudentRecordById = async (id: string): Promise<StudentRecord | null> => {
  const { data, error } = await supabase
    .from('student_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching student record:', error)
    return null
  }

  return data
}

export const createStudentRecord = async (record: StudentRecordInsert): Promise<StudentRecord> => {
  const response = await fetch('/api/student-records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create student record')
  }
  return response.json()
}

export const updateStudentRecord = async (id: string, updates: StudentRecordUpdate): Promise<StudentRecord> => {
  const response = await fetch('/api/student-records', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update student record')
  }
  return response.json()
}

export const deleteStudentRecord = async (id: string): Promise<void> => {
  const response = await fetch(`/api/student-records?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete student record')
  }
}
