import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { apiUrl } from "@utils/axiosConfig";
import { convertToCustomDate } from "@utils/convertToCustomDate";
import { convertToExcel } from "@utils/jsonToExcel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "@utils/dates";
import { useRouter } from "next/router";
import generatePDF from "../../../../utils/generatePdf";
import { formatDataForAutoTable } from "../../../../utils/formatDataForAutoTable";

// Obtener la fecha actual
const currentDate = new Date();
const currentFormattedDate = formatDate(currentDate);

// Obtener la fecha de hace un mes
const oneMonthAgoDate = new Date();
oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1);
const oneMonthAgoFormattedDate = formatDate(oneMonthAgoDate);

const initialState = {
  dateStart: oneMonthAgoFormattedDate,
  dateEnd: currentFormattedDate,
  type: "",
};

const Logs = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialState);
  const [details, setDetails] = useState(null);
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
    setDetails(null);
  };

  const handleGeneratePDF = async () => {
    await generatePDF(formatDataForAutoTable(data));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const dateStart = convertToCustomDate(form.dateStart);
      const dateEnd = convertToCustomDate(form.dateEnd);
      const type = form.type || null;
      const result = await apiUrl.get(
        `/api/logs/${dateStart}/${dateEnd}/${type}`
      );
      if (result.status === 200) {
        const { body } = result.data;
        setData(body);
        setCurrentPage(1); // Reiniciar la página actual al cargar nuevos datos
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calcular índices del primer y último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Generar los números de página a mostrar en la paginación
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const route = useRouter();
  return (
    <>
      <AdminLayout>
        <Card>
          <Card.Body>
            <Form>
              <div className="form_logs">
                <div className="block1">
                  <Form.Group
                    className="mb-3 form_group_logs"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Fecha inicial</Form.Label>
                    <Form.Control
                      name="dateStart"
                      onChange={handleChange}
                      value={form.dateStart}
                      type="date"
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 form_group_logs"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Fecha final</Form.Label>
                    <Form.Control
                      name="dateEnd"
                      onChange={handleChange}
                      value={form.dateEnd}
                      type="date"
                      required
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3 form_group_logs"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      onChange={handleChange}
                      value={form.type}
                    >
                      <option value={null}>Sleccione un tipo</option>
                      <option value="Dosis Autorizada">Dosis Autorizada</option>
                      <option value="Eluciones">Eluciones</option>
                      <option value="Generador">Generador</option>
                    </Form.Control>
                  </Form.Group>
                  <ButtonGroup className="mb-2 buttonGroup">
                    <Button
                      type="button"
                      onClick={() => {
                        loadData();
                      }}
                      variant="primary"
                      style={{ marginTop: "30px" }}
                      disabled={loading}
                    >
                      {loading ? "Filtrando..." : "Filtrar"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => convertToExcel(data)}
                      variant="success"
                      style={{ marginTop: "30px" }}
                    >
                      Exp Excel
                    </Button>
                  </ButtonGroup>
                  <div>
                    <Button
                      type="button"
                      onClick={handleGeneratePDF}
                      variant="success"
                      style={{ marginTop: "30px", marginLeft: "10px" }}
                    >
                      Exp PDF
                    </Button>
                  </div>
                </div>
                <div>
                  <Button
                    style={{ marginTop: "30px" }}
                    onClick={() => route.replace("/admin/audit_trail")}
                  >
                    Atras
                  </Button>
                </div>
              </div>
            </Form>
            {!loading ? (
              <>
                <div className="table-responsive">
                  <table className="table border mb-0">
                    <thead className="table-light fw-semibold">
                      <tr className="align-middle">
                        <th>Tipo</th>
                        <th>Fecha Registro</th>
                        <th>Id Paciente</th>
                        <th>Fecha Cita</th>
                        <th>Hora Cita</th>
                        <th>Cod Examen</th>
                        <th>Examen</th>
                        <th>Ver</th>
                        <th aria-label="Action" />
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems?.length > 0 &&
                        currentItems?.map((item, index) => (
                          <>
                            <tr
                              className="align-middle"
                              key={item.ID_PACIENTE || index}
                            >
                              <td>
                                <div>{item.TIPO}</div>
                              </td>
                              <td>
                                <div>{item.FECHA_REGISTRO}</div>
                              </td>
                              <td>
                                <div>{item.ID_PACIENTE}</div>
                              </td>
                              <td>
                                <div>{item?.FECHA_CITA?.split("T")[0]}</div>
                              </td>
                              <td>
                                <div>{item.HORA_CITA}</div>
                              </td>
                              <td>
                                <div>{item.COD_EXAMEN}</div>
                              </td>
                              <td>
                                <div>{item.NOMBRE_EXAMEN}</div>
                              </td>
                              <td>
                                <Button
                                  type="button"
                                  variant="light"
                                  onClick={() => {
                                    setDetails(item);
                                    setShow(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFile} size="lg" />
                                </Button>
                              </td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        prevPage > 1 ? prevPage - 1 : prevPage
                      )
                    }
                    disabled={currentPage === 1}
                  />
                  {pageNumbers.map((pageNumber, index) => (
                    <Pagination.Item
                      key={`${pageNumber}`}
                      active={pageNumber === currentPage}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        prevPage < totalPages ? prevPage + 1 : prevPage
                      )
                    }
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </>
            ) : (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Card>
      </AdminLayout>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-stripe">
            <tbody>
              <tr>
                <th>Tipo</th>
                <td>{details?.TIPO}</td>
              </tr>
              <tr>
                <th>Fecha Registro</th>
                <td>{details?.FECHA_REGISTRO}</td>
              </tr>
              <tr>
                <th>Id Paciente</th>
                <td>{details?.ID_PACIENTE}</td>
              </tr>
              <tr>
                <th>Fecha Cita</th>
                <td>{details?.FECHA_CITA?.split("T")[0]}</td>
              </tr>
              <tr>
                <th>Hora Cita</th>
                <td>{details?.HORA_CITA}</td>
              </tr>
              <tr>
                <th>Cod Examen</th>
                <td>{details?.COD_EXAMEN}</td>
              </tr>
              <tr>
                <th>Examen</th>
                <td>{details?.NOMBRE_EXAMEN}</td>
              </tr>
              <tr>
                <th>Usuario</th>
                <td>{details?.USUARIO}</td>
              </tr>
              <tr>
                <th>Registor Actualizado</th>
                <td>{details?.REGISTRO_ACTUALIZADO}</td>
              </tr>
              <tr>
                <th>Valor Anterior</th>
                <td>{details?.VALOR_ANTERIOR}</td>
              </tr>
              <tr>
                <th>Valor Nuevo</th>
                <td>{details?.VALOR_NUEVO}</td>
              </tr>
              <tr>
                <th>Observaciones</th>
                <td>{details?.OBSERVACIONES}</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Logs;
