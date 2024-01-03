const express = require("express");
const middlewareController = require("../app/controllers/MiddlewareController");

const OderController = require("../app/controllers/OderController");
const router = express.Router();
router.post("/thong-tin/:id", OderController.getThongtin);
router.post("/dat_hang", OderController.dat_hang);
router.get("/getList",middlewareController.verifyTokenAndAdminAuth, OderController.shows);
router.get("/sucess", OderController.success);
module.exports = router;
