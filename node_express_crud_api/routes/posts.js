const express = require("express");
let posts = require("../posts.json");

const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  postExists,
} = require("../controllers/posts.js");

const router = express.Router();

var updateId = function (req, res, next) {
  if (!req.body.id) {
    req.body.id = posts.length + 1;
  }
  next();
};

router.param("id", (req, res, next, id) => {
  postExists(req, res, next, id);
});

// router.use((req, res, next) => {
//   res.setHeader("X-Total-Count", `${posts.length}`);
//   res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
//   next();
// })

// all routes in here are starting with: posts
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", updateId, createPost);
router.delete("/:id", deletePost);
router.patch("/:id", updatePost);

// Error handler
router.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
