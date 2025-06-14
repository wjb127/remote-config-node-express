const express = require('express');
const router = express.Router();
const styleController = require('../controllers/styleController');

// 앱의 모든 스타일 조회
router.get('/apps/:appId/styles', styleController.getAllStyles);

// 특정 스타일 조회
router.get('/apps/:appId/styles/:id', styleController.getStyleById);

// 스타일 키로 조회
router.get('/apps/:appId/styles/key/:styleKey', styleController.getStyleByKey);

// 새 스타일 생성
router.post('/apps/:appId/styles', styleController.createStyle);

// 스타일 수정
router.put('/apps/:appId/styles/:id', styleController.updateStyle);

// 스타일 삭제
router.delete('/apps/:appId/styles/:id', styleController.deleteStyle);

module.exports = router; 