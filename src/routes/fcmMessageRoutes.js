const express = require('express');
const router = express.Router();
const fcmMessageController = require('../controllers/fcmMessageController');

// Firebase 연결 테스트
router.get('/fcm/test', fcmMessageController.testConnection);

// 특정 토픽으로 메시지 발송
router.post('/apps/:appId/fcm/send/:topicId', fcmMessageController.sendToTopic);

// 앱의 모든 활성 토픽으로 브로드캐스트
router.post('/apps/:appId/fcm/broadcast', fcmMessageController.broadcastToApp);

module.exports = router; 