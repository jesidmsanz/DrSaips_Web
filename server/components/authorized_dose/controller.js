import { convertToCustomDate } from "../../../utils/convertToCustomDate";
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

async function updateByAuthorizedDose(ordinal, data) {
  return new Promise(async (resolve, reject) => {
    const {
      NEW_DOSIS_AUTORIZADA,
      NUM_DOC,
      FECHA_CITA,
      HORA_CITA,
      COD_EXAMEN,
      EXAMEN,
      DOSIS_AUTORIZADA,
      OBSERVACION,
      user,
    } = data;
    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);

    const num_ordinal = parseFloat(ordinal);
    const query = `Update citas set dosis_aut = ${NEW_DOSIS_AUTORIZADA} where ordinal = ${num_ordinal}`;
    console.log("query :>> ", query);
    const search = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });

    if (search?.rowsAffected === 1) {
      const date = convertToCustomDate(FECHA_CITA.split("T")[0]);
      const query = `INSERT INTO AUDIT_TRAIL_LOGS (id_parametro, fecha_registro, id_paciente, fecha_cita, 
        hora_cita, cod_Examen, nombre_examen, usuario, registro_actualizado, valor_anterior, valor_nuevo, observaciones)
  VALUES (1, SYSDATE, '${NUM_DOC}', TO_DATE('${date}', 'dd/mm/yy'), '${HORA_CITA}', '${COD_EXAMEN}', '${EXAMEN}', '${
        user || ""
      }', 'DOSIS_AUTORIZADA', 
  '${DOSIS_AUTORIZADA.replace(" mCi", "")}', '${NEW_DOSIS_AUTORIZADA}', '${
        OBSERVACION || " "
      }')`;
      console.log("query :>> ", query);
      const search = await connection.execute(query, [], {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
        autoCommit: true,
      });
    }

    resolve(search);
  });
}

module.exports = {
  findAllByAuthorizedDose,
  updateByAuthorizedDose,
};
