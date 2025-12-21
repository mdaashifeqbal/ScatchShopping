const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: {
    type:Buffer,
    contentType: String
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
    default: 0,
  },
  bgcolor: {
    type: String,
    default:"cyan"
  },
  panelcolor: {
    type: String,
    default:"#92487A"
  },
  textcolor: {
    type: String,
    default:"white"
  },
});

module.exports = mongoose.model("product", productSchema);
