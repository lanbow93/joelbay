import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, ENDPOINT_ID } = process.env;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  define: {
    // You can add Sequelize options here if needed
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You may need to adjust this based on your PostgreSQL setup
    },
  },
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('PostgreSQL connection established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to PostgreSQL:', error);
  });

export default sequelize;
