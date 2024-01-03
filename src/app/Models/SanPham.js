const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SanPhams = new Schema(
  {
    name: { type: String, default: "" }, //tên sản phẩm
    img: { type: String, default: "" }, //hình ảnh sản phẩm
    price: { type: Number },
    categoryId: { type: String }, //mã thể loại sản phẩm
    decription: { type: String }, //thông tin chi tiết sản phẩm
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("SanPham", SanPhams);
