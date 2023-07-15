const OracleDB = require("oracledb");

export const getDataOfOracle = async (query) => {
  try {
    if (query) {
      console.log("query", query);
      OracleDB.initOracleClient({ libDir: "C:\\instantclient_21_10" });
      // OracleDB.initOracleClient({ libDir: "/var/www/html/websites/DrSaips_Web/instantclient_21_10" });

      const connection = await OracleDB.getConnection({
        user: process.env.USER,
        password: process.env.PASS,
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = pirasoft.top)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
        externalAuth: false,
      });

      const result = await connection.execute(query, [], { resultSet: true });

      const resultSet = result.resultSet;
      const rows = await resultSet.getRows(); // Obtener todas las filas

      const columnNames = result.metaData.map((column) => column.name);
      const jsonData = rows.map((row) => {
        const obj = {};
        columnNames.forEach((columnName, index) => {
          obj[columnName] = row[index];
        });
        return obj;
      });

      console.log("jsonData.length", jsonData.length);

      await resultSet.close();
      await connection.close();

      return jsonData;
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
