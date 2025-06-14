const StyleModel = require('../models/styleModel');
const ApiResponse = require('../utils/api-response');

const styleController = {
  async getAllStyles(req, res) {
    try {
      const { appId } = req.params;
      const styles = await StyleModel.findAllByAppId(appId);
      res.json(ApiResponse.success(styles));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getStyleById(req, res) {
    try {
      const { id } = req.params;
      const style = await StyleModel.findById(id);
      
      if (!style) {
        return res.status(404).json(ApiResponse.notFound('스타일을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(style));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async getStyleByKey(req, res) {
    try {
      const { appId, styleKey } = req.params;
      const style = await StyleModel.findByStyleKey(appId, styleKey);
      
      if (!style) {
        return res.status(404).json(ApiResponse.notFound('스타일을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(style));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async createStyle(req, res) {
    try {
      const { appId } = req.params;
      const styleData = { ...req.body, app_id: appId };

      // 필수 필드 검증
      const requiredFields = ['style_key', 'style_value', 'style_category'];
      const missingFields = requiredFields.filter(field => !styleData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json(
          ApiResponse.badRequest(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`)
        );
      }

      // 스타일 카테고리 검증
      if (!StyleModel.validateStyleCategory(styleData.style_category)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 스타일 카테고리입니다.')
        );
      }

      const style = await StyleModel.create(styleData);
      res.status(201).json(ApiResponse.success(style, '스타일이 생성되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async updateStyle(req, res) {
    try {
      const { id } = req.params;
      const styleData = req.body;

      // 스타일 카테고리 검증
      if (styleData.style_category && !StyleModel.validateStyleCategory(styleData.style_category)) {
        return res.status(400).json(
          ApiResponse.badRequest('유효하지 않은 스타일 카테고리입니다.')
        );
      }

      const style = await StyleModel.update(id, styleData);
      
      if (!style) {
        return res.status(404).json(ApiResponse.notFound('스타일을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(style, '스타일이 업데이트되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  },

  async deleteStyle(req, res) {
    try {
      const { id } = req.params;
      const style = await StyleModel.delete(id);
      
      if (!style) {
        return res.status(404).json(ApiResponse.notFound('스타일을 찾을 수 없습니다.'));
      }
      
      res.json(ApiResponse.success(style, '스타일이 삭제되었습니다.'));
    } catch (error) {
      res.status(500).json(ApiResponse.error(error.message));
    }
  }
};

module.exports = styleController; 