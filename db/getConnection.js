import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  }
};

export default async function getConnection() {
  try {
    const connection = await new sql.connect(config);
    return new Promise(async (resolve, reject) => {
      try {
        await connection.connect();
        resolve(connection);
      } catch (error) {
        reject(error);
      }
    });
    return connection;
  } catch (error) {
    console.log(error);
    return error;
  }
}
