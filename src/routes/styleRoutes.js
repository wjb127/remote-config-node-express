const express = require('express');
const router = express.Router({ mergeParams: true });
const styleController = require('../controllers/styleController');

// 앱의 모든 스타일 조회
router.get('/', styleController.getAllStyles);

// 스타일 키로 조회
router.get('/key/:styleKey', styleController.getStyleByKey);

// 특정 스타일 조회
router.get('/:id', styleController.getStyleById);

// 새 스타일 생성
router.post('/', styleController.createStyle);

// 스타일 수정
router.put('/:id', styleController.updateStyle);

// 스타일 삭제
router.delete('/:id', styleController.deleteStyle);

module.exports = router; 