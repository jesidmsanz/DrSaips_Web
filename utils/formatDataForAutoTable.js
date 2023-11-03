import { toTitleCase } from "./formatTitleCase";

export const formatDataForAutoTable = (data) => {
  if (data.length === 0) {
    return { head: [], body: [] };
  }
  const newData = data.map((item) => {
    const date_cite = item?.FECHA_CITA ? item?.FECHA_CITA.split("T")[0] : "";
    item.FECHA_CITA = date_cite;
    item.PACIENTE = item.PACIENTE.replace(/\s+/g, " ").trim();
    item.USUARIO = item.USUARIO.replace(/\s+/g, " ").trim();
    return item;
  });

  const head = Object.keys(newData[0]); // Tomar las propiedades del primer objeto como cabeceras
  const body = newData.map((user) => Object.values(user)); // Tomar los valores de cada objeto

  return {
    headData: [head.map((item) => item.replace(/_/g, " ").toUpperCase())],
    bodyData: body,
  };
};
