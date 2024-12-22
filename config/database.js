import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
// Create a new instance of Sequelize with database credentials
export const sequelize = new Sequelize(
    process.env.MYSQL_DB,               // Database name
    process.env.DB_USER,                // Username
    process.env.DB_PASS,                // Password
    {
      host: process.env.DB_HOST.split(':')[0], // Hostname only
      port: process.env.DB_HOST.split(':')[1] || 3306, // Extract port or use default
      dialect: 'mysql',
      logging: false,
    }
  );

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
