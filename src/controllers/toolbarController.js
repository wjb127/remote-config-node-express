const ToolbarModel = require('../models/toolbarModel');
const ApiResponse = require('../utils/api-response');

const toolbarController = {
  async getAllToolbars(req, res) {
    try {
      const { appId } = req.params;
      const toolbars = await ToolbarModel.findAllByAppId(appId);
      res.json(ApiResponse.success(toolbars));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getToolbarById(req, res) {
    try {
      const { id } = req.params;
      const toolbar = await ToolbarModel.findById(id);
      
      if (!toolbar) {
        return res.status(404).json(ApiResponse.notFound('툴바를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(toolbar));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async createToolbar(req, res) {
    try {
      const { appId } = req.params;
      const toolbarData = { ...req.body, app_id: appId };

      // 필수 필드 검증
      const requiredFields = ['toolbar_id', 'title', 'position'];
      const missingFields = requiredFields.filter(field => !toolbarData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json(
          ApiResponse.badRequest(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`)
        );
      }

      // 위치 검증
      if (!ToolbarModel.validatePosition(toolbarData.position)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 툴바 위치입니다.')
        );
      }

      const toolbar = await ToolbarModel.create(toolbarData);
      res.status(201).json(ApiResponse.success(toolbar, '툴바가 생성되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async updateToolbar(req, res) {
    try {
      const { id } = req.params;
      const toolbarData = req.body;

      // 위치 검증
      if (toolbarData.position && !ToolbarModel.validatePosition(toolbarData.position)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 툴바 위치입니다.')
        );
      }

      const toolbar = await ToolbarModel.update(id, toolbarData);
      
      if (!toolbar) {
        return res.status(404).json(ApiResponse.notFound('툴바를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(toolbar, '툴바가 업데이트되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async deleteToolbar(req, res) {
    try {
      const { id } = req.params;
      const toolbar = await ToolbarModel.delete(id);
      
      if (!toolbar) {
        return res.status(404).json(ApiResponse.notFound('툴바를 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(toolbar, '툴바가 삭제되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  }
};

module.exports = toolbarController; 