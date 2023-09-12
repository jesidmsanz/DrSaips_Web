import jsPDF from "jspdf";
import "jspdf-autotable";

async function generatePDF({ headData, bodyData }) {
  const doc = new jsPDF({
    orientation: "landscape", // Establecer la orientación en horizontal
    unit: "pt", // Unidad de medida (puntos)
  });

  console.log("headData, bodyData", bodyData);

  const logoImage = "/assets/img/avatars/logo.png"; // Ruta de la imagen del logotipo

  const title = "MEDICINA NUCLEAR S.A"; // Título
  const subtitle = "NIT 824004330-3"; // Subtitle
  const subtitle2 = "INFORME AUDIT TRAIL"; // Subtitle

  // Calcular el ancho del título
  const titleWidth = doc.getStringUnitWidth(title) * 16; // Tamaño de fuente x 16 (ajuste de ancho de fuente)
  const subTitle = doc.getStringUnitWidth(subtitle) * 16; // Tamaño de fuente x 16 (ajuste de ancho de fuente)
  const subTitle2 = doc.getStringUnitWidth(subtitle2) * 16; // Tamaño de fuente x 16 (ajuste de ancho de fuente)

  // Calcular la posición para centrar el título horizontalmente
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight(); // Alto de la página
  const xPos = (pageWidth - titleWidth) / 2;

  // Calcular la posición para centrar el título horizontalmente
  const xPosSubtitle = (pageWidth - subTitle) / 2;
  const xPosSubtitle2 = (pageWidth - subTitle2) / 2;
  doc.setFont("helvetica", "bold");
  // Agregar el título centrado
  doc.setFontSize(14); // Tamaño de fuente para el título
  doc.text(title, xPos, 50); // Título y posición centrada horizontalmente

  // Agregar el subtitle centrado
  doc.setFontSize(14); // Tamaño de fuente para el título
  doc.text(subtitle, xPosSubtitle, 75); // Subtitle y posición centrada horizontalmente

  // Agregar el subtitle centrado
  doc.setFontSize(14); // Tamaño de fuente para el título
  doc.text(subtitle2, xPosSubtitle2, 100); // Subtitle y posición centrada horizontalmente
  // Restablecer la fuente a la normal para el texto siguiente
  doc.setFont("helvetica", "normal");
  // Agregar el logotipo en la parte superior izquierda
  doc.addImage(logoImage, "PNG", 20, 20, 160, 80); // (imagen, tipo, x, y, ancho, alto)

  // Establecer el color de dibujo a un color más claro (por ejemplo, gris claro)
  doc.setDrawColor(200, 200, 200); // Puedes ajustar los valores RGB según tus preferencias

  // Dibujar una línea para separar la parte superior de la tabla
  doc.setLineWidth(1); // Ancho de la línea
  doc.line(40, 120, pageWidth - 40, 120); // (x1, y1, x2, y2) - ajusta las coordenadas y el ancho según sea necesario

  // Restaurar el color de dibujo a su valor predeterminado (negro)
  doc.setDrawColor(0);

  //Texto Derecha superior
  // const marginRight = 20; // Margen derecho para el texto
  // const marginTopRight = 20; // Margen superior para el texto
  // Texto que deseas agregar
  // const textoRight = "Texto en la esquina derecha superior";

  // // Calcular la posición del texto
  // const textWidth =
  //   doc.getStringUnitWidth(textoRight) * doc.internal.getFontSize();
  // const textXRight = pageWidth - marginRight - textWidth;
  // const textYRight = marginTopRight;

  // // Agregar el texto en la posición calculada
  // doc.text(textXRight, textYRight, textoRight);

  ///Texto Izquierda superior
  const marginLeft = 40; // Margen izquierdo para el texto
  const marginTopLeft = 110; // Margen superior para el texto
  const fontSize = 10; // Tamaño de fuente en puntos

  const dateCurrent = new Date();

  // Texto que deseas agregar
  const textoLeft = `FECHA: DIA: ${dateCurrent.getDate()} MES: ${
    dateCurrent.getMonth() + 1
  } AÑO: ${dateCurrent.getFullYear()}`;

  // Guardar el tamaño de fuente actual
  const fontSizeBefore = doc.internal.getFontSize();

  // Establecer el tamaño de fuente personalizado
  doc.setFontSize(fontSize);

  // Calcular la posición del texto
  const textXLeft = marginLeft;
  const textYLeft = marginTopLeft;
  // Establecer la fuente en negritas solo para este texto
  doc.setFont("helvetica", "bold");
  // Agregar el texto en la posición calculada
  doc.text(textXLeft, textYLeft, textoLeft);
  // Restablecer la fuente a la normal para el texto siguiente
  doc.setFont("helvetica", "normal");
  // Restaurar el tamaño de fuente anterior
  doc.setFontSize(fontSizeBefore);

  doc.autoTable({
    head: headData,
    body: bodyData,
    startY: 130, // Ajusta la posición vertical de inicio para mover la tabla más abajo
    showHead: true, // Evitar que se repita la cabecera en la siguiente página
    styles: {
      fillColor: [227, 220, 195],
      textColor: [0, 0, 0],
      cellPadding: 8, // Ajusta el espacio entre el contenido de la celda y los bordes de la celda
      fontSize: 7,
    },
  });
  doc.save("Logs.pdf");
}

export default generatePDF;
