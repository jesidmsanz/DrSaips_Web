  import { incrementOneDayToDate } from "../../../utils/incrementOneDayToDate";
  import { getDataOfOracle } from "../../getDataOfOracle";

  function findAllByAuthorizedDose() {
    return new Promise(async (resolve, reject) => {
      const query = `Select * from PERMISOS`;
      const result = await getDataOfOracle(query);
      resolve(result);
    });
  }

  module.exports = {
    findAllByAuthorizedDose,
  };
