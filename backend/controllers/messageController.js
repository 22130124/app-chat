const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

// Get or create conversation
exports.getOrCreateConversation = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const currentUserId = req.user._id;

  if (userId === currentUserId.toString()) {
    return res.status(400).json({
      status: "error",
      message: "Cannot create conversation with yourself",
    });
  }

  // Check if conversation exists
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, userId], $size: 2 },
  }).populate("participants", "firstName lastName avatar _id email status");

  if (!conversation) {
    // Create new conversation
    conversation = await Conversation.create({
      participants: [currentUserId, userId],
    });

    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "firstName lastName avatar _id email status"
    );
  }

  res.status(200).json({
    status: "success",
    data: conversation,
  });
});

// Get all conversations for current user
exports.getConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user._id] },
  })
    .populate("participants", "firstName lastName avatar _id email status")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });

  res.status(200).json({
    status: "success",
    data: conversations,
  });
});

// Get messages for a conversation
exports.getMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Check if user is part of conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.includes(req.user._id)) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  const messages = await Message.find({
    conversation_id: conversationId,
  })
    .populate("from", "firstName lastName avatar _id")
    .populate("to", "firstName lastName avatar _id")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  // Mark messages as read
  await Message.updateMany(
    {
      conversation_id: conversationId,
      to: req.user._id,
      read: false,
    },
    { read: true }
  );

  res.status(200).json({
    status: "success",
    data: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page,
      limit,
      total: await Message.countDocuments({ conversation_id: conversationId }),
    },
  });
});

// Send message
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId, to, text, type = "Text", file } = req.body;
  const from = req.user._id;

  // Verify conversation exists and user is part of it
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.includes(req.user._id)) {
    return res.status(403).json({
      status: "error",
      message: "Access denied",
    });
  }

  // Create message
  const message = await Message.create({
    conversation_id: conversationId,
    from,
    to,
    text: text || "",
    type,
    file: file || "",
  });

  // Update conversation last message
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    lastMessageAt: Date.now(),
  });

  const populatedMessage = await Message.findById(message._id)
    .populate("from", "firstName lastName avatar _id")
    .populate("to", "firstName lastName avatar _id");

  res.status(201).json({
    status: "success",
    data: populatedMessage,
  });
});
