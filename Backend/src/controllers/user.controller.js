import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Option } from "../utils/constant.js";

//TODO:Refresh Access Token if expired
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } =  req.body;
  //check if any field is empty throw error
  if ([fullName, email, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All Fields are requried");
  }
  //check for already exixting user
  const isUserAlreadyExists = await User.findOne({ email: email });
  if (isUserAlreadyExists) {
    throw new ApiError(409, "User Already Exists");
  }
  //create new user
  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = User.findById(user._id).select("-password -refreshToken");
  //console.log(createdUser);
  return res.status(201).json({
    success: true,
    message: "user created successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if ([email, password].some((fields) => fields.trim()) === "") {
    throw new ApiError(400, "All Fields are mandatory");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(400, "Invalid User");
  }

  const isCorrectPassword = await user.isPasswordCorrect(password);
  console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new ApiError(400, "Invalid Password");
  }

  const accessToken = await user.generateAccessTokens();
  const refreshToken = await user.generateRefreshTokens();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", accessToken, Option)
    .cookie("refreshToken", refreshToken, Option)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logout Successfully"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  req.user.status = status;
  await req.user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, `Status updated Successfully to ${status}`));
});

export { registerUser, loginUser, logoutUser, updateStatus };
