const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');
const ToolbarModel = require('../models/toolbarModel');
const FcmTopicModel = require('../models/fcmTopicModel');
const StyleModel = require('../models/styleModel');
const ApiResponse = require('../utils/api-response');

const configController = {
  // 모바일 앱용 전체 설정 조회 (UUID만 지원)
  getAppConfig: async (req, res) => {
    try {
      const { appId } = req.params;
      console.log('Config API 호출됨 (UUID):', appId);
      
      // UUID 형태인지 확인
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
      
      if (!isUUID) {
        return ApiResponse.badRequest(res, 'UUID 형태의 앱 ID만 지원합니다.');
      }
      
      // UUID로 앱 조회
      const app = await App.findById(appId);
      
      if (!app) {
        return ApiResponse.notFound(res, '앱을 찾을 수 없습니다.');
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