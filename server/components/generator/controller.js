import { convertToCustomDate } from "../../../utils/convertToCustomDate";
import { credentialsOracleDb } from "../../db/conectection";
import { getDataOfOracle } from "../../getDataOfOracle";
const OracleDB = require("oracledb");

function findAllByNoGenerator(NRO_GENERADOR) {
  return new Promise(async (resolve, reject) => {
    const query = `Select * from view_auditoria_generador where nro_generador = '${NRO_GENERADOR}'`;
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

async function updateByNoGenerator(ORD_GEN, data) {
  return new Promise(async (resolve, reject) => {
    const {
      NRO_GENERADOR,
      ACTIVIDAD,
      FEC_RECEPCION,
      FEC_SALIDA,
      MED_BULT,
      NEW_NRO_GENERADOR,
      NEW_ACTIVIDAD,
      NEW_FEC_RECEPCION,
      NEW_FEC_SALIDA,
      NEW_MED_BULT,
    } = data;
    console.log("data :>> ", data);
    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);

    const new_fec_recepcion = NEW_FEC_RECEPCION ?? FEC_RECEPCION;
    const new_fec_salida = NEW_FEC_SALIDA ?? FEC_SALIDA;

    const query = `Update eluciones set NRO_GENERADOR = '${
      NEW_NRO_GENERADOR || NRO_GENERADOR
    }', ACTIVIDAD = '${NEW_ACTIVIDAD || ACTIVIDAD}', 
    FEC_RECEPCION = TO_DATE('${convertToCustomDate(
      new_fec_recepcion.split("T")[0]
    )}','dd/mm/yy'), FEC_SALIDA = TO_DATE('${convertToCustomDate(
      new_fec_salida.split("T")[0]
    )}','dd/mm/yy'), MED_BULT = '${NEW_MED_BULT || MED_BULT}'
    where ORD_GEN = ${ORD_GEN}`;
    const search = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });

    resolve(search);
  });
}

module.exports = {
  findAllByNoGenerator,
  updateByNoGenerator,
};
