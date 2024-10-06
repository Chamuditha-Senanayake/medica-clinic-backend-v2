import sql from "mssql";
import getConnection from "./getConnection.js";

export default async function executeQuery({ query, connection }) {
  return new Promise(async (resolve, reject) => {
    try {
      var request = new sql.Request(connection);
      try {
        const result = await request.query(query);
        // connection.close();
        resolve(result);
      } catch (error) {
        console.log(error);
        // connection.close();
        reject(error);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
