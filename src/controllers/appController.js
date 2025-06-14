const App = require('../models/appModel');

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