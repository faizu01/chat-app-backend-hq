import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js"
import userRouter from "./routes/user.route.js";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static("public"));
// app.use(morgan("dev"));

//API End Point
app.use("/user", userRouter);
app.use("/chat",chatRouter);
export default app;
