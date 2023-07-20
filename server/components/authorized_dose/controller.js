import { credentialsOracleDb } from "../../db/conectection";
import { getDataOfOracle } from "../../getDataOfOracle";
const OracleDB = require("oracledb");

function findAllByAuthorizedDose(numberDocument, citeDate) {
  return new Promise(async (resolve, reject) => {
    const query = `Select * from view_dosis_autorizada where num_doc = '${numberDocument}' and fecha_cita = TO_DATE('${citeDate}','dd/mm/yy')`;
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

async function updateByAuthorizedDose(ordinal, newValue) {
  return new Promise(async (resolve, reject) => {
    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);

    const num_ordinal = parseFloat(ordinal);
    const query = `Update citas set dosis_aut = ${newValue} where ordinal = ${num_ordinal}`;
    const search = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });

    resolve(search);
  });
}

module.exports = {
  findAllByAuthorizedDose,
  updateByAuthorizedDose,
};
