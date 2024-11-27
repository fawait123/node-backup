const { exec } = require('child_process');
const cron = require('cron');
const path = require('path');
const fs = require('fs');
require('dotenv').config()

// MySQL configuration
const dbConfig = {
  host: process.env.DB_HOST,          // Replace with your MySQL host
  user: process.env.DB_USER,      // Replace with your MySQL user
  password: process.env.DB_PASSWORD,  // Replace with your MySQL password
  database: process.env.DB_DATABASE   // Replace with your database name
};

// Backup directory
const backupDir = path.join(__dirname, 'backups');

// Ensure the backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Backup function
function backupDatabase() {
  console.log('starting backup')
  const fileName = `${dbConfig.database}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
  const filePath = path.join(backupDir, fileName);

  const command = `mysqldump -h ${dbConfig.host} -u ${dbConfig.user} -p${dbConfig.password} ${dbConfig.database} > ${filePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${stderr}`);
    } else {
      console.log(`Backup completed: ${filePath}`);
    }
  });
}

// Schedule the backup (runs daily at 2:00 AM)
const job = new cron.CronJob('0 * * * *', backupDatabase, null, true, 'Asia/Jakarta');
console.log('Backup job scheduled.');
