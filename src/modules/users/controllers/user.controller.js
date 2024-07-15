const bcrypt = require("bcrypt");
const { generateJWT } = require("../../../common/helpers/jwt");
const pool = require("../../../common/database/config");
const {
  errors,
  success,
} = require("../../../common/helpers/constants/messages");
const constants = require("../../../common/helpers/constants/constants");
const {
  readAllRecord,
  permissionAny,
  createRecord,
  updateRecord,
  getCurrentDate,
} = require("../../../common/helpers/functions");
const tables = require("../../../common/helpers/constants/tables");
const {
  validatePassword,
  searchOrganization,
  addUserToOrganization,
} = require("../common/functions");
const { response } = require("express");

const table = tables.tables.Users.name;

module.exports = {
  addAccountUser: async (req, res) => {
    try {
      const { nombre, email, password } = req.body;

      let response = 0;

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }

        response = await readAllRecord(
          `SELECT *  FROM Users WHERE email = '${email}'`,
          connection
        );
        if (response[2].length == 0) {
          const salt = bcrypt.genSaltSync();
          const user = {
            nombre,
            email,
            password,
          };
          user.password = bcrypt.hashSync(password, salt);
          response = await createRecord(user, table, connection);
        } else {
          response[1] = errors.errorRecordAlredyExists;
        }

        connection.release();
        myConnection.end();

        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },
  addUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      const id_user = 1;
      let response = 0;
      let responseAux = 0;
      let id_rol = 3

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }

        response = await permissionAny(id_user, connection);
        if (response[0]) {
          response = await readAllRecord(
            `SELECT *  FROM Users WHERE email = '${email}'`,
            connection
          );
          if (response[2].length == 0) {
            const salt = bcrypt.genSaltSync();
            const user = {
              name,
              email,
              password,
              id_rol
            };
            user.password = bcrypt.hashSync(password, salt);
            response = await createRecord(user, table, connection);

          } else {
            response[1] = errors.errorRecordAlredyExists;
          }
        }

        connection.release();
        myConnection.end();

        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },
  getUsers: async (req, res) => {
    try {
      let response = 0;

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        response = await readAllRecord(
          'SELECT * FROM Users WHERE id_rol = 3 or id_rol = 2 ',
          connection
        );
        
        console.log(response);
        
        connection.release();
        myConnection.end();
        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      let { name, email, password } = req.body;
      console.log(email, password);
      const id_user = req.id_user;

      const current_date = getCurrentDate();
      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        response = await permissionAny(id_user, connection);
        if (response[0]) {
          const response = await updateRecord(
            { name, email, password },
            table,
            id_user,
            connection
          );
          if (response[0]) {
            const responseFiles = await uploadFilesBySong(
              req.files,
              id_organization,
              id_song,
              connection
            );
            console.log(responseFiles);
          }
        }
        connection.release();
        myConnection.end();
        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },

  joinToOrganization: async (req, res) => {
    try {
      const { code } = req.body;
      const id_user = req.id_user;
      let response = 0;
      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        response = await permissionAny(id_user, connection);
        if (response[0]) {
          response = await searchOrganization(code, connection);
          if (response[0]) {
            response = await addUserToOrganization(
              response[2],
              id_user,
              connection
            );
          }
        }

        connection.release();
        myConnection.end();
        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },

  changeStatusAccountUser: async (req, res) => {
    try {
      let { id_organization_user, id_status } = req.body;
      const id_user = req.id_user;
      console.log(id_organization_user, id_status);
      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        let response = await permissionAny(id_user, connection);
        if (response[0]) {
          response = await updateRecord(
            { id_status },
            tables.tables.Organizations_Users.name,
            id_organization_user,
            connection
          );
        }
        console.log(response);
        connection.release();
        myConnection.end();
        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2],
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(errors.errorServer.code).json({
        ok: false,
        message: errors.errorServer.message,
      });
    }
  },
};
