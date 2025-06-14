const pool = require('../config/database');

class ToolbarModel {
  // 앱 ID로 모든 툴바 조회
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.app_toolbar 
      WHERE app_id = $1 
      ORDER BY position ASC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  // ID로 툴바 조회
  static async findById(id) {
    const query = 'SELECT * FROM public.app_toolbar WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 새 툴바 생성
  static async create(toolbarData) {
    const {
      app_id,
      toolbar_id,
      title,
      position,
      background_color,
      text_color,
      height,
      is_visible,
      buttons
    } = toolbarData;

    const query = `
      INSERT INTO public.app_toolbar (
        app_id, toolbar_id, title, position, background_color,
        text_color, height, is_visible, buttons
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      app_id, toolbar_id, title, position, background_color,
      text_color, height, is_visible, buttons
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 툴바 수정
  static async update(id, toolbarData) {
    const {
      title,
      position,
      background_color,
      text_color,
      height,
      is_visible,
      buttons
    } = toolbarData;

    const query = `
      UPDATE public.app_toolbar
      SET 
        title = COALESCE($1, title),
        position = COALESCE($2, position),
        background_color = COALESCE($3, background_color),
        text_color = COALESCE($4, text_color),
        height = COALESCE($5, height),
        is_visible = COALESCE($6, is_visible),
        buttons = COALESCE($7, buttons),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      title, position, background_color,
      text_color, height, is_visible,
      buttons, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 툴바 삭제
  static async delete(id) {
    const query = 'DELETE FROM public.app_toolbar WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 툴바 타입 검증
  static validatePosition(position) {
    const validPositions = ['top', 'bottom', 'left', 'right'];
    return validPositions.includes(position);
  }
}

module.exports = ToolbarModel; 