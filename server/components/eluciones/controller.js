import { credentialsOracleDb } from "../../db/conectection";
import { getDataOfOracle } from "../../getDataOfOracle";
const OracleDB = require("oracledb");

function findAllByEluciones(numberDocument, citeDate) {
  return new Promise(async (resolve, reject) => {
    const query = `Select * from view_eluciones where num_doc = '${numberDocument}' and fecha_cita = TO_DATE('${citeDate}','dd/mm/yy')`;
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

async function updateByEluciones(ordinal, data) {
  return new Promise(async (resolve, reject) => {
    const {
      VOLUMEN,
      ACTIVIDAD,
      NEW_ACTIVIDAD,
      NEW_VOLUMEN,
      NUM_DOC,
      FECHA_CITA,
      HORA_CITA,
      COD_EXAMEN,
      EXAMEN,
      OBSERVACION,
      user,
    } = data;

    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);
    const num_ordinal = parseFloat(ordinal);
    const result = [];

    const search = async (query) => {
      const result = await connection.execute(query, [], {
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
        autoCommit: true,
      });
      return result;
    };

    const insertLog = async (field, oldValue, newValue) => {
      try {
        const query = `INSERT INTO AUDIT_TRAIL_LOGS (id_parametro, fecha_registro, id_paciente, fecha_cita, 
            hora_cita, cod_Examen, nombre_examen, usuario, registro_actualizado, valor_anterior, valor_nuevo, observaciones)
      VALUES (2, SYSDATE, '${NUM_DOC}', '${FECHA_CITA}', '${HORA_CITA}', '${COD_EXAMEN}', '${EXAMEN}', '${
          user || ""
        }', '${field}', 
      '${oldValue}', '${newValue}', '${OBSERVACION || "Sin Observación"}')`;
        const search = await connection.execute(query, [], {
          outFormat: OracleDB.OUT_FORMAT_OBJECT,
          autoCommit: true,
        });
        return search;
      } catch (error) {
        console.log("error", error);
      }
    };

    if (NEW_VOLUMEN) {
      const insert = await search(
        `Update citas set volumen = ${NEW_VOLUMEN} where ordinal = ${num_ordinal}`
      );
      if (insert.rowsAffected === 1) {
        await insertLog("volumen", VOLUMEN, NEW_VOLUMEN);
      }
      result.push({ updateVolumen: insert });
    }

    if (NEW_ACTIVIDAD) {
      const insert = await search(
        `Update citas set Activ_eluc = ${NEW_ACTIVIDAD} where ordinal = ${num_ordinal}`
      );
      if (insert.rowsAffected === 1) {
        await insertLog("Activ_eluc", ACTIVIDAD, NEW_ACTIVIDAD);
      }
      result.push({ updateActividad: insert });
    }
    resolve(result);
  });
}

module.exports = {
  findAllByEluciones,
  updateByEluciones,
};
