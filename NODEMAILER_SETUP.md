# Nodemailer 이메일 전송 설정 가이드

Nodemailer를 사용하여 상담 신청 이메일을 받는 방법을 안내합니다.

## 1단계: Gmail 계정 준비

이메일을 **발신**하고 **수신**할 Gmail 계정이 필요합니다.

- 기존 Gmail 사용 가능
- 또는 새로운 Gmail 계정 생성 (예: mothermath.official@gmail.com)

---

## 2단계: Gmail 2단계 인증 활성화

1. **Google 계정 관리** 페이지로 이동
   - https://myaccount.google.com/ 접속

2. 왼쪽 메뉴에서 **"보안"** 클릭

3. **"2단계 인증"** 섹션 찾기

4. **"시작하기"** 클릭하여 2단계 인증 설정
   - 휴대폰 번호 인증 필요
   - 설정 완료 후 "사용 설정됨" 표시 확인

---

## 3단계: Gmail 앱 비밀번호 생성

**중요**: 일반 Gmail 비밀번호가 아니라 **앱 비밀번호**를 생성해야 합니다.

1. **Google 계정 관리** > **보안** 페이지

2. **"2단계 인증"** 섹션 아래에 **"앱 비밀번호"** 클릭
   - 찾을 수 없다면: https://myaccount.google.com/apppasswords 직접 접속

3. **앱 선택**: "메일" 선택

4. **기기 선택**: "기타(맞춤 이름)" 선택
   - 이름 입력: `마더수학 웹사이트`

5. **생성** 클릭

6. **16자리 앱 비밀번호** 표시됨
   - 예: `abcd efgh ijkl mnop`
   - 이 비밀번호를 복사하세요 (공백 포함/제외 모두 가능)
   - **주의**: 이 화면을 닫으면 다시 볼 수 없습니다!

---

## 4단계: .env.local 파일 수정

프로젝트 루트의 `.env.local` 파일을 열고 다음 값을 수정하세요:

```bash
# 발신자 Gmail 주소
EMAIL_USER=mothermath@gmail.com

# 위에서 생성한 16자리 앱 비밀번호 (공백 제거)
EMAIL_PASSWORD=abcdefghijklmnop

# 받을 이메일 주소 (발신자와 같아도 됨)
EMAIL_TO=mothermath@gmail.com
```

### 예시:
```bash
EMAIL_USER=mothermath.official@gmail.com
EMAIL_PASSWORD=xyzw1234abcd5678
EMAIL_TO=mothermath.official@gmail.com
```

---

## 5단계: 개발 서버 재시작

환경 변수를 변경했으므로 서버를 재시작해야 합니다:

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

---

## 6단계: 테스트

1. 브라우저에서 `http://localhost:3000/consultation` 접속

2. 상담 신청 폼 작성

3. **"상담 신청하기"** 버튼 클릭

4. Gmail 받은편지함 확인!
   - 제목: `마더수학 상담 신청 - [학생이름]`
   - 발신자: 본인의 Gmail 주소

---

## 문제 해결

### 이메일이 안 오면?

1. **스팸 폴더 확인**
   - Gmail 스팸함에 있을 수 있습니다

2. **브라우저 콘솔 확인**
   - F12 > Console 탭에서 에러 메시지 확인

3. **서버 로그 확인**
   - 터미널에서 에러 메시지 확인

4. **앱 비밀번호 재확인**
   - 공백 없이 16자리인지 확인
   - 대소문자 정확히 입력했는지 확인

### 자주 발생하는 에러

**"Invalid login"**
- 앱 비밀번호가 잘못되었습니다
- 앱 비밀번호를 다시 생성하세요

**"Less secure app access"**
- 2단계 인증이 활성화되지 않았습니다
- 2단계를 다시 설정하세요

**"Username and Password not accepted"**
- `EMAIL_USER`에 올바른 Gmail 주소를 입력했는지 확인
- 앱 비밀번호가 정확한지 확인

---

## 보안 주의사항

1. **.env.local 파일 보안**
   - 절대 Git에 커밋하지 마세요
   - `.gitignore`에 포함되어 있는지 확인

2. **앱 비밀번호 관리**
   - 안전한 곳에 보관하세요
   - 유출 시 즉시 삭제하고 재생성하세요

3. **배포 시**
   - Vercel, Netlify 등 호스팅 서비스의 환경 변수 설정에 추가하세요

---

## 완전 무료!

Nodemailer + Gmail은 **완전 무료**입니다. 제한 없이 사용 가능합니다.

---

## 추가 기능

현재 구현된 기능:
- ✅ 전화번호 자동 포맷팅
- ✅ 실시간 유효성 검사
- ✅ 에러 메시지 표시
- ✅ 로딩 상태 표시
- ✅ 이메일 전송
- ✅ 예쁜 HTML 이메일 템플릿

---

문제가 있으면 언제든 문의하세요! 🎉
