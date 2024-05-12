import { Server } from "socket.io";
const initializeSocket = (server) => {
  const io = new Server(server,
    {
      cors:{
        origin:"http://localhost:5173",
        credentials:true
      }
    }
  );
  io.on("connection", (socket) => {
    console.log("A new user Joined",socket.id);
  });
};

export default initializeSocket;