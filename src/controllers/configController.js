const App = require('../models/appModel');

const configController = {
  // 모바일 앱용 전체 설정 조회 (UUID만 지원, 최소 버전)
  getAppConfig: async (req, res) => {
    try {
      const { appId } = req.params;
      console.log('Config API 호출됨 (최소 버전):', appId);
      
      // UUID 형태인지 확인
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
      
      if (!isUUID) {
        return res.status(400).json({ message: 'UUID 형태의 앱 ID만 지원합니다.' });
      }
      
      // UUID로 앱 조회 (getAppById와 동일한 방식)
      const app = await App.findById(appId);
      
      if (!app) {
        return res.status(404).json({ message: 'App not found' });
      }

      // 앱 정보만 반환 (getAppById와 동일)
      res.json(app);
      
    } catch (error) {
      console.error('Get app config error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = configController; 