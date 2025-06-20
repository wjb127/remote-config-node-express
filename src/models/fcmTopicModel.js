const pool = require('../config/database');

class FcmTopicModel {
  // 앱 ID로 모든 FCM 토픽 조회
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.app_fcm_topic 
      WHERE app_id = $1 
      ORDER BY topic_name ASC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  // ID로 FCM 토픽 조회
  static async findById(id) {
    const query = 'SELECT * FROM public.app_fcm_topic WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 토픽 ID로 FCM 토픽 조회
  static async findByTopicId(appId, topicId) {
    const query = 'SELECT * FROM public.app_fcm_topic WHERE app_id = $1 AND topic_id = $2';
    const result = await pool.query(query, [appId, topicId]);
    return result.rows[0];
  }

  // 새 FCM 토픽 생성
  static async create(topicData) {
    const {
      app_id,
      topic_name,
      topic_id,
      description,
      is_default,
      is_active
    } = topicData;

    const query = `
      INSERT INTO public.app_fcm_topic (
        app_id, topic_name, topic_id, description,
        is_default, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      app_id, topic_name, topic_id, description,
      is_default, is_active
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // FCM 토픽 수정
  static async update(id, topicData) {
    const {
      topic_name,
      description,
      is_default,
      is_active
    } = topicData;

    const query = `
      UPDATE public.app_fcm_topic
      SET 
        topic_name = COALESCE($1, topic_name),
        description = COALESCE($2, description),
        is_default = COALESCE($3, is_default),
        is_active = COALESCE($4, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [
      topic_name, description,
      is_default, is_active, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // FCM 토픽 삭제
  static async delete(id) {
    const query = 'DELETE FROM public.app_fcm_topic WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 토픽 이름 유효성 검사
  static validateTopicName(topicName) {
    // FCM 토픽 이름 규칙:
    // - 알파벳, 숫자, 하이픈(-), 언더스코어(_), 퍼센트(%)만 사용 가능
    // - 대소문자 구분
    // - 최대 255자
    const topicNameRegex = /^[a-zA-Z0-9\-_%]{1,255}$/;
    return topicNameRegex.test(topicName);
  }
}

module.exports = FcmTopicModel; 