var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    userId: String,
    username: String,
    title: String,
    type: String,
    description: Object,
    image: String,
    price: String,
    date: String,
    searchText: String
  },
  {
    minimize: false
  }
);

schema.index({ title: "text", searchText: "text" });

schema.pre("save", function(next) {
  this.searchText = this.description.blocks.map(block => block.text).join(" ");
  next();
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model("Ads", schema);
