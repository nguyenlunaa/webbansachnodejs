const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = new Schema(
  {
    name: { type: String, default: "" }, //tên sản phẩm
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Category", Category);
