// src/controllers/contractController.js - Version simple

const { db, getById, create, update, remove } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAllContracts = asyncHandler(async (req, res) => {
  try {
    const contracts = await db('contracts').select('*');
    res.json({
      success: true,
      data: { contracts },
    });
  } catch (error) {
    console.error('Erreur contrats:', error);
    throw new AppError('Erreur', 500, 'DATABASE_ERROR');
  }
});

const getContractById = asyncHandler(async (req, res) => {
  const contract = await getById('contracts', req.params.id);
  if (!contract) throw new AppError('Non trouvé', 404, 'CONTRACT_NOT_FOUND');
  res.json({ success: true, data: { contract } });
});

const createContract = asyncHandler(async (req, res) => {
  const { numero_contrat, titre, montant } = req.body;
  
  if (!numero_contrat || !titre) {
    throw new AppError('Champs requis', 400, 'MISSING_FIELD');
  }
  
  const id = await create('contracts', {
    numero_contrat,
    titre,
    montant,
    created_by: req.user.id,
  });
  
  const contract = await getById('contracts', id);
  res.status(201).json({ success: true, data: { contract } });
});

const updateContract = asyncHandler(async (req, res) => {
  await update('contracts', req.params.id, req.body);
  const contract = await getById('contracts', req.params.id);
  res.json({ success: true, data: { contract } });
});

const deleteContract = asyncHandler(async (req, res) => {
  await remove('contracts', req.params.id);
  res.json({ success: true, message: 'Supprimé' });
});

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};