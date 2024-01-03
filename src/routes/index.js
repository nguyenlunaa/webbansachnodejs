const sanphamRouter = require("./sanpham");
const cartRouter = require("./cart");
const homeRouter = require("./home");
const userRouter = require("./user");
const oderRouter = require("./oder");
const categoryRouter = require("./categories");
const searchOder=require("./search")
const middlewareController = require("../app/controllers/MiddlewareController");
function routes(app) {
  app.use(
    "/categories",
    middlewareController.verifyTokenAndAdminAuth,
    categoryRouter
  );
  app.use(
    "/sanphams",
    middlewareController.verifyTokenAndAdminAuth,
    sanphamRouter
  );
  app.use("/users", middlewareController.verifyTokenAndAdminAuth, userRouter);
  app.use("/cart", middlewareController.authenticateToken, cartRouter);
  app.use("/oder", middlewareController.authenticateToken, oderRouter);
  app.use("/home", homeRouter);
  app.use("/search",middlewareController.authenticateToken,searchOder)
  
}
module.exports = routes;
