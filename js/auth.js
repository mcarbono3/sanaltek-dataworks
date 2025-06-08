const { validateCredentials, generateToken } = require('./utils/auth-utils');

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
    const { username, password } = JSON.parse(event.body);

    // Validar que se proporcionen credenciales
    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Username y password son requeridos' })
      };
    }

    // Validar credenciales
    if (!validateCredentials(username, password)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Credenciales inválidas' })
      };
    }

    // Generar token
    const token = generateToken(username);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token,
        user: { username },
        message: 'Autenticación exitosa'
      })
    };

  } catch (error) {
    console.error('Error en autenticación:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};

