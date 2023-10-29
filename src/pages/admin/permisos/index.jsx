import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import {
  Alert,
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
import { useSession } from "next-auth/react";
import convertToTitleCaseAndReplaceUnderscores from "../../../../utils/toTitleCaseClearGuionbajo";

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
  const { data: session, status } = useSession();
  const [namePermission, setNamePermission] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const handleChange = async (checked, user, permiso) => {
    if (!checked) {
      const newData = data.filter(i => i.USUARIO === user && i.PERMISO != permiso)
      setData(newData)
      await apiUrl.delete(`/api/users/removePermission/${user}/${permiso}`)
    } else {
      setData([...data, { USUARIO: user, PERMISO: permiso }])
      await apiUrl.post(`/api/users/addPermission`, { USUARIO: user, PERMISO: permiso })
    }
  }


  const handleClose = () => {
    setShow(false);
    setDetails(null);
  };

  const loadUsers = async () => {
    try {
      const users = await apiUrl.get('/api/users')
      if (users.status === 200) {
        setUsers(users?.data?.data);
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const loadPermisionsByUser = async (user) => {
    try {
      const result = await apiUrl.get(
        `/api/users/permissionsByUser/${user}`
      );
      if (result.status === 200) {
        setData(result?.data?.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadPermisions = async () => {
    try {
      setLoading(true);
      const result = await apiUrl.get(
        `/api/permisos`
      );
      if (result.status === 200) {
        setNamePermission(result?.data?.body);
        setCurrentPage(1); // Reiniciar la página actual al cargar nuevos datos
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!namePermission.length > 0) loadPermisions()
    if (!users.length > 0) loadUsers()
  }, [session]);

  // Calcular índices del primer y último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = namePermission?.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(namePermission?.length / itemsPerPage);

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
            <Row className="mb-4">
              <Col sm="4">
                <Form.Group>
                  <Form.Label>Seleccione el usuario</Form.Label>
                  <Form.Control as="select" value={selectedUser} onChange={(e) => {
                    setSelectedUser(e.target.value)
                    loadPermisionsByUser(e.target.value)
                  }}>
                    <option value="" >Seleccione</option>
                    {users.map((i) => (
                      <option value={i.LOGIN} key={i.LOGIN} >{i.LOGIN} </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            {!loading ? (
              <>
                <div className="table-responsive">
                  <table className="table border mb-0">
                    <thead className="table-light fw-semibold">
                      <tr className="align-middle">
                        <th>Codigo</th>
                        <th>Nombre</th>
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
                                <div>{item.CODIGO}</div>
                              </td>
                              <td>
                                <div>{item.NOMBRE}</div>
                              </td>
                              <td>
                                <Form.Check
                                  type="switch"
                                  id={`${item.CODIGO}`}
                                  label=""
                                  onChange={(e) => handleChange(e.target.checked, selectedUser, item.CODIGO)}
                                  checked={data.some(i => i.USUARIO === selectedUser && i.PERMISO === item.CODIGO)}
                                />
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
