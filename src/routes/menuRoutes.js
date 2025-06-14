const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// 메뉴 목록 조회
router.get('/', menuController.getAllMenus);

// 특정 메뉴 조회
router.get('/:menuId', menuController.getMenuById);

// 새 메뉴 생성
router.post('/', menuController.createMenu);

// 메뉴 수정
router.put('/:menuId', menuController.updateMenu);

// 메뉴 삭제
router.delete('/:menuId', menuController.deleteMenu);

module.exports = router; 