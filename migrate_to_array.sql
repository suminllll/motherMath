-- lectures 테이블의 grade를 배열 타입으로 변경
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 데이터 백업 (선택사항)
-- SELECT * FROM lectures;

-- 2. grade 컬럼을 TEXT[] 배열로 변경
-- 기존 데이터를 배열로 변환
ALTER TABLE lectures
ALTER COLUMN grade TYPE TEXT[]
USING ARRAY[grade];

-- 3. 인덱스 재생성 (GIN 인덱스는 배열 검색에 효율적)
DROP INDEX IF EXISTS idx_lectures_grade;

CREATE INDEX idx_lectures_grade ON lectures USING GIN (grade);

-- 4. 확인
-- SELECT id, title, grade FROM lectures;
