import * as uuid from "uuid";
import * as bcrypt from "bcrypt";

function findAll() {
  return new Promise(async (resolve, reject) => {
    // const { Users } = await db();
    console.log("holaaa");
    // const result = await Users.findAll();
    // resolve(result);
  });
}

module.exports = {
  findAll,
};
