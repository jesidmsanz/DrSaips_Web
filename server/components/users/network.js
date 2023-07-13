import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

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
    console.log("JEsidddd");
    const query = `Select * from view_auditoria_citas`;
    const result = await getDataOfOracle(query);

    res.json({ message: "Success", data: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on users", error });
  }
});

export default router;
