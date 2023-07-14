import passport from "passport";
import { Router } from "express";
import controller from "./controller";
import baseHandler from "@server/network/baseHandler";
import { getDataOfOracle } from "../../getDataOfOracle";

const router = Router();
const apiURL = "/api/bills";

// GET: api/bills/:dateStart/:dateEnd
router.get(`${apiURL}/:dateStart/:dateEnd`, async function (req, res) {
  try {
    const result = await controller.findAllByRangeDate(
      req.params.dateStart,
      req.params.dateEnd
    );

    setTimeout(() => {
      res.json({ message: "Success", body: result });
    }, 300);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(400).json({ message: "Error on bills", error });
  }
});

export default router;
