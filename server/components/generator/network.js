import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/generator";

// GET: api/generator/:NRO_GENERADOR
router.get(`${apiURL}/:NRO_GENERADOR`, async function (req, res) {
  try {
    console.log("api/generator/", req.params.NRO_GENERADOR);
    const result = await controller.findAllByNoGenerator(
      req.params.NRO_GENERADOR
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on generator", error });
  }
});

// PUT: api/generator/:MED_BULT
router.put(`${apiURL}/:ORD_GEN`, async function (req, res) {
  try {
    const result = await controller.updateByNoGenerator(
      req.params.ORD_GEN,
      req.body
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on generator", error });
  }
});

export default router;
