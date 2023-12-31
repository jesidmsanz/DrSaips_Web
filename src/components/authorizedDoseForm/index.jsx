import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { apiUrl } from "@utils/axiosConfig";
import { convertToCustomDate } from "@utils/convertToCustomDate";

const initialState = {
  numberDocument: "",
  citeDate: "",
};

export default function AuthorizedDose({ user }) {
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
        `/api/authorized_dose/${form.numberDocument}/${citeDate}`
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
          `/api/authorized_dose/${formUpdateData?.ORDINAL}`,
          { ...formUpdateData, user: user?.login || "" }
        );
        if (update?.data?.body?.rowsAffected === 1) {
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
                <th>Cod Examen</th>
                <th>Examen</th>
                <th>Fecha cita</th>
                <th>Hora cita</th>
                <th>Dosis autorizada</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data[0].NUM_DOC}</td>
                <td>{data[0].PACIENTE}</td>
                <td>{data[0].COD_EXAMEN}</td>
                <td>{data[0].EXAMEN}</td>
                <td>{data[0].FECHA_CITA.split("T")[0]}</td>
                <td>{data[0].HORA_CITA}</td>
                <td>{data[0].DOSIS_AUTORIZADA}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleShow();
                      setFormUpdateData(data[0]);
                    }}
                  >
                    Cambiar Dosis
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
              <Modal.Title>Actualizar Dosis Autorizada</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#e3e3e36b" }}>
              <Form>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dosis Autorizada</Form.Label>
                      <Form.Control
                        type="text"
                        id="DOSIS_AUTORIZADA"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.DOSIS_AUTORIZADA}
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Dosis Autorizada</Form.Label>
                      <Form.Control
                        type="number"
                        id="NEW_DOSIS_AUTORIZADA"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_DOSIS_AUTORIZADA}
                        placeholder="Nueva Dosis Autorizada"
                        inputMode="numeric"
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
