const { mongooseToObject } = require("../../ultils/mongoogses");
const User = require("../Models/User");

class CartController {
  show(req, res) {
    res.json(cart);
  }
  // POST /cart/addCart/:id
  addToCart(req, res) {
    const productId = req.params.id;
    const product_name = req.body.product_name;
    const product_id = req.body.product_id;
    const product_price = req.body.product_price;
    // Kiểm tra xem phiên (session) đã có giỏ hàng chưa
    if (!req.session.cart) {
      req.session.cart = {}; // Nếu chưa có, tạo một giỏ hàng mới
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    if (req.session.cart[productId]) {
      req.session.cart[productId].quantity++;
    } else {
      //Thêm sản phẩm vào giỏ hàng
      req.session.cart[productId] = {
        id: product_id,
        name: product_name,
        price: parseFloat(product_price),
        quantity: 1,
      };
    }
    res.redirect("/cart/listCart");
  }
  //Xuất ra view giỏ hàng GET /cart/cartItem
  cartItem(req, res) {
    if (!req.session.cart) {
      req.session.cart = {}; // Nếu chưa có, tạo một giỏ hàng mới
    }
    const cart = req.session.cart;
    //Đếm số lượng sản phẩm có trong giỏ hàng
    const count = Object.keys(req.session.cart).length;
    // Trả về thông tin tổng hóa đơn
    let total = 0;
    for (const productId in cart) {
      if (cart.hasOwnProperty(productId)) {
        const item = cart[productId];
        total += item.price * item.quantity;
      }
    }
    res.render("cart/showListCart", {
      cart,
      count,
      total,
      user: req.user,
    });
  }
  async oder(req,res){
    if (!req.session.cart) {
      req.session.cart = {}; // Nếu chưa có, tạo một giỏ hàng mới
    }
    const cart = req.session.cart;
    //Đếm số lượng sản phẩm có trong giỏ hàng
    const count = Object.keys(req.session.cart).length;
    // Trả về thông tin tổng hóa đơn
    let total = 0;
    for (const productId in cart) {
      if (cart.hasOwnProperty(productId)) {
        const item = cart[productId];
        total += item.price * item.quantity;
      }
    }
    let user2=await User.findOne({_id:req.user.id})
    
    console.log(user2.username);
    res.render("cart/oder",{
      cart,
      count,
      total,
      user2: mongooseToObject(user2),
      user:req.user,
    })
  }
}

module.exports = new CartController();
