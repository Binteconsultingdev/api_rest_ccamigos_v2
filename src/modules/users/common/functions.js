const tables = require("../../../common/helpers/constants/tables");
const bcrypt = require("bcrypt");
const {
  errors,
  success,
} = require("../../../common/helpers/constants/messages");
const {
  readAllRecord,
  updateRecord,
  createRecord,
  uploadFile,
} = require("../../../common/helpers/functions");
const constants = require("../../../common/helpers/constants/constants");

module.exports = {
  validatePassword: async (user, password) => {
    return new Promise(function (resolve, reject) {
      const validatePassword = bcrypt.compareSync(password, user.password);
      resolve([validatePassword]);
    });
  },
  searchOrganization: async (code, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        const organization = await readAllRecord(
          `SELECT * FROM ${tables.tables.Organizations.name} WHERE code = '${code}'`,
          connection
        );

        if (organization[2].length > 0) {
          resolve([
            true,
            success.successJoinOrganization,
            organization[2][0].id,
          ]);
        } else {
          resolve([false, errors.errorJoinOrganizationNotFound, 0]);
        }
      } catch (err) {
        console.log(err);
        resolve([false, errors.errorJoinOrganization, 0]);
      }
    });
  },

  addUserToOrganization: async (id_organization, id_user, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        const organization_user = await readAllRecord(
          `SELECT * FROM ${tables.tables.Organizations_Users.name} WHERE id_user = '${id_user}' AND id_organization = '${id_organization}'`,
          connection
        );
        console.log(organization_user);
        if (organization_user[2].length > 0) {
          if (organization_user[2][0].id_status == 1) {
            resolve([false, errors.errorAlredyOrganization, 0]);
          } else {
            await updateRecord(
              { id_status: 1 },
              tables.tables.Organizations_Users.name,
              organization_user[2][0].id,
              connection
            );
            resolve([
              true,
              success.successJoinOrganization,
              {
                id_organization,
                id_organization_user: organization_user[2][0].id,
              },
            ]);
          }
        } else {
          const response = await createRecord(
            { id_user, id_organization, id_rol: 3 },
            tables.tables.Organizations_Users.name,
            connection
          );
          resolve([
            true,
            success.successJoinOrganization,
            { id_organization, id_organization_user: response[2] },
          ]);
        }
      } catch (err) {
        console.log(err);
        resolve([false, errors.errorJoinOrganization, 0]);
      }
    });
  },

  uploadPay: async (files, id_client, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        let ruta_pago = '';
        let response = 0;
        if (files != null) {
          if (files["file"]) {
            response = await uploadFile(
              files["file"],
              "Clientes",
              id_client,
              `https://nyc3.digitaloceanspaces.com/sgp-web/${constants.SERVER_FILES}/`,
              `pago-${id_client}`
            );
            if (response[0]) {
              ruta_pago = response[2];
            }
          }
          response = await updateRecord(
            { ruta_pago },
            tables.tables.ClientesRegistros.name,
            id_client,
            connection
          );
          if (response[0]) {
            resolve([true, success.successCreate, id_client]);
          } else {
            resolve([false, errors.errorUploadFile, id_client]);
          }
        } else {
          console.log("SIN ARCHIVOS");
          resolve([true, success.successUpdate, id_user]);
        }
      } catch (error) {
        console.log(error);
        resolve([false, errors.errorUploadFile, id_user]);
      }
    });
  },

  uploadPhotoUser: async (files, id_user, id_organization, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        const user = await readRecord(
          tables.tables.Users.name,
          id_user,
          connection
        );
        let path_photo = user[2].path_photo;
        let response = 0;
        if (files != null) {
          if (files["photo"]) {
            response = await uploadFile(
              files["photo"],
              "Users",
              id_user,
              `https://nyc3.digitaloceanspaces.com/sgp-web/${constants.SERVER_FILES}/${id_organization}/`,
              `photo-${user[2].id}`
            );
            if (response[0]) {
              path_photo = response[2];
            }
          }
          response = await updateRecord(
            { path_photo },
            tables.tables.Users.name,
            id_user,
            connection
          );
          if (response[0]) {
            resolve([true, success.successUpdate, id_user]);
          } else {
            resolve([false, errors.errorUploadFile, id_user]);
          }
        } else {
          console.log("SIN ARCHIVOS");
          resolve([true, success.successUpdate, id_user]);
        }
      } catch (error) {
        console.log(error);
        resolve([false, errors.errorUploadFile, id_user]);
      }
    });
  },
  addSkillToUser: async (id_skill, id_user, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await readAllRecord(
          `SELECT * FROM ${tables.tables.Users_Skills.name} WHERE id_skill = '${id_skill}' AND id_user = '${id_user}'`,
          connection
        );
        if (response[2].length > 0) {
          const update = await updateRecord(
            { id_status: 1 },
            tables.tables.Users_Skills.name,
            response[2][0].id,
            connection
          );
          if (update[0]) {
            resolve([true, success.successCreate, response[2][0].id]);
          } else {
            resolve([false, errors.errorCreate, 0]);
          }
        } else {
          const create = await createRecord(
            { id_status: 1, id_user, id_skill },
            tables.tables.Users_Skills.name,
            connection
          );
          if (create[0]) {
            resolve([true, success.successCreate, create[2]]);
          } else {
            resolve([false, errors.errorCreate, 0]);
          }
        }
      } catch (error) {
        console.log(error);
        resolve([false, errors.errorDelete, 0]);
      }
    });
  },
  removeSkillToUser: async (id_skill, id_user, connection) => {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await readAllRecord(
          `SELECT * FROM ${tables.tables.Users_Skills.name} WHERE id_skill = '${id_skill}' AND id_user = '${id_user}'`,
          connection
        );

        if (response[2].length > 0) {
          const update = await updateRecord(
            { id_status: 0 },
            tables.tables.Users_Skills.name,
            response[2][0].id,
            connection
          );
          if (update[0]) {
            resolve([true, success.successDelete, response[2][0].id]);
          } else {
            resolve([false, errors.errorDelete, 0]);
          }
        } else {
          resolve([true, success.successDelete, 0]);
        }
      } catch (error) {
        console.log(error);
        resolve([false, errors.errorDelete, id_song]);
      }
    });
  },
};
