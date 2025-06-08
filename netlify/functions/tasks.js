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

    // Procesar la solicitud de tarea específica
    const { taskType, data } = JSON.parse(event.body);

    if (!taskType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'taskType es requerido' })
      };
    }

    let result;

    switch (taskType) {
      case 'web_search':
        result = await performWebSearch(data);
        break;
      case 'register_request':
        result = await registerRequest(data, payload.username);
        break;
      case 'faq_response':
        result = await getFAQResponse(data);
        break;
      case 'email_draft':
        result = await generateEmailDraft(data);
        break;
      case 'data_analysis':
        result = await performDataAnalysis(data);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Tipo de tarea no soportado' })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
        taskType,
        timestamp: new Date().toISOString(),
        user: payload.username
      })
    };

  } catch (error) {
    console.error('Error en tareas:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al procesar la tarea',
        details: error.message 
      })
    };
  }
};

/**
 * Realizar búsqueda web
 */
async function performWebSearch(data) {
  const { query, maxResults = 5 } = data;
  
  // Simulación de búsqueda web (en producción usar una API real como Google Custom Search)
  const mockResults = [
    {
      title: `Resultados para: ${query}`,
      url: 'https://example.com',
      snippet: 'Información relevante encontrada sobre el tema solicitado.',
      source: 'Web Search'
    }
  ];

  return {
    type: 'web_search',
    query,
    results: mockResults,
    totalResults: mockResults.length
  };
}

/**
 * Registrar solicitud
 */
async function registerRequest(data, username) {
  const { requestType, description, priority = 'medium', contact } = data;
  
  const requestId = `REQ-${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  // En producción, esto se guardaría en una base de datos
  const request = {
    id: requestId,
    type: requestType,
    description,
    priority,
    contact,
    status: 'pending',
    createdBy: username,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  // Simular guardado en base de datos
  console.log('Solicitud registrada:', request);

  return {
    type: 'request_registration',
    requestId,
    status: 'registered',
    message: `Solicitud ${requestId} registrada exitosamente`,
    request
  };
}

/**
 * Responder preguntas frecuentes
 */
async function getFAQResponse(data) {
  const { question } = data;
  
  const faqs = {
    'servicios': {
      question: '¿Qué servicios ofrece Sanaltek Dataworks?',
      answer: 'Ofrecemos tres servicios principales: Inteligencia Artificial Aplicada para optimizar procesos y crear sistemas predictivos, Desarrollo de Proyectos de Investigación con metodologías rigurosas, y Asesorías Profesionales en IA aplicada, energías renovables y análisis de datos.'
    },
    'contacto': {
      question: '¿Cómo puedo contactar a Sanaltek Dataworks?',
      answer: 'Puedes contactarnos por email a info.sanaltek@gmail.com, por teléfono al +57 3209804238, o visitarnos en Bucaramanga, Colombia. También puedes usar el formulario de contacto en nuestro sitio web.'
    },
    'proyectos': {
      question: '¿Qué tipo de proyectos desarrollan?',
      answer: 'Desarrollamos proyectos de análisis de datos para energías renovables, modelos predictivos para eficiencia energética, visualización de datos complejos e integración de IA en sistemas energéticos.'
    },
    'equipo': {
      question: '¿Quién forma el equipo de Sanaltek Dataworks?',
      answer: 'Nuestro equipo está formado por el Dr. Mario Carbonó (Director de Investigación en IA), la Ing. Raquel Toloza (Jefa de Proyectos en Energías Renovables) y el Dr. Juan Gomez (Científico de Datos Senior).'
    }
  };

  // Buscar FAQ más relevante
  const questionLower = question.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, faq] of Object.entries(faqs)) {
    if (questionLower.includes(key)) {
      const score = key.length;
      if (score > bestScore) {
        bestMatch = faq;
        bestScore = score;
      }
    }
  }

  if (!bestMatch) {
    // FAQ genérica
    bestMatch = {
      question: 'Pregunta general',
      answer: 'Para obtener información específica sobre nuestros servicios, proyectos o equipo, te recomiendo contactarnos directamente a info.sanaltek@gmail.com o revisar las secciones correspondientes en nuestro sitio web.'
    };
  }

  return {
    type: 'faq_response',
    question,
    matchedFAQ: bestMatch,
    confidence: bestScore > 0 ? 'high' : 'low'
  };
}

/**
 * Generar borrador de correo
 */
async function generateEmailDraft(data) {
  const { recipient, subject, purpose, tone = 'professional', keyPoints = [] } = data;
  
  let emailBody = '';
  
  switch (purpose) {
    case 'proposal':
      emailBody = `Estimado/a ${recipient || '[Nombre del destinatario]'},

Espero que este mensaje le encuentre bien. Me dirijo a usted desde Sanaltek Dataworks para presentarle una propuesta que podría ser de gran valor para su organización.

En Sanaltek Dataworks nos especializamos en innovación tecnológica mediante análisis avanzado de datos y aplicaciones de inteligencia artificial, con un enfoque particular en energías renovables y soluciones sostenibles.

${keyPoints.length > 0 ? 'Puntos clave de nuestra propuesta:\n' + keyPoints.map(point => `• ${point}`).join('\n') + '\n\n' : ''}

Nos gustaría programar una reunión para discutir cómo nuestros servicios pueden contribuir al éxito de sus proyectos. Estamos disponibles para una llamada o reunión presencial en Bucaramanga, Colombia.

Quedo a la espera de su respuesta.

Cordialmente,
[Su nombre]
Sanaltek Dataworks
info.sanaltek@gmail.com
+57 3209804238`;
      break;
      
    case 'follow_up':
      emailBody = `Estimado/a ${recipient || '[Nombre del destinatario]'},

Espero que se encuentre bien. Me permito hacer seguimiento a nuestra conversación anterior sobre [tema específico].

${keyPoints.length > 0 ? keyPoints.map(point => `• ${point}`).join('\n') + '\n\n' : ''}

Quedo atento/a a sus comentarios y disponible para cualquier aclaración adicional que pueda necesitar.

Saludos cordiales,
[Su nombre]
Sanaltek Dataworks`;
      break;
      
    default:
      emailBody = `Estimado/a ${recipient || '[Nombre del destinatario]'},

Espero que este mensaje le encuentre bien.

${keyPoints.length > 0 ? keyPoints.map(point => `• ${point}`).join('\n') + '\n\n' : ''}

Quedo a la espera de su respuesta.

Cordialmente,
[Su nombre]
Sanaltek Dataworks
info.sanaltek@gmail.com`;
  }

  return {
    type: 'email_draft',
    subject: subject || `Propuesta de colaboración - Sanaltek Dataworks`,
    body: emailBody,
    recipient,
    purpose,
    tone,
    metadata: {
      wordCount: emailBody.split(' ').length,
      estimatedReadTime: Math.ceil(emailBody.split(' ').length / 200) + ' minutos'
    }
  };
}

/**
 * Realizar análisis de datos
 */
async function performDataAnalysis(data) {
  const { dataType, analysisType, parameters = {} } = data;
  
  // Simulación de análisis de datos
  let analysisResult;
  
  switch (analysisType) {
    case 'energy_consumption':
      analysisResult = {
        summary: 'Análisis de consumo energético completado',
        metrics: {
          averageConsumption: '1,250 kWh/mes',
          peakHours: '18:00 - 22:00',
          efficiency: '78%',
          potentialSavings: '15-20%'
        },
        recommendations: [
          'Implementar sistema de gestión inteligente',
          'Optimizar horarios de operación',
          'Considerar integración de energías renovables'
        ]
      };
      break;
      
    case 'renewable_forecast':
      analysisResult = {
        summary: 'Pronóstico de generación renovable',
        forecast: {
          solar: '85% capacidad promedio',
          wind: '62% capacidad promedio',
          reliability: '92%'
        },
        trends: [
          'Incremento del 12% en eficiencia solar',
          'Variabilidad estacional del 8%',
          'Potencial de almacenamiento: 4.5 MWh'
        ]
      };
      break;
      
    default:
      analysisResult = {
        summary: 'Análisis de datos general completado',
        insights: [
          'Patrones identificados en los datos',
          'Correlaciones significativas encontradas',
          'Recomendaciones basadas en tendencias'
        ]
      };
  }

  return {
    type: 'data_analysis',
    dataType,
    analysisType,
    result: analysisResult,
    timestamp: new Date().toISOString()
  };
}

