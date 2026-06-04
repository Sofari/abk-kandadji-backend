// src/controllers/deadlineController.js - Version simple

const { db, getById, create, update, remove } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAllDeadlines = asyncHandler(async (req, res) => {
  try {
    const deadlines = await db('deadlines').select('*').orderBy('date_limite', 'asc');
    
    res.json({
      success: true,
      data: { deadlines },
    });
  } catch (error) {
    console.error('Erreur deadlines:', error);
    throw new AppError('Erreur lors de la récupération', 500, 'DATABASE_ERROR');
  }
});

const getUrgentDeadlines = asyncHandler(async (req, res) => {
  try {
    const deadlines = await db('deadlines')
      .where('statut', 'in', ['planifiee', 'en_attente'])
      .orderBy('date_limite', 'asc');
    
    res.json({ success: true, data: { deadlines } });
  } catch (error) {
    throw new AppError('Erreur', 500, 'DATABASE_ERROR');
  }
});

const getDeadlineById = asyncHandler(async (req, res) => {
  const deadline = await getById('deadlines', req.params.id);
  if (!deadline) throw new AppError('Non trouvée', 404, 'DEADLINE_NOT_FOUND');
  res.json({ success: true, data: { deadline } });
});

const createDeadline = asyncHandler(async (req, res) => {
  const { contract_id, date_action, date_limite, description } = req.body;
  
  if (!contract_id || !date_action || !date_limite) {
    throw new AppError('Champs requis', 400, 'MISSING_FIELD');
  }
  
  const id = await create('deadlines', {
    contract_id,
    date_action,
    date_limite,
    description,
    statut: 'planifiee',
    created_by: req.user.id,
  });
  
  const deadline = await getById('deadlines', id);
  res.status(201).json({ success: true, data: { deadline } });
});

const updateDeadline = asyncHandler(async (req, res) => {
  const deadline = await getById('deadlines', req.params.id);
  if (!deadline) throw new AppError('Non trouvée', 404, 'DEADLINE_NOT_FOUND');
  
  await update('deadlines', req.params.id, req.body);
  const updated = await getById('deadlines', req.params.id);
  
  res.json({ success: true, data: { deadline: updated } });
});

const completeDeadline = asyncHandler(async (req, res) => {
  await update('deadlines', req.params.id, { statut: 'completée' });
  const deadline = await getById('deadlines', req.params.id);
  res.json({ success: true, data: { deadline } });
});

const deleteDeadline = asyncHandler(async (req, res) => {
  await remove('deadlines', req.params.id);
  res.json({ success: true, message: 'Supprimée' });
});

module.exports = {
  getAllDeadlines,
  getUrgentDeadlines,
  getDeadlineById,
  createDeadline,
  updateDeadline,
  completeDeadline,
  deleteDeadline,
};