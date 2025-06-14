const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.initializeFirebase();
  }

  initializeFirebase() {
    try {
      // Firebase가 이미 초기화되었는지 확인
      if (admin.apps.length === 0) {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        };

        // 필수 환경변수 확인
        if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
          throw new Error('Firebase 환경변수가 설정되지 않았습니다.');
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.projectId
        });

        console.log('Firebase Admin SDK 초기화 완료');
      }
    } catch (error) {
      console.error('Firebase 초기화 오류:', error.message);
      throw error;
    }
  }

  // 토픽으로 메시지 발송
  async sendToTopic(topicId, message) {
    try {
      const payload = {
        notification: {
          title: message.title,
          body: message.body
        },
        data: message.data || {},
        topic: topicId
      };

      const result = await admin.messaging().send(payload);
      console.log('메시지 발송 성공:', result);
      return result;
    } catch (error) {
      console.error('메시지 발송 실패:', error);
      throw error;
    }
  }

  // 여러 토픽으로 메시지 발송
  async sendToMultipleTopics(topicIds, message) {
    try {
      const results = [];
      
      for (const topicId of topicIds) {
        try {
          const result = await this.sendToTopic(topicId, message);
          results.push({ topicId, success: true, messageId: result });
        } catch (error) {
          results.push({ topicId, success: false, error: error.message });
        }
      }

      return results;
    } catch (error) {
      console.error('다중 토픽 메시지 발송 실패:', error);
      throw error;
    }
  }

  // 특정 토큰으로 메시지 발송
  async sendToToken(token, message) {
    try {
      const payload = {
        notification: {
          title: message.title,
          body: message.body
        },
        data: message.data || {},
        token: token
      };

      const result = await admin.messaging().send(payload);
      console.log('토큰 메시지 발송 성공:', result);
      return result;
    } catch (error) {
      console.error('토큰 메시지 발송 실패:', error);
      throw error;
    }
  }

  // 토픽 구독
  async subscribeToTopic(tokens, topicId) {
    try {
      const result = await admin.messaging().subscribeToTopic(tokens, topicId);
      console.log('토픽 구독 성공:', result);
      return result;
    } catch (error) {
      console.error('토픽 구독 실패:', error);
      throw error;
    }
  }

  // 토픽 구독 해제
  async unsubscribeFromTopic(tokens, topicId) {
    try {
      const result = await admin.messaging().unsubscribeFromTopic(tokens, topicId);
      console.log('토픽 구독 해제 성공:', result);
      return result;
    } catch (error) {
      console.error('토픽 구독 해제 실패:', error);
      throw error;
    }
  }

  // Firebase 연결 테스트
  async testConnection() {
    try {
      // 간단한 테스트 메시지 생성 (실제로는 발송하지 않음)
      const testPayload = {
        notification: {
          title: 'Test',
          body: 'Firebase 연결 테스트'
        },
        topic: 'test-topic'
      };

      // 메시지 유효성만 검증 (dry_run: true)
      await admin.messaging().send(testPayload, true);
      console.log('Firebase 연결 테스트 성공');
      return true;
    } catch (error) {
      console.error('Firebase 연결 테스트 실패:', error);
      return false;
    }
  }
}

// 싱글톤 패턴으로 인스턴스 생성
const firebaseService = new FirebaseService();

module.exports = firebaseService; 