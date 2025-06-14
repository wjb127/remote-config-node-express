const admin = require('firebase-admin');

console.log('🔥 [FIREBASE SERVICE] Firebase Admin SDK 초기화 시작...');

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  console.log('🔥 [FIREBASE SERVICE] 새로운 Firebase 앱 초기화 중...');
  
  try {
    // 환경변수에서 Firebase 설정 읽기
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    console.log('🔥 [FIREBASE SERVICE] 서비스 계정 정보:');
    console.log('   - project_id:', serviceAccount.project_id);
    console.log('   - client_email:', serviceAccount.client_email);
    console.log('   - private_key 존재:', !!serviceAccount.private_key);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log('✅ [FIREBASE SERVICE] Firebase Admin SDK 초기화 성공');
    
  } catch (error) {
    console.error('❌ [FIREBASE SERVICE] Firebase Admin SDK 초기화 실패:', error);
    throw error;
  }
} else {
  console.log('🔥 [FIREBASE SERVICE] 기존 Firebase 앱 사용');
}

// FCM 메시징 인스턴스
const messaging = admin.messaging();
console.log('📱 [FIREBASE SERVICE] FCM 메시징 인스턴스 생성 완료');

// 토픽으로 메시지 전송
const sendMessageToTopic = async (topic, title, body, data = {}) => {
  console.log('📤 [FIREBASE SERVICE] sendMessageToTopic 시작');
  console.log('📤 [FIREBASE SERVICE] 파라미터:', { topic, title, body, data });
  
  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      topic: topic
    };

    // 추가 데이터가 있으면 포함
    if (data && Object.keys(data).length > 0) {
      message.data = data;
      console.log('📤 [FIREBASE SERVICE] 추가 데이터 포함:', data);
    }

    console.log('📤 [FIREBASE SERVICE] 전송할 메시지:', JSON.stringify(message, null, 2));
    console.log('📤 [FIREBASE SERVICE] Firebase Admin SDK로 메시지 전송 중...');
    
    const response = await messaging.send(message);
    
    console.log('✅ [FIREBASE SERVICE] 토픽 메시지 전송 성공');
    console.log('📤 [FIREBASE SERVICE] Firebase 응답 ID:', response);
    
    return response;
    
  } catch (error) {
    console.error('❌ [FIREBASE SERVICE] 토픽 메시지 전송 실패:', error);
    console.error('❌ [FIREBASE SERVICE] 에러 코드:', error.code);
    console.error('❌ [FIREBASE SERVICE] 에러 메시지:', error.message);
    console.error('❌ [FIREBASE SERVICE] 에러 스택:', error.stack);
    throw error;
  }
};

// 토큰으로 메시지 전송
const sendMessageToToken = async (token, title, body, data = {}) => {
  console.log('📱 [FIREBASE SERVICE] sendMessageToToken 시작');
  console.log('📱 [FIREBASE SERVICE] 파라미터:', { 
    token: token ? `${token.substring(0, 20)}...` : 'null', 
    title, 
    body, 
    data 
  });
  
  try {
    const message = {
      notification: {
        title: title,
        body: body
      },
      token: token
    };

    // 추가 데이터가 있으면 포함
    if (data && Object.keys(data).length > 0) {
      message.data = data;
      console.log('📱 [FIREBASE SERVICE] 추가 데이터 포함:', data);
    }

    console.log('📱 [FIREBASE SERVICE] 전송할 메시지 구조 생성 완료');
    console.log('📱 [FIREBASE SERVICE] Firebase Admin SDK로 메시지 전송 중...');
    
    const response = await messaging.send(message);
    
    console.log('✅ [FIREBASE SERVICE] 토큰 메시지 전송 성공');
    console.log('📱 [FIREBASE SERVICE] Firebase 응답 ID:', response);
    
    return response;
    
  } catch (error) {
    console.error('❌ [FIREBASE SERVICE] 토큰 메시지 전송 실패:', error);
    console.error('❌ [FIREBASE SERVICE] 에러 코드:', error.code);
    console.error('❌ [FIREBASE SERVICE] 에러 메시지:', error.message);
    console.error('❌ [FIREBASE SERVICE] 에러 스택:', error.stack);
    throw error;
  }
};

// 토픽 구독
const subscribeToTopic = async (token, topic) => {
  console.log('➕ [FIREBASE SERVICE] subscribeToTopic 시작');
  console.log('➕ [FIREBASE SERVICE] 파라미터:', { 
    token: token ? `${token.substring(0, 20)}...` : 'null', 
    topic 
  });
  
  try {
    console.log('➕ [FIREBASE SERVICE] Firebase Admin SDK로 토픽 구독 중...');
    
    const response = await messaging.subscribeToTopic([token], topic);
    
    console.log('✅ [FIREBASE SERVICE] 토픽 구독 성공');
    console.log('➕ [FIREBASE SERVICE] Firebase 응답:', response);
    console.log('➕ [FIREBASE SERVICE] 성공 수:', response.successCount);
    console.log('➕ [FIREBASE SERVICE] 실패 수:', response.failureCount);
    
    return response;
    
  } catch (error) {
    console.error('❌ [FIREBASE SERVICE] 토픽 구독 실패:', error);
    console.error('❌ [FIREBASE SERVICE] 에러 코드:', error.code);
    console.error('❌ [FIREBASE SERVICE] 에러 메시지:', error.message);
    console.error('❌ [FIREBASE SERVICE] 에러 스택:', error.stack);
    throw error;
  }
};

// 토픽 구독 해제
const unsubscribeFromTopic = async (token, topic) => {
  console.log('➖ [FIREBASE SERVICE] unsubscribeFromTopic 시작');
  console.log('➖ [FIREBASE SERVICE] 파라미터:', { 
    token: token ? `${token.substring(0, 20)}...` : 'null', 
    topic 
  });
  
  try {
    console.log('➖ [FIREBASE SERVICE] Firebase Admin SDK로 토픽 구독 해제 중...');
    
    const response = await messaging.unsubscribeFromTopic([token], topic);
    
    console.log('✅ [FIREBASE SERVICE] 토픽 구독 해제 성공');
    console.log('➖ [FIREBASE SERVICE] Firebase 응답:', response);
    console.log('➖ [FIREBASE SERVICE] 성공 수:', response.successCount);
    console.log('➖ [FIREBASE SERVICE] 실패 수:', response.failureCount);
    
    return response;
    
  } catch (error) {
    console.error('❌ [FIREBASE SERVICE] 토픽 구독 해제 실패:', error);
    console.error('❌ [FIREBASE SERVICE] 에러 코드:', error.code);
    console.error('❌ [FIREBASE SERVICE] 에러 메시지:', error.message);
    console.error('❌ [FIREBASE SERVICE] 에러 스택:', error.stack);
    throw error;
  }
};

console.log('✅ [FIREBASE SERVICE] Firebase 서비스 모듈 로드 완료');
console.log('📋 [FIREBASE SERVICE] 사용 가능한 메서드:');
console.log('   - sendMessageToTopic');
console.log('   - sendMessageToToken');
console.log('   - subscribeToTopic');
console.log('   - unsubscribeFromTopic');

module.exports = {
  sendMessageToTopic,
  sendMessageToToken,
  subscribeToTopic,
  unsubscribeFromTopic,
  admin
}; 