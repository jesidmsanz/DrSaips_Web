import { getDataOfOracle } from "../../getDataOfOracle";

function findAllByRangeDate(dateStart, dateEnd) {
  return new Promise(async (resolve, reject) => {
    function formatDate(fecha) {
      if (/^\d{2}-\d{2}-\d{4}$/.test(fecha)) {
        const partesFecha = fecha.split("-");
        const anio = partesFecha[2];
        const nuevoAnio = anio.substring(2); // Obtener los últimos dos números del año
        return `${partesFecha[0]}-${partesFecha[1]}-${nuevoAnio}`;
      }
      return fecha; // Devolver la fecha sin cambios si no tiene el formato esperado
    }

    const query = `SELECT * FROM view_auditoria_citas
    where fecha_cita BETWEEN '${formatDate(dateStart)}' And '${formatDate(
      dateEnd
    )}'`;
    console.log("query :>> ", query);
    const result = await getDataOfOracle(query);
    resolve(result);
  });
}

module.exports = {
  findAllByRangeDate,
};
