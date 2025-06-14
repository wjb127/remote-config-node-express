const App = require('../models/appModel');
const ApiResponse = require('../utils/api-response');

const configController = {
  // 모바일 앱용 전체 설정 조회 (UUID만 지원, 간단 버전)
  getAppConfig: async (req, res) => {
    try {
      const { appId } = req.params;
      console.log('Config API 호출됨 (간단 버전):', appId);
      
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

      // 간단한 응답 - 앱 정보만 반환
      const config = {
        app: app,
        menus: [],
        toolbars: [],
        fcm_topics: [],
        styles: []
      };

      return ApiResponse.success(res, config, 'App configuration retrieved successfully');
      
    } catch (error) {
      console.error('Get app config error:', error);
      return ApiResponse.error(res, 'Internal server error');
    }
  }
};

module.exports = configController; 