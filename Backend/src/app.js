import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import MessageRouter from "./routes/message.route.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());3
app.use(cookieParser());
app.use(express.static("public"));
// app.use(morgan("dev"));

//API End Point
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", MessageRouter);
export default app;
