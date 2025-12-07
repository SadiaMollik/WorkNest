const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserRoleByEmail,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
} = require("../controllers/userController");

// get method for all users in database
router.get("/users", getUser);

// get user role by email
router.get("/users/role/:email", getUserRoleByEmail);

// get single user by id
router.get("/users/:uid", getSingleUser);

// create new user
router.post("/users", createUser);

// update user info by id
router.put("/users/:id", updateUser);

// delete a user by id
router.delete("/users/:id", deleteUser);

module.exports = router;
