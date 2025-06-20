const pool = require('../config/database');

class MenuModel {
  static async findAllByAppId(appId) {
    const query = `
      SELECT * FROM public.menu 
      WHERE app_id = $1 
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [appId]);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM public.menu WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(menuData) {
    const {
      app_id,
      menu_id,
      title,
      icon,
      order_index,
      parent_id,
      menu_type,
      action_type,
      action_value,
      is_visible,
      is_enabled
    } = menuData;

    const query = `
      INSERT INTO public.menu (
        app_id, menu_id, title, icon, order_index, parent_id,
        menu_type, action_type, action_value, is_visible, is_enabled
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      app_id, menu_id, title, icon, order_index, parent_id,
      menu_type, action_type, action_value, is_visible, is_enabled
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, menuData) {
    const {
      title,
      icon,
      order_index,
      parent_id,
      menu_type,
      action_type,
      action_value,
      is_visible,
      is_enabled
    } = menuData;

    const query = `
      UPDATE public.menu
      SET 
        title = COALESCE($1, title),
        icon = COALESCE($2, icon),
        order_index = COALESCE($3, order_index),
        parent_id = COALESCE($4, parent_id),
        menu_type = COALESCE($5, menu_type),
        action_type = COALESCE($6, action_type),
        action_value = COALESCE($7, action_value),
        is_visible = COALESCE($8, is_visible),
        is_enabled = COALESCE($9, is_enabled),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      title, icon, order_index, parent_id,
      menu_type, action_type, action_value,
      is_visible, is_enabled, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM public.menu WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static validateMenuType(menuType) {
    const validTypes = ['item', 'category', 'divider'];
    return validTypes.includes(menuType);
  }

  static validateActionType(actionType) {
    const validTypes = ['navigate', 'external_link', 'api_call'];
    return validTypes.includes(actionType);
  }
}

module.exports = MenuModel; 