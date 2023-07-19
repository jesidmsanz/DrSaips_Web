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
import AuthorizedDose from "../../../components/authorizedDose";
import ViewForm from "./viewForm";

const data = [
  {
    title: "Edición: Dosis Autorizada",
    component: <AuthorizedDose />,
    message: "Digite número de documento del paciente y fecha de la cita:",
    textButton: "Consultar",
  },
  { title: "Edición: Eluciones", component: null },
  { title: "Edición: Generador", component: null },
];

export default function index() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(null);

  const handleClose = () => {
    setShow(!show);
    setForm(null);
  };

  return (
    <>
      <AdminLayout>
        <Card>
          <Card.Body>
            {data.map((item, index) => (
              <Button
                className="button"
                onClick={() => {
                  setForm(item);
                  setShow(true);
                }}
                key={item.title}
              >
                {item.title}
              </Button>
            ))}
          </Card.Body>
        </Card>
      </AdminLayout>
      {form && <ViewForm form={form} show={show} handleClose={handleClose} />}
    </>
  );
}
