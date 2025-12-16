const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

// All routes require authentication
router.use(authController.protect);

router.post("/conversation", messageController.getOrCreateConversation);
router.get("/conversations", messageController.getConversations);
router.get("/messages/:conversationId", messageController.getMessages);
router.post("/send", messageController.sendMessage);

module.exports = router;
