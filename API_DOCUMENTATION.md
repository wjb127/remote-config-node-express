# Remote Config API 문서

## 기본 URL
```
https://remote-config-node-express.onrender.com/api
```

## 앱 관리 API

### 1. 모든 앱 조회
```http
GET /apps
```

### 2. 앱 이름으로 조회
```http
GET /apps/name/:name
```

### 3. 앱 상태별 조회
```http
GET /apps/status/:status
```
- `status`: active, inactive, maintenance

### 4. 앱 상세 정보 조회
```http
GET /apps/:id/details
```

### 5. 특정 앱 조회
```http
GET /apps/:id
```

### 6. 새 앱 생성
```http
POST /apps
Content-Type: application/json

{
  "app_name": "MyApp",
  "app_id": "com.example.myapp",
  "package_name": "com.example.myapp",
  "version": "1.0.0",
  "description": "앱 설명",
  "status": "active"
}
```

### 7. 앱 정보 업데이트
```http
PUT /apps/:id
Content-Type: application/json

{
  "app_name": "MyApp Updated",
  "version": "1.0.1",
  "description": "업데이트된 앱 설명",
  "status": "active"
}
```

### 8. 앱 삭제
```http
DELETE /apps/:id
```

## 메뉴 관리 API

### 1. 메뉴 목록 조회
```http
GET /apps/:appId/menus
```

### 2. 특정 메뉴 조회
```http
GET /apps/:appId/menus/:menuId
```

### 3. 새 메뉴 생성
```http
POST /apps/:appId/menus
Content-Type: application/json

{
  "menu_type": "item",
  "title": "홈",
  "icon": "home",
  "order_index": 1,
  "action_type": "navigate",
  "action_value": "/home",
  "is_visible": true,
  "parent_id": null
}
```

### 4. 메뉴 수정
```http
PUT /apps/:appId/menus/:menuId
Content-Type: application/json

{
  "title": "홈 화면",
  "icon": "house",
  "order_index": 2,
  "is_visible": true
}
```

### 5. 메뉴 삭제
```http
DELETE /apps/:appId/menus/:menuId
```

## 툴바 관리 API

### 1. 툴바 목록 조회
```http
GET /apps/:appId/toolbars
```

### 2. 특정 툴바 조회
```http
GET /apps/:appId/toolbars/:toolbarId
```

### 3. 새 툴바 생성
```http
POST /apps/:appId/toolbars
Content-Type: application/json

{
  "toolbar_type": "item",
  "title": "새로고침",
  "icon": "refresh",
  "order_index": 1,
  "action_type": "api_call",
  "action_value": "/api/refresh",
  "is_visible": true
}
```

### 4. 툴바 수정
```http
PUT /apps/:appId/toolbars/:toolbarId
Content-Type: application/json

{
  "title": "새로고침 버튼",
  "icon": "sync",
  "order_index": 2,
  "is_visible": true
}
```

### 5. 툴바 삭제
```http
DELETE /apps/:appId/toolbars/:toolbarId
```

## FCM 토픽 관리 API

### 1. FCM 토픽 목록 조회
```http
GET /apps/:appId/fcm-topics
```

### 2. 토픽 이름으로 조회
```http
GET /apps/:appId/fcm-topics/name/:topicName
```

### 3. 특정 FCM 토픽 조회
```http
GET /apps/:appId/fcm-topics/:topicId
```

### 4. 새 FCM 토픽 생성
```http
POST /apps/:appId/fcm-topics
Content-Type: application/json

{
  "topic_name": "news_updates",
  "description": "뉴스 업데이트 알림",
  "is_active": true
}
```

### 5. FCM 토픽 수정
```http
PUT /apps/:appId/fcm-topics/:topicId
Content-Type: application/json

{
  "topic_name": "news_updates_v2",
  "description": "뉴스 업데이트 알림 V2",
  "is_active": true
}
```

### 6. FCM 토픽 삭제
```http
DELETE /apps/:appId/fcm-topics/:topicId
```

## 스타일 관리 API

### 1. 스타일 목록 조회
```http
GET /apps/:appId/styles
```

### 2. 스타일 이름으로 조회
```http
GET /apps/:appId/styles/name/:styleName
```

### 3. 특정 스타일 조회
```http
GET /apps/:appId/styles/:styleId
```

### 4. 새 스타일 생성
```http
POST /apps/:appId/styles
Content-Type: application/json

{
  "style_name": "primary_button",
  "style_type": "color",
  "style_value": "#007AFF",
  "description": "기본 버튼 색상",
  "is_active": true
}
```

### 5. 스타일 수정
```http
PUT /apps/:appId/styles/:styleId
Content-Type: application/json

{
  "style_name": "primary_button_v2",
  "style_value": "#0066CC",
  "description": "업데이트된 기본 버튼 색상",
  "is_active": true
}
```

### 6. 스타일 삭제
```http
DELETE /apps/:appId/styles/:styleId
```

## 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "성공 메시지",
  "data": {
    // 응답 데이터
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "error": {
    "code": "에러 코드",
    "details": "상세 에러 정보"
  }
}
```

## 스타일 타입별 값 형식

### 1. color
```json
"#007AFF"
```

### 2. font
```json
"Noto Sans KR"
```

### 3. size
```json
24
```

### 4. spacing
```json
{
  "margin": 16,
  "padding": 12
}
```

### 5. border
```json
{
  "width": 1,
  "style": "solid",
  "color": "#E5E5EA"
}
```

### 6. shadow
```json
{
  "offsetX": 0,
  "offsetY": 2,
  "blur": 4,
  "color": "#000000"
}
```

### 7. animation
```json
{
  "duration": 300,
  "timing": "ease-in-out"
}
``` 