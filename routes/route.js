const express = require("express");
const authToken = require("../middleware/authToken");
const {
  getPosts,
  addPost,
  createUser,
  getUsers,
  login,
  deleteUser,
  getUser
} = require("../controllers/controller2");

const router = express.Router();

/* Creating the routes for the user controller. */
router.get("/posts", getPosts);

router.get("/users/:name",authToken, getUser);

router.post("/addPost", addPost);

router.get("/users", getUsers);

router.post("/createUser", createUser);

router.post("/login",login);

router.delete("/users/:name", deleteUser);

module.exports = router;