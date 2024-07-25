const pool = require("../../../common/database/config");
const {
  errors,
  success,
} = require("../../../common/helpers/constants/messages");
const constants = require("../../../common/helpers/constants/constants");
const {
  readAllRecord,
  createRecord,
  updateEventFunction
} = require("../../../common/helpers/functions");
const tables = require("../../../common/helpers/constants/tables");
const { response } = require("express");
const { uploadPay } = require("../common/functions");

const table = tables.tables.Eventos.name;

module.exports = {
  addEvent: async (req, res) => {
    try {
      const { nombre_evento, fecha_evento, url_pagina_link, color, informacion_evento, baner, lugar_fecha_evento } = req.body;
      console.log(nombre_evento, fecha_evento,  url_pagina_link, color, informacion_evento, baner, lugar_fecha_evento);
        // fecha_evento = 2024-08-22
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

        const evento = {
            nombre_evento, 
            fecha_evento, 
            url_pagina_link, 
            color, 
            informacion_evento, 
            baner, 
            lugar_fecha_evento
        };

        console.log(evento);
        response = await createRecord(evento, table, connection);
        

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

  updateEvent: async (req, res) => {
    try {
      const { id_evento, nombre_evento, fecha_evento, url_pagina_link, color, informacion_evento, baner, lugar_fecha_evento } = req.body;
      console.log(id_evento, nombre_evento, fecha_evento, url_pagina_link, color, informacion_evento, baner, lugar_fecha_evento);
      
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
  
        const evento = {
          nombre_evento, 
          fecha_evento, 
          url_pagina_link, 
          color, 
          informacion_evento, 
          baner, 
          lugar_fecha_evento
        };
  
        console.log(evento);
        response = await updateEventFunction(id_evento, evento, table, connection);
  
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
  
  getEvents: async (req, res) => {
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
            'SELECT ClientesRegistros.id_evento, ClientesRegistros.nombre, ClientesRegistros.email, Eventos.fecha_evento, Eventos.nombre_evento FROM `ccamigos_congreso-musicos`.ClientesRegistros JOIN Eventos ON ClientesRegistros.id_evento = Eventos.id',
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

  getEventsById: async (req, res) => {
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
            'SELECT ClientesRegistros.id_evento, Eventos.fecha_evento, Eventos.nombre_evento, Eventos.color, Eventos.informacion_evento, Eventos.baner, Eventos.lugar_fecha_evento FROM `ccamigos_congreso-musicos`.ClientesRegistros JOIN Eventos ON ClientesRegistros.id_evento = Eventos.id',
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

  getLandingById: async (req, res) => {
    try {
        const { id } = req.params;
        console.log( id );
      
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
            `SELECT  Eventos.id, Eventos.fecha_evento, Eventos.nombre_evento, Eventos.url_pagina_link, Eventos.color, Eventos.informacion_evento, Eventos.baner, Eventos.lugar_fecha_evento FROM ${table} WHERE Eventos.id = ${id}`,
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

  getLandingByUrl: async (req, res) => {
    try {
        const { url_pagina_link } = req.body;
        console.log( url_pagina_link );
        
        // console.log(req.body);
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
            // `SELECT * FROM ${table} WHERE Eventos.url_pagina_link = '${url_pagina_link}'`,
            `SELECT * FROM ${table} WHERE Eventos.url_pagina_link = '${url_pagina_link}'`,
            connection
        );
        if(response[0]){
          let i = 0
          while(i < response[2].length){
            const campos = await readAllRecord(`SELECT * FROM Events_Campos WHERE id_event = ${response[2][i].id}`, connection)
            response[2][i].campos = campos[2]
            i++
          }
        }

        console.log(response);

        connection.release();
        myConnection.end();

        return res.status(response[1].code).json({
          ok: response[0],
          message: response[1].message,
          data: response[2][0],
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

  getEvent: async (req, res) => {
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
            'SELECT * FROM `ccamigos_congreso-musicos`.Eventos',
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
};
