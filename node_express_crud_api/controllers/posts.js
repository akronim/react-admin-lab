//const { v4: uuidv4 } = require("uuid");
let posts = require("../posts.json");

const getPosts_v1 = (req, res) => {
  let getPosts = [];
  if (req.query && req.query.filter) {
    let filterArgs = JSON.parse(req.query.filter);

    if (filterArgs.q && filterArgs.q.length > 0) {
      getPosts = posts.filter((post) => {
        return (
          post.title.indexOf(filterArgs.q) > -1 ||
          post.body.indexOf(filterArgs.q) > -1
        );
      });
    }
  }

  if (req.query && req.query.sort) {
    let sortArgs = JSON.parse(req.query.sort);
    if (getPosts.length > 0) {
      getPosts.sort(propComparator(sortArgs[0], sortArgs[1]));
    } else {
      posts.sort(propComparator(sortArgs[0], sortArgs[1]));
    }
  }

  let postsToSend = [];
  if (getPosts.length > 0) {
    postsToSend = getPosts;
  } else {
    postsToSend = posts;
  }

  let postsCount = postsToSend.length;

  res.setHeader("X-Total-Count", `${postsCount}`);
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

  console.log(`Posts in the database: ${postsCount}`);

  if (req.query.range) {
    let rangeArgs = JSON.parse(req.query.range);
    postsToSend = postsToSend.slice(rangeArgs[0], rangeArgs[1] + 1);

    res.json(postsToSend);
  }

  res.json(postsToSend);
};

const getPosts = (req, res) => {
  let filterArgsExists = false;

  let filteredPosts = [];

  if (req.query && req.query.filter) {
    let filterArgs = JSON.parse(req.query.filter);

    if (filterArgs.q && filterArgs.q.length > 0) {
      filterArgsExists = true;

      filteredPosts = posts.filter((post) => {
        return (
          post.title.indexOf(filterArgs.q) > -1 ||
          post.body.indexOf(filterArgs.q) > -1
        );
      });
    }
  }

  let postsToSend = [];
  if (filterArgsExists) {
    postsToSend = filteredPosts;
  } else {
    postsToSend = posts;
  }

  if (req.query && req.query.sort) {
    let sortArgs = JSON.parse(req.query.sort);
    postsToSend.sort(propComparator(sortArgs[0], sortArgs[1]));
  }

  let postsCount = postsToSend.length;

  res.setHeader("Content-Range", `${postsCount}`);
  //res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");

  console.log(`Posts in the database: ${postsCount}`);

  if (req.query.range) {
    let rangeArgs = JSON.parse(req.query.range);
    postsToSend = postsToSend.slice(rangeArgs[0], rangeArgs[1] + 1);
    res.setHeader(
      "Content-Range",
      `posts ${rangeArgs[0]}-${rangeArgs[1]}/${postsCount}`
    );
  } else {
    res.setHeader("Content-Range", `posts .../${postsCount}`);
  }

  return res.json(postsToSend);
};

const getPost = (req, res) => {
  const post = posts.find((post) => post.id === parseInt(req.params.id));
  //res.send(post);
  res.json(post || {});
};

const createPost = (req, res) => {
  const post = req.body;
  // posts.push({ ...post, id: uuidv4() });
  posts.push(post);

  console.log(`Post [${post.title}] added to the database.`);

  res.status(201).json(post || {});
};

const updatePost = (req, res) => {
  const post = posts.find((post) => post.id === parseInt(req.params.id));

  Object.assign(post, req.body);

  console.log(`Post has been updated`);

  res.json(post);
};

const deletePost = (req, res) => {
  console.log(`post with id ${req.params.id} has been deleted`);

  posts = posts.filter((post) => post.id !== parseInt(req.params.id));

  res.status(200).json(req.params.id || {});
};

const postExists = (req, res, next, id) => {
  const post = posts.find((post) => post.id === parseInt(id));
  console.log(post);
  if (post) {
    next();
  } else {
    res.json({ error: "Id not found" });
  }
};

const propComparator = (propName, sortOrder) => (a, b) => {
  let objA = a[propName];
  let objB = b[propName];

  if (sortOrder == "ASC") {
    return objA == objB ? 0 : objA < objB ? -1 : 1;
  } else {
    return objA == objB ? 0 : objB < objA ? -1 : 1;
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  postExists,
};
