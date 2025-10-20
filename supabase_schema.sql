-- 학습 자료 테이블
CREATE TABLE IF NOT EXISTS materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    contents TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
);

-- 강의 영상 테이블
CREATE TABLE IF NOT EXISTS lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    grade VARCHAR(20) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials(created_at);
CREATE INDEX IF NOT EXISTS idx_lectures_grade ON lectures(grade);
CREATE INDEX IF NOT EXISTS idx_lectures_subject ON lectures(subject);
CREATE INDEX IF NOT EXISTS idx_lectures_created_at ON lectures(created_at);

-- Row Level Security (RLS) 활성화
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (자료실, 강의영상)
CREATE POLICY "Allow public read access to materials" ON materials
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to lectures" ON lectures
    FOR SELECT USING (true);

-- 관리자만 모든 작업 허용 (서비스 키 사용시)
CREATE POLICY "Allow service role full access to materials" ON materials
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Allow service role full access to lectures" ON lectures
    USING (auth.jwt() ->> 'role' = 'service_role');

-- 샘플 데이터 삽입
INSERT INTO materials (title, contents) VALUES
('중1 정수와 유리수 연습문제', '정수와 유리수 개념 정리와 다양한 연습문제를 담았습니다.' ),
('중2 일차함수 개념정리', '일차함수의 기본 개념부터 그래프까지 상세히 설명합니다.'),
('고1 이차함수 기출문제', '최근 3년간 이차함수 관련 기출문제를 모았습니다.');

INSERT INTO lectures (title, description, youtube_url, grade, subject) VALUES
('중1 정수와 유리수 기초', '정수와 유리수의 개념과 사칙연산을 배워봅시다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '중1', '대수'),
('중2 일차함수의 그래프', '일차함수의 그래프를 그리고 해석하는 방법을 알아봅시다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '중2', '함수'),
('고1 이차함수의 최댓값과 최솟값', '이차함수에서 최댓값과 최솟값을 구하는 다양한 방법을 학습합니다.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '고1', '함수');

-- 업데이트 시각 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();