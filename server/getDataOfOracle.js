import { credentialsOracleDb } from "./db/conectection";

const OracleDB = require("oracledb");

export const getDataOfOracle = async (query) => {
  try {
    if (query) {
      console.log("QUERY LOGIN", query);
      OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
      // OracleDB.initOracleClient({ libDir: "/var/www/html/websites/DrSaips_Web/instantclient_21_10" });

      const connection = await OracleDB.getConnection(credentialsOracleDb);

      console.log("connection", connection);

      const result = await connection.execute(query, [], {
        resultSet: true,
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      });

      const resultSet = result.resultSet;
      const rows = await resultSet.getRows();

      await resultSet.close();
      await connection.close();

      return rows;
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
};

export const executeQueryOfOracle = async (query) => {
  try {
    if (query) {
      OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
      // OracleDB.initOracleClient({ libDir: "/var/www/html/websites/DrSaips_Web/instantclient_21_10" });

      const connection = await OracleDB.getConnection(credentialsOracleDb);

      const result = await connection.execute(query, [], {
        autoCommit: true, // Asegúrate de establecer autoCommit en true para realizar la operación de eliminación
      });

      await connection.close();

      return result;
    }
    return null;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
