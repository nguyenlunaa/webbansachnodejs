const mongoose = require("mongoose");
const ordershema = mongoose.Schema(
  {
    OrderItems: [
      {
        product: {
          id: { type: String, require: true },
          name: { type: String, require: true },
          price: { type: Number, require: true },
          quantity: { type: Number, require: true },
        },
      },
    ],
    totalPrice: { type: Number, require: true },
    user: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", ordershema);
module.exports = Order;
