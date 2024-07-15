const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "NO HAY TOKEN",
    });
  }

  try {
    const { id_user } = jwt.verify(token, process.env.JWT_SECRET);
    req.id_user = id_user;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "TOKEN INVALIDO",
    });
  }
};

module.exports = {
  validateJWT,
};
