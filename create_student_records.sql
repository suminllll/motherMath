-- 학생변화기록 테이블 생성
CREATE TABLE IF NOT EXISTS student_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    grade TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_student_records_created_at ON student_records(created_at);
CREATE INDEX IF NOT EXISTS idx_student_records_grade ON student_records USING GIN (grade);

-- Row Level Security (RLS) 활성화
ALTER TABLE student_records ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "Allow public read access to student_records" ON student_records
    FOR SELECT USING (true);

-- 관리자(서비스 키)만 모든 작업 허용
CREATE POLICY "Allow service role full access to student_records" ON student_records
    USING (auth.jwt() ->> 'role' = 'service_role');
