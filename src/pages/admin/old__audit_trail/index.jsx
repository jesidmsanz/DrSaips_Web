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
};

const Index = () => {
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

  const loadData = async () => {
    try {
      setLoading(true);
      const dateStart = convertToCustomDate(form.dateStart);
      const dateEnd = convertToCustomDate(form.dateEnd);
      console.log(
        "`/api/bills/${dateStart}/${dateEnd}` :>> ",
        `/api/bills/${dateStart}/${dateEnd}`
      );
      const result = await apiUrl.get(`/api/bills/${dateStart}/${dateEnd}`);
      if (result.status === 200) {
        const { body } = result.data;
        console.log("body.length :>> ", body);
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

  return (
    <>
      <AdminLayout>
        <Card>
          <Card.Body>
            <Form>
              <Row>
                <Col sm="3">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Fecha inicial</Form.Label>
                    <Form.Control
                      name="dateStart"
                      onChange={handleChange}
                      value={form.dateStart}
                      type="date"
                    />
                  </Form.Group>
                </Col>
                <Col sm="3">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Fecha final</Form.Label>
                    <Form.Control
                      name="dateEnd"
                      onChange={handleChange}
                      value={form.dateEnd}
                      type="date"
                    />
                  </Form.Group>
                </Col>
                <Col sm="3">
                  <ButtonGroup className="mb-2">
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
                      Exportar a Excel
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Form>
            {!loading ? (
              <>
                <div className="table-responsive">
                  <table className="table border mb-0">
                    <thead className="table-light fw-semibold">
                      <tr className="align-middle">
                        <th>Ordinal</th>
                        <th>Fecha Cita</th>
                        <th>Hora Cita</th>
                        <th>Num Doc</th>
                        <th>Paciente</th>
                        <th>Cod Examen</th>
                        <th>Examen</th>
                        <th>Opciones</th>
                        <th aria-label="Action" />
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems?.length > 0 &&
                        currentItems?.map((item) => (
                          <>
                            <tr className="align-middle" key={item.ORDINAL}>
                              <td>
                                <div>{item.ORDINAL}</div>
                              </td>
                              <td>
                                <div>{item.FECHA_CITA}</div>
                              </td>
                              <td>
                                <div>{item.HORA_CITA}</div>
                              </td>
                              <td>
                                <div>{item.NUM_DOC}</div>
                              </td>
                              <td>
                                <div>{item.PACIENTE}</div>
                              </td>
                              <td>
                                <div>{item.COD_EXAMEN}</div>
                              </td>
                              <td>
                                <div>{item.EXAMEN}</div>
                              </td>
                              <td>
                                <Button
                                  type="button"
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
                <th>Ordinal</th>
                <td>{details?.ORDINAL}</td>
              </tr>
              <tr>
                <th>Fecha Cita</th>
                <td>{details?.FECHA_CITA}</td>
              </tr>
              <tr>
                <th>Hora Cita</th>
                <td>{details?.HORA_CITA}</td>
              </tr>
              <tr>
                <th>Num Doc</th>
                <td>{details?.NUM_DOC}</td>
              </tr>
              <tr>
                <th>Paciente</th>
                <td>{details?.PACIENTE}</td>
              </tr>
              <tr>
                <th>Cod Examen</th>
                <td>{details?.COD_EXAMEN}</td>
              </tr>
              <tr>
                <th>Examen</th>
                <td>{details?.EXAMEN}</td>
              </tr>
              <tr>
                <th>Dosis Autorizada</th>
                <td>{details?.DOSIS_AUTORIZADA}</td>
              </tr>
              <tr>
                <th>Estado</th>
                <td>{details?.ESTADO}</td>
              </tr>
              <tr>
                <th>Cumplida</th>
                <td>{details?.CUMPLIDA}</td>
              </tr>
              <tr>
                <th>Confirmada</th>
                <td>{details?.CONFIRMADA}</td>
              </tr>
              <tr>
                <th>Usuario</th>
                <td>{details?.USUARIO}</td>
              </tr>
              <tr>
                <th>User Anula</th>
                <td>{details?.USER_ANULA}</td>
              </tr>
              <tr>
                <th>Comentarios</th>
                <td>{details?.COMENTARIO ?? " "}</td>
              </tr>
              <tr>
                <th>Fecha De Creacion</th>
                <td>
                  {details?.FECHA_CREACION
                    ? details?.FECHA_CREACION.split("T")[0]
                    : ""}
                </td>
              </tr>
              <tr>
                <th>Fecha De Anulación</th>
                <td>
                  {details?.FECHA_ANULACION
                    ? details?.FECHA_ANULACION.split("T")[0]
                    : ""}
                </td>
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

export default Index;
