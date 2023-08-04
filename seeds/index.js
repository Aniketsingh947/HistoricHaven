const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Mongo Error");
  });
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const price = Math.floor(Math.random() * 100) + 1;
    const randomct = Math.floor(Math.random() * 1000);
    const ncamp = new Campground({
      author: "64855681cad548e34709700e",
      location: `${cities[randomct].city},${cities[randomct].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomct].longitude, cities[randomct].latitude],
      },
      description:
        "  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum tempora recusandae nulla, veritatis culpa distinctio, dolore doloribus iusto inventore nam odio illum maxime obcaecati neque explicabo ratione, voluptatum nesciunt beatae?",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dsnm8u71e/image/upload/v1686799389/xzz37mchzwpgaqanyafq.png",
          filename: "xzz37mchzwpgaqanyafq",
        },
      ],
    });
    await ncamp.save();
    console.log("succesful");
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
