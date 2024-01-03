const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Users = new Schema(
  {
    username: { type: String, default: "" },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    isAdmin: { type: String, default: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", Users);
