const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

// 모든 앱 조회
router.get('/', appController.getAllApps);

// 특정 앱 조회
router.get('/:id', appController.getAppById);

// 새 앱 생성
router.post('/', appController.createApp);

// 앱 정보 업데이트
router.put('/:id', appController.updateApp);

// 앱 삭제
router.delete('/:id', appController.deleteApp);

module.exports = router; 