const express = require('express');
const router = express.Router();

console.log('🚀 [FCM ROUTES] FCM 메시지 라우트 초기화 중...');

// Firebase 연결 테스트 (간단한 하드코딩 버전)
router.get('/test', (req, res) => {
  console.log('🔥 [FCM ROUTES] GET /api/fcm/test 호출됨');
  
  res.status(200).json({
    success: true,
    message: 'FCM 라우트가 정상적으로 작동합니다!',
    timestamp: new Date().toISOString(),
    route: '/api/fcm/test'
  });
  
  console.log('🔥 [FCM ROUTES] 테스트 응답 전송 완료');
});

// 토픽으로 메시지 전송 (간단한 테스트 버전)
router.post('/send-to-topic', (req, res) => {
  console.log('📤 [FCM ROUTES] POST /api/fcm/send-to-topic 호출됨');
  console.log('📤 [FCM ROUTES] 요청 Body:', req.body);
  
  res.status(200).json({
    success: true,
    message: '토픽 메시지 전송 테스트 (하드코딩)',
    timestamp: new Date().toISOString(),
    receivedData: req.body
  });
});

// 토큰으로 메시지 전송 (간단한 테스트 버전)
router.post('/send-to-token', (req, res) => {
  console.log('📱 [FCM ROUTES] POST /api/fcm/send-to-token 호출됨');
  console.log('📱 [FCM ROUTES] 요청 Body:', req.body);
  
  res.status(200).json({
    success: true,
    message: '토큰 메시지 전송 테스트 (하드코딩)',
    timestamp: new Date().toISOString(),
    receivedData: req.body
  });
});

// 다중 토픽으로 메시지 전송
router.post('/send-to-multiple-topics', (req, res) => {
  console.log('📡 [FCM ROUTES] POST /api/fcm/send-to-multiple-topics 호출됨');
  
  res.status(200).json({
    success: true,
    message: '다중 토픽 메시지 전송 테스트 (하드코딩)',
    timestamp: new Date().toISOString()
  });
});

// 앱 브로드캐스트
router.post('/broadcast/:appId', (req, res) => {
  console.log('📢 [FCM ROUTES] POST /api/fcm/broadcast/:appId 호출됨, appId:', req.params.appId);
  
  res.status(200).json({
    success: true,
    message: '앱 브로드캐스트 테스트 (하드코딩)',
    appId: req.params.appId,
    timestamp: new Date().toISOString()
  });
});

// 토픽 구독
router.post('/subscribe', (req, res) => {
  console.log('➕ [FCM ROUTES] POST /api/fcm/subscribe 호출됨');
  
  res.status(200).json({
    success: true,
    message: '토픽 구독 테스트 (하드코딩)',
    timestamp: new Date().toISOString()
  });
});

// 토픽 구독 해제
router.post('/unsubscribe', (req, res) => {
  console.log('➖ [FCM ROUTES] POST /api/fcm/unsubscribe 호출됨');
  
  res.status(200).json({
    success: true,
    message: '토픽 구독 해제 테스트 (하드코딩)',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ [FCM ROUTES] FCM 메시지 라우트 설정 완료 (테스트 버전)');
console.log('📋 [FCM ROUTES] 등록된 라우트:');
console.log('   - GET  /api/fcm/test');
console.log('   - POST /api/fcm/send-to-topic');
console.log('   - POST /api/fcm/send-to-token');
console.log('   - POST /api/fcm/send-to-multiple-topics');
console.log('   - POST /api/fcm/broadcast/:appId');
console.log('   - POST /api/fcm/subscribe');
console.log('   - POST /api/fcm/unsubscribe');

module.exports = router; 