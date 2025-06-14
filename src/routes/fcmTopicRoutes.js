const express = require('express');
const router = express.Router();
const fcmTopicController = require('../controllers/fcmTopicController');

// FCM 토픽 목록 조회
router.get('/', fcmTopicController.getAllTopics);

// 토픽 이름으로 조회
router.get('/name/:topicName', fcmTopicController.getTopicByName);

// 특정 FCM 토픽 조회
router.get('/:topicId', fcmTopicController.getTopicById);

// 새 FCM 토픽 생성
router.post('/', fcmTopicController.createTopic);

// FCM 토픽 수정
router.put('/:topicId', fcmTopicController.updateTopic);

// FCM 토픽 삭제
router.delete('/:topicId', fcmTopicController.deleteTopic);

module.exports = router; 