const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controller/campgrounds");
const flash = require("connect-flash");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn, isAuthor } = require("../middleware");
// router.get("/", (req, res) => {
//   res.render("home");
// });

router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.rendernewform);
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  catchAsync(campgrounds.createnew)
);
// router.post("/",  (req, res) => {
//   console.log(req.body, req.files);
//   res.send("it worked");
// });

router.get("/:id", campgrounds.showcamp);

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editform));

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  campgrounds.updateform
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deletecamp));
module.exports = router;
