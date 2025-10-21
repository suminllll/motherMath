import { supabase } from './supabase'

// 카테고리 옵션 타입
export interface CategoryOption {
  label: string
  value: string
}

// 기본 학년 옵션 (드롭다운에 표시)
export const DEFAULT_GRADE_OPTIONS: CategoryOption[] = [
  { label: '초1', value: 'elem-1' },
  { label: '초2', value: 'elem-2' },
  { label: '초3', value: 'elem-3' },
  { label: '초4', value: 'elem-4' },
  { label: '초5', value: 'elem-5' },
  { label: '초6', value: 'elem-6' },
  { label: '중1', value: 'middle-1' },
  { label: '중2', value: 'middle-2' },
  { label: '중3', value: 'middle-3' },
  { label: '고1', value: 'high-1' },
  { label: '고2', value: 'high-2' },
  { label: '고3', value: 'high-3' },
]

// lectures 테이블에서 실제 사용 중인 학년 목록 가져오기
export async function getUsedGrades(): Promise<string[]> {
  const { data, error } = await supabase
    .from('lectures')
    .select('grade')

  if (error) {
    console.error('Error fetching used grades:', error)
    throw error
  }

  // 배열을 평탄화하고 중복 제거
  const allGrades = data?.flatMap(d => d.grade || []) || []
  const uniqueGrades = [...new Set(allGrades)]
  return uniqueGrades
}

// value로 label 찾기 (학년)
export function getGradeLabel(value: string): string {
  const option = DEFAULT_GRADE_OPTIONS.find(opt => opt.value === value)
  return option ? option.label : value
}

// 필터링용: 실제 사용 중인 학년 옵션만 반환
export async function getActiveGradeOptions(): Promise<CategoryOption[]> {
  const usedGrades = await getUsedGrades()

  const options: CategoryOption[] = []

  usedGrades.forEach(grade => {
    const defaultOption = DEFAULT_GRADE_OPTIONS.find(opt => opt.value === grade)
    if (defaultOption) {
      options.push(defaultOption)
    }
  })

  return options
}
