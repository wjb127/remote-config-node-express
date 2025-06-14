const App = require('../models/appModel');

const configController = {
  // 모바일 앱용 전체 설정 조회 (가장 간단한 버전)
  getAppConfig: async (req, res) => {
    try {
      console.log('Config API 호출됨 (가장 간단한 버전)');
      
      // 하드코딩된 응답으로 시작
      const response = {
        message: "Config API 작동 중",
        timestamp: new Date().toISOString(),
        appId: req.params.appId
      };

      res.json(response);
      
    } catch (error) {
      console.error('Config API 오류:', error);
      res.status(500).json({ error: "서버 오류" });
    }
  }
};

module.exports = configController; 