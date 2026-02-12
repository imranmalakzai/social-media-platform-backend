import ApiError from "../utils/ApiError.js";
export const globalErrorHandler = (err, req, res, next) => {
  try {
    // if error belongs to our custom API error
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        message: err.message,
        statusCode: err.statusCode,
        success: err.success,
      });
    }

    // if error belongs to Error Class
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message, success: false });
    }

    // unspected error
    res.status(500).json({ message: "Internal server error", success: false });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "critial error in global error handler middleware",
      error,
    });
  }
};
