const App = require('../models/appModel');
const MenuModel = require('../models/menuModel');
const ToolbarModel = require('../models/toolbarModel');
const FcmTopicModel = require('../models/fcmTopicModel');
const StyleModel = require('../models/styleModel');

exports.getAllApps = async (req, res) => {
  try {
    const apps = await App.findAll();
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppById = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppByName = async (req, res) => {
  try {
    const apps = await App.findByAppName(req.params.name);
    if (!apps || apps.length === 0) {
      return res.status(404).json({ message: 'No apps found with that name' });
    }
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppWithDetails = async (req, res) => {
  try {
    const app = await App.findAppWithDetails(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!['active', 'inactive', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const apps = await App.findByStatus(status);
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 앱 통계 정보 조회
exports.getAppStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 앱 존재 확인
    const app = await App.findById(id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    // 모든 관련 데이터 개수 병렬 조회
    const [menus, toolbars, fcmTopics, styles] = await Promise.all([
      MenuModel.findAllByAppId(id),
      ToolbarModel.findAllByAppId(id),
      FcmTopicModel.findAllByAppId(id),
      StyleModel.findAllByAppId(id)
    ]);

    const stats = {
      app_info: {
        id: app.id,
        app_name: app.app_name,
        app_id: app.app_id,
        status: app.status,
        created_at: app.created_at
      },
      counts: {
        menus: menus ? menus.length : 0,
        toolbars: toolbars ? toolbars.length : 0,
        fcm_topics: fcmTopics ? fcmTopics.length : 0,
        styles: styles ? styles.length : 0
      },
      menu_stats: {
        visible: menus ? menus.filter(m => m.is_visible !== false).length : 0,
        enabled: menus ? menus.filter(m => m.is_enabled !== false).length : 0,
        by_type: menus ? menus.reduce((acc, m) => {
          acc[m.menu_type] = (acc[m.menu_type] || 0) + 1;
          return acc;
        }, {}) : {}
      },
      toolbar_stats: {
        visible: toolbars ? toolbars.filter(t => t.is_visible !== false).length : 0,
        by_position: toolbars ? toolbars.reduce((acc, t) => {
          acc[t.position] = (acc[t.position] || 0) + 1;
          return acc;
        }, {}) : {}
      },
      fcm_topic_stats: {
        active: fcmTopics ? fcmTopics.filter(f => f.is_active !== false).length : 0,
        default: fcmTopics ? fcmTopics.filter(f => f.is_default === true).length : 0
      },
      style_stats: {
        by_category: styles ? styles.reduce((acc, s) => {
          acc[s.style_category] = (acc[s.style_category] || 0) + 1;
          return acc;
        }, {}) : {}
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 앱 복제
exports.cloneApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_app_name, new_app_id, new_package_name } = req.body;

    if (!new_app_name || !new_app_id || !new_package_name) {
      return res.status(400).json({ message: 'Missing required fields for cloning' });
    }

    // 원본 앱 조회
    const originalApp = await App.findById(id);
    if (!originalApp) {
      return res.status(404).json({ message: 'App not found' });
    }

    // 새 앱 생성
    const newAppData = {
      app_name: new_app_name,
      app_id: new_app_id,
      package_name: new_package_name,
      version: originalApp.version,
      description: `${originalApp.description} (복제됨)`,
      status: 'inactive' // 복제된 앱은 비활성 상태로 시작
    };

    const newApp = await App.create(newAppData);

    // 모든 관련 데이터 복제
    const [menus, toolbars, fcmTopics, styles] = await Promise.all([
      MenuModel.findAllByAppId(id),
      ToolbarModel.findAllByAppId(id),
      FcmTopicModel.findAllByAppId(id),
      StyleModel.findAllByAppId(id)
    ]);

    // 메뉴 복제
    if (menus && menus.length > 0) {
      for (const menu of menus) {
        const menuData = { ...menu };
        delete menuData.id;
        delete menuData.created_at;
        delete menuData.updated_at;
        menuData.app_id = newApp.id;
        await MenuModel.create(menuData);
      }
    }

    // 툴바 복제
    if (toolbars && toolbars.length > 0) {
      for (const toolbar of toolbars) {
        const toolbarData = { ...toolbar };
        delete toolbarData.id;
        delete toolbarData.created_at;
        delete toolbarData.updated_at;
        toolbarData.app_id = newApp.id;
        await ToolbarModel.create(toolbarData);
      }
    }

    // FCM 토픽 복제
    if (fcmTopics && fcmTopics.length > 0) {
      for (const topic of fcmTopics) {
        const topicData = { ...topic };
        delete topicData.id;
        delete topicData.created_at;
        delete topicData.updated_at;
        topicData.app_id = newApp.id;
        await FcmTopicModel.create(topicData);
      }
    }

    // 스타일 복제
    if (styles && styles.length > 0) {
      for (const style of styles) {
        const styleData = { ...style };
        delete styleData.id;
        delete styleData.created_at;
        delete styleData.updated_at;
        styleData.app_id = newApp.id;
        await StyleModel.create(styleData);
      }
    }

    res.status(201).json({
      message: 'App cloned successfully',
      original_app: originalApp,
      cloned_app: newApp,
      cloned_items: {
        menus: menus ? menus.length : 0,
        toolbars: toolbars ? toolbars.length : 0,
        fcm_topics: fcmTopics ? fcmTopics.length : 0,
        styles: styles ? styles.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 앱 설정 내보내기
exports.exportApp = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 앱 정보 조회
    const app = await App.findById(id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }

    // 모든 관련 데이터 조회
    const [menus, toolbars, fcmTopics, styles] = await Promise.all([
      MenuModel.findAllByAppId(id),
      ToolbarModel.findAllByAppId(id),
      FcmTopicModel.findAllByAppId(id),
      StyleModel.findAllByAppId(id)
    ]);

    const exportData = {
      export_info: {
        exported_at: new Date().toISOString(),
        app_id: app.app_id,
        app_name: app.app_name
      },
      app: app,
      menus: menus || [],
      toolbars: toolbars || [],
      fcm_topics: fcmTopics || [],
      styles: styles || []
    };

    // JSON 파일로 다운로드
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${app.app_id}_config.json"`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createApp = async (req, res) => {
  try {
    const { app_name, app_id, package_name, version, description, status } = req.body;
    
    // 필수 필드 검증
    if (!app_name || !app_id || !package_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // status 값 검증
    if (status && !['active', 'inactive', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const app = await App.create(req.body);
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateApp = async (req, res) => {
  try {
    const { status } = req.body;
    
    // status 값 검증
    if (status && !['active', 'inactive', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const app = await App.update(req.params.id, req.body);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteApp = async (req, res) => {
  try {
    const app = await App.delete(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 