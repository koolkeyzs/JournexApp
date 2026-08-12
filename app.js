if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const sanitizeV5 = require("./utils/mongoSanitizeV5.js");

const express = require("express");
const app = express();

app.set("query parser", "extended");

const mongoose = require("mongoose");
const path = require("path");

const Journex = require("./model/journex");
const catchAsync = require("./utils/CatchAsync");
const ExpressError = require("./utils/ExpressErrors");

const joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");

const { entrySchema, commentSchema } = require("./model/JOIschema");

const Comment = require("./model/comments");

const entryRoutes = require("./routes/entry");
const commentRoutes = require("./routes/comment");
const reportRoutes = require("./routes/report");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const announcementRoutes = require("./routes/announcement");
const notificationRoutes = require("./routes/notification");

const passport = require("passport");
const passportLocal = require("passport-local");

const User = require("./model/user");

const helmet = require("helmet");
const cors = require("cors");

const { MongoStore } = require("connect-mongo");

// ============================================
// ENVIRONMENT
// ============================================

const isProduction = process.env.NODE_ENV === "production";

const PORT = process.env.PORT || 3000;

const dbUrl = process.env.DB_ACCESS;

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

if (!dbUrl) {
  console.error("❌ MONGODB_ACCESS is not defined");
  process.exit(1);
}

if (!process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is not defined");
  process.exit(1);
}

// ============================================
// CORS
// ============================================

const allowedOrigins = [
    "http://journex-app.vercel.app/"
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true
}))

// ============================================
// DATABASE
// ============================================

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection-Error"));

db.once("open", () => {
  console.log("✅ Database Connected");
});

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

const methodOverride = require("method-override");

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  sanitizeV5({
    replaceWith: "_",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ============================================
// MONGODB SESSION STORE
// ============================================

const store = new MongoStore({
  mongoUrl: dbUrl,

  touchAfter: 24 * 60 * 60,

  crypto: {
    secret: process.env.SESSION_SECRET,
  },
});

store.on("error", function (e) {
  console.log("Session store error:", e);
});

// ============================================
// SESSION
// ============================================

const sessionConfig = {
  store,

  name: "session",

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  cookie: {
    httpOnly: true,

    secure: true,

    sameSite: 'none',

    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(flash());

// ============================================
// HELMET
// ============================================

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// ============================================
// PASSPORT
// ============================================

app.use(passport.initialize());

app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// ============================================
// CURRENT USER
// ============================================

app.use((req, res, next) => {
  console.log(req.query);

  res.locals.currentUser = req.user;

  next();
});

// ============================================
// ROUTES
// ==========
app.get("/", (req, res) => {
  res.json({
    message: "Journex API is live",
  });
});

app.use("/entries", entryRoutes);

app.use("/entries/:id/comments", commentRoutes);

app.use("/", userRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/admin", adminRoutes);

app.use("/announcements", announcementRoutes);

app.use("/notifications", notificationRoutes);

app.use("/", reportRoutes);

// ============================================
// FILE UPLOAD ERRORS
// ============================================

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Image too large! Maximum 2MB per image",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Maximum of 4 images per entry!",
    });
  }

  next(err);
});

// ============================================
// AUTHENTICATION ERRORS
// ============================================

app.use((err, req, res, next) => {
  if (err.name === "AuthenticationError") {
    return res.status(401).json({
      message: "Incorrect username or password!",
    });
  }

  next(err);
});

// ============================================
// 404
// ============================================

app.all("/{*path}", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ============================================
// FINAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  const { status = 500 } = err;

  if (!err.message) {
    err.message = "Something went wrong!";
  }

  res.status(status).json({
    message: err.message,
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 APP IS LISTENING ON PORT ${PORT}`);

  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
