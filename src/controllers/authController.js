// src/controllers/authController.js - Version simple pour développement

const { db, getById } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', email);
  
  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400, 'MISSING_FIELD');
  }
  
  // Récupérer l'utilisateur
  const user = await db('users').where('email', email).first();
  
  console.log('👤 User found:', user?.email);
  
  if (!user) {
    throw new AppError('Utilisateur non trouvé', 401, 'INVALID_CREDENTIALS');
  }
  
  // En développement : accepter n'importe quel mot de passe
  console.log('✅ Password accepted for development');
  
  const token = generateToken({
    id: user.id,
    email: user.email,
    nom_prenom: user.nom_prenom,
    role: user.role,
  });
  
  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
  });
  
  res.json({
    success: true,
    data: {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nom_prenom: user.nom_prenom,
        role: user.role,
      },
    },
  });
});

const refreshTokenEndpoint = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token requis', 400, 'MISSING_FIELD');
  
  const jwt = require('jsonwebtoken');
  const config = require('../config/env');
  
  try {
    const decoded = jwt.verify(refreshToken, config.JWT.REFRESH_SECRET);
    const user = await getById('users', decoded.id);
    
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      nom_prenom: user.nom_prenom,
      role: user.role,
    });
    
    res.json({ success: true, data: { token: newToken } });
  } catch (error) {
    throw new AppError('Refresh token invalide', 401, 'INVALID_REFRESH_TOKEN');
  }
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await getById('users', req.user.id);
  if (!user) throw new AppError('Utilisateur non trouvé', 404, 'USER_NOT_FOUND');
  res.json({ success: true, data: { user } });
});

const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Déconnecté' });
});

module.exports = { login, refreshTokenEndpoint, getProfile, logout };