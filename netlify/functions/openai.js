const { OpenAI } = require('openai');

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Procesa una consulta usando OpenAI GPT-4-turbo
 * @param {string} userMessage - Mensaje del usuario
 * @param {string} context - Contexto adicional (opcional)
 * @returns {Promise<string>} - Respuesta de la IA
 */
async function processQuery(userMessage, context = '') {
  try {
    const systemPrompt = `Eres PeterAI, un asistente de inteligencia artificial especializado para Sanaltek Dataworks, una empresa de innovación tecnológica y análisis de datos enfocada en energías renovables y proyectos de IA.

Tu función es:
1. Responder consultas sobre la empresa y sus servicios
2. Ayudar con análisis de datos y reportes
3. Asistir en tareas operativas como registrar solicitudes
4. Responder preguntas frecuentes
5. Preparar borradores de correos electrónicos
6. Proporcionar información sobre proyectos de energías renovables e IA

Contexto de la empresa:
- Sanaltek Dataworks se dedica a la innovación tecnológica mediante análisis avanzado de datos
- Especializada en energías renovables y aplicaciones de IA
- Servicios: IA aplicada, desarrollo de proyectos de investigación, asesorías profesionales
- Equipo: Dr. Mario Carbonó (Director de Investigación en IA), Ing. Raquel Toloza (Jefa de Proyectos en Energías Renovables), Dr. Juan Gomez (Científico de Datos Senior)
- Ubicación: Bucaramanga, Colombia
- Contacto: info.sanaltek@gmail.com, +57 3209804238

${context ? `Contexto adicional: ${context}` : ''}

Responde de manera profesional, concisa y útil. Si necesitas generar un reporte o tabla, indica claramente el formato requerido.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error en OpenAI:', error);
    throw new Error('Error al procesar la consulta con IA');
  }
}

/**
 * Determina el tipo de consulta del usuario
 * @param {string} userMessage - Mensaje del usuario
 * @returns {string} - Tipo de consulta (query, report, email, faq, etc.)
 */
function determineQueryType(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('reporte') || message.includes('tabla') || message.includes('datos') || message.includes('análisis')) {
    return 'report';
  }
  if (message.includes('correo') || message.includes('email') || message.includes('carta') || message.includes('borrador')) {
    return 'email';
  }
  if (message.includes('registrar') || message.includes('solicitud') || message.includes('petición') || message.includes('ticket')) {
    return 'register';
  }
  if (message.includes('faq') || message.includes('pregunta frecuente') || message.includes('ayuda') || message.includes('información')) {
    return 'faq';
  }
  if (message.includes('buscar') || message.includes('búsqueda') || message.includes('investigar')) {
    return 'search';
  }
  if (message.includes('energía') || message.includes('renovable') || message.includes('solar') || message.includes('eólica')) {
    return 'energy_analysis';
  }
  
  return 'query';
}

/**
 * Procesa tareas específicas basadas en el tipo de consulta
 * @param {string} queryType - Tipo de consulta
 * @param {string} userMessage - Mensaje del usuario
 * @returns {Promise<object>} - Resultado de la tarea específica
 */
async function processSpecificTask(queryType, userMessage) {
  switch (queryType) {
    case 'search':
      return await processWebSearch(userMessage);
    case 'register':
      return await processRegistration(userMessage);
    case 'faq':
      return await processFAQ(userMessage);
    case 'email':
      return await processEmailDraft(userMessage);
    case 'energy_analysis':
      return await processEnergyAnalysis(userMessage);
    default:
      return null;
  }
}

/**
 * Procesa búsquedas web
 */
async function processWebSearch(message) {
  // Extraer términos de búsqueda del mensaje
  const searchTerms = extractSearchTerms(message);
  
  return {
    type: 'web_search',
    query: searchTerms,
    suggestion: `Realizaré una búsqueda sobre: "${searchTerms}". Los resultados aparecerán a continuación.`
  };
}

/**
 * Procesa registro de solicitudes
 */
async function processRegistration(message) {
  // Extraer información de la solicitud
  const requestInfo = extractRequestInfo(message);
  
  return {
    type: 'request_registration',
    data: requestInfo,
    suggestion: 'Procederé a registrar tu solicitud en el sistema.'
  };
}

/**
 * Procesa preguntas frecuentes
 */
async function processFAQ(message) {
  return {
    type: 'faq_response',
    question: message,
    suggestion: 'Buscaré información relevante en nuestra base de conocimientos.'
  };
}

/**
 * Procesa borradores de correo
 */
async function processEmailDraft(message) {
  const emailInfo = extractEmailInfo(message);
  
  return {
    type: 'email_draft',
    data: emailInfo,
    suggestion: 'Generaré un borrador de correo basado en tu solicitud.'
  };
}

/**
 * Procesa análisis de energía
 */
async function processEnergyAnalysis(message) {
  const analysisType = determineEnergyAnalysisType(message);
  
  return {
    type: 'energy_analysis',
    analysisType,
    suggestion: `Realizaré un análisis de ${analysisType} basado en tu consulta.`
  };
}

/**
 * Extrae términos de búsqueda del mensaje
 */
function extractSearchTerms(message) {
  // Remover palabras comunes y extraer términos clave
  const stopWords = ['buscar', 'búsqueda', 'investigar', 'sobre', 'acerca', 'de', 'la', 'el', 'en', 'y', 'o'];
  const words = message.toLowerCase().split(' ').filter(word => 
    word.length > 2 && !stopWords.includes(word)
  );
  
  return words.slice(0, 5).join(' ');
}

/**
 * Extrae información de solicitud del mensaje
 */
function extractRequestInfo(message) {
  return {
    description: message,
    type: 'general',
    priority: 'medium'
  };
}

/**
 * Extrae información de correo del mensaje
 */
function extractEmailInfo(message) {
  return {
    purpose: 'general',
    tone: 'professional',
    keyPoints: [message]
  };
}

/**
 * Determina el tipo de análisis energético
 */
function determineEnergyAnalysisType(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('consumo')) return 'energy_consumption';
  if (msg.includes('pronóstico') || msg.includes('predicción')) return 'renewable_forecast';
  if (msg.includes('eficiencia')) return 'efficiency_analysis';
  
  return 'general_energy';
}

module.exports = {
  processQuery,
  determineQueryType,
  processSpecificTask
};

