import sql from "mssql";
import { errorWithData, info } from "./config/logger.js";

import dotenv from "dotenv";

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

export default async function getConnection() {
  try {
    info("Database connection establishment started");
    const connection = await new sql.connect(config);
    return new Promise(async (resolve, reject) => {
      try {
        await connection.connect();
        info("Database connection establishment success");
        resolve(connection);
      } catch (error) {
        errorWithData("Database connection establishment failure", { error });
        reject(error);
      }
    });
  } catch (error) {
    errorWithData("Database connection establishment failure", { error });
    return error;
  }
}
