const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
if (admin.apps.length === 0) {
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('Firebase Admin SDK 초기화 성공');
  } catch (error) {
    console.error('Firebase Admin SDK 초기화 실패:', error);
  }
}

class FirebaseService {
  // Firebase 연결 테스트 (간단한 버전)
  async testConnection() {
    try {
      if (admin.apps.length === 0) {
        return { success: false, message: 'Firebase가 초기화되지 않았습니다.' };
      }

      const app = admin.app();
      const projectId = app.options.projectId;
      
      if (projectId) {
        return { 
          success: true, 
          message: 'Firebase 연결 성공', 
          projectId: projectId 
        };
      } else {
        return { success: false, message: 'Firebase 프로젝트 ID를 찾을 수 없습니다.' };
      }
    } catch (error) {
      console.error('Firebase 연결 테스트 실패:', error);
      return { success: false, message: error.message };
    }
  }

  // 특정 토픽으로 메시지 전송
  async sendToTopic(topicName, title, body, data = {}) {
    try {
      if (admin.apps.length === 0) {
        throw new Error('Firebase가 초기화되지 않았습니다.');
      }

      const message = {
        notification: {
          title: title,
          body: body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        topic: topicName
      };

      const response = await admin.messaging().send(message);
      console.log('FCM 메시지 전송 성공:', response);
      
      return {
        success: true,
        messageId: response,
        topic: topicName,
        title: title,
        body: body
      };
    } catch (error) {
      console.error('FCM 메시지 전송 실패:', error);
      throw error;
    }
  }

  // 특정 토큰으로 메시지 전송
  async sendToToken(token, title, body, data = {}) {
    try {
      if (admin.apps.length === 0) {
        throw new Error('Firebase가 초기화되지 않았습니다.');
      }

      const message = {
        notification: {
          title: title,
          body: body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        token: token
      };

      const response = await admin.messaging().send(message);
      console.log('FCM 토큰 메시지 전송 성공:', response);
      
      return {
        success: true,
        messageId: response,
        token: token,
        title: title,
        body: body
      };
    } catch (error) {
      console.error('FCM 토큰 메시지 전송 실패:', error);
      throw error;
    }
  }

  // 여러 토픽으로 메시지 전송
  async sendToMultipleTopics(topics, title, body, data = {}) {
    try {
      const results = [];
      
      for (const topic of topics) {
        try {
          const result = await this.sendToTopic(topic, title, body, data);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            topic: topic,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('다중 토픽 메시지 전송 실패:', error);
      throw error;
    }
  }

  // 토픽 구독
  async subscribeToTopic(tokens, topicName) {
    try {
      if (admin.apps.length === 0) {
        throw new Error('Firebase가 초기화되지 않았습니다.');
      }

      const response = await admin.messaging().subscribeToTopic(tokens, topicName);
      console.log('토픽 구독 성공:', response);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        topic: topicName
      };
    } catch (error) {
      console.error('토픽 구독 실패:', error);
      throw error;
    }
  }

  // 토픽 구독 해제
  async unsubscribeFromTopic(tokens, topicName) {
    try {
      if (admin.apps.length === 0) {
        throw new Error('Firebase가 초기화되지 않았습니다.');
      }

      const response = await admin.messaging().unsubscribeFromTopic(tokens, topicName);
      console.log('토픽 구독 해제 성공:', response);
      
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        topic: topicName
      };
    } catch (error) {
      console.error('토픽 구독 해제 실패:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService(); 