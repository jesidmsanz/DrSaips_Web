import { credentialsOracleDb } from "./db/conectection";

const OracleDB = require("oracledb");

export const getDataOfOracle = async (query) => {
  try {
    if (query) {
      console.log("query", query);
      console.log("route", process.env.RUTE_INSTANTCLIENT);
      OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
      // OracleDB.initOracleClient({ libDir: "/var/www/html/websites/DrSaips_Web/instantclient_21_10" });

      const connection = await OracleDB.getConnection(credentialsOracleDb);

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
