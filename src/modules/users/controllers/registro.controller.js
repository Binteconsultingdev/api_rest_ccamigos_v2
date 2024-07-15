const pool = require("../../../common/database/config");
const {
  errors,
  success,
} = require("../../../common/helpers/constants/messages");
const constants = require("../../../common/helpers/constants/constants");
const {
  readAllRecord,
  createRecord,
  getCurrentDate,
  readRecord,
  updateRecord,
  uploadFile
} = require("../../../common/helpers/functions");
const tables = require("../../../common/helpers/constants/tables");
const { response } = require("express");
const { uploadPay } = require("../common/functions");

const table = tables.tables.ClientesRegistros.name;

module.exports = {
  addClient: async (req, res) => {
    try {
      const { nombre, edad, iglesia, email, telefono, id_instrumento } = req.body;
      console.log(nombre, edad, iglesia, email, telefono, id_instrumento);
      let response = 0;
      let responseAux = 0;

      console.log(req.files['file'])

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }

        // response = await readAllRecord(
        //     `SELECT *  FROM ClientesRegistros WHERE email = '${email}'`,
        //     connection
        // );

        // if (!!req.body.length) {
        //   console.log(response);
        const client = {
          nombre, 
          edad, 
          iglesia, 
          email, 
          telefono, 
          id_instrumento,
          // ruta_pago
        };

        response = await createRecord(client, table, connection);
        if(response[0]){
          response = await uploadPay(req.files, response[2], connection)
        }

        else {
          response[1] = errors.errorToSendData;
        }

        connection.release();
        myConnection.end();
        
        console.log(response);
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

  getClients: async (req, res) => {
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
            'SELECT * FROM `ccamigos_congreso-musicos`.ClientesRegistros JOIN Cat_instrumentos ON ClientesRegistros.id_instrumento = Cat_instrumentos.id ',
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
  getInstrument: async (req, res) => {
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
            'SELECT * FROM `ccamigos_congreso-musicos`.Cat_instrumentos',
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

  actualizarUsuario: async(req, res) => {
  try {
    const { nombre, email, password } = req.body;
    let nuevoPassword = null

    if(!password.length === 0){
      const salt = await bcrypt.genSalt(10);
      nuevoPassword = await bcrypt.hash(password, salt);
    }

    // Query SQL para actualizar el usuario
    // const sql = `
    //   UPDATE Users
    //   SET 
    //   username = ${} 
    //   email = ${}
    //   WHERE id = ${}
    // `;

    // Ejecutar la consulta SQL
    const [result] = await db.execute(sql, [nuevoNombre, nuevoEmail, usuarioId]);
    
    // Verificar si se actualizó correctamente
    if (result.affectedRows > 0) {
      console.log(`Usuario con ID ${usuarioId} actualizado correctamente.`);
      return true;
    } else {
      console.log(`No se encontró ningún usuario con ID ${usuarioId} para actualizar.`);
      return false;
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    throw error;
  }
},
  updateUser: async (req, res) => {
    try {
      let { nombre, edad, iglesia, email, telefono, instrumento } = req.body;

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

        if (response[0]) {
          const response = await updateRecord(
            { nombre, edad, iglesia, email, telefono, instrumento },
            table,
            id_cliente,
            connection
          );

          console.log(response);
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


  changeStatusClient: async (req, res) => {
    try {
      const { id_cliente } = req.params;
      let estatus = 0
      let response = 0
      console.log( id_cliente, estatus );

      const myConnection = pool.connection(constants.DATABASE);
      myConnection.getConnection(async function (err, connection) {
        if (err) {
          console.log(err);
          return res.status(errors.errorConnection.code).json({
            ok: false,
            message: errors.errorConnection.message,
          });
        }        
        console.log(response);
        response = await readRecord(table, id_cliente, connection)
        if(response[0]){
          if(response[2].estatus === 1){
            estatus = 0
          }else if (response[2].estatus === 0){
            estatus = 1
          }
          response = await updateRecord({estatus}, table, id_cliente, connection)
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
