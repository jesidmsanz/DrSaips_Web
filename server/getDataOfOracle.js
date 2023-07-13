const OracleDB = require("oracledb");

export const getDataOfOracle = async (query) => {
  try {
    if (query) {
      OracleDB.initOracleClient({ libDir: "C:\\instantclient_21_10" });

      const connection = await OracleDB.getConnection({
        user: "DRSAIPS",
        password: "SPIASRD",
        connectString:
          "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(CONNECT_DATA =(SID= xe)))",
        externalAuth: false,
      });

      // Realiza la consulta a la tabla "users"
      const result = await connection.execute(query);
      const columnNames = result.metaData.map((column) => column.name);

      // Obtener los valores de las filas
      const rows = result.rows;

      // Crear un array de objetos con los títulos de las columnas y los valores de las filas
      const jsonData = rows.map((row) => {
        const obj = {};
        columnNames.forEach((columnName, index) => {
          obj[columnName] = row[index];
        });
        return obj;
      });

      // Cierra la conexión al finalizar
      await connection.close();

      // Mostrar el resultado en formato JSON con los títulos de las columnas
      return jsonData;
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
