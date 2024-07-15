const { Router } = require("express");
const { login, renewToken } = require("../controllers/auth.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");
const router = Router();

router.post("/login", login);
router.get("/renew", [validateJWT], renewToken);

module.exports = router;
