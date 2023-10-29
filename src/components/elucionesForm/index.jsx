import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { apiUrl } from "@utils/axiosConfig";
import { convertToCustomDate } from "@utils/convertToCustomDate";

const initialState = {
  numberDocument: "",
  citeDate: "",
};

export default function ElucionesForm({ user }) {
  const [form, setForm] = useState(initialState);
  const [formUpdateData, setFormUpdateData] = useState(null);
  const [data, setData] = useState(null);
  const [show, setShow] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleChangeUpdateData = (e) => {
    setFormUpdateData({ ...formUpdateData, [e.target.id]: e.target.value });
  };

  const loadData = async (e) => {
    try {
      e?.preventDefault();
      setSearching(true);
      const citeDate = convertToCustomDate(form.citeDate);
      const result = await apiUrl.get(
        `/api/eluciones/${form.numberDocument}/${citeDate}`
      );
      if (result.status === 200 && result.data.body.length > 0) {
        setData(result.data.body);
      } else {
        setData(null);
      }
      setSearching(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      if (formUpdateData) {
        const update = await apiUrl.put(
          `/api/eluciones/${formUpdateData?.ORDINAL}`,
          { ...formUpdateData, user: user?.login || "" }
        );
        if (update.status === 200) {
          loadData();
          handleClose();
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <>
      <Form onSubmit={loadData}>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>No. Documento</Form.Label>
              <Form.Control
                type="number"
                id="numberDocument"
                onChange={handleChange}
                value={form.numberDocument}
                placeholder="Numero de documento"
                required
              />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha cita</Form.Label>
              <Form.Control
                type="date"
                id="citeDate"
                onChange={handleChange}
                value={form.citeDate}
                placeholder="Numero de documento"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mb-4 mt-4">
          <Button type="submit">
            {searching ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </Form>
      {data && data.length > 0 ? (
        <>
          <Table striped bordered hover size="sm" className="mt-4">
            <thead>
              <tr>
                <th>Numero documento</th>
                <th>Paciente</th>
                <th>Examen</th>
                <th>Fecha cita</th>
                <th>Hora cita</th>
                <th>Actividad</th>
                <th>Volumen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data[0].NUM_DOC}</td>
                <td>{data[0].PACIENTE}</td>
                <td>{data[0].EXAMEN}</td>
                <td>{data[0].FECHA_CITA.split("T")[0]}</td>
                <td>{data[0].HORA_CITA}</td>
                <td>{data[0].ACTIVIDAD}</td>
                <td>{data[0].VOLUMEN}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleShow();
                      setFormUpdateData(data[0]);
                    }}
                  >
                    Actualizar Registros
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header
              style={{ backgroundColor: "#051F34", color: "white" }}
              closeButton
            >
              <Modal.Title>Actualizar Actividad</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#e3e3e36b" }}>
              <Form>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Actividad</Form.Label>
                      <Form.Control
                        type="text"
                        id="ACTIVIDAD"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.ACTIVIDAD}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Actividad</Form.Label>
                      <Form.Control
                        type="number"
                        id="NEW_ACTIVIDAD"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_ACTIVIDAD}
                        placeholder="Nueva Actividad"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Volumen</Form.Label>
                      <Form.Control
                        type="text"
                        id="VOLUMEN"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.VOLUMEN}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuevo volumen</Form.Label>
                      <Form.Control
                        type="number"
                        id="NEW_VOLUMEN"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_VOLUMEN}
                        placeholder="Nueva Volumen"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Observación</Form.Label>
                      <Form.Control
                        as="textarea"
                        id="OBSERVACION"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.OBSERVACION}
                        placeholder="Observación"
                        rows={4}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#e3e3e36b" }}>
              <Button variant="primary" onClick={handleSubmit}>
                Actualizar
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <div className="d-flex justify-content-center mb-4 mt-4">
          <strong>No se encontraron resultados.</strong>
        </div>
      )}
    </>
  );
}
