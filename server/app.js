const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const postRoutes = require("./routes/postRoutes");
const { uploadsDir } = require("./utils/fileStorage");

const app = express();

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const defaultOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  ...parseOrigins(process.env.CLIENT_URL),
]);

const allowAllOrigins = defaultOrigins.has("*");

app.use(
  cors({
    origin(origin, callback) {
      if (allowAllOrigins || !origin) {
        callback(null, true);
        return;
      }

      if (defaultOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
        callback(null, true);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        callback(null, true);
        return;
      }

      callback(new Error(`Origen ${origin} no permitido por CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

app.get("/", (_req, res) => {
  res.send("API de FlorteV2 funcionando correcto");
});

app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/posts", postRoutes);

const PORT = Number(process.env.PORT ?? 5000);
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
