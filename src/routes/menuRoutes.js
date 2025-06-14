const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// 앱의 모든 메뉴 조회
router.get('/apps/:appId/menus', menuController.getAllMenus);

// 특정 메뉴 조회
router.get('/apps/:appId/menus/:id', menuController.getMenuById);

// 새 메뉴 생성
router.post('/apps/:appId/menus', menuController.createMenu);

// 메뉴 수정
router.put('/apps/:appId/menus/:id', menuController.updateMenu);

// 메뉴 삭제
router.delete('/apps/:appId/menus/:id', menuController.deleteMenu);

module.exports = router; 