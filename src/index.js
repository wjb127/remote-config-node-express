require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const appRoutes = require('./routes/appRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api/apps', appRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Remote Config API is running' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 