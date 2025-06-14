const Menu = require('../models/menuModel');
const ApiResponse = require('../utils/api-response');

exports.getAllMenus = async (req, res) => {
  try {
    const { appId } = req.params;
    const menus = await Menu.findAllByAppId(appId);
    res.json(ApiResponse.success(menus));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error));
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json(ApiResponse.notFound('Menu not found'));
    }
    res.json(ApiResponse.success(menu));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error));
  }
};

exports.createMenu = async (req, res) => {
  try {
    const { appId } = req.params;
    const menuData = { ...req.body, app_id: appId };

    // 필수 필드 검증
    if (!menuData.menu_id || !menuData.title) {
      return res.status(400).json(ApiResponse.badRequest('Missing required fields'));
    }

    // 메뉴 타입 검증
    if (menuData.menu_type && !(await Menu.validateMenuType(menuData.menu_type))) {
      return res.status(400).json(ApiResponse.badRequest('Invalid menu type'));
    }

    // 액션 타입 검증
    if (menuData.action_type && !(await Menu.validateActionType(menuData.action_type))) {
      return res.status(400).json(ApiResponse.badRequest('Invalid action type'));
    }

    const menu = await Menu.create(menuData);
    res.status(201).json(ApiResponse.success(menu, 'Menu created successfully'));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error));
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menuData = req.body;

    // 메뉴 타입 검증
    if (menuData.menu_type && !(await Menu.validateMenuType(menuData.menu_type))) {
      return res.status(400).json(ApiResponse.badRequest('Invalid menu type'));
    }

    // 액션 타입 검증
    if (menuData.action_type && !(await Menu.validateActionType(menuData.action_type))) {
      return res.status(400).json(ApiResponse.badRequest('Invalid action type'));
    }

    const menu = await Menu.update(menuId, menuData);
    if (!menu) {
      return res.status(404).json(ApiResponse.notFound('Menu not found'));
    }
    res.json(ApiResponse.success(menu, 'Menu updated successfully'));
  } catch (error) {
    res.status(400).json(ApiResponse.error(error));
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.delete(req.params.menuId);
    if (!menu) {
      return res.status(404).json(ApiResponse.notFound('Menu not found'));
    }
    res.json(ApiResponse.success(null, 'Menu deleted successfully'));
  } catch (error) {
    res.status(500).json(ApiResponse.error(error));
  }
}; 