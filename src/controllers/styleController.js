const StyleModel = require('../models/styleModel');
const ApiResponse = require('../utils/api-response');

// 모든 스타일 조회
exports.getAllStyles = async (req, res) => {
  try {
    const { appId } = req.params;
    const styles = await StyleModel.findAllByAppId(appId);
    return ApiResponse.success(res, styles);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 특정 스타일 조회
exports.getStyleById = async (req, res) => {
  try {
    const { styleId } = req.params;
    const style = await StyleModel.findById(styleId);
    
    if (!style) {
      return ApiResponse.notFound(res, '스타일을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, style);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 스타일 이름으로 조회
exports.getStyleByName = async (req, res) => {
  try {
    const { appId } = req.params;
    const { styleName } = req.params;
    const style = await StyleModel.findByStyleName(appId, styleName);
    
    if (!style) {
      return ApiResponse.notFound(res, '스타일을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, style);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 새 스타일 생성
exports.createStyle = async (req, res) => {
  try {
    const { appId } = req.params;
    const styleData = { ...req.body, app_id: appId };

    // 필수 필드 검증
    const requiredFields = ['style_name', 'style_type', 'style_value'];
    for (const field of requiredFields) {
      if (!styleData[field]) {
        return ApiResponse.badRequest(res, `${field}는 필수 항목입니다.`);
      }
    }

    // 스타일 타입 검증
    if (!StyleModel.validateStyleType(styleData.style_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 스타일 타입입니다.');
    }

    // 스타일 값 유효성 검사
    if (!StyleModel.validateStyleValue(styleData.style_type, styleData.style_value)) {
      return ApiResponse.badRequest(res, '유효하지 않은 스타일 값입니다.');
    }

    // 스타일 이름 중복 검사
    const existingStyle = await StyleModel.findByStyleName(appId, styleData.style_name);
    if (existingStyle) {
      return ApiResponse.badRequest(res, '이미 존재하는 스타일 이름입니다.');
    }

    const style = await StyleModel.create(styleData);
    return ApiResponse.success(res, style, '스타일이 생성되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 스타일 수정
exports.updateStyle = async (req, res) => {
  try {
    const { styleId } = req.params;
    const styleData = req.body;

    // 스타일 타입 검증
    if (styleData.style_type && !StyleModel.validateStyleType(styleData.style_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 스타일 타입입니다.');
    }

    // 스타일 값 유효성 검사
    if (styleData.style_value) {
      const styleType = styleData.style_type || (await StyleModel.findById(styleId))?.style_type;
      if (!StyleModel.validateStyleValue(styleType, styleData.style_value)) {
        return ApiResponse.badRequest(res, '유효하지 않은 스타일 값입니다.');
      }
    }

    // 스타일 이름 중복 검사
    if (styleData.style_name) {
      const existingStyle = await StyleModel.findByStyleName(req.params.appId, styleData.style_name);
      if (existingStyle && existingStyle.id !== parseInt(styleId)) {
        return ApiResponse.badRequest(res, '이미 존재하는 스타일 이름입니다.');
      }
    }

    const style = await StyleModel.update(styleId, styleData);
    
    if (!style) {
      return ApiResponse.notFound(res, '스타일을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, style, '스타일이 수정되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 스타일 삭제
exports.deleteStyle = async (req, res) => {
  try {
    const { styleId } = req.params;
    const style = await StyleModel.delete(styleId);
    
    if (!style) {
      return ApiResponse.notFound(res, '스타일을 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, style, '스타일이 삭제되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
}; 