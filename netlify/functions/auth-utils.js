const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Usuarios autorizados (en producción esto vendría de una base de datos)
const AUTHORIZED_USERS = JSON.parse(process.env.AUTHORIZED_USERS || '[]');

/**
 * Valida las credenciales del usuario
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {boolean} - True si las credenciales son válidas
 */
function validateCredentials(username, password) {
  const user = AUTHORIZED_USERS.find(u => u.username === username);
  if (!user) return false;
  
  return bcrypt.compareSync(password, user.passwordHash);
}

/**
 * Genera un token JWT para el usuario
 * @param {string} username - Nombre de usuario
 * @returns {string} - Token JWT
 */
function generateToken(username) {
  const payload = {
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET);
}

/**
 * Verifica un token JWT
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload del token si es válido, null si no
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extrae el token del header Authorization
 * @param {object} headers - Headers de la request
 * @returns {string|null} - Token extraído o null
 */
function extractToken(headers) {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

module.exports = {
  validateCredentials,
  generateToken,
  verifyToken,
  extractToken
};

