const pool = require('../config/database');

class ToolbarModel {
  // 앱 ID로 모든 툴바 조회
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.toolbar 
      WHERE app_id = $1 
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  // ID로 툴바 조회
  static async findById(id) {
    const query = 'SELECT * FROM public.toolbar WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 새 툴바 생성
  static async create(toolbarData) {
    const {
      app_id,
      toolbar_type,
      title,
      icon,
      order_index,
      action_type,
      action_value,
      is_visible
    } = toolbarData;

    const query = `
      INSERT INTO public.toolbar (
        app_id, toolbar_type, title, icon, order_index, 
        action_type, action_value, is_visible
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      app_id, toolbar_type, title, icon, order_index,
      action_type, action_value, is_visible
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 툴바 수정
  static async update(id, toolbarData) {
    const {
      toolbar_type,
      title,
      icon,
      order_index,
      action_type,
      action_value,
      is_visible
    } = toolbarData;

    const query = `
      UPDATE public.toolbar
      SET 
        toolbar_type = COALESCE($1, toolbar_type),
        title = COALESCE($2, title),
        icon = COALESCE($3, icon),
        order_index = COALESCE($4, order_index),
        action_type = COALESCE($5, action_type),
        action_value = COALESCE($6, action_value),
        is_visible = COALESCE($7, is_visible),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [
      toolbar_type, title, icon, order_index,
      action_type, action_value, is_visible, id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 툴바 삭제
  static async delete(id) {
    const query = 'DELETE FROM public.toolbar WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 툴바 타입 검증
  static validateToolbarType(toolbarType) {
    const validTypes = ['item', 'category', 'divider'];
    return validTypes.includes(toolbarType);
  }

  // 액션 타입 검증
  static validateActionType(actionType) {
    const validTypes = ['navigate', 'external_link', 'api_call'];
    return validTypes.includes(actionType);
  }
}

module.exports = ToolbarModel; 