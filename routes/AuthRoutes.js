const Router = require("express").Router;
const authRouter = Router();
const {
  signup,
  login,
  refreshTokenController,
  logout,
  me,
} = require("../controller/AuthController");
const authMiddleware = require("../middleware/authMiddleware");

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, me);

module.exports = authRouter;
