import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/eluciones";

// GET: api/eluciones/:numberDocument/:citeDate
router.get(`${apiURL}/:numberDocument/:citeDate`, async function (req, res) {
  try {
    console.log("api/eluciones/");
    const result = await controller.findAllByEluciones(
      req.params.numberDocument,
      req.params.citeDate
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on eluciones", error });
  }
});

// PUT: api/eluciones/:ordinal
router.put(`${apiURL}/:ordinal`, async function (req, res) {
  try {
    const result = await controller.updateByEluciones(
      req.params.ordinal,
      req.body
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on eluciones", error });
  }
});

export default router;
