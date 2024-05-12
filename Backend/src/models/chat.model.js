import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["PERSONAL", "GROUP"],
      required: true,
    },
    chatName: {
      type: String,
      default: "PERSONAL",
    },
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    admin: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    }],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
