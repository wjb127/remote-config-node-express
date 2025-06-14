const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');

const configController = {
  // 모바일 앱용 전체 설정 조회 (메뉴 정보 추가)
  getAppConfig: async (req, res) => {
    try {
      console.log('Config API 호출됨 (메뉴 정보 추가 버전)');
      
      const { appId } = req.params;
      
      // UUID 형태인지 확인
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
      
      if (!isUUID) {
        return res.json({
          message: "UUID 형태가 아닙니다",
          timestamp: new Date().toISOString(),
          appId: appId
        });
      }
      
      // 앱 정보 조회 시도
      const app = await App.findById(appId);
      
      if (!app) {
        return res.json({
          message: "앱을 찾을 수 없습니다",
          timestamp: new Date().toISOString(),
          appId: appId
        });
      }

      // 메뉴 정보 조회 시도
      let menus = [];
      try {
        menus = await MenuModel.findByAppId(appId);
        console.log('메뉴 조회 성공:', menus.length, '개');
      } catch (menuError) {
        console.error('메뉴 조회 오류:', menuError);
        menus = [];
      }

      // 성공 응답
      const response = {
        message: "Config API 작동 중 - 앱 정보 + 메뉴 정보 포함",
        timestamp: new Date().toISOString(),
        appId: appId,
        app: app,
        menus: menus
      };

      res.json(response);
      
    } catch (error) {
      console.error('Config API 오류:', error);
      res.json({
        message: "서버 오류 발생",
        error: error.message,
        timestamp: new Date().toISOString(),
        appId: req.params.appId
      });
    }
  }
};

module.exports = configController; 