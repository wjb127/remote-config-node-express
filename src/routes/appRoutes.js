const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

// 모든 앱 조회
router.get('/', appController.getAllApps);

// 앱 이름으로 조회
router.get('/name/:name', appController.getAppByName);

// 앱 상태별 조회
router.get('/status/:status', appController.getAppsByStatus);

// 앱 상세 정보 조회 (메뉴, 툴바, FCM 토픽, 스타일 포함)
router.get('/:id/details', appController.getAppWithDetails);

// 특정 앱 조회 (ID)
router.get('/:id', appController.getAppById);

// 새 앱 생성
router.post('/', appController.createApp);

// 앱 정보 업데이트
router.put('/:id', appController.updateApp);

// 앱 삭제
router.delete('/:id', appController.deleteApp);

module.exports = router; 