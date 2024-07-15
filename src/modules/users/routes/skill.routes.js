const { Router } = require("express");
const { validateJWT } = require("../../../common/middlewares/validate-jwt.js");
const {
  getSkills,
  addSkillUser,
  removeSkillUser,
  getSkillsByUser,
} = require("../controllers/skill.controller.js");
const router = Router();
router.get("/user", [validateJWT], getSkillsByUser);
router.get("/", [validateJWT], getSkills);
router.post("/add", [validateJWT], addSkillUser);
router.put("/remove", [validateJWT], removeSkillUser);

module.exports = router;
