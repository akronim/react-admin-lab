const express = require("express");
let users = require("../users.json");

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  userExists,
} = require("../controllers/users.js");

const router = express.Router();

var updateId = function (req, res, next) {
  if (!req.body.id) {
    req.body.id = users.length + 1;
  }
  next();
};

router.param("id", (req, res, next, id) => {
  userExists(req, res, next, id);
});

// router.use((req, res, next) => {
//   res.setHeader("X-Total-Count", `${users.length}`);
//   res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
//   next();
// })

// all routes in here are starting with: users
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", updateId, createUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
