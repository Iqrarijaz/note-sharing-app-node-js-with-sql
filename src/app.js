const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const responseTime = require("response-time");
const winston = require("winston");
const expressWinston = require("express-winston");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.routes");
const noteShareRoutes = require("./routes/noteShare.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

/* -------------------- Core Middleware -------------------- */

app.use(helmet());
app.use(responseTime());
app.use(express.json());

app.use(
  cors({
    origin: true, // reflect request origin
    credentials: true
  })
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- Request ID -------------------- */

app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

/* -------------------- Request Logger -------------------- */

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    requestWhitelist: ["method", "url", "headers", "body"],
    responseWhitelist: ["statusCode"],
    dynamicMeta: (req) => ({
      requestId: req.requestId,
      userId: req.user?.userId || null
    })
  })
);

/* -------------------- Routes -------------------- */

app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/note-share", noteShareRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true, status: "OK" });
});

/* -------------------- 404 Handler -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* -------------------- Error Logger -------------------- */

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
);

/* -------------------- Global Error Handler -------------------- */

app.use(errorMiddleware);

module.exports = app;
