-- 관리자 테이블 및 관련 요소 삭제
-- Supabase SQL Editor에서 실행하세요

-- 트리거 삭제
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;

-- 정책 삭제
DROP POLICY IF EXISTS "Allow service role full access to admins" ON admins;

-- 테이블 삭제
DROP TABLE IF EXISTS admins;

-- 확인
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admins';