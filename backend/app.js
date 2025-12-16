const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const routes = require("./routes/index");
const errorHandler = require("./middleware/errorHandle");

const app = express();

//security middleware
app.use(helmet());

//CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Xóa $ và . trong input và Chặn NoSQL Injection
app.use(mongoSanitize());

//Lọc script nguy hiểm, ngăn chèn <script>
app.use(xss());

//giới hạn request (chống spam)
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, //15p
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

//Dev log
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
app.use("/api", routes);

//health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

//error handling middleware
app.use(errorHandler);

module.exports = app;
