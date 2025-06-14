const express = require('express');
const router = express.Router();
const toolbarController = require('../controllers/toolbarController');

// 앱의 모든 툴바 조회
router.get('/apps/:appId/toolbars', toolbarController.getAllToolbars);

// 특정 툴바 조회
router.get('/apps/:appId/toolbars/:id', toolbarController.getToolbarById);

// 새 툴바 생성
router.post('/apps/:appId/toolbars', toolbarController.createToolbar);

// 툴바 수정
router.put('/apps/:appId/toolbars/:id', toolbarController.updateToolbar);

// 툴바 삭제
router.delete('/apps/:appId/toolbars/:id', toolbarController.deleteToolbar);

module.exports = router; 