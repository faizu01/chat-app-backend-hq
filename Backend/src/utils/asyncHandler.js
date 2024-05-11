import ApiError from "./ApiError.js";
const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    return requestHandler(req, res, next);
  } catch (error) {
    return new ApiError(error.code, error.message);
  }
};

export default asyncHandler;