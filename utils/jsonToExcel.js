import ExcelJS from "exceljs";

export const convertToExcel = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Datos");

  // Establecer el estilo de las celdas
  const fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "CCE5FF" }, // Color de fondo de las celdas (azul claro)
  };
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.fill = fill;
    });
  });

  // Agregar los encabezados de columna
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  // Agregar los datos a la hoja de cálculo
  data.forEach((item) => {
    const row = Object.values(item);
    worksheet.addRow(row);
  });

  // Generar el archivo de Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const excelData = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(excelData);
    downloadLink.download = "datos.xlsx";
    downloadLink.click();
  });
};
