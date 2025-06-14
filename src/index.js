require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const appRoutes = require('./routes/appRoutes');
const configRoutes = require('./routes/configRoutes');
const fcmMessageRoutes = require('./routes/fcmMessageRoutes');
const menuRoutes = require('./routes/menuRoutes');
const toolbarRoutes = require('./routes/toolbarRoutes');
const fcmTopicRoutes = require('./routes/fcmTopicRoutes');
const styleRoutes = require('./routes/styleRoutes');
const { testConnection } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// 데이터베이스 연결 테스트
testConnection().then(() => {
  console.log('Database connection test completed');
}).catch(error => {
  console.error('Database connection test failed:', error);
  process.exit(1);
});

// 라우트 설정
app.use('/api', appRoutes);
app.use('/api/config', configRoutes);
app.use('/api/fcm', fcmMessageRoutes);

console.log('🚀 [SERVER] 등록된 라우트:');
console.log('   - /api/* (앱 관련)');
console.log('   - /api/config/* (설정)');
console.log('   - /api/fcm/* (FCM 메시징)');

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Remote Config API is running' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
}); 