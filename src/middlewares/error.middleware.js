function errorMiddleware(error, req, res, next) {
  console.error(error);

  res.status(400).json({
    success: false,
    message: error.message || "Something went wrong",
    error: {
      message: error?.message || "",
      stack: error?.stack || "",
      details: error?.error || ""
    }
  });
}

module.exports = errorMiddleware;
