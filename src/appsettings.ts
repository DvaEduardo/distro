import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'euromundo-mysql01.mysql.database.azure.com',
  user: 'wapp01db-user@euromundo-mysql01',
  password: 'drD*CGX4!B3Vb$6&g6FF%p7fNjMCwFfN',
  database: 'distro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;
