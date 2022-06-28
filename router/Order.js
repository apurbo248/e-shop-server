const express = require("express");
const router = express.Router();
const verify = require("../authenticate/verifyToken");

const OrderController = require("../Controllers/Order");

router.post("/order/new", verify, OrderController.create);
router.get("/my/orders", verify, OrderController.myOrder);
router.get("/order/:id", verify, OrderController.getSingleOrder);

router.get("/orders", verify, OrderController.getAllOrder);
router.put("/orderstatus/:id", verify, OrderController.updateOrder);
router.delete("/order/:id", verify, OrderController.deleteOrder);


//router.post("/addCart/:id", UserController.addToCart);

module.exports = router;
