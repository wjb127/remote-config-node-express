# Remote Config Node Express

Remote Config 백엔드 서버 for Kotlin Apps

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 서버 실행
npm start
```

## API 엔드포인트

- GET /api/apps - 모든 앱 조회
- GET /api/apps/:id - 특정 앱 조회
- POST /api/apps - 새 앱 생성
- PUT /api/apps/:id - 앱 정보 업데이트
- DELETE /api/apps/:id - 앱 삭제

## 환경 변수 설정

`.env` 파일에 다음 환경 변수를 설정하세요:

```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/remote_config
NODE_ENV=development
``` 