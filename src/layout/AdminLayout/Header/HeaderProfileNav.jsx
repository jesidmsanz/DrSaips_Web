import { Dropdown, Nav, NavItem } from "react-bootstrap";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faGear, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { SessionContext, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const ItemWithIcon = (props) => {
  const { icon, children } = props;

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  );
};

export default function HeaderProfileNav() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const logout = async () => {
    const result = await signOut({ redirect: false });

    if (result.error) {
      console.error(result.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <Nav>
      <Dropdown as={NavItem}>
        <strong>{session?.user?.fullName || ""}</strong>
        <Dropdown.Toggle
          variant="link"
          bsPrefix="hide-caret"
          className="py-0 px-2 rounded-0"
          id="dropdown-profile"
        >
          <div className="avatar position-relative">
            <Image
              fill
              className="rounded-circle"
              src="/assets/img/avatars/1.jpg"
              alt="user@email.com"
            />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="pt-0">
          <Dropdown.Header className="bg-light fw-bold">
            Configuración
          </Dropdown.Header>

          {/* <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faUser}>Perfil</ItemWithIcon>
            </Dropdown.Item>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <Dropdown.Item>
              <ItemWithIcon icon={faGear}>Configuración</ItemWithIcon>
            </Dropdown.Item>
          </Link> */}
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>
            <ItemWithIcon icon={faPowerOff}>Cerrar Sesión</ItemWithIcon>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
}
