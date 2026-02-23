# motherMath

수학 교육/학원 사이트를 가정한 웹 프로젝트입니다.  
사용자에게는 상담 신청 흐름을 제공하고, 운영 측면에서는 콘텐츠 관리/작성 흐름을 염두에 두고 UI를 구성했습니다.

- Demo: https://www.mothermath.com

## 핵심 기능

- **학원 소개** - 학원 비전, 교육 철학, 내부 시설, 위치(지도) 안내
- **상담 예약** - 카카오톡 채널 / 전화 상담 연결
- **강의 영상** - 학년별(초등·중등·고등) 필터링 유튜브 강의 제공
- **교육 칼럼** - 교육 자료 게시판 (제목·내용 검색 기능)
- **학생 변화 기록** - 성적 향상 사례 갤러리 (학년별 필터링, 이미지 다중 첨부)
- **관리자 대시보드** - 콘텐츠(칼럼·강의·학생기록) CRUD 관리, Rich Text Editor(react-quill) 기반 콘텐츠 작성


## 기술 스택
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Vercel 
- Database: Supabase (PostgreSQL + Storage)

## 로컬 실행
```
npm install
npm run dev
```
