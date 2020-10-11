const express = require("express");
var morgan = require("morgan");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users.js");
const postsRoutes = require("./routes/posts.js");

const app = express();
const PORT = 5000;

// adding morgan to log HTTP requests
app.use(morgan("dev"));

// Enable CORS ...
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.header('Access-Control-Expose-Headers', 'Content-Range')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => res.send("Welcome to the Users API!"));
app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
