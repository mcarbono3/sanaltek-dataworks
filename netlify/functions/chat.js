const { verifyToken, extractToken } = require('./utils/auth-utils');
const { processQuery, determineQueryType, processSpecificTask } = require('./utils/openai');

exports.handler = async (event, context) => {
  // Configurar CORS
  const allowedOrigins = [
  'https://mcarbono3.github.io',
  'https://sanaltek-dataworks.vercel.app'
];

  const origin = event.headers.origin || event.headers.Origin;
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]; 
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
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

    // Procesar la consulta
    const { message, context } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Mensaje es requerido' })
      };
    }

    // Determinar el tipo de consulta
    const queryType = determineQueryType(message);

    // Procesar con OpenAI
    const response = await processQuery(message, context);

    // Procesar tareas específicas si es necesario
    let specificTaskResult = null;
    if (queryType !== 'query') {
      try {
        specificTaskResult = await processSpecificTask(queryType, message);
      } catch (error) {
        console.error('Error en tarea específica:', error);
        // Continuar sin la tarea específica
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        response,
        queryType,
        specificTask: specificTaskResult,
        timestamp: new Date().toISOString(),
        user: payload.username
      })
    };

  } catch (error) {
    console.error('Error en chat:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al procesar la consulta',
        details: error.message 
      })
    };
  }
};

