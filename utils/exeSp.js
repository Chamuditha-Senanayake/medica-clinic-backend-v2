import sql from "mssql";

export default async function executeSp({ spName, params, connection }) {
  return new Promise(async (resolve, reject) => {
    try {
      var request = new sql.Request(connection);
      try {
        if (params != undefined) {
          params.map((param) => {
            request.input(param.name, param.type, param.value);
          });
        }
        request
          .execute(spName)
          .then(function (err, recordsets, returnValue, affected) {
            resolve(err);
          })
          .catch(function (err) {
            reject(err);
          });
        //
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
