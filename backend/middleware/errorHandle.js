const AppError = require("../utils/AppError");

//Handle MongoDB CastError
//Lỗi xảy ra khi truyền sai kiểu dữ liệu
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

//Handle MongoDB Duplicate Field Error (code 11000)
//Lỗi trùng dữ liệu unique (vd: email đã tồn tại)
const handleDuplicateFieldsDB = (err) => {
  // Lấy giá trị bị trùng từ thông báo lỗi MongoDB
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handle MongoDB Validation Error
// Lỗi validate schema (required, minlength, maxlength, ...)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};


//Send detailed error information in development environment (debug)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,       
    message: err.message,
    stack: err.stack,  
  });
};


//Send safe error message in production environment
//Không lộ thông tin nội bộ cho client
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown error: lỗi hệ thống
    console.error("ERROR", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};


// Global Error Handling Middleware
// Middleware này bắt tất cả lỗi trong ứng dụng
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Môi trường dev
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } 
  // Môi trường prod
  else {
    let error = { ...err };
    error.message = err.message;

    // Xử lý các lỗi đặc biệt từ MongoDB
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
