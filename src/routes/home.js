const express = require("express");
const router = express.Router();
const middlewareController = require("../app/controllers/MiddlewareController");
const HomeController = require("../app/controllers/HomeController");
const SanPhamController = require("../app/controllers/SanPhamController");
const { route } = require("./sanpham");
router.post("/register/account", HomeController.register);
router.get("/register", HomeController.showRegister);
router.post("/login/store", HomeController.store);
router.get("/login", HomeController.showLogin);
router.post(
  "/logout",
  middlewareController.authenticateToken,
  HomeController.userLogout
);
router.get("/search", middlewareController.authenticateToken, HomeController.search);
router.get("/", middlewareController.authenticateToken, HomeController.show);
router.get("/find/:id",middlewareController.authenticateToken,SanPhamController.find);
router.get("/gioithieu",middlewareController.authenticateToken,HomeController.showGioiThieu)
router.get("/lienhe",middlewareController.authenticateToken,HomeController.showLienHe)
router.get("/thongke",middlewareController.verifyTokenAndAdminAuth,HomeController.showThongKe)
module.exports = router;
