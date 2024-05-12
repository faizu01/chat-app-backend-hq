import { Server } from "socket.io";
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  // Handle user conection
  io.on("connection", (socket) => {
    console.log("User connected" ,socket.id);

    // Handle user joining a chat
    socket.on("joinChat", (userData) => {
      const { _id } = userData;
      socket.join(_id);
      socket.emit("connected");
    });

    // Handle user joining a specific room
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log("User joined room: " + room);
    });

    // Handle user typing notificationn
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));

    // Handle new messagae
    socket.on("newMessage", (messageData) => {
      const { chat, sender } = messageData;

      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        if (user._id === sender._id) return;

        socket.in(user._id).emit("messageReceived", messageData);
      });
    });

    // Handle user disconection basically
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default initializeSocket;
