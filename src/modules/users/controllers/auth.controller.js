const { generateJWT } = require("../../../common/helpers/jwt");
const bcrypt = require("bcrypt");
const pool = require("../../../common/database/config");
const {
  errors,
  success,
} = require("../../../common/helpers/constants/messages");
const constants = require("../../../common/helpers/constants/constants");
const { readAllRecord, permissionAny, createRecord, } = require("../../../common/helpers/functions");
const tables = require("../../../common/helpers/constants/tables");
const { validatePassword } = require("../common/functions");

const table = tables.tables.Users.name;

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      let response = 0;
      let responseAux = 0;

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        response = await readAllRecord(
          `SELECT * FROM Users WHERE  email = '${email}'`,
          connection
        );
        console.log(response);
        if (response[2].length > 0) {
         
          responseAux = await validatePassword(response[2][0], password);
          if (responseAux[0]) {
            response[2] = await generateJWT(response[2][0].id);
          } else {
            response[1] = errors.errorPassword;
            response[2] = "";
          }
        } else {
          response[1] = errors.errorEmail;
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
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(name, email, password);
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

  renewToken: async (req, res) => {
    try {
      const id_user = req.id_user;
      console.log(id_user);
      let response = 0;
      let responseAux = 0;
      let token = "";
      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }
        response = await readAllRecord(
          `SELECT * FROM ${tables.tables.Users.name} WHERE  id = '${id_user}'`,
          connection
        );
        if (response[2].length > 0) {
          token = await generateJWT(response[2][0].id);
          
        } else {
          response[1] = errors.errorNotFound;
        }
        connection.release();
        myConnection.end();
        console.log(response);
        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2][0],
          token,
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
