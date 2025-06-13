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

exports.createApp = async (req, res) => {
  try {
    const app = await App.create(req.body);
    res.status(201).json(app);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateApp = async (req, res) => {
  try {
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