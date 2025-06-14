const FcmTopicModel = require('../models/fcmTopicModel');
const ApiResponse = require('../utils/api-response');

// 모든 FCM 토픽 조회
exports.getAllTopics = async (req, res) => {
  try {
    const { appId } = req.params;
    const topics = await FcmTopicModel.findAllByAppId(appId);
    return ApiResponse.success(res, topics);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 특정 FCM 토픽 조회
exports.getTopicById = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await FcmTopicModel.findById(topicId);
    
    if (!topic) {
      return ApiResponse.notFound(res, 'FCM 토픽을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, topic);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 토픽 이름으로 조회
exports.getTopicByName = async (req, res) => {
  try {
    const { appId } = req.params;
    const { topicName } = req.params;
    const topic = await FcmTopicModel.findByTopicName(appId, topicName);
    
    if (!topic) {
      return ApiResponse.notFound(res, 'FCM 토픽을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, topic);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 새 FCM 토픽 생성
exports.createTopic = async (req, res) => {
  try {
    const { appId } = req.params;
    const topicData = { ...req.body, app_id: appId };

    // 필수 필드 검증
    const requiredFields = ['topic_name'];
    for (const field of requiredFields) {
      if (!topicData[field]) {
        return ApiResponse.badRequest(res, `${field}는 필수 항목입니다.`);
      }
    }

    // 토픽 이름 유효성 검사
    if (!FcmTopicModel.validateTopicName(topicData.topic_name)) {
      return ApiResponse.badRequest(res, '유효하지 않은 토픽 이름입니다.');
    }

    // 토픽 이름 중복 검사
    const existingTopic = await FcmTopicModel.findByTopicName(appId, topicData.topic_name);
    if (existingTopic) {
      return ApiResponse.badRequest(res, '이미 존재하는 토픽 이름입니다.');
    }

    const topic = await FcmTopicModel.create(topicData);
    return ApiResponse.success(res, topic, 'FCM 토픽이 생성되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// FCM 토픽 수정
exports.updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topicData = req.body;

    // 토픽 이름 유효성 검사
    if (topicData.topic_name && !FcmTopicModel.validateTopicName(topicData.topic_name)) {
      return ApiResponse.badRequest(res, '유효하지 않은 토픽 이름입니다.');
    }

    // 토픽 이름 중복 검사
    if (topicData.topic_name) {
      const existingTopic = await FcmTopicModel.findByTopicName(req.params.appId, topicData.topic_name);
      if (existingTopic && existingTopic.id !== parseInt(topicId)) {
        return ApiResponse.badRequest(res, '이미 존재하는 토픽 이름입니다.');
      }
    }

    const topic = await FcmTopicModel.update(topicId, topicData);
    
    if (!topic) {
      return ApiResponse.notFound(res, 'FCM 토픽을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, topic, 'FCM 토픽이 수정되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// FCM 토픽 삭제
exports.deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await FcmTopicModel.delete(topicId);
    
    if (!topic) {
      return ApiResponse.notFound(res, 'FCM 토픽을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, topic, 'FCM 토픽이 삭제되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
}; 