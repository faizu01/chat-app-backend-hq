import Chat from "../models/chat.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
//TODO:Remove logged in user from result in fetchallchats and add avatar field in each controllers
const fetchAllChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      participant: { $in: [req.user._id] },
    }).populate("participant", "-password");

    //console.log(chats);
    return res.status(200).json(new ApiResponse(200, chats, "All User Chat"));
  } catch (error) {
    throw new ApiError(400, error.message, error);
  }
});
const checkIfChatExists = async (userId1, userId2) => {
  return await Chat.findOne({
    type: "Personal",
    participant: { $all: [userId1, userId2] },
  }).populate({ path: "participant", select: "fullName email password" });
};

const createOneToOneChat = asyncHandler(async (req, res) => {
  try {
    const userID = req.query.userID;
    if (!userID) {
      throw new ApiError(400, "UserID parameter is missing");
    }

    const existingChat = await checkIfChatExists(req.user._id, userID); //logged user id , you want to create chat user id
    if (existingChat) {
      console.log("existing", existingChat);
      // Chat exists, return the chat details
      return res
        .status(200)
        .json(new ApiResponse(200, existingChat, "Chat Already exists"));
    }

    // Chat does not exist, create a new chat
    const newChat = new Chat({
      type: "Personal",
      participant: [req.user._id, userID],
    });

    await newChat.save();
    const createdChat = await newChat.populate({
      path: "participant",
      select: "fullName email password ",
    }); //TODO:select avatar
    res
      .status(201)
      .json(new ApiResponse(201, createdChat, "Chat created successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      "Some Error Ocuured while creating one-to-one chat"
    );
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  try {
    const listOfUserID = req?.body?.usersID; //assuming i will receive array of users containing user obj to create group with
    const chatName = req?.body?.chatName;

    if (listOfUserID.length < 2) {
      throw new ApiError(400, "Group chat must have at least two members");
    }

    const adminID = req.user._id;
    listOfUserID.unshift(adminID);
    const newGroupChat = await Chat.create({
      type: "Group",
      chatName: chatName,
      participant: listOfUserID,
      admin: adminID,
    });
    const groupDetails = await newGroupChat.populate([
      { path: "participant", select: "fullName email status" },
      { path: "admin", select: "fullName email status" },
    ]); //TODO:Add avatar

    return res
      .status(201)
      .json(
        new ApiResponse(201, groupDetails, "Group chat Successfully created")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating Group chat",
      error
    );
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, newGroupName } = req.body;
    //console.log(chatId)
    const chatGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: newGroupName,
      },
      {
        new: true,
      }
    ).populate([
      { path: "participant", select: "fullName email status " },
      { path: "admin", select: "fullName email status" },
    ]);

    if (!chatGroup) {
      throw new ApiError(404, "Group Chat Not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, chatGroup, "Group Chat Name updated Successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while updating Group Chat Name"
    );
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  //in req i will receive id of user
  try {
    const chatId = req.body.chatId;
    const newUsersId = req.body.newUsersId;
    //push new user
    const updatedGroupMembers = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { $push: { participant: newUsersId } },
      { new: true }
    );

    // Populate the updated document
    const updatedListOfUser = await Chat.populate(updatedGroupMembers, [
      { path: "participant", select: "fullName email status" },
      { path: "admin", select: "fullName email status" },
    ]);

    if (!updatedListOfUser) {
      throw new ApiError(
        500,
        "Something went wrong while adding user to group"
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          updatedListOfUser,
          "User added successfully to group"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Cannot add user to Group", error);
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const remainingUsers = await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $pull: { participant: { $in: userId } },
      },
      {
        new: true,
      }
    ).populate([
      { path: "participant", select: "fullName email password" },
      { path: "admin", select: "fullName email password" },
    ]);
    if (!remainingUsers) {
      throw new ApiError(404, "Either Group or User does not exists");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          remainingUsers,
          "User Removed Successfully from group"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Somethind went wrong while removing user from group"
    );
  }
});
export {
  fetchAllChats,
  createOneToOneChat,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
