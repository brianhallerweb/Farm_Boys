var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model(
  "Ads",
  new Schema({
    user: String,
    title: String,
    type: String,
    description: String,
    image: String,
    price: String,
    date: Date
  })
);
