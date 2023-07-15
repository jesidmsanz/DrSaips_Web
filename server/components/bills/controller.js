import { getDataOfOracle } from "../../getDataOfOracle";

function findAllByRangeDate(dateStart, dateEnd) {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT * FROM view_auditoria_citas
    where fecha_cita BETWEEN TO_DATE('${dateStart}','dd/mm/yy') AND TO_DATE('${dateEnd}','dd/mm/yy')`;
    console.log("query :>> ", query);
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

module.exports = {
  findAllByRangeDate,
};
