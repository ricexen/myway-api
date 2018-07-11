var express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const keys = require("./config/keys");

var app = express();

//enables cors
app.use(cors());

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiUserRoutes = require("./routes/UserRoutes");
var apiPathRoutes = require("./routes/PathRoutes");
var apiTransportRoutes = require("./routes/TransportRoutes");
var apiKeyPointRoutes = require("./routes/KeyPointRoutes");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// DB CONF
const db = require("./config/keys").mongoURI;

// Connect to MongoDB using Mongoose
mongoose
  .connect(db)
  .then(() => console.log("mongo db connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

// Passpor config
require("./config/passport")(passport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static(path.join(__dirname, "node_modules/axios/dist")));

// ROUTES
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/user", apiUserRoutes);
app.use("/api/path", apiPathRoutes);
app.use("/api/transport", apiTransportRoutes);
app.use("/api/keypoint", apiKeyPointRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
