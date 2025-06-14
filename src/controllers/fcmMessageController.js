const firebaseService = require('../services/firebaseService');
const ApiResponse = require('../utils/api-response');

const fcmMessageController = {
  // Firebase 연결 테스트
  testConnection: async (req, res) => {
    try {
      console.log('FCM 연결 테스트 요청');
      const result = await firebaseService.testConnection();
      
      if (result.success) {
        return ApiResponse.success(res, result, 'Firebase 연결 테스트 성공');
      } else {
        return ApiResponse.error(res, result.message, 500);
      }
    } catch (error) {
      console.error('FCM 연결 테스트 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 특정 토픽으로 메시지 전송
  sendToTopic: async (req, res) => {
    try {
      const { topic, title, body, data } = req.body;

      // 필수 필드 검증
      if (!topic || !title || !body) {
        return ApiResponse.badRequest(res, 'topic, title, body는 필수 필드입니다.');
      }

      console.log('FCM 토픽 메시지 전송:', { topic, title, body });
      
      const result = await firebaseService.sendToTopic(topic, title, body, data || {});
      
      return ApiResponse.success(res, result, 'FCM 메시지 전송 성공');
    } catch (error) {
      console.error('FCM 토픽 메시지 전송 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 특정 토큰으로 메시지 전송
  sendToToken: async (req, res) => {
    try {
      const { token, title, body, data } = req.body;

      // 필수 필드 검증
      if (!token || !title || !body) {
        return ApiResponse.badRequest(res, 'token, title, body는 필수 필드입니다.');
      }

      console.log('FCM 토큰 메시지 전송:', { token, title, body });
      
      const result = await firebaseService.sendToToken(token, title, body, data || {});
      
      return ApiResponse.success(res, result, 'FCM 토큰 메시지 전송 성공');
    } catch (error) {
      console.error('FCM 토큰 메시지 전송 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 여러 토픽으로 메시지 전송
  sendToMultipleTopics: async (req, res) => {
    try {
      const { topics, title, body, data } = req.body;

      // 필수 필드 검증
      if (!topics || !Array.isArray(topics) || topics.length === 0 || !title || !body) {
        return ApiResponse.badRequest(res, 'topics(배열), title, body는 필수 필드입니다.');
      }

      console.log('FCM 다중 토픽 메시지 전송:', { topics, title, body });
      
      const results = await firebaseService.sendToMultipleTopics(topics, title, body, data || {});
      
      return ApiResponse.success(res, results, 'FCM 다중 토픽 메시지 전송 완료');
    } catch (error) {
      console.error('FCM 다중 토픽 메시지 전송 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 앱의 모든 토픽으로 메시지 전송 (브로드캐스트)
  broadcastToApp: async (req, res) => {
    try {
      const { appId } = req.params;
      const { title, body, data } = req.body;

      // 필수 필드 검증
      if (!title || !body) {
        return ApiResponse.badRequest(res, 'title, body는 필수 필드입니다.');
      }

      // 앱의 모든 활성 토픽 조회 (실제로는 DB에서 조회)
      const activeTopics = [
        'general_notifications',
        'app_updates',
        `app_${appId}_notifications`
      ];

      console.log('FCM 앱 브로드캐스트:', { appId, topics: activeTopics, title, body });
      
      const results = await firebaseService.sendToMultipleTopics(activeTopics, title, body, data || {});
      
      return ApiResponse.success(res, {
        appId,
        results,
        totalTopics: activeTopics.length,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length
      }, 'FCM 앱 브로드캐스트 완료');
    } catch (error) {
      console.error('FCM 앱 브로드캐스트 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 토픽 구독
  subscribeToTopic: async (req, res) => {
    try {
      const { tokens, topic } = req.body;

      // 필수 필드 검증
      if (!tokens || !Array.isArray(tokens) || tokens.length === 0 || !topic) {
        return ApiResponse.badRequest(res, 'tokens(배열), topic은 필수 필드입니다.');
      }

      console.log('FCM 토픽 구독:', { tokens: tokens.length, topic });
      
      const result = await firebaseService.subscribeToTopic(tokens, topic);
      
      return ApiResponse.success(res, result, 'FCM 토픽 구독 성공');
    } catch (error) {
      console.error('FCM 토픽 구독 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  },

  // 토픽 구독 해제
  unsubscribeFromTopic: async (req, res) => {
    try {
      const { tokens, topic } = req.body;

      // 필수 필드 검증
      if (!tokens || !Array.isArray(tokens) || tokens.length === 0 || !topic) {
        return ApiResponse.badRequest(res, 'tokens(배열), topic은 필수 필드입니다.');
      }

      console.log('FCM 토픽 구독 해제:', { tokens: tokens.length, topic });
      
      const result = await firebaseService.unsubscribeFromTopic(tokens, topic);
      
      return ApiResponse.success(res, result, 'FCM 토픽 구독 해제 성공');
    } catch (error) {
      console.error('FCM 토픽 구독 해제 오류:', error);
      return ApiResponse.error(res, error.message, 500);
    }
  }
};

module.exports = fcmMessageController; 