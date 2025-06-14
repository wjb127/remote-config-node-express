const express = require('express');
const router = express.Router();
const styleController = require('../controllers/styleController');

// 스타일 목록 조회
router.get('/', styleController.getAllStyles);

// 스타일 이름으로 조회
router.get('/name/:styleName', styleController.getStyleByName);

// 특정 스타일 조회
router.get('/:styleId', styleController.getStyleById);

// 새 스타일 생성
router.post('/', styleController.createStyle);

// 스타일 수정
router.put('/:styleId', styleController.updateStyle);

// 스타일 삭제
router.delete('/:styleId', styleController.deleteStyle);

module.exports = router; 