const express = require("express");
const router = express.Router();
const Product = require("../Controllers/Product");

const verify = require("../authenticate/verifyToken");

router.post("/product/create", verify, Product.create);
router.get("/products", Product.getAllProduct);
router.get("/admin/all_products", Product.getAdminProduct);
router.get("/product/:id", Product.getSingleProduct);
router.put("/product/:id", verify, Product.update);
router.delete("/delete_product/:id", verify, Product.delete);
router.put("/create/review", verify, Product.createReview);
router.get("/reviews", Product.getProductReviews);
router.delete("/delete_review", verify, Product.deleteReview);

module.exports = router;
