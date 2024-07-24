const { Router } = require("express");
const fileUpload = require("express-fileupload");
const {
    addClient,
    changeStatusClient,
    getInstrument,
    getClients,
    changeStatusPay,
    // joinToOrganization,
    // addAccountUser,
} = require("../controllers/registro.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");
const router = Router();
router.use(fileUpload());
router.get("/", getClients);
router.post("/client", addClient); // crear registro
router.get("/instrument", getInstrument)  // Obtener instrumento
router.put("/estatus/:id_cliente", changeStatusClient);
router.put("/estatus/pay/:id_cliente", changeStatusPay);
module.exports = router;
