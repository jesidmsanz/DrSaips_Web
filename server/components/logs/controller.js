import { incrementOneDayToDate } from "../../../utils/incrementOneDayToDate";
import { getDataOfOracle } from "../../getDataOfOracle";

function findAllByRangeDate(dateStart, dateEnd, type) {
  return new Promise(async (resolve, reject) => {
    const finishDate = incrementOneDayToDate(dateEnd);
    const query =
      type && type !== "null"
        ? `Select * from view_audit_trail
        where fecha_registro BETWEEN '${dateStart}' AND '${finishDate}' AND TIPO = '${type}'
        order by fecha_Registro desc`
        : `Select * from view_audit_trail
        where fecha_registro BETWEEN '${dateStart}' AND '${finishDate}' 
        order by fecha_Registro desc`;

    console.log("query :>> ", query);
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

module.exports = {
  findAllByRangeDate,
};
