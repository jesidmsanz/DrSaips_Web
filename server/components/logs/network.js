import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/logs";

// GET: api/logs/:dateStart/:dateEnd/:type
router.get(`${apiURL}/:dateStart/:dateEnd/:type`, async function (req, res) {
  try {
    console.log("logs");
    const result = await controller.findAllByRangeDate(
      req.params.dateStart,
      req.params.dateEnd,
      req.params.type
    );

    setTimeout(() => {
      res.json({ message: "Success", body: result });
    }, 300);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on logs", error });
  }
});

export default router;
