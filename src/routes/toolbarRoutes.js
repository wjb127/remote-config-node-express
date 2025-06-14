const express = require('express');
const router = express.Router();
const toolbarController = require('../controllers/toolbarController');

// 툴바 목록 조회
router.get('/', toolbarController.getAllToolbars);

// 특정 툴바 조회
router.get('/:toolbarId', toolbarController.getToolbarById);

// 새 툴바 생성
router.post('/', toolbarController.createToolbar);

// 툴바 수정
router.put('/:toolbarId', toolbarController.updateToolbar);

// 툴바 삭제
router.delete('/:toolbarId', toolbarController.deleteToolbar);

module.exports = router; 