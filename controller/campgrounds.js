const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.rendernewform = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createnew = async (req, res) => {
  //have to put joi middleware;
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // console.log(geoData);
  // res.send("ok!!");
  const camp = new Campground(req.body.campground);
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.geometry = geoData.body.features[0].geometry;
  camp.author = req.user._id;
  await camp.save();
  console.log(camp);
  req.flash("success", "succssfully done that!");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.showcamp = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "no campground found");
    return res.redirect("/campgrounds");
  }
  console.log(campground.geometry.coordinates);
  res.render("campgrounds/show", { campground });
};

module.exports.editform = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "no campground found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateform = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  console.log(req.files);
  const imge = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imge);
  await campground.save();
  req.flash("success", "succssfully updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deletecamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
};
