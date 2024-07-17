const express = require("express");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const registerRoutes = require("./routes/register.routes");
const eventRoutes = require("./routes/event.routes");
const router = express.Router();


// Agrega aquí todas tus rutas combinadas
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/register", registerRoutes);
router.use("/event", eventRoutes);

module.exports = router;
