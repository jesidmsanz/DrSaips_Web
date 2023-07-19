import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/authorized_dose";

// GET: api/authorized_dose/:numberDocument/:citeDate
router.get(`${apiURL}/:numberDocument/:citeDate`, async function (req, res) {
  try {
    console.log("api/authorized_dose/");
    const result = await controller.findAllByAuthorizedDose(
      req.params.numberDocument,
      req.params.citeDate
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on authorized_dose", error });
  }
});

// PUT: api/authorized_dose/:ordinal
router.put(`${apiURL}/:ordinal`, async function (req, res) {
  try {
    const { DOSIS_AUTORIZADA } = req.body;
    const result = await controller.updateByAuthorizedDose(
      req.params.ordinal,
      DOSIS_AUTORIZADA
    );

    res.json({ message: "Success", body: result });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on authorized_dose", error });
  }
});

export default router;
