const express = require("express");
const router = express.Router();
const CartController = require("../app/controllers/CartController");

router.post("/addToCart/:id", CartController.addToCart);
router.get("/", CartController.show);
router.get("/listCart", CartController.cartItem);
router.post("/removie/:productId", (req, res) => {
  const productId = req.params.productId;
  // Kiểm tra xem sản phẩm có tồn tại trong session không
  if (req.session && req.session.cart && req.session.cart[productId]) {
    // Xóa sản phẩm ra khỏi session
    delete req.session.cart[productId];
    // Lưu session lại
    req.session.save((err) => {
      if (err) {
        console.error("Lỗi khi lưu session:", err);
      }

      // Redirect hoặc làm bất kỳ điều gì sau khi xóa sản phẩm thành công
      res.redirect("/cart/listCart"); // Ví dụ: chuyển hướng đến trang giỏ hàng
    });
  } else {
    res.status(404).send("Sản phẩm không tồn tại trong giỏ hàng.");
  }
});
router.post('/increase-quantity/:productID', (req, res) => {
  const productID = req.params.productID;
  // console.log(productID);
  const cart = req.session.cart || {};
  console.log(cart);
  if (cart[productID]) {
    cart[productID].quantity++;
  } 
  req.session.cart = cart;
  console.log(cart);
  const count = Object.keys(req.session.cart).length;
    // Trả về thông tin tổng hóa đơn
    let total = 0;
    for (const productId in cart) {
      if (cart.hasOwnProperty(productId)) {
        const item = cart[productId];
        total += item.price * item.quantity;
      }
    }
  res.render("cart/showListCart",{ cart,
    count,
    total,
    user: req.user,})
});
router.post('/decrease-quantity/:productID', (req, res) => {
  const productID = req.params.productID;
  const cart = req.session.cart || {};
  if (cart[productID]) {
    cart[productID].quantity--;
    if (cart[productID].quantity === 0) {
      delete req.session.cart[productID]; // Loại bỏ sản phẩm nếu số lượng giảm xuống 0
    }
  }
  req.session.cart = cart;
  const count = Object.keys(req.session.cart).length;
    // Trả về thông tin tổng hóa đơn
    let total = 0;
    for (const productId in cart) {
      if (cart.hasOwnProperty(productId)) {
        const item = cart[productId];
        total += item.price * item.quantity;
      }
    }
  res.render("cart/showListCart",{ cart,
    count,
    total,
    user: req.user,})
});
router.get("/oder",CartController.oder)
module.exports = router;
