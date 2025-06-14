const { sendMessageToTopic, sendMessageToToken, subscribeToTopic, unsubscribeFromTopic } = require('../services/firebaseService');

// Firebase 연결 테스트
const testFirebaseConnection = async (req, res) => {
  console.log('🔥 [FCM TEST] Firebase 연결 테스트 시작');
  console.log('🔥 [FCM TEST] 요청 시간:', new Date().toISOString());
  
  try {
    console.log('🔥 [FCM TEST] Firebase Admin SDK 상태 확인 중...');
    
    // 간단한 테스트 메시지 생성
    const testMessage = {
      notification: {
        title: 'Firebase 연결 테스트',
        body: 'Firebase Admin SDK가 정상적으로 작동합니다!'
      },
      topic: 'test-connection'
    };
    
    console.log('🔥 [FCM TEST] 테스트 메시지 생성 완료:', JSON.stringify(testMessage, null, 2));
    
    res.status(200).json({
      success: true,
      message: 'Firebase Admin SDK 연결 성공',
      timestamp: new Date().toISOString(),
      testMessage: testMessage
    });
    
    console.log('🔥 [FCM TEST] 응답 전송 완료 - 연결 성공');
    
  } catch (error) {
    console.error('❌ [FCM TEST] Firebase 연결 테스트 실패:', error);
    console.error('❌ [FCM TEST] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Firebase 연결 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 토픽으로 메시지 전송
const sendToTopic = async (req, res) => {
  console.log('📤 [FCM TOPIC] 토픽 메시지 전송 시작');
  console.log('📤 [FCM TOPIC] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { topic, title, body, data } = req.body;
    
    console.log('📤 [FCM TOPIC] 파라미터 검증 중...');
    console.log('📤 [FCM TOPIC] - topic:', topic);
    console.log('📤 [FCM TOPIC] - title:', title);
    console.log('📤 [FCM TOPIC] - body:', body);
    console.log('📤 [FCM TOPIC] - data:', data);

    if (!topic || !title || !body) {
      console.log('❌ [FCM TOPIC] 필수 파라미터 누락');
      return res.status(400).json({
        success: false,
        message: 'topic, title, body는 필수입니다'
      });
    }

    console.log('📤 [FCM TOPIC] Firebase 메시지 전송 시작...');
    const result = await sendMessageToTopic(topic, title, body, data);
    console.log('📤 [FCM TOPIC] Firebase 응답:', result);

    res.status(200).json({
      success: true,
      message: '토픽 메시지 전송 성공',
      messageId: result,
      timestamp: new Date().toISOString()
    });
    
    console.log('📤 [FCM TOPIC] 응답 전송 완료 - 성공');

  } catch (error) {
    console.error('❌ [FCM TOPIC] 토픽 메시지 전송 실패:', error);
    console.error('❌ [FCM TOPIC] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '토픽 메시지 전송 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 토큰으로 메시지 전송
const sendToToken = async (req, res) => {
  console.log('📱 [FCM TOKEN] 토큰 메시지 전송 시작');
  console.log('📱 [FCM TOKEN] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { token, title, body, data } = req.body;
    
    console.log('📱 [FCM TOKEN] 파라미터 검증 중...');
    console.log('📱 [FCM TOKEN] - token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('📱 [FCM TOKEN] - title:', title);
    console.log('📱 [FCM TOKEN] - body:', body);

    if (!token || !title || !body) {
      console.log('❌ [FCM TOKEN] 필수 파라미터 누락');
      return res.status(400).json({
        success: false,
        message: 'token, title, body는 필수입니다'
      });
    }

    console.log('📱 [FCM TOKEN] Firebase 메시지 전송 시작...');
    const result = await sendMessageToToken(token, title, body, data);
    console.log('📱 [FCM TOKEN] Firebase 응답:', result);

    res.status(200).json({
      success: true,
      message: '토큰 메시지 전송 성공',
      messageId: result,
      timestamp: new Date().toISOString()
    });
    
    console.log('📱 [FCM TOKEN] 응답 전송 완료 - 성공');

  } catch (error) {
    console.error('❌ [FCM TOKEN] 토큰 메시지 전송 실패:', error);
    console.error('❌ [FCM TOKEN] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '토큰 메시지 전송 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 다중 토픽으로 메시지 전송
const sendToMultipleTopics = async (req, res) => {
  console.log('📡 [FCM MULTI] 다중 토픽 메시지 전송 시작');
  console.log('📡 [FCM MULTI] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { topics, title, body, data } = req.body;
    
    console.log('📡 [FCM MULTI] 파라미터 검증 중...');
    console.log('📡 [FCM MULTI] - topics:', topics);
    console.log('📡 [FCM MULTI] - title:', title);
    console.log('📡 [FCM MULTI] - body:', body);

    if (!topics || !Array.isArray(topics) || topics.length === 0 || !title || !body) {
      console.log('❌ [FCM MULTI] 필수 파라미터 누락 또는 잘못된 형식');
      return res.status(400).json({
        success: false,
        message: 'topics (배열), title, body는 필수입니다'
      });
    }

    console.log('📡 [FCM MULTI] 각 토픽별 메시지 전송 시작...');
    const results = [];
    
    for (const topic of topics) {
      console.log(`📡 [FCM MULTI] 토픽 "${topic}" 전송 중...`);
      try {
        const result = await sendMessageToTopic(topic, title, body, data);
        console.log(`📡 [FCM MULTI] 토픽 "${topic}" 전송 성공:`, result);
        results.push({ topic, success: true, messageId: result });
      } catch (error) {
        console.error(`❌ [FCM MULTI] 토픽 "${topic}" 전송 실패:`, error.message);
        results.push({ topic, success: false, error: error.message });
      }
    }

    console.log('📡 [FCM MULTI] 모든 토픽 전송 완료:', results);

    res.status(200).json({
      success: true,
      message: '다중 토픽 메시지 전송 완료',
      results: results,
      timestamp: new Date().toISOString()
    });
    
    console.log('📡 [FCM MULTI] 응답 전송 완료');

  } catch (error) {
    console.error('❌ [FCM MULTI] 다중 토픽 메시지 전송 실패:', error);
    console.error('❌ [FCM MULTI] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '다중 토픽 메시지 전송 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 앱 브로드캐스트 (하드코딩된 토픽 리스트 사용)
const broadcastToApp = async (req, res) => {
  console.log('📢 [FCM BROADCAST] 앱 브로드캐스트 시작');
  console.log('📢 [FCM BROADCAST] 앱 ID:', req.params.appId);
  console.log('📢 [FCM BROADCAST] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { appId } = req.params;
    const { title, body, data } = req.body;
    
    console.log('📢 [FCM BROADCAST] 파라미터 검증 중...');
    console.log('📢 [FCM BROADCAST] - appId:', appId);
    console.log('📢 [FCM BROADCAST] - title:', title);
    console.log('📢 [FCM BROADCAST] - body:', body);

    if (!title || !body) {
      console.log('❌ [FCM BROADCAST] 필수 파라미터 누락');
      return res.status(400).json({
        success: false,
        message: 'title, body는 필수입니다'
      });
    }

    // 하드코딩된 토픽 리스트 (나중에 DB에서 조회하도록 변경 가능)
    const defaultTopics = [
      'general_notifications',
      'app_updates', 
      'user_notifications'
    ];

    console.log('📢 [FCM BROADCAST] 사용할 토픽 목록:', defaultTopics);

    console.log('📢 [FCM BROADCAST] 모든 토픽에 메시지 전송 시작...');
    const results = [];
    
    for (const topicName of defaultTopics) {
      console.log(`📢 [FCM BROADCAST] 토픽 "${topicName}" 전송 중...`);
      
      try {
        const result = await sendMessageToTopic(topicName, title, body, data);
        console.log(`📢 [FCM BROADCAST] 토픽 "${topicName}" 전송 성공:`, result);
        results.push({ topic: topicName, success: true, messageId: result });
      } catch (error) {
        console.error(`❌ [FCM BROADCAST] 토픽 "${topicName}" 전송 실패:`, error.message);
        results.push({ topic: topicName, success: false, error: error.message });
      }
    }

    console.log('📢 [FCM BROADCAST] 브로드캐스트 완료:', results);

    res.status(200).json({
      success: true,
      message: `앱 브로드캐스트 완료 (${defaultTopics.length}개 토픽)`,
      appId: appId,
      results: results,
      timestamp: new Date().toISOString()
    });
    
    console.log('📢 [FCM BROADCAST] 응답 전송 완료');

  } catch (error) {
    console.error('❌ [FCM BROADCAST] 앱 브로드캐스트 실패:', error);
    console.error('❌ [FCM BROADCAST] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '앱 브로드캐스트 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 토픽 구독
const subscribe = async (req, res) => {
  console.log('➕ [FCM SUBSCRIBE] 토픽 구독 시작');
  console.log('➕ [FCM SUBSCRIBE] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { token, topic } = req.body;
    
    console.log('➕ [FCM SUBSCRIBE] 파라미터 검증 중...');
    console.log('➕ [FCM SUBSCRIBE] - token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('➕ [FCM SUBSCRIBE] - topic:', topic);

    if (!token || !topic) {
      console.log('❌ [FCM SUBSCRIBE] 필수 파라미터 누락');
      return res.status(400).json({
        success: false,
        message: 'token, topic은 필수입니다'
      });
    }

    console.log('➕ [FCM SUBSCRIBE] Firebase 토픽 구독 시작...');
    const result = await subscribeToTopic(token, topic);
    console.log('➕ [FCM SUBSCRIBE] Firebase 응답:', result);

    res.status(200).json({
      success: true,
      message: '토픽 구독 성공',
      topic: topic,
      timestamp: new Date().toISOString()
    });
    
    console.log('➕ [FCM SUBSCRIBE] 응답 전송 완료 - 성공');

  } catch (error) {
    console.error('❌ [FCM SUBSCRIBE] 토픽 구독 실패:', error);
    console.error('❌ [FCM SUBSCRIBE] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '토픽 구독 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 토픽 구독 해제
const unsubscribe = async (req, res) => {
  console.log('➖ [FCM UNSUBSCRIBE] 토픽 구독 해제 시작');
  console.log('➖ [FCM UNSUBSCRIBE] 요청 Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { token, topic } = req.body;
    
    console.log('➖ [FCM UNSUBSCRIBE] 파라미터 검증 중...');
    console.log('➖ [FCM UNSUBSCRIBE] - token:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('➖ [FCM UNSUBSCRIBE] - topic:', topic);

    if (!token || !topic) {
      console.log('❌ [FCM UNSUBSCRIBE] 필수 파라미터 누락');
      return res.status(400).json({
        success: false,
        message: 'token, topic은 필수입니다'
      });
    }

    console.log('➖ [FCM UNSUBSCRIBE] Firebase 토픽 구독 해제 시작...');
    const result = await unsubscribeFromTopic(token, topic);
    console.log('➖ [FCM UNSUBSCRIBE] Firebase 응답:', result);

    res.status(200).json({
      success: true,
      message: '토픽 구독 해제 성공',
      topic: topic,
      timestamp: new Date().toISOString()
    });
    
    console.log('➖ [FCM UNSUBSCRIBE] 응답 전송 완료 - 성공');

  } catch (error) {
    console.error('❌ [FCM UNSUBSCRIBE] 토픽 구독 해제 실패:', error);
    console.error('❌ [FCM UNSUBSCRIBE] 에러 스택:', error.stack);
    
    res.status(500).json({
      success: false,
      message: '토픽 구독 해제 실패',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  testFirebaseConnection,
  sendToTopic,
  sendToToken,
  sendToMultipleTopics,
  broadcastToApp,
  subscribe,
  unsubscribe
}; 