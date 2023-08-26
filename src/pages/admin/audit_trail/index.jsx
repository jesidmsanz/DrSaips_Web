import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { Button } from "react-bootstrap";
import AuthorizedDose from "../../../components/authorizedDoseForm";
import ElucionesForm from "../../../components/elucionesForm";
import GeneratorForm from "../../../components/generatorForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ViewForm from "./viewForm";

export default function index() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(null);
  const [user, setUser] = useState({ name: "" });
  const route = useRouter();
  const { data: session, status } = useSession();
  const data = [
    {
      title: "Edición: Dosis Autorizada",
      component: <AuthorizedDose user={user} />,
      message: "Digite número de documento del Paciente y fecha de la cita:",
      textButton: "Consultar",
      style: { backgroundColor: "#0A2647", border: "none", color: "#FFF" },
    },
    {
      title: "Edición: Eluciones",
      component: <ElucionesForm user={user} />,
      textButton: "Consultar",
      message: "Digite número de documento del Paciente y fecha de la cita:",
      style: { backgroundColor: "#144272", border: "none", color: "#FFF" },
    },
    {
      title: "Edición: Generador",
      component: <GeneratorForm user={user} />,
      textButton: "Consultar",
      message: "",
      style: { backgroundColor: "#205295", border: "none", color: "#FFF" },
    },
    {
      title: "Logs",
      component: null,
      textButton: "Consultar",
      href: "/admin/logs",
      message: "",
      style: { backgroundColor: "#2C74B3", border: "none", color: "#FFF" },
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
        <div className="card_body_audit">
          {data.map((item, index) => (
            <Button
              className="button"
              style={item.style}
              onClick={() => {
                if (!item.href) {
                  setForm(item);
                  setShow(true);
                } else {
                  route.push(item.href);
                }
              }}
              key={item.title}
            >
              {item.title}
            </Button>
          ))}
        </div>
      </AdminLayout>
      {form?.component && (
        <ViewForm form={form} show={show} handleClose={handleClose} />
      )}
    </>
  );
}
