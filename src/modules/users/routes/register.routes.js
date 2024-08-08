const { Router } = require("express");
const fileUpload = require("express-fileupload");
const {
    addClient,
    getInstrument,
    getClients,
    changeStatusClient,
    changeStatusClientForAll,
    changeStatusPay,
    changeStatusPayForAll,
} = require("../controllers/registro.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");
const router = Router();
router.use(fileUpload());
router.get("/", [validateJWT], getClients);
router.post("/client", addClient); // crear registro
router.get("/instrument", getInstrument)  // Obtener instrumento
router.put("/estatus/:id_cliente", changeStatusClient); // Actualizar Eliminado
router.put("/estatus/delete/all", changeStatusClientForAll);
router.put("/estatus/pay/clientAll", changeStatusPayForAll);
router.put("/estatus/pay/:id_cliente", changeStatusPay); // Actualizar status pago
module.exports = router;
