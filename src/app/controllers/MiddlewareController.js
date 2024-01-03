const jwt = require("jsonwebtoken");
class middlewareController {
  authenticateToken(req, res, next) {
    const token = req.cookies.rf || "";
    // console.log(token);
    jwt.verify(token, "rf", (err, user) => {
      if (err) {
        return res.status(403).json("Token hợp lệ");
      }
      req.user = user;
      next();
    });
  }
  verifyTokenAndAdminAuth(req, res, next) {
    const token = req.cookies.rf || "";
    jwt.verify(token, "rf", (err, user) => {
      if (err || !user) {
        return res.status(403).json("Token không hợp lệ");
      }
      if (user.isAdmin === "true") {
        req.user = user;
        next();
      } else {
        res
          .status(404)
          .json("Bạn không có quyền truy cập vào việc quản lý thông tin");
      }
    });
    //Nếu tồn tại id trùng với id trên url hoặc là Admin thì được phép xóa
  }
}

module.exports = new middlewareController();
