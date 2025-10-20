# Supabase 데이터베이스 정리 명령어

다음 SQL 명령어들을 Supabase 대시보드의 SQL Editor에서 실행하세요:

## 1. admins 테이블 삭제
```sql
DROP TABLE IF EXISTS admins CASCADE;
```

## 2. consultations 테이블 삭제
```sql
DROP TABLE IF EXISTS consultations CASCADE;
```

## 3. materials 테이블의 description 컬럼을 contents로 변경
```sql
ALTER TABLE materials 
RENAME COLUMN description TO contents;
```

## 4. 테이블 목록 확인
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

## 5. materials 테이블 구조 확인
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'materials' 
AND table_schema = 'public';
```

---

### 실행 순서:
1. Supabase 대시보드 → SQL Editor 이동
2. 위의 SQL 명령어들을 하나씩 복사해서 실행
3. 각 명령어 실행 후 결과 확인
4. 마지막에 테이블 목록과 materials 구조 확인

### 예상 결과:
- `materials` 테이블만 남아있어야 함
- `lectures` 테이블만 남아있어야 함
- materials 테이블에 `contents` 컬럼이 있어야 함