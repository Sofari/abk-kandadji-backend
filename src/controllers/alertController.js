// src/controllers/alertController.js - Version simple

const { db, getById, create, update, remove } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAllAlerts = asyncHandler(async (req, res) => {
  try {
    const alerts = await db('alerts').select('*');
    res.json({ success: true, data: { alerts } });
  } catch (error) {
    console.error('Erreur alerts:', error);
    throw new AppError('Erreur', 500, 'DATABASE_ERROR');
  }
});

const getAlertHistory = asyncHandler(async (req, res) => {
  try {
    const history = await db('alert_logs').where('alert_id', req.params.id);
    res.json({ success: true, data: { history } });
  } catch (error) {
    throw new AppError('Erreur', 500, 'DATABASE_ERROR');
  }
});

const createAlert = asyncHandler(async (req, res) => {
  const { deadline_id, type_alerte } = req.body;
  
  if (!deadline_id || !type_alerte) {
    throw new AppError('Champs requis', 400, 'MISSING_FIELD');
  }
  
  const id = await create('alerts', {
    deadline_id,
    type_alerte,
    statut: 'active',
    created_by: req.user.id,
  });
  
  const alert = await getById('alerts', id);
  res.status(201).json({ success: true, data: { alert } });
});

const updateAlert = asyncHandler(async (req, res) => {
  await update('alerts', req.params.id, req.body);
  const alert = await getById('alerts', req.params.id);
  res.json({ success: true, data: { alert } });
});

const toggleAlert = asyncHandler(async (req, res) => {
  const { active } = req.body;
  await update('alerts', req.params.id, { statut: active ? 'active' : 'deactivee' });
  const alert = await getById('alerts', req.params.id);
  res.json({ success: true, data: { alert } });
});

const testAlertSend = asyncHandler(async (req, res) => {
  const alert = await getById('alerts', req.params.id);
  if (!alert) throw new AppError('Non trouvée', 404, 'ALERT_NOT_FOUND');
  res.json({ success: true, message: 'Test envoyé' });
});

const deleteAlert = asyncHandler(async (req, res) => {
  await remove('alerts', req.params.id);
  res.json({ success: true, message: 'Supprimée' });
});

module.exports = {
  getAllAlerts,
  getAlertHistory,
  createAlert,
  updateAlert,
  toggleAlert,
  testAlertSend,
  deleteAlert,
};