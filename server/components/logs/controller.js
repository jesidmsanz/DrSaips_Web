import { incrementOneDayToDate } from "../../../utils/incrementOneDayToDate";
import { executeQueryOfOracle, getDataOfOracle } from "../../getDataOfOracle";

function findAllByRangeDate(dateStart, dateEnd, type) {
  return new Promise(async (resolve, reject) => {
    const finishDate = incrementOneDayToDate(dateEnd);
    const query =
      type && type !== "null"
        ? `SELECT * FROM view_audit_trail where fecha_registro between '${dateStart.replace(/-/g, '/')} 00:00:00' and '${dateEnd.replace(/-/g, '/')} 23:59:59' and TIPO = '${type}'
        order by fecha_Registro desc`
        : `SELECT * FROM view_audit_trail where fecha_registro between '${dateStart.replace(/-/g, '/')} 00:00:00' and '${dateEnd.replace(/-/g, '/')} 23:59:59' 
        order by fecha_Registro desc`;

        console.log('query :>> ', query);
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

module.exports = {
  findAllByRangeDate,
};
