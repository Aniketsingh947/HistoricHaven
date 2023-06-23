const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const User = require("../models/user");
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware");
const users = require("../controller/users");

router.get("/register", users.register);

router.post("/register", catchAsync(users.newuser));

router.get("/login", users.loginform);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    // keepSessionInfo: true,
  }),
  users.loginchk
);

router.get("/logout", users.logout);

module.exports = router;
