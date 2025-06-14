const express = require('express');
const router = express.Router({ mergeParams: true });
const fcmTopicController = require('../controllers/fcmTopicController');

// 앱의 모든 FCM 토픽 조회
router.get('/', fcmTopicController.getAllTopics);

// 토픽 ID로 FCM 토픽 조회
router.get('/topic/:topicId', fcmTopicController.getTopicByTopicId);

// 특정 FCM 토픽 조회
router.get('/:id', fcmTopicController.getTopicById);

// 새 FCM 토픽 생성
router.post('/', fcmTopicController.createTopic);

// FCM 토픽 수정
router.put('/:id', fcmTopicController.updateTopic);

// FCM 토픽 삭제
router.delete('/:id', fcmTopicController.deleteTopic);

module.exports = router; 