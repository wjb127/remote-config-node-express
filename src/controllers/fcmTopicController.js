const FcmTopicModel = require('../models/fcmTopicModel');
const ApiResponse = require('../utils/api-response');

const fcmTopicController = {
  async getAllTopics(req, res) {
    try {
      const { appId } = req.params;
      const topics = await FcmTopicModel.findAllByAppId(appId);
      res.json(ApiResponse.success(topics));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getTopicById(req, res) {
    try {
      const { id } = req.params;
      const topic = await FcmTopicModel.findById(id);
      
      if (!topic) {
        return res.status(404).json(ApiResponse.notFound('FCM 토픽을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(topic));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getTopicByTopicId(req, res) {
    try {
      const { appId, topicId } = req.params;
      const topic = await FcmTopicModel.findByTopicId(appId, topicId);
      
      if (!topic) {
        return res.status(404).json(ApiResponse.notFound('FCM 토픽을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(topic));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async createTopic(req, res) {
    try {
      const { appId } = req.params;
      const topicData = { ...req.body, app_id: appId };

      // 필수 필드 검증
      const requiredFields = ['topic_name', 'topic_id'];
      const missingFields = requiredFields.filter(field => !topicData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json(
          ApiResponse.badRequest(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`)
        );
      }

      const topic = await FcmTopicModel.create(topicData);
      res.status(201).json(ApiResponse.success(topic, 'FCM 토픽이 생성되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async updateTopic(req, res) {
    try {
      const { id } = req.params;
      const topicData = req.body;

      const topic = await FcmTopicModel.update(id, topicData);
      
      if (!topic) {
        return res.status(404).json(ApiResponse.notFound('FCM 토픽을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(topic, 'FCM 토픽이 업데이트되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async deleteTopic(req, res) {
    try {
      const { id } = req.params;
      const topic = await FcmTopicModel.delete(id);
      
      if (!topic) {
        return res.status(404).json(ApiResponse.notFound('FCM 토픽을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(topic, 'FCM 토픽이 삭제되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  }
};

module.exports = fcmTopicController; 