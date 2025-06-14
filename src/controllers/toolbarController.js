const ToolbarModel = require('../models/toolbarModel');
const ApiResponse = require('../utils/api-response');

// 모든 툴바 조회
exports.getAllToolbars = async (req, res) => {
  try {
    const { appId } = req.params;
    const toolbars = await ToolbarModel.findAllByAppId(appId);
    return ApiResponse.success(res, toolbars);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 특정 툴바 조회
exports.getToolbarById = async (req, res) => {
  try {
    const { toolbarId } = req.params;
    const toolbar = await ToolbarModel.findById(toolbarId);
    
    if (!toolbar) {
      return ApiResponse.notFound(res, '툴바를 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, toolbar);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 새 툴바 생성
exports.createToolbar = async (req, res) => {
  try {
    const { appId } = req.params;
    const toolbarData = { ...req.body, app_id: appId };

    // 필수 필드 검증
    const requiredFields = ['toolbar_type', 'title', 'order_index', 'action_type', 'action_value'];
    for (const field of requiredFields) {
      if (!toolbarData[field]) {
        return ApiResponse.badRequest(res, `${field}는 필수 항목입니다.`);
      }
    }

    // 툴바 타입 검증
    if (!ToolbarModel.validateToolbarType(toolbarData.toolbar_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 툴바 타입입니다.');
    }

    // 액션 타입 검증
    if (!ToolbarModel.validateActionType(toolbarData.action_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 액션 타입입니다.');
    }

    const toolbar = await ToolbarModel.create(toolbarData);
    return ApiResponse.success(res, toolbar, '툴바가 생성되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 툴바 수정
exports.updateToolbar = async (req, res) => {
  try {
    const { toolbarId } = req.params;
    const toolbarData = req.body;

    // 툴바 타입 검증
    if (toolbarData.toolbar_type && !ToolbarModel.validateToolbarType(toolbarData.toolbar_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 툴바 타입입니다.');
    }

    // 액션 타입 검증
    if (toolbarData.action_type && !ToolbarModel.validateActionType(toolbarData.action_type)) {
      return ApiResponse.badRequest(res, '유효하지 않은 액션 타입입니다.');
    }

    const toolbar = await ToolbarModel.update(toolbarId, toolbarData);
    
    if (!toolbar) {
      return ApiResponse.notFound(res, '툴바를 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, toolbar, '툴바가 수정되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// 툴바 삭제
exports.deleteToolbar = async (req, res) => {
  try {
    const { toolbarId } = req.params;
    const toolbar = await ToolbarModel.delete(toolbarId);
    
    if (!toolbar) {
      return ApiResponse.notFound(res, '툴바를 찾을 수 없습니다.');
    }
    
    return ApiResponse.success(res, toolbar, '툴바가 삭제되었습니다.');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
}; 