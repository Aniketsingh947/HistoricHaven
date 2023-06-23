if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUDINARY_KEY);
const express = require("express");
const router = express.Router();
const path = require("path");
const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");
const campgroundRoutes = require("./routes/campgrounds");
// const { campgroundSchema, reviewSchema } = require("./schemas.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
// const campground = require("./models/campground");
mongoose
  .connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Mongo Error");
  });

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const sessionConfig = {
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  //console.log(req.session);
  //console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
