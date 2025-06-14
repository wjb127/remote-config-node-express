const pool = require('../config/database');

class StyleModel {
  // 앱 ID로 모든 스타일 조회
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.style 
      WHERE app_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  // ID로 스타일 조회
  static async findById(id) {
    const query = 'SELECT * FROM public.style WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 스타일 이름으로 조회
  static async findByStyleName(appId, styleName) {
    const query = 'SELECT * FROM public.style WHERE app_id = $1 AND style_name = $2';
    const result = await pool.query(query, [appId, styleName]);
    return result.rows[0];
  }

  // 새 스타일 생성
  static async create(styleData) {
    const {
      app_id,
      style_name,
      style_type,
      style_value,
      description,
      is_active
    } = styleData;

    const query = `
      INSERT INTO public.style (
        app_id, style_name, style_type, style_value, description, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      app_id, style_name, style_type, style_value, description, is_active
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 스타일 수정
  static async update(id, styleData) {
    const {
      style_name,
      style_type,
      style_value,
      description,
      is_active
    } = styleData;

    const query = `
      UPDATE public.style
      SET 
        style_name = COALESCE($1, style_name),
        style_type = COALESCE($2, style_type),
        style_value = COALESCE($3, style_value),
        description = COALESCE($4, description),
        is_active = COALESCE($5, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      style_name, style_type, style_value, description, is_active, id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 스타일 삭제
  static async delete(id) {
    const query = 'DELETE FROM public.style WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // 스타일 타입 검증
  static validateStyleType(styleType) {
    const validTypes = ['color', 'font', 'size', 'spacing', 'border', 'shadow', 'animation'];
    return validTypes.includes(styleType);
  }

  // 스타일 값 유효성 검사
  static validateStyleValue(styleType, styleValue) {
    try {
      const value = JSON.parse(styleValue);
      
      switch (styleType) {
        case 'color':
          return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value);
        case 'font':
          return typeof value === 'string' && value.length > 0;
        case 'size':
          return typeof value === 'number' && value > 0;
        case 'spacing':
          return typeof value === 'object' && 
                 typeof value.margin === 'number' && 
                 typeof value.padding === 'number';
        case 'border':
          return typeof value === 'object' && 
                 typeof value.width === 'number' && 
                 typeof value.style === 'string' && 
                 /^#[0-9A-Fa-f]{6}$/.test(value.color);
        case 'shadow':
          return typeof value === 'object' && 
                 typeof value.offsetX === 'number' && 
                 typeof value.offsetY === 'number' && 
                 typeof value.blur === 'number' && 
                 /^#[0-9A-Fa-f]{6}$/.test(value.color);
        case 'animation':
          return typeof value === 'object' && 
                 typeof value.duration === 'number' && 
                 typeof value.timing === 'string';
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}

module.exports = StyleModel; 