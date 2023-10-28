import React, { useEffect, useState } from "react";
import { AdminLayout } from "@layout";
import { Button, Spinner } from "react-bootstrap";
import AuthorizedDose from "../../../components/authorizedDoseForm";
import ElucionesForm from "../../../components/elucionesForm";
import GeneratorForm from "../../../components/generatorForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ViewForm from "./viewForm";
import { apiUrl } from "@utils/axiosConfig";

export default function index() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(null);
  const [user, setUser] = useState(null);
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const { data: session, status } = useSession();
  const data = [
    {
      title: "Edición: Dosis Autorizada",
      component: <AuthorizedDose user={user} />,
      message: "Digite número de documento del Paciente y fecha de la cita:",
      textButton: "Consultar",
      style: { backgroundColor: "#0A2647", border: "none", color: "#FFF" },
      permission: permissions.some(i => i.PERMISO === 'permiso_dosis_autorizada')
    },
    {
      title: "Edición: Eluciones",
      component: <ElucionesForm user={user} />,
      textButton: "Consultar",
      message: "Digite número de documento del Paciente y fecha de la cita:",
      style: { backgroundColor: "#144272", border: "none", color: "#FFF" },
      permission: permissions.some(i => i.PERMISO === 'permiso_eluciones')
    },
    {
      title: "Edición: Generador",
      component: <GeneratorForm user={user} />,
      textButton: "Consultar",
      message: "",
      style: { backgroundColor: "#205295", border: "none", color: "#FFF" },
      permission: permissions.some(i => i.PERMISO === 'permiso_generador')
    },
    {
      title: "Logs",
      component: null,
      textButton: "Consultar",
      href: "/admin/logs",
      message: "",
      style: { backgroundColor: "#2C74B3", border: "none", color: "#FFF" },
      permission: permissions.some(i => i.PERMISO === 'permiso_logs')
    },
  ];

  const loadPermissions = async (userData) => {
    try {
      if (permissions.length > 0) return;
      setLoading(true)
      const result = await apiUrl.get(`/api/users/permissionsByUser/${userData?.name}`)
      setPermissions(result.data.data)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleClose = () => {
    setShow(!show);
    setForm(null);
  };

  useEffect(() => {
    if (session?.user && !permissions.some(i => i.USUARIO === session.user.name && i.PERMISO === 'permiso_audittrail')) setUser(session.user)
    else {
      route.replace('/admin')
    }
    if (user) loadPermissions(user)
  }, [session, user]);


  return (
    <>
      <AdminLayout>
        <div className="card_body_audit">
          {!loading ? data.map((item, index) => item.permission && (
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
          )) : <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>}
        </div>
      </AdminLayout>
      {form?.component && (
        <ViewForm form={form} show={show} handleClose={handleClose} />
      )}
    </>
  );
}
