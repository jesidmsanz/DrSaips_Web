import {
  convertToCustomDate,
  convertToCustomDate2,
} from "../../../utils/convertToCustomDate";
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
      OBSERVACION,
      NEW_NRO_GENERADOR,
      NEW_ACTIVIDAD,
      NEW_FEC_RECEPCION,
      NEW_FEC_SALIDA,
      NEW_MED_BULT,
      user,
    } = data;

    console.log("data :>------> ", data);

    OracleDB.initOracleClient({ libDir: process.env.RUTE_INSTANTCLIENT });
    const connection = await OracleDB.getConnection(credentialsOracleDb);

    const new_fec_recepcion = NEW_FEC_RECEPCION ?? FEC_RECEPCION;
    const new_fec_salida = NEW_FEC_SALIDA ?? FEC_SALIDA;

    console.log("new_fec_recepcion :>> ", new_fec_recepcion);
    console.log("new_fec_salida :>> ", new_fec_salida);

    const query = `Update eluciones set NRO_GENERADOR = '${
      NEW_NRO_GENERADOR || NRO_GENERADOR
    }', ACTIVIDAD = ${NEW_ACTIVIDAD || ACTIVIDAD?.toString()}, 
    FEC_RECEPCION = TO_DATE('${convertToCustomDate(
      new_fec_recepcion.split("T")[0]
    )}','dd/mm/yy'), FEC_SALIDA = TO_DATE('${convertToCustomDate(
      new_fec_salida.split("T")[0]
    )}','dd/mm/yy'), MED_BULT = ${NEW_MED_BULT || MED_BULT}
    where ORD_GEN = ${ORD_GEN}`;
    console.log("query :>> ", query);
    const search = await connection.execute(query, [], {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
      autoCommit: true,
    });

    const generateQuery = (registro_actualizado, oldValue, newValue) => {
      const query = `INSERT INTO AUDIT_TRAIL_LOGS (id_parametro, fecha_registro, id_paciente, fecha_cita, 
        hora_cita, cod_Examen, nombre_examen, usuario, registro_actualizado, valor_anterior, valor_nuevo, observaciones)
  VALUES (3, SYSDATE, null,null, null, null, null, '${
    user || ""
  }', '${registro_actualizado}', '${oldValue || ""}', '${newValue || ""}', '${
        OBSERVACION || " "
      }')`;
      return query;
    };

    const loadSearch = async (query) => {
      try {
        await connection.execute(query, [], {
          outFormat: OracleDB.OUT_FORMAT_OBJECT,
          autoCommit: true,
        });
      } catch (error) {
        console.log("error loadSearch:>> ", error);
      }
    };

    if (NEW_NRO_GENERADOR) {
      const query = generateQuery(
        "NRO_GENERADOR",
        NRO_GENERADOR,
        NEW_NRO_GENERADOR
      );
      await loadSearch(query);
    }

    if (NEW_ACTIVIDAD) {
      const query = generateQuery("ACTIVIDAD", ACTIVIDAD, NEW_ACTIVIDAD);
      await loadSearch(query);
    }

    if (NEW_FEC_RECEPCION) {
      const query = `INSERT INTO AUDIT_TRAIL_LOGS (id_parametro, fecha_registro, id_paciente, fecha_cita, 
        hora_cita, cod_Examen, nombre_examen, usuario, registro_actualizado, valor_anterior, valor_nuevo, observaciones)
  VALUES (3, SYSDATE, null,null, null, null, null, '${
    user || ""
  }', 'FEC_RECEPCION', '${convertToCustomDate(
        FEC_RECEPCION.split("T")[0]
      )}', '${convertToCustomDate(NEW_FEC_RECEPCION.split("T")[0])}', '${
        OBSERVACION || " "
      }')`;
      await loadSearch(query);
    }

    if (NEW_FEC_SALIDA) {
      const query = `INSERT INTO AUDIT_TRAIL_LOGS (id_parametro, fecha_registro, id_paciente, fecha_cita, 
        hora_cita, cod_Examen, nombre_examen, usuario, registro_actualizado, valor_anterior, valor_nuevo, observaciones)
  VALUES (3, SYSDATE, null,null, null, null, null, '${
    user || ""
  }', 'FEC_SALIDA', '${convertToCustomDate(
        FEC_SALIDA.split("T")[0]
      )}', '${convertToCustomDate(NEW_FEC_SALIDA.split("T")[0])}', '${
        OBSERVACION || " "
      }')`;
      await loadSearch(query);
    }

    if (NEW_MED_BULT) {
      const query = generateQuery("MED_BULT", MED_BULT, NEW_MED_BULT);
      await loadSearch(query);
    }

    resolve(search);
  });
}

module.exports = {
  findAllByNoGenerator,
  updateByNoGenerator,
};
