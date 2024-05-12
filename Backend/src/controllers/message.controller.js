import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import openai from "../config/openai.config.js";
import { PROMPT } from "../utils/constant.js";
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

    //check the type of chat from chatId and if it is personal and also the reciever status is BUSY then generate response from chatgpt
    const isUserBusy = await checkIfUserIsBusy(chatId);

    if (isUserBusy) {
      let response;
      try {
        response = await Promise.race([
          getChatGptResponse(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Response timeout")), 10000)
          ),
        ]);
      } catch (error) {
        response = "User is unavailable. Please try again later.";
      }
      return res
        .status(400)
        .json(new ApiResponse(400, undefined, response?.content || response));
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

const checkIfUserIsBusy = async (chatId) => {
  const chat = await Chat.findById({ _id: chatId }).populate(
    "participant",
    "status"
  );

  if (chat.chatName === "PERSONAL" && chat.participant[1].status === "BUSY") {
    return true;
  }
  return false;
};

const getChatGptResponse = async () => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: "user", content: PROMPT }],
    model: "gpt-3.5-turbo",
  });

  const response = chatCompletion?.choices[0].message;
  return response;
};

export { getAllMessages, sendMessage };
