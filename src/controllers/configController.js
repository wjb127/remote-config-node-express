const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');
const ToolbarModel = require('../models/toolbarModel');
const FcmTopicModel = require('../models/fcmTopicModel');
const StyleModel = require('../models/styleModel');
const ApiResponse = require('../utils/api-response');

const configController = {
  // 모바일 앱용 전체 설정 조회
  getAppConfig: async (req, res) => {
    try {
      const { appId } = req.params;
      
      // 앱 정보 조회 - UUID 형태인지 app_id 형태인지 확인
      let app;
      
      // UUID 형태인지 확인 (36자리, 하이픈 포함)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
      
      if (isUUID) {
        // UUID로 검색
        app = await App.findById(appId);
      } else {
        // app_id로 검색
        app = await App.findByAppId(appId);
      }
      
      if (!app) {
        return ApiResponse.notFound(res, 'App not found');
      }

      // 모든 관련 데이터 병렬 조회 (app.id 사용)
      const [menus, toolbars, fcmTopics, styles] = await Promise.all([
        MenuModel.findAllByAppId(app.id),
        ToolbarModel.findAllByAppId(app.id),
        FcmTopicModel.findAllByAppId(app.id),
        StyleModel.findAllByAppId(app.id)
      ]);

      const config = {
        app: app,
        menus: menus || [],
        toolbars: toolbars || [],
        fcm_topics: fcmTopics || [],
        styles: styles || []
      };

      return ApiResponse.success(res, config, 'App configuration retrieved successfully');
    } catch (error) {
      console.error('Get app config error:', error);
      return ApiResponse.error(res, error.message);
    }
  }
};

module.exports = configController; 