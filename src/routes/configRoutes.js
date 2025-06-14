const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// 모바일 앱용 전체 설정 조회
router.get('/:appId', configController.getAppConfig);

module.exports = router; 