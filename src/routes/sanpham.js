const express = require("express");
const multer = require("multer");
const middlewareController = require("../app/controllers/MiddlewareController");
const SanPhamController = require("../app/controllers/SanPhamController");
const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("img");
router.get("/edit/:id", upload, SanPhamController.edit);
router.put("/:_id", upload, SanPhamController.update);
router.get("/getAll", SanPhamController.show);
router.get(
  "/create",middlewareController.authenticateToken,SanPhamController.create
);
// router.get("/find/:id", upload, SanPhamController.find);
router.post("/create/store", upload, SanPhamController.store);
router.delete("/delete/:id", SanPhamController.destroy);

module.exports = router;
