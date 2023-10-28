"use strict";

module.exports = function setupUser(UserModel, RoleUserModel, db) {
  function findAll() {
    return UserModel.find();
  }

  return {
    findAll,
  };
};
