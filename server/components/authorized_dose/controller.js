import { credentialsOracleDb } from "../../db/conectection";
import { getDataOfOracle } from "../../getDataOfOracle";
const OracleDB = require("oracledb");

function findAllByAuthorizedDose(numberDocument, citeDate) {
  return new Promise(async (resolve, reject) => {
    const query = `Select * from view_dosis_autorizada where num_doc = '1064794507' and fecha_cita = TO_DATE('${citeDate}','dd/mm/yy')`;
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

async function updateByAuthorizedDose(ordinal, newValue) {
  return new Promise(async (resolve, reject) => {
    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);

    const num_ordinal = parseFloat(ordinal);
    const num_newValue = parseInt(newValue, 10);

    console.log("query :>update> ", num_ordinal, num_newValue);

    const query = `Update citas set dosis_aut = :num_newValue where ordinal = ${num_ordinal}`;
    const search = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });

    console.log("search :>> ", search);

    resolve(true);
  });
}

module.exports = {
  findAllByAuthorizedDose,
  updateByAuthorizedDose,
};
