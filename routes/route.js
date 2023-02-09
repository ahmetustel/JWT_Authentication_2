const express = require("express");
const authToken = require("../middleware/authToken");
const {
  createUser,
  login,
  deleteUser,
  getUser,
  refreshToken,
  logout
} = require("../controllers/controller");

const router = express.Router();

/* Creating the routes for the user controller. */

router.get("/users/:name",authToken, getUser);

router.post("/createUser", createUser);

router.post("/login",login);

router.delete("/users/:name", deleteUser);

router.post("/token", refreshToken);

router.delete("/logout", logout);

module.exports = router;