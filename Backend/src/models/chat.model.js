import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Personal", "Group"],
      required: true,
    },
    chatName: {
      type: String,
      default: "Personal",
    },
    recipient: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "Message",
      default: null,
    },
    admin: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "user",
      default:null
    },
  },
  { timestamps: true }
);

const Chat = mongoose.Schema("Chat", chatSchema);
export default Chat;
