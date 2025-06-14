const db = require('../config/database');

class App {
  static async findAll() {
    const query = 'SELECT * FROM app ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM app WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByAppName(appName) {
    const query = 'SELECT * FROM app WHERE app_name ILIKE $1';
    const result = await db.query(query, [`%${appName}%`]);
    return result.rows;
  }

  static async findByAppId(appId) {
    const query = 'SELECT * FROM app WHERE app_id = $1';
    const result = await db.query(query, [appId]);
    return result.rows[0];
  }

  static async create(appData) {
    const { app_name, app_id, package_name, version, description, status } = appData;
    const query = `
      INSERT INTO app (app_name, app_id, package_name, version, description, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [app_name, app_id, package_name, version, description, status];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async update(id, appData) {
    const { app_name, app_id, package_name, version, description, status } = appData;
    const query = `
      UPDATE app
      SET app_name = $1, 
          app_id = $2, 
          package_name = $3, 
          version = $4, 
          description = $5, 
          status = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [app_name, app_id, package_name, version, description, status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM app WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // 앱의 모든 관련 데이터 조회 (메뉴, 툴바, FCM 토픽, 스타일)
  static async findAppWithDetails(id) {
    const query = `
      SELECT 
        a.*,
        json_agg(DISTINCT m.*) FILTER (WHERE m.id IS NOT NULL) as menus,
        json_agg(DISTINCT t.*) FILTER (WHERE t.id IS NOT NULL) as toolbars,
        json_agg(DISTINCT f.*) FILTER (WHERE f.id IS NOT NULL) as fcm_topics,
        json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL) as styles
      FROM app a
      LEFT JOIN menu m ON m.app_id = a.id
      LEFT JOIN app_toolbar t ON t.app_id = a.id
      LEFT JOIN app_fcm_topic f ON f.app_id = a.id
      LEFT JOIN app_style s ON s.app_id = a.id
      WHERE a.id = $1
      GROUP BY a.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // 앱 상태별 조회
  static async findByStatus(status) {
    const query = 'SELECT * FROM app WHERE status = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [status]);
    return result.rows;
  }
}

module.exports = App; 