const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

// All routes require authentication
router.use(authController.protect);

router.get("/get-me", userController.getMe);
router.patch("/update-me", userController.updateMe);
router.get("/get-users", userController.getUsers);
router.get("/get-all-verified-users", userController.getAllVerifiedUsers);
router.get("/get-requests", userController.getRequests);
router.get("/get-friends", userController.getFriends);

module.exports = router;
