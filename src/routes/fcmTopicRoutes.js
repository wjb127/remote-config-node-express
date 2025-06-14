const express = require('express');
const router = express.Router();
const fcmTopicController = require('../controllers/fcmTopicController');

// 앱의 모든 FCM 토픽 조회
router.get('/apps/:appId/fcm-topics', fcmTopicController.getAllTopics);

// 특정 FCM 토픽 조회
router.get('/apps/:appId/fcm-topics/:id', fcmTopicController.getTopicById);

// 토픽 ID로 FCM 토픽 조회
router.get('/apps/:appId/fcm-topics/topic/:topicId', fcmTopicController.getTopicByTopicId);

// 새 FCM 토픽 생성
router.post('/apps/:appId/fcm-topics', fcmTopicController.createTopic);

// FCM 토픽 수정
router.put('/apps/:appId/fcm-topics/:id', fcmTopicController.updateTopic);

// FCM 토픽 삭제
router.delete('/apps/:appId/fcm-topics/:id', fcmTopicController.deleteTopic);

module.exports = router; 