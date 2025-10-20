-- Supabase 데이터베이스 정리 SQL
-- consultations 테이블과 admin 관련 내용 제거

-- admins 테이블 삭제
DROP TABLE IF EXISTS admins CASCADE;

-- consultations 테이블 삭제
DROP TABLE IF EXISTS consultations CASCADE;

-- materials 테이블의 description 컬럼을 contents로 변경
ALTER TABLE materials 
RENAME COLUMN description TO contents;

-- 불필요한 정책들 제거 (consultations 관련)
-- 이미 테이블이 삭제되면서 관련 정책들도 자동으로 삭제됨

-- 확인용 쿼리
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';