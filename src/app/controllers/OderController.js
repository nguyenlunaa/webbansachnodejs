const { mutiMongoosesToObject } = require("../../ultils/mongoogses");
const Order = require("../Models/Order");
const User = require("../Models/User");
const mongoogses = require("mongoose");
const ObjectId = mongoogses.Types.ObjectId;
class OderController {
  async success(req, res) {
    res.render("Succes/succes", {
      user: req.user,
    });
  }
  async dat_hang(req, res) {
    if (!req.session.cart) {
      req.session.cart = {}; // Nếu chưa có, tạo một giỏ hàng mới
    }
    const cart = req.session.cart;
    //Lọc các sản phẩm có trong đơn hàng và add vào mảng oderItems
    const orderItems = [];
    for (const productId in cart) {
      const orderItem = {
        product: {
          id: cart[productId].id,
          name: cart[productId].name,
          price: parseFloat(cart[productId].price),
          quantity: cart[productId].quantity,
        },
      };
      orderItems.push(orderItem);
    }
    //Tính tổng số tiền trong hóa đơn
    let total = 0;
    for (const productId in cart) {
      if (cart.hasOwnProperty(productId)) {
        const item = cart[productId];
        total += item.price * item.quantity;
      }
    }
    const existingUser = await User.findOne({ _id: req.user.id });
    console.log(existingUser);
    //Lưu đơn hàng vào cơ sở dữ liệu
    const newOrder = new Order({
      OrderItems: orderItems,
      totalPrice: total,
      user: existingUser.username,
    });
    newOrder.save();
    //Xóa session.cart
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      } else {
        console.log("Session has been destroyed.");
      }
      res.redirect("/oder/sucess");
    });
    // Đã lưu đơn hàng thành công
    // Xóa giỏ hàng từ session hoặc thực hiện bất kỳ xử lý nào cần thiết
  }
  async shows(req, res) {
    const order = await Order.find({}).then((order) => {
      console.log(order);
      res.render("cart/showOder", {
        order: mutiMongoosesToObject(order),
        user: req.user,
      });
    });
  }
  async getThongtin(req, res) {}
}

module.exports = new OderController();
