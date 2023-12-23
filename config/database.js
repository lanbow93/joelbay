import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, ENDPOINT_ID } =
  process.env;

const sequelize = new Sequelize({
  dialect: "postgres",
  host: PGHOST,
  port: PGPORT,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  define: {},
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connection established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to PostgreSQL:", error);
  });

export default sequelize;
