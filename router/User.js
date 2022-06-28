const express = require("express");
const router = express.Router();
const verify = require("../authenticate/verifyToken");

const UserController = require("../Controllers/User");


//For Registration
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);
router.get("/me", verify, UserController.getProfile);
router.get("/user/:id", verify, UserController.getSingleUser);

router.get("/users", verify, UserController.getAllUser);
router.get("/logout",verify, UserController.logout);
router.put("/update_user/:id", verify, UserController.update);
router.delete("/delete_user/:id", verify, UserController.delete);




module.exports = router;
