var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model(
  "Ads",
  new Schema(
    {
      userId: String,
      username: String,
      title: String,
      type: String,
      description: Object,
      image: String,
      price: Number,
      contact: String,
      date: String
    },
    {
      minimize: false
    }
  )
);
