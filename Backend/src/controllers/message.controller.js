import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) {
      throw new ApiError(400, "chatId is required in query");
    }
    const messages = await Message.find({ chat: chatId }).populate([
      { path: "sender", select: "fullName email status avatar" },
      {
        path: "chat",
        populate: [
          {
            path: "participant",
            select: "fullName email status avatar",
          },
          {
            path: "lastMessage",
            select: "-sender -chat",
          },
        ],
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "chat fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "something went wrong while loading chats", error);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
      throw new ApiError(400, "All fields are mandatory");
    }

    const newmessage = new Message({
      sender: req.user,
      chat: chatId,
      content: content,
    });

    await newmessage.save();
    const message = await newmessage.populate([
      { path: "sender", select: "fullName email status avatar" },
      { path: "chat" },
    ]);
    await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage: message },
      { new: true }
    );
    // console.log(message);
    return res
      .status(200)
      .json(new ApiResponse(200, message, "message sent successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while sending message",
      error
    );
  }
});

export { getAllMessages, sendMessage };
