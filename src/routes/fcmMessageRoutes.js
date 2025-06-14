const express = require('express');
const router = express.Router();
const {
  testFirebaseConnection,
  sendToTopic,
  sendToToken,
  sendToMultipleTopics,
  broadcastToApp,
  subscribe,
  unsubscribe
} = require('../controllers/fcmMessageController');

console.log('🚀 [FCM ROUTES] FCM 메시지 라우트 초기화 중...');

// Firebase 연결 테스트
router.get('/test', (req, res, next) => {
  console.log('🔥 [FCM ROUTES] GET /api/fcm/test 호출됨');
  testFirebaseConnection(req, res, next);
});

// 토픽으로 메시지 전송
router.post('/send-to-topic', (req, res, next) => {
  console.log('📤 [FCM ROUTES] POST /api/fcm/send-to-topic 호출됨');
  sendToTopic(req, res, next);
});

// 토큰으로 메시지 전송
router.post('/send-to-token', (req, res, next) => {
  console.log('📱 [FCM ROUTES] POST /api/fcm/send-to-token 호출됨');
  sendToToken(req, res, next);
});

// 다중 토픽으로 메시지 전송
router.post('/send-to-multiple-topics', (req, res, next) => {
  console.log('📡 [FCM ROUTES] POST /api/fcm/send-to-multiple-topics 호출됨');
  sendToMultipleTopics(req, res, next);
});

// 앱 브로드캐스트
router.post('/broadcast/:appId', (req, res, next) => {
  console.log('📢 [FCM ROUTES] POST /api/fcm/broadcast/:appId 호출됨, appId:', req.params.appId);
  broadcastToApp(req, res, next);
});

// 토픽 구독
router.post('/subscribe', (req, res, next) => {
  console.log('➕ [FCM ROUTES] POST /api/fcm/subscribe 호출됨');
  subscribe(req, res, next);
});

// 토픽 구독 해제
router.post('/unsubscribe', (req, res, next) => {
  console.log('➖ [FCM ROUTES] POST /api/fcm/unsubscribe 호출됨');
  unsubscribe(req, res, next);
});

console.log('✅ [FCM ROUTES] FCM 메시지 라우트 설정 완료');
console.log('📋 [FCM ROUTES] 등록된 라우트:');
console.log('   - GET  /api/fcm/test');
console.log('   - POST /api/fcm/send-to-topic');
console.log('   - POST /api/fcm/send-to-token');
console.log('   - POST /api/fcm/send-to-multiple-topics');
console.log('   - POST /api/fcm/broadcast/:appId');
console.log('   - POST /api/fcm/subscribe');
console.log('   - POST /api/fcm/unsubscribe');

module.exports = router; 