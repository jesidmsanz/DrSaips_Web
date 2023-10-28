import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faNoteSticky,
  faGear,
  faMagicWandSparkles,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Accordion,
  AccordionContext,
  Badge,
  Button,
  Nav,
} from "react-bootstrap";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { apiUrl } from "@utils/axiosConfig";

const SidebarNavItem = (props) => {
  const { icon, children, href } = props;

  return (
    <Nav.Item>
      <Link href={href} passHref legacyBehavior>
        <Nav.Link className="px-3 py-2 d-flex align-items-center item_nav">
          {icon ? (
            <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
          ) : (
            <span className="nav-icon ms-n3" />
          )}
          {children}
        </Nav.Link>
      </Link>
    </Nav.Item>
  );
};

const SidebarNavTitle = (props) => {
  const { children } = props;

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  );
};

const SidebarNavGroupToggle = (props) => {
  const { activeEventKey } = useContext(AccordionContext);
  const { eventKey, icon, children, setIsShow } = props;

  const isCurrentEventKey = activeEventKey === eventKey;

  useEffect(() => {
    setIsShow(activeEventKey === eventKey);
  }, [activeEventKey, eventKey, setIsShow]);

  return (
    <Button
      variant="link"
      type="button"
      className={classNames(
        "rounded-0 nav-link px-3 py-2 d-flex align-items-center flex-fill w-100 shadow-none",
        {
          collapsed: !isCurrentEventKey,
        }
      )}
    >
      <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
      {children}
      <div className="nav-chevron ms-auto text-end">
        <FontAwesomeIcon size="xs" icon={faChevronUp} />
      </div>
    </Button>
  );
};

const SidebarNavGroup = (props) => {
  const { toggleIcon, toggleText, children } = props;

  const [isShow, setIsShow] = useState(false);

  return (
    <Accordion
      as="li"
      bsPrefix="nav-group"
      className={classNames({ show: isShow })}
    >
      <SidebarNavGroupToggle
        icon={toggleIcon}
        eventKey="0"
        setIsShow={setIsShow}
      >
        {toggleText}
      </SidebarNavGroupToggle>
      <Accordion.Collapse eventKey="0">
        <ul className="nav-group-items list-unstyled">{children}</ul>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default function SidebarNav() {
  const { data: session, status } = useSession();
  const [data, setData] = useState([])

  console.log('data:D', data)

  const loadPermisionsByUser = async (user) => {
    try {
      console.log('user', user)
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

  useEffect(() => {
    if (session?.user?.name) loadPermisionsByUser(session.user.name)
  }, [session])

  return (
    <ul className="list-unstyled">
      {/* <SidebarNavItem icon={faGauge} href="/">
        Dashboard
        <small className="ms-auto">
          <Badge bg="info" className="ms-auto">
            NEW
          </Badge>
        </small>
      </SidebarNavItem> */}
      <SidebarNavItem href="/admin/audit_trail"></SidebarNavItem>
      <div className="logo_left">
        <Image
          width={120}
          height={70}
          src="/assets/img/avatars/logoblanco.png"
          alt="user@example.com"
        />
      </div>
      {data.some(i => i.PERMISO === 'permiso_audittrail' && session?.user?.name === i.USUARIO) && <SidebarNavItem icon={faMagnifyingGlass} href="/admin/audit_trail">
        Audit Trail
      </SidebarNavItem>}
      {data.some(i => i.PERMISO === 'permiso_permisos' && session?.user?.name === i.USUARIO) && <SidebarNavItem icon={faMagnifyingGlass} href="/admin/permisos">
        Permisos
      </SidebarNavItem>}
      {/* <SidebarNavItem icon={faNoteSticky} href="#">
        Reportes
      </SidebarNavItem>
      <SidebarNavItem icon={faGear} href="#">
        Configuración
      </SidebarNavItem> */}
    </ul>
  );
}
