const MenuModel = require('../models/menuModel');
const ApiResponse = require('../utils/api-response');

const menuController = {
  async getAllMenus(req, res) {
    try {
      const { appId } = req.params;
      const menus = await MenuModel.findAllByAppId(appId);
      res.json(ApiResponse.success(menus));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getMenuById(req, res) {
    try {
      const { id } = req.params;
      const menu = await MenuModel.findById(id);
      
      if (!menu) {
        return res.status(404).json(ApiResponse.notFound('메뉴를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(menu));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async createMenu(req, res) {
    try {
      const { appId } = req.params;
      const menuData = { ...req.body, app_id: appId };

      // 필수 필드 검증
      const requiredFields = ['menu_id', 'title', 'menu_type', 'action_type'];
      const missingFields = requiredFields.filter(field => !menuData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json(
          ApiResponse.badRequest(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`)
        );
      }

      // 메뉴 타입 검증
      if (!MenuModel.validateMenuType(menuData.menu_type)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 메뉴 타입입니다.')
        );
      }

      // 액션 타입 검증
      if (!MenuModel.validateActionType(menuData.action_type)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 액션 타입입니다.')
        );
      }

      const menu = await MenuModel.create(menuData);
      res.status(201).json(ApiResponse.success(menu, '메뉴가 생성되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async updateMenu(req, res) {
    try {
      const { id } = req.params;
      const menuData = req.body;

      // 메뉴 타입 검증
      if (menuData.menu_type && !MenuModel.validateMenuType(menuData.menu_type)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 메뉴 타입입니다.')
        );
      }

      // 액션 타입 검증
      if (menuData.action_type && !MenuModel.validateActionType(menuData.action_type)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 액션 타입입니다.')
        );
      }

      const menu = await MenuModel.update(id, menuData);
      
      if (!menu) {
        return res.status(404).json(ApiResponse.notFound('메뉴를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(menu, '메뉴가 업데이트되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      const menu = await MenuModel.delete(id);
      
      if (!menu) {
        return res.status(404).json(ApiResponse.notFound('메뉴를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(menu, '메뉴가 삭제되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  }
};

module.exports = menuController; 