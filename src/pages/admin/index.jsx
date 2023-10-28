import Image from "next/image";
import { AdminLayout } from "@layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Card, Dropdown, ProgressBar } from "react-bootstrap";

import {
  faCcAmex,
  faCcApplePay,
  faCcPaypal,
  faCcStripe,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons";

import React from "react";

const Home = () => {
  return (
    <AdminLayout>
      <div className="messageWellcome">

        <Image
          width={300}
          height={250}
          src="/assets/img/avatars/logo_mediano.png"
          alt="user@example.com"
        />
        <h2>¡Bienvenidos a Dr. Saips, Si requieren asistencia por favor comunicate con el equipo de soporte.</h2>
      </div>
    </AdminLayout>
  );
};

export default Home;
