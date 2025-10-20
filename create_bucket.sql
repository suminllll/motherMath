-- Supabase Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- 버킷 정책 설정 (모든 사용자가 읽기 가능, 인증된 사용자가 업로드 가능)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');