const { Router } = require("express");
const {
  getUsers,
  updateUser,
} = require("../controllers/user.controller.js");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");

const router = Router();


router.get("/", getUsers);  // crear usuario
router.put("/", updateUser); 


module.exports = router;
