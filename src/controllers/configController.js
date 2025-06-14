const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');
const ToolbarModel = require('../models/toolbarModel');
const FcmTopicModel = require('../models/fcmTopicModel');
const StyleModel = require('../models/styleModel');

const configController = {
  // 모바일 앱용 전체 설정 조회 (완전한 버전 - 스타일 포함)
  getAppConfig: async (req, res) => {
    try {
      console.log('Config API 호출됨 (완전한 버전 - 스타일 포함)');
      
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
        menus = await MenuModel.findAllByAppId(appId);
        console.log('메뉴 조회 성공:', menus.length, '개');
      } catch (menuError) {
        console.error('메뉴 조회 오류:', menuError);
        menus = [];
      }

      // 툴바 정보 조회 시도
      let toolbars = [];
      try {
        toolbars = await ToolbarModel.findAllByAppId(appId);
        console.log('툴바 조회 성공:', toolbars.length, '개');
      } catch (toolbarError) {
        console.error('툴바 조회 오류:', toolbarError);
        toolbars = [];
      }

      // FCM 토픽 정보 조회 시도
      let fcmTopics = [];
      try {
        fcmTopics = await FcmTopicModel.findAllByAppId(appId);
        console.log('FCM 토픽 조회 성공:', fcmTopics.length, '개');
      } catch (fcmError) {
        console.error('FCM 토픽 조회 오류:', fcmError);
        fcmTopics = [];
      }

      // 스타일 정보 조회 시도
      let styles = [];
      try {
        styles = await StyleModel.findAllByAppId(appId);
        console.log('스타일 조회 성공:', styles.length, '개');
      } catch (styleError) {
        console.error('스타일 조회 오류:', styleError);
        styles = [];
      }

      // 완전한 설정 응답
      const response = {
        message: "Config API 완성 - 모든 설정 정보 포함",
        timestamp: new Date().toISOString(),
        appId: appId,
        app: app,
        menus: menus,
        toolbars: toolbars,
        fcm_topics: fcmTopics,
        styles: styles
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