import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/user", userRouter);
export default app;
