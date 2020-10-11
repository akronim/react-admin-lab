//const { v4: uuidv4 } = require("uuid");
let users = require("../users.json");

const getUsers = (req, res) => {
  if (req.query && req.query.sort) {
    let sortArgs = JSON.parse(req.query.sort);
    users.sort(propComparator(sortArgs[0], sortArgs[1]));
  }

  console.log(`Users in the database: ${users.length}`);

  if (req.query.range) {
    let rangeArgs = JSON.parse(req.query.range);
    let usersToSend = users.slice(rangeArgs[0], rangeArgs[1] + 1);
    res.setHeader(
      "Content-Range",
      `users ${rangeArgs[0]}-${rangeArgs[1]}/${users.length}`
    );
    return res.json(usersToSend);
  }else{
    res.setHeader(
      "Content-Range",
      `users .../${users.length}`
    );
    return res.json(users);
  }
};

const getUser = (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  //res.send(user);
  res.json(user || {});
};

const createUser = (req, res) => {
  const user = req.body;
  // users.push({ ...user, id: uuidv4() });
  users.push(user);

  console.log(`User [${user.name}] added to the database.`);

  res.status(201).json(user || {});
};

const updateUser = (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));

  Object.assign(user, req.body);

  console.log(`User has been updated`);

  res.json(user);
};

const deleteUser = (req, res) => {
  console.log(`user with id ${req.params.id} has been deleted`);

  users = users.filter((user) => user.id !== parseInt(req.params.id));

  res.status(200).json(req.params.id || {});
};

const userExists = (req, res, next, id) => {
  const user = users.find((user) => user.id === parseInt(id));
  console.log(user);
  if (user) {
    next();
  } else {
    res.json({ error: "Id not found" });
  }
};

const propComparator = (propName, sortOrder) => (a, b) => {
  let objA = a[propName];
  let objB = b[propName];

  if (propName == "company.name") {
    objA = a["company"]["name"];
    objB = b["company"]["name"];
  }

  if (sortOrder == "ASC") {
    return objA == objB ? 0 : objA < objB ? -1 : 1;
  } else {
    return objA == objB ? 0 : objB < objA ? -1 : 1;
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userExists,
};
