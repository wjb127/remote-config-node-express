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
      
      // 앱 정보 조회
      const app = await App.findByAppId(appId);
      if (!app) {
        return ApiResponse.notFound(res, 'App not found');
      }

      // 모든 관련 데이터 병렬 조회
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