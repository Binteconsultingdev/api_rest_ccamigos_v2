const { Router } = require("express");
const fileUpload = require("express-fileupload");
const {
    addEvent,
    getEvent,
    getEvents,
} = require("../controllers/event.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");

const router = Router();


router.get("/", getEvents);
router.post("/event", addEvent); // crear registro
router.get("/event", getEvent)  // Obtener Evento


module.exports = router;
