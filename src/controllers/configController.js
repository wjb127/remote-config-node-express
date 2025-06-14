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
      console.log('Config API 호출됨:', appId);
      
      // 앱 정보 조회 - UUID 형태인지 app_id 형태인지 확인
      let app;
      
      // UUID 형태인지 확인 (36자리, 하이픈 포함)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(appId);
      console.log('UUID 형태인가?', isUUID);
      
      if (isUUID) {
        // UUID로 검색
        console.log('UUID로 앱 검색 중...');
        app = await App.findById(appId);
      } else {
        // app_id로 검색
        console.log('app_id로 앱 검색 중...');
        app = await App.findByAppId(appId);
      }
      
      console.log('앱 조회 결과:', app ? '찾음' : '없음');
      
      if (!app) {
        console.log('앱을 찾을 수 없습니다.');
        return ApiResponse.notFound(res, '앱을 찾을 수 없습니다.');
      }

      console.log('관련 데이터 조회 시작...');
      
      // 타임아웃 설정으로 각 쿼리 제한
      const timeout = (ms) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), ms)
      );

      try {
        // 모든 관련 데이터 병렬 조회 (app.id 사용) - 3초 타임아웃
        const [menus, toolbars, fcmTopics, styles] = await Promise.race([
          Promise.all([
            MenuModel.findAllByAppId(app.id),
            ToolbarModel.findAllByAppId(app.id),
            FcmTopicModel.findAllByAppId(app.id),
            StyleModel.findAllByAppId(app.id)
          ]),
          timeout(3000)
        ]);

        console.log('데이터 조회 완료');

        const config = {
          app: app,
          menus: menus || [],
          toolbars: toolbars || [],
          fcm_topics: fcmTopics || [],
          styles: styles || []
        };

        console.log('Config API 응답 준비 완료');
        return ApiResponse.success(res, config, 'App configuration retrieved successfully');
        
      } catch (queryError) {
        console.error('데이터 조회 중 오류:', queryError.message);
        
        // 타임아웃이나 쿼리 오류 시 앱 정보만 반환
        const config = {
          app: app,
          menus: [],
          toolbars: [],
          fcm_topics: [],
          styles: []
        };
        
        return ApiResponse.success(res, config, 'App configuration retrieved (partial data due to timeout)');
      }
      
    } catch (error) {
      console.error('Get app config error:', error);
      return ApiResponse.error(res, error.message);
    }
  }
};

module.exports = configController; 