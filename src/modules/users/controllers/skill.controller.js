const pool = require("../../../common/database/config");
const tables = require("../../../common/helpers/constants/tables");
const constants = require("../../../common/helpers/constants/constants");
const { errors } = require("../../../common/helpers/constants/messages");
const {
  readAllRecord,
  permissionAny,
} = require("../../../common/helpers/functions");
const { addSkillToUser, removeSkillToUser } = require("../common/functions");

const table = tables.tables.Skills.name;

module.exports = {
  getSkillsByUser: async (req, res) => {
    try {
      const id_user = req.id_user;
      let response = 0;
      let query = "";
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
          query = `SELECT ${tables.tables.Skills.name}.* FROM ${tables.tables.Users_Skills.name} INNER JOIN ${tables.tables.Skills.name} ON ${tables.tables.Skills.name}.id = ${tables.tables.Users_Skills.name}.id_skill  WHERE ${tables.tables.Users_Skills.name}.id_status = '1' AND ${tables.tables.Users_Skills.name}.id_user = '${id_user}'`;
          console.log(query);
          response = await readAllRecord(query, connection);
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
  getSkills: async (req, res) => {
    try {
      console.log("SKILLS");
      const id_user = req.id_user;
      let response = 0;
      let query = "";
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
          query = `SELECT * FROM ${table} WHERE id_status = '1'`;
          response = await readAllRecord(query, connection);
        }

        connection.release();
        myConnection.end();
        console.log(query, response);
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
  addSkillUser: async (req, res) => {
    try {
      let { id_skill } = req.body;
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
          response = await addSkillToUser(id_skill, id_user, connection);
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

  removeSkillUser: async (req, res) => {
    try {
      const { id_skill } = req.body;

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
          response = await removeSkillToUser(id_skill, id_user, connection);
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
};
