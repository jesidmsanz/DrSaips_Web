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
import AuthorizedDose from "../../../components/authorizedDoseForm";
import ViewForm from "./viewForm";
import ElucionesForm from "../../../components/elucionesForm";
import GeneratorForm from "../../../components/generatorForm";
import { useSession } from "next-auth/react";

export default function index() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(null);
  const [user, setUser] = useState({ name: "" });
  const { data: session, status } = useSession();
  const data = [
    {
      title: "Edición: Dosis Autorizada",
      component: <AuthorizedDose user={user} />,
      message: "Digite número de documento del Paciente y fecha de la cita:",
      textButton: "Consultar",
    },
    {
      title: "Edición: Eluciones",
      component: <ElucionesForm user={user} />,
      textButton: "Consultar",
      message: "Digite número de documento del Paciente y fecha de la cita:",
    },
    {
      title: "Edición: Generador",
      component: <GeneratorForm user={user} />,
      textButton: "Consultar",
    },
  ];

  const handleClose = () => {
    setShow(!show);
    setForm(null);
  };

  useEffect(() => {
    if (session?.user) setUser(session.user);
  }, [session]);

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
