const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const menuRoutes = require('./menuRoutes');
const toolbarRoutes = require('./toolbarRoutes');
const fcmTopicRoutes = require('./fcmTopicRoutes');
const styleRoutes = require('./styleRoutes');

// 모든 앱 조회
router.get('/apps', appController.getAllApps);

// 앱 이름으로 조회
router.get('/apps/name/:name', appController.getAppByName);

// 앱 상태별 조회
router.get('/apps/status/:status', appController.getAppsByStatus);

// 앱 상세 정보 조회 (메뉴, 툴바, FCM 토픽, 스타일 포함)
router.get('/apps/:id/details', appController.getAppWithDetails);

// 특정 앱 조회 (ID)
router.get('/apps/:id', appController.getAppById);

// 새 앱 생성
router.post('/apps', appController.createApp);

// 앱 정보 업데이트
router.put('/apps/:id', appController.updateApp);

// 앱 삭제
router.delete('/apps/:id', appController.deleteApp);

// 메뉴 관련 라우트
router.use('/apps/:appId/menus', menuRoutes);

// 툴바 관련 라우트
router.use('/apps/:appId/toolbars', toolbarRoutes);

// FCM 토픽 관련 라우트
router.use('/apps/:appId/fcm-topics', fcmTopicRoutes);

// 스타일 관련 라우트
router.use('/apps/:appId/styles', styleRoutes);

module.exports = router; 