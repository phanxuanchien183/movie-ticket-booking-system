const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || 'root_password';
  const database = process.env.MYSQL_DATABASE || 'ticket_booking';

  console.log(`[Migration] Connecting to MySQL at ${host}:${port} as ${user}...`);

  let connection;
  try {
    // Kết nối không database trước để CREATE DATABASE nếu chưa có
    connection = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.changeUser({ database });

    console.log(`[Migration] Database "${database}" ready.`);

    const sqlDir = path.join(__dirname, '../schema/sql');
    const files = fs.readdirSync(sqlDir).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      console.log(`[Migration] Running ${file}...`);
      const filePath = path.join(sqlDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await connection.query(sql);
      console.log(`[Migration] Done ${file}`);
    }

    console.log('[Migration] All migrations executed successfully!');
  } catch (err) {
    console.error('[Migration Error]:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();
