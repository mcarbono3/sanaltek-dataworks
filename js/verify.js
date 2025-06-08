const { verifyToken, extractToken } = require('./utils/auth-utils');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    // Verificar autenticación
    const token = extractToken(event.headers);
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token de autenticación requerido' })
      };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token inválido o expirado' })
      };
    }

    // Verificar token válido
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        valid: true,
        user: {
          username: payload.username,
          iat: payload.iat,
          exp: payload.exp
        },
        expiresIn: payload.exp - Math.floor(Date.now() / 1000),
        message: 'Token válido'
      })
    };

  } catch (error) {
    console.error('Error en verificación:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message 
      })
    };
  }
};

