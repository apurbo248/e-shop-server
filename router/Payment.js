const express = require("express");
const verifyToken = require("../authenticate/verifyToken");
const { processPayment, getStripeKey } = require("../Controllers/Payment");
const router = express.Router();

router.post("/payment", verifyToken, processPayment);
router.get("/getStripeKey", verifyToken, getStripeKey);

module.exports = router;
