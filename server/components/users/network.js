import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { executeQueryOfOracle, getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/users";

// POST: api/users/login
router.post(`${apiURL}/login`, async function (req, res) {
  try {
    const { username, password } = req.body;
    console.log("Login", username, password);
    const query = `SELECT LOGIN AS LOG, DECODE (PWD('${username}','${password}'), CLAVE, 1, 0) AS Acceso FROM USUARIOS WHERE LOGIN = '${username}'`;
    const result = await getDataOfOracle(query);
    if (result && result.length > 0) {
      const user = result[0];
      console.log("user :>> ", user);
      if (user && user.ACCESO === 1) {
        res.json({ message: "Success", status: 200 });
      }
    } else {
      res.status(400).json({ message: "Error on users", error: true });
    }
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on users", error });
  }
});

// GET: api/users
router.get(apiURL, async function (req, res) {
  try {
    const query = `Select LOGIN from USUARIOS`;
    const result = await getDataOfOracle(query);

    res.json({ message: "Success", data: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on users", error });
  }
});

// GET: api/users/permissionsByUser
router.get(`${apiURL}/permissionsByUser`, async function (req, res) {
  try {
    const query = `Select * from USUARIOS_PERMISOS`;
    console.log("query", query);
    const result = await getDataOfOracle(query);

    res.json({ message: "Success", data: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on users", error });
  }
});

// GET: api/users/permissionsByUser
router.get(`${apiURL}/permissionsByUser/:user`, async function (req, res) {
  try {
    const { user } = req.params;
    const query = `Select * from USUARIOS_PERMISOS WHERE USUARIO = '${user}'`;
    console.log("query", query);
    const result = await getDataOfOracle(query);

    res.json({ message: "Success", data: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on users", error });
  }
});

// POST: api/users/addPermission
router.post(`${apiURL}/addPermission`, async function (req, res) {
  try {
    console.log("ADD PERMISSION");
    const { USUARIO, PERMISO } = req.body; // Asegúrate de que los campos 'usuario' y 'permiso' existan en el cuerpo de la solicitud
    const query = `INSERT INTO USUARIOS_PERMISOS (USUARIO, PERMISO) VALUES ('${USUARIO}', '${PERMISO}')`;
    console.log("query", query);
    // Ejecuta la consulta para insertar los datos en la base de datos
    const result = await executeQueryOfOracle(query);

    res.json({ message: "Insertion successful", data: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on insert", error });
  }
});

// DELETE: api/users/removePermission/:usuario/:permiso
router.delete(
  `${apiURL}/removePermission/:usuario/:permiso`,
  async function (req, res) {
    try {
      console.log("DELETE PERMISSION");
      const { usuario, permiso } = req.params; // Obtiene los parámetros de la URL
      const query = `DELETE FROM USUARIOS_PERMISOS WHERE USUARIO = '${usuario}' AND PERMISO = '${permiso}'`;
      console.log("query", query);
      // Ejecuta la consulta para eliminar los datos de la base de datos
      const result = await executeQueryOfOracle(query);

      res.json({ message: "Deletion successful", data: result });
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(400).json({ message: "Error on deletion", error });
    }
  }
);

export default router;
