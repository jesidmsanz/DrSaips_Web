import React, { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { apiUrl } from "@utils/axiosConfig";
import { convertToCustomDate } from "@utils/convertToCustomDate";

const initialState = {
  NRO_GENERADOR: "",
};

export default function GeneratorForm({ user }) {
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
      console.log("form.NRO_GENERADOR", form.NRO_GENERADOR);
      const result = await apiUrl.get(`/api/generator/${form.NRO_GENERADOR}`);
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
          `/api/generator/${formUpdateData?.ORD_GEN}`,
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
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>No. Generador</Form.Label>
              <Form.Control
                type="number"
                id="NRO_GENERADOR"
                onChange={handleChange}
                value={form.NRO_GENERADOR}
                placeholder="Numero de generador"
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
                <th>No Generador</th>
                <th>Actividad</th>
                <th>Fecha De Recepción</th>
                <th>Fecha De Salida</th>
                <th>Med Bult</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data[0]?.NRO_GENERADOR}</td>
                <td>{data[0]?.ACTIVIDAD}</td>
                <td>{data[0]?.FEC_RECEPCION.split("T")[0]}</td>
                <td>{data[0]?.FEC_SALIDA.split("T")[0]}</td>
                <td>{data[0]?.MED_BULT}</td>
                <td className="text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleShow();
                      setFormUpdateData({
                        ...data[0],
                        ACTIVIDAD: parseInt(data[0].ACTIVIDAD),
                      });
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
              <Modal.Title>Actualizar Registros</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#e3e3e36b" }}>
              <Form>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>No Generador</Form.Label>
                      <Form.Control
                        type="text"
                        id="NRO_GENERADOR"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NRO_GENERADOR}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuevo No Generador</Form.Label>
                      <Form.Control
                        type="text"
                        id="NEW_NRO_GENERADOR"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_NRO_GENERADOR}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Actividad</Form.Label>
                      <Form.Control
                        type="number"
                        id="ACTIVIDAD"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.ACTIVIDAD}
                        disabled
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
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha Recepción</Form.Label>
                      <Form.Control
                        type="date"
                        id="FEC_RECEPCION"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.FEC_RECEPCION.split("T")[0]}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Fecha Recepción</Form.Label>
                      <Form.Control
                        type="date"
                        id="NEW_FEC_RECEPCION"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_FEC_RECEPCION}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha Salida</Form.Label>
                      <Form.Control
                        type="date"
                        id="FEC_SALIDA"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.FEC_SALIDA.split("T")[0]}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Fecha Salida</Form.Label>
                      <Form.Control
                        type="date"
                        id="NEW_FEC_SALIDA"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_FEC_SALIDA}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Med Bult</Form.Label>
                      <Form.Control
                        type="number"
                        id="MED_BULT"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.MED_BULT}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nuevo Med Bult</Form.Label>
                      <Form.Control
                        type="number"
                        id="NEW_MED_BULT"
                        onChange={handleChangeUpdateData}
                        value={formUpdateData?.NEW_MED_BULT}
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
