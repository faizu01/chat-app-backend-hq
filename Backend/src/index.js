import connectToDB from "./db/index.js";
import http from "http";
import initializeSocket from "./socket/socket.js";
import app from "./app.js";
connectToDB()
  .then(() => {
    const server = http.createServer(app);
    initializeSocket(server);
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening at port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    throw error;
  });
