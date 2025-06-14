const express = require('express');
const router = express.Router({ mergeParams: true });
const toolbarController = require('../controllers/toolbarController');

// 앱의 모든 툴바 조회
router.get('/', toolbarController.getAllToolbars);

// 특정 툴바 조회
router.get('/:id', toolbarController.getToolbarById);

// 새 툴바 생성
router.post('/', toolbarController.createToolbar);

// 툴바 수정
router.put('/:id', toolbarController.updateToolbar);

// 툴바 삭제
router.delete('/:id', toolbarController.deleteToolbar);

module.exports = router; 