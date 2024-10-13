const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:role", userController.getAllUsers);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser); 
router.post("/login_user_details", userController.loger_Details); 

module.exports = router;
