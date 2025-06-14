const express = require('express');
const router = express.Router({ mergeParams: true });
const menuController = require('../controllers/menuController');

// 앱의 모든 메뉴 조회
router.get('/', menuController.getAllMenus);

// 특정 메뉴 조회
router.get('/:id', menuController.getMenuById);

// 새 메뉴 생성
router.post('/', menuController.createMenu);

// 메뉴 수정
router.put('/:id', menuController.updateMenu);

// 메뉴 삭제
router.delete('/:id', menuController.deleteMenu);

module.exports = router; 