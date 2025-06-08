const { verifyToken, extractToken } = require('./utils/auth-utils');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://mcarbono3.github.io',
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

    // Procesar la solicitud de reporte
    const { data, format, title } = JSON.parse(event.body);

    if (!data || !format) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Data y format son requeridos' })
      };
    }

    let result;

    switch (format.toLowerCase()) {
      case 'csv':
        result = await generateCSV(data, title);
        break;
      case 'txt':
        result = generateTXT(data, title);
        break;
      case 'html':
        result = generateHTML(data, title);
        break;
      case 'pdf':
        result = await generatePDF(data, title);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Formato no soportado' })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
        format,
        timestamp: new Date().toISOString(),
        user: payload.username
      })
    };

  } catch (error) {
    console.error('Error en generación de reporte:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error al generar el reporte',
        details: error.message 
      })
    };
  }
};

/**
 * Genera un archivo CSV
 */
async function generateCSV(data, title = 'Reporte') {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Los datos deben ser un array no vacío');
  }

  const headers = Object.keys(data[0]).map(key => ({
    id: key,
    title: key.charAt(0).toUpperCase() + key.slice(1)
  }));

  const csvContent = [
    headers.map(h => h.title).join(','),
    ...data.map(row => headers.map(h => row[h.id] || '').join(','))
  ].join('\n');

  return {
    type: 'text',
    content: csvContent,
    filename: `${title.replace(/\s+/g, '_')}.csv`
  };
}

/**
 * Genera un archivo TXT
 */
function generateTXT(data, title = 'Reporte') {
  let content = `${title}\n${'='.repeat(title.length)}\n\n`;
  
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      content += `${index + 1}. `;
      if (typeof item === 'object') {
        content += Object.entries(item)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      } else {
        content += item;
      }
      content += '\n';
    });
  } else {
    content += JSON.stringify(data, null, 2);
  }

  return {
    type: 'text',
    content,
    filename: `${title.replace(/\s+/g, '_')}.txt`
  };
}

/**
 * Genera HTML
 */
function generateHTML(data, title = 'Reporte') {
  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c5f5f; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
`;

  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    html += `
    <table>
        <thead>
            <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${data.map(row => `
                <tr>
                    ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
`;
  } else {
    html += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }

  html += `
</body>
</html>`;

  return {
    type: 'html',
    content: html,
    filename: `${title.replace(/\s+/g, '_')}.html`
  };
}

/**
 * Genera un PDF (simplificado - en producción usaría una librería más robusta)
 */
async function generatePDF(data, title = 'Reporte') {
  // Por simplicidad, retornamos HTML que puede ser convertido a PDF en el frontend
  const htmlResult = generateHTML(data, title);
  return {
    type: 'pdf-html',
    content: htmlResult.content,
    filename: `${title.replace(/\s+/g, '_')}.pdf`
  };
}

