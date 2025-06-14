const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');
const ToolbarModel = require('../models/toolbarModel');
const FcmTopicModel = require('../models/fcmTopicModel');

const configController = {
  // 모바일 앱용 전체 설정 조회 (올바른 메서드명 사용)
  getAppConfig: async (req, res) => {
    try {
      console.log('Config API 호출됨 (올바른 메서드명 사용 버전)');
      
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

      // 메뉴 정보 조회 시도 (올바른 메서드명 사용)
      let menus = [];
      try {
        menus = await MenuModel.findAllByAppId(appId);
        console.log('메뉴 조회 성공:', menus.length, '개');
      } catch (menuError) {
        console.error('메뉴 조회 오류:', menuError);
        menus = [];
      }

      // 툴바 정보 조회 시도 (올바른 메서드명 확인 필요)
      let toolbars = [];
      try {
        toolbars = await ToolbarModel.findAllByAppId(appId);
        console.log('툴바 조회 성공:', toolbars.length, '개');
      } catch (toolbarError) {
        console.error('툴바 조회 오류:', toolbarError);
        toolbars = [];
      }

      // FCM 토픽 정보 조회 시도 (올바른 메서드명 확인 필요)
      let fcmTopics = [];
      try {
        fcmTopics = await FcmTopicModel.findAllByAppId(appId);
        console.log('FCM 토픽 조회 성공:', fcmTopics.length, '개');
      } catch (fcmError) {
        console.error('FCM 토픽 조회 오류:', fcmError);
        fcmTopics = [];
      }

      // 성공 응답
      const response = {
        message: "Config API 작동 중 - 올바른 메서드명으로 데이터 조회",
        timestamp: new Date().toISOString(),
        appId: appId,
        app: app,
        menus: menus,
        toolbars: toolbars,
        fcm_topics: fcmTopics
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