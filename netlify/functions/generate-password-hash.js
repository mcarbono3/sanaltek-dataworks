const bcrypt = require('bcryptjs');

/**
 * Utilidad para generar hashes de contraseñas
 * Ejecutar: node generate-password-hash.js
 */

async function generatePasswordHash() {
  const passwords = [
    { username: 'admin', password: 'admin123' },
    { username: 'sanaltek', password: 'sanaltek2025' },
    { username: 'demo', password: 'demo123' }
  ];

  console.log('Generando hashes de contraseñas...\n');

  const users = [];
  
  for (const user of passwords) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(user.password, saltRounds);
    
    users.push({
      username: user.username,
      passwordHash: hash
    });
    
    console.log(`Usuario: ${user.username}`);
    console.log(`Contraseña: ${user.password}`);
    console.log(`Hash: ${hash}\n`);
  }

  console.log('JSON para AUTHORIZED_USERS:');
  console.log(JSON.stringify(users, null, 2));
}

generatePasswordHash().catch(console.error);

