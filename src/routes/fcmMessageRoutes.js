const express = require('express');
const router = express.Router();
const fcmMessageController = require('../controllers/fcmMessageController');

// Firebase 연결 테스트
router.get('/fcm/test', fcmMessageController.testConnection);

// 특정 토픽으로 메시지 전송
router.post('/fcm/send-to-topic', fcmMessageController.sendToTopic);

// 특정 토큰으로 메시지 전송
router.post('/fcm/send-to-token', fcmMessageController.sendToToken);

// 여러 토픽으로 메시지 전송
router.post('/fcm/send-to-multiple-topics', fcmMessageController.sendToMultipleTopics);

// 앱의 모든 토픽으로 브로드캐스트
router.post('/fcm/broadcast/:appId', fcmMessageController.broadcastToApp);

// 토픽 구독
router.post('/fcm/subscribe', fcmMessageController.subscribeToTopic);

// 토픽 구독 해제
router.post('/fcm/unsubscribe', fcmMessageController.unsubscribeFromTopic);

module.exports = router; 