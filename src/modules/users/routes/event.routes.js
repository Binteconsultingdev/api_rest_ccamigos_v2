const { Router } = require("express");
const fileUpload = require("express-fileupload");
const {
    addEvent,
    getEvent,
    getEvents,
    updateEvent,
    getLandingById,
    getLandingByUrl
} = require("../controllers/event.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");

const router = Router();


router.get("/", getEvents);
router.post("/", addEvent); // crear evento
router.put("/:id", updateEvent); // actualizar evento
router.get("/event", getEvent)  // Obtener Evento
// router.get("/landing/:id", getLandingById)  // Obtener Evento
router.post("/landing", getLandingByUrl)  // Obtener Evento


module.exports = router;
