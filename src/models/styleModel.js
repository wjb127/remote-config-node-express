const pool = require('../config/database');

class StyleModel {
  // 앱 ID로 모든 스타일 조회
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.app_style 
      WHERE app_id = $1 
      ORDER BY style_key ASC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  // ID로 스타일 조회
  static async findById(id) {
    const query = 'SELECT * FROM public.app_style WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 스타일 키로 조회
  static async findByStyleKey(appId, styleKey) {
    const query = 'SELECT * FROM public.app_style WHERE app_id = $1 AND style_key = $2';
    const result = await pool.query(query, [appId, styleKey]);
    return result.rows[0];
  }

  // 새 스타일 생성
  static async create(styleData) {
    const {
      app_id,
      style_key,
      style_value,
      style_category,
      description
    } = styleData;

    const query = `
      INSERT INTO public.app_style (
        app_id, style_key, style_value, style_category, description
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      app_id, style_key, style_value,
      style_category, description
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 스타일 수정
  static async update(id, styleData) {
    const {
      style_value,
      style_category,
      description
    } = styleData;

    const query = `
      UPDATE public.app_style
      SET 
        style_value = COALESCE($1, style_value),
        style_category = COALESCE($2, style_category),
        description = COALESCE($3, description),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const values = [
      style_value, style_category,
      description, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 스타일 삭제
  static async delete(id) {
    const query = 'DELETE FROM public.app_style WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 스타일 카테고리 검증
  static validateStyleCategory(category) {
    const validCategories = ['color', 'layout', 'typography', 'spacing', 'animation'];
    return validCategories.includes(category);
  }
}

module.exports = StyleModel; 