const db = require('../config/database');

class App {
  static async findAll() {
    const query = 'SELECT * FROM apps ORDER BY created_at DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM apps WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByAppId(appId) {
    const query = 'SELECT * FROM apps WHERE app_id = $1';
    const result = await db.query(query, [appId]);
    return result.rows[0];
  }

  static async create(appData) {
    const { app_name, app_id, package_name, version, description, status } = appData;
    const query = `
      INSERT INTO apps (app_name, app_id, package_name, version, description, status)
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
      UPDATE apps
      SET app_name = $1, app_id = $2, package_name = $3, version = $4, description = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [app_name, app_id, package_name, version, description, status, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM apps WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = App; 