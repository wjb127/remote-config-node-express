const firebaseService = require('../services/firebaseService');
const FcmTopicModel = require('../models/fcmTopicModel');
const App = require('../models/appModel');
const ApiResponse = require('../utils/api-response');

const fcmMessageController = {
  // 특정 토픽으로 메시지 발송
  sendToTopic: async (req, res) => {
    try {
      const { appId, topicId } = req.params;
      const { title, body, data } = req.body;

      // 필수 필드 검증
      if (!title || !body) {
        return ApiResponse.badRequest(res, 'title과 body는 필수입니다.');
      }

      // 앱 존재 확인
      const app = await App.findById(appId);
      if (!app) {
        return ApiResponse.notFound(res, 'App not found');
      }

      // 토픽 존재 및 활성화 상태 확인
      const topic = await FcmTopicModel.findByTopicId(appId, topicId);
      if (!topic) {
        return ApiResponse.notFound(res, 'Topic not found');
      }

      if (!topic.is_active) {
        return ApiResponse.badRequest(res, 'Topic is not active');
      }

      // Firebase로 메시지 발송
      const messageId = await firebaseService.sendToTopic(topicId, {
        title,
        body,
        data: data || {}
      });

      return ApiResponse.success(res, {
        messageId,
        topic: topic.topic_name,
        topicId,
        title,
        body,
        sentAt: new Date().toISOString()
      }, 'Message sent successfully');

    } catch (error) {
      console.error('FCM 메시지 발송 오류:', error);
      return ApiResponse.error(res, error.message);
    }
  },

  // 앱의 모든 활성 토픽으로 브로드캐스트
  broadcastToApp: async (req, res) => {
    try {
      const { appId } = req.params;
      const { title, body, data } = req.body;

      // 필수 필드 검증
      if (!title || !body) {
        return ApiResponse.badRequest(res, 'title과 body는 필수입니다.');
      }

      // 앱 존재 확인
      const app = await App.findById(appId);
      if (!app) {
        return ApiResponse.notFound(res, 'App not found');
      }

      // 앱의 모든 활성 토픽 조회
      const topics = await FcmTopicModel.findAllByAppId(appId);
      const activeTopics = topics.filter(topic => topic.is_active);

      if (activeTopics.length === 0) {
        return ApiResponse.badRequest(res, 'No active topics found for this app');
      }

      // 모든 활성 토픽으로 메시지 발송
      const topicIds = activeTopics.map(topic => topic.topic_id);
      const results = await firebaseService.sendToMultipleTopics(topicIds, {
        title,
        body,
        data: data || {}
      });

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;

      return ApiResponse.success(res, {
        app: app.app_name,
        totalTopics: activeTopics.length,
        successCount,
        failureCount,
        results,
        sentAt: new Date().toISOString()
      }, `Broadcast completed: ${successCount} success, ${failureCount} failed`);

    } catch (error) {
      console.error('FCM 브로드캐스트 오류:', error);
      return ApiResponse.error(res, error.message);
    }
  },

  // Firebase 연결 테스트
  testConnection: async (req, res) => {
    try {
      const isConnected = await firebaseService.testConnection();
      
      if (isConnected) {
        return ApiResponse.success(res, { connected: true }, 'Firebase connection successful');
      } else {
        return ApiResponse.error(res, 'Firebase connection failed');
      }
    } catch (error) {
      console.error('Firebase 연결 테스트 오류:', error);
      return ApiResponse.error(res, error.message);
    }
  }
};

module.exports = fcmMessageController; 