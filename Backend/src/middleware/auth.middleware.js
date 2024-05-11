import JWT, { decode } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorizaton").replace("Bearer", "");
    if (!token) {
      throw new ApiError(400, "unauthorized acces");
    }

    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new ApiError(400, "Invalid Access Token");
    }

    const user = await User.findById(decodedToken._id);
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
2;

export default verifyJWT;
