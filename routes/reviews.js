const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controller/reviews");
const { isLoggedIn, isAuthor, isReviewAuthor } = require("../middleware");
router.post("/", isLoggedIn, catchAsync(reviews.newreview));
router.delete(
  "/:reviewid",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deletereview)
);

module.exports = router;
